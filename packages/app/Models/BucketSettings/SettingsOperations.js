const mongodb = require("mongodb");
const objectId = mongodb.ObjectId;

const {
  coatError,
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");

const {
  insertOne,
  updateOneByAggregation,
  performAggregation,
  deleteOneByAggregation,
  deleteManyByAggregation,
  updateManyByAggregation,
} = require("../../Helpers/DataAccess/DBOperation");

const { PROPS } = require("../../Helpers/DataAccess/DBInfo");

const {
  conditionBucketFindWithAdminOrNot,
  aggregationUpdateBucketDetails,
  pipelineShowSettingPageToAdmins,
  aggregationRemoveUserFromMemberIds,
  conditionRemoveBucketIdFromUserMappingOnDeltingBucket,
  conditionRemoveBucketIdFromUserMappingOnRemovingUser,
  conditionRemoveBucketIdFromUserMappingOnRemovingUserFromBucket,
  aggregationRemoveBucketIdFromUserMappingOnRemovingUser,
  conditionDeleteRemarksOfUsersOfaBucketOnRemovingFromBucket,
} = require("../DBQueries/Admin/DBQueries.Admin.Operations");

/*
possible errors:
1. user is not an admin(403)
2. Internal server error
will return acknowledgment
*/
function editDetails(adminId, newBucketData) {
  return new Promise(async (resolve, reject) => {
    try {
      const updateData = await updateOneByAggregation(
        conditionBucketFindWithAdminOrNot(adminId, newBucketData.bucketId),
        aggregationUpdateBucketDetails(
          newBucketData.bucketName,
          newBucketData.bucketDescription
        ),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      // handling the error 1
      if (updateData.matchedCount == 0) {
        return reject(makeError.Forbidden());
      }
      return resolve({
        status: 200,
        message: "Successfully updated",
      });
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

// possible errors:
// 1. user the made the request is not an admin
// 2. Internal server error
//will return an arrayy with single object
function showDetails(adminId, bucketId) {
  return new Promise(async (resolve, reject) => {
    try {
      const bucketDetailsAndUsers = await performAggregation(
        pipelineShowSettingPageToAdmins(adminId, bucketId),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      // handling the error 1
      if (bucketDetailsAndUsers.length === 0) {
        return reject(makeError.Forbidden());
      }
      return resolve(bucketDetailsAndUsers);
    } catch (err) {
      // handling the error 2
      return reject(makeError.InternalServerError());
    }
  });
}

function manageUsers(adminId, bucketId, removedUsers) {
  return new Promise(async (resolve, reject) => {
    try {
      if (isAdminTryingToDeleteHimself(removedUsers, adminId)) {
        return reject(makeError(403, "Admin can not delete himself"));
      }
      //removing the userIds from memberIds
      let deleteRes = await updateOneByAggregation(
        conditionBucketFindWithAdminOrNot(adminId, bucketId),
        aggregationRemoveUserFromMemberIds(removedUsers),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      //user is not admin
      if (deleteRes.matchedCount == 0) {
        return reject(makeError.Forbidden());
      }

      // removing bucketId from mapping
      await updateManyByAggregation(
        conditionRemoveBucketIdFromUserMappingOnRemovingUserFromBucket(
          removedUsers
        ),
        aggregationRemoveBucketIdFromUserMappingOnRemovingUser(bucketId),
        PROPS.dbName,
        PROPS.userBucketMappingCollection
      );
      //removing remarks of user with that bucket
      await deleteManyByAggregation(
        conditionDeleteRemarksOfUsersOfaBucketOnRemovingFromBucket(
          removedUsers,
          bucketId
        ),
        PROPS.dbName,
        PROPS.remarkCollection
      );

      return resolve({
        status: 200,
        message: "Successfully removed",
      });
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

function isAdminTryingToDeleteHimself(removedUsers, adminId) {
  adminId = adminId.toString();
  for (let i = 0; i < removedUsers.length; i++) {
    if (removedUsers[i].toString() == adminId) return true;
  }
  return false;
}

module.exports = {
  editDetails,
  showDetails,
  manageUsers,
};
