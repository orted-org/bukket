const { findOne, insertOne } = require("../../Helpers/DataAccess/DBOperation");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../../Helpers/Auth/Helper.Auth.JwtFactory");
const {
  makeError,
  coatError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const {
  inMemSet,
  inMemGet,
  inMemDel,
} = require("../../Helpers/InMemoryDB/InMemOperation");
const {
  REFRESH_TOKEN_DURATION,
} = require("../../Helpers/Auth/DurationHandler");
const { PROPS } = require("../../Helpers/DataAccess/DBInfo");
const { ObjectId } = require("mongodb");

/* 
Please note that subId and UserId are different things. 
SubId is ID given by google to identify users,
where as the UserId is generated for each user in Bukket servers.
*/

/* 
this is the model function called by the controller for login
and this perform the all the tasks and return access and refresh token
*/
function performLogin(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const userDataFromDB = await handleUserAccount(userData);
      // this response data contains the id of the user as _id
      try {
        //setting the audience data for generating the tokens
        const allTokens = await signAllTokens({
          id: userDataFromDB._id.toString(),
          firstName: userDataFromDB.firstName,
          lastName: userDataFromDB.lastName,
          email: userDataFromDB.email,
          profilePictureUrl: userDataFromDB.profilePictureUrl,
        });
        return resolve({
          accessToken: allTokens.accessToken,
          refreshToken: allTokens.refreshToken,
          userData: userDataFromDB,
        });
      } catch (err) {
        return reject(err);
      }
    } catch (err_1) {
      return reject(coatError(err_1));
    }
  });
}

/*
this function checks if the user if created previously, 
and if not calls a function to create user
and ultimately returns the user data from Bukket DB
*/
function handleUserAccount(userData) {
  return new Promise((resolve, reject) => {
    return findOne({ subId: userData.sub }, PROPS.dbName, PROPS.userCollection)
      .then(async (data) => {
        if (!data) {
          // the user does not exists and we need to create user
          return resolve(await createNewUser(userData));
        } else {
          // the user already exists and no need to create user
          return resolve(data);
        }
      })
      .catch((err) => {
        return reject(coatError(err));
      });
  });
}

/*
this function creates new user 
and returns the data from the Bukket DB
*/
function createNewUser(userData) {
  return new Promise((resolve, reject) => {
    const userProfileInfo = {
      firstName: userData.given_name,
      lastName: userData.family_name,
      subId: userData.sub,
      email: userData.email,
      profilePictureUrl: userData.picture,
    };
    return insertOne(userProfileInfo, PROPS.dbName, PROPS.userCollection)
      .then(async (data) => {
        //now create the userBucketMapping for user
        await insertOne(
          {
            userId: ObjectId(data.ops[0]._id),
            joinedBuckets: [],
          },
          PROPS.dbName,
          PROPS.userBucketMappingCollection
        );
        return resolve(data.ops[0]);
      })
      .catch((err) => {
        return reject(makeError.InternalServerError());
      });
  });
}

/*
audience data must contain:
1. id from Bukket DB
2. First Name
3. Second Name 
4. Email
5. ProfilePictureUrl
*/
async function signAllTokens(audienceData) {
  try {
    const accessToken = await signAccessToken(audienceData);
    const refreshToken = await signRefreshToken(audienceData);

    // got the generated tokens and now store refresh token in the redis DB
    return { accessToken, refreshToken };
  } catch (err) {
    throw makeError.InternalServerError();
  }
}

/*
this refreshes the tokens after verifying that 
it has not been blacklisted and is logged in
in redis and returns payload from the incoming refresh token
*/
function checkIfAlreadyLogin(incomingRefreshToken) {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = await verifyRefreshToken(incomingRefreshToken);

      //checking wheather incomingRefreshToken is blackListed or not
      const isRefreshTokenBlackListed = await inMemGet(incomingRefreshToken);

      if (isRefreshTokenBlackListed) {
        /* 
        if this condition is satisfied, 
        then it is verified that there is stored token 
        and is blacklisted 
        */
        return reject(makeError.Unauthorized());
      }

      // function arrives here, if the refresh token is not blacklisted
      // the user is still logged in and returning the payload
      return resolve(payload);
    } catch (err) {
      return reject(coatError(err));
    }
  });
}

/*
this refreshes the tokens after verifying that 
it has not been blacklisted and is logged in
in redis and returns access and refresh tokens
*/
function refreshExistingToken(incomingRefreshToken) {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = await checkIfAlreadyLogin(incomingRefreshToken);

      //signing all the tokens again for the incoming refresh token
      const allTokens = await signAllTokens({
        id: payload.aud,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        profilePictureUrl: payload.profilePictureUrl,
      });
      return resolve({
        accessToken: allTokens.accessToken,
        refreshToken: allTokens.refreshToken,
        payload: payload,
        status: 301,
      });
    } catch (err) {
      return reject(err);
    }
  });
}

/*
this refreshes performs the logout of the user
by black listing the refresh tokens
using redis DB
*/
async function performLogout(incomingRefreshToken, userData) {
  return new Promise((resolve, reject) => {
    //setting the time to origin
    let expirationTimeInSeconds = new Date(0);

    //adding the exp seconds received from the incoming refresh token
    expirationTimeInSeconds.setSeconds(userData.exp);

    //adding extra 60 seconds and converting to integer
    expirationTimeInSeconds = Math.ceil(
      (expirationTimeInSeconds - new Date()) / 1000 + 60
    );

    // putting the incoming refresh token as key and value be true
    inMemSet(incomingRefreshToken, true, expirationTimeInSeconds)
      .then((reply) => {
        return resolve();
      })
      .catch((err) => {
        return reject(makeError.InternalServerError());
      });
  });
}
module.exports = {
  performLogin,
  performLogout,
  refreshExistingToken,
  checkIfAlreadyLogin,
};
