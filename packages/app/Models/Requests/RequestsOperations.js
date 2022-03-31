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
  pipelineShowAllRequests,
  conditionBucketFindWithAdminOrNot,
  pipelineAddUserToBucket,
  conditionForRemovingRequest,
  pipelineRemovingRequest,
  conditionAddBucketToUserBucketMapping,
  pipelineAddBucketToUserBucketMapping,
} = require("../DBQueries/Admin/DBQueries.Admin.Operations");
const {
  conditionAddUserJoinRequest,
  aggregationAddUserJoinRequest,
  aggregationCheckWhetherUserIsPartOfBucketOrNot,
} = require("../DBQueries/NormalUser/DBQueries.NormalUser.Operations");

function joinRequests(userId, bucketId) {
  return new Promise(async (resolve, reject) => {
    try {
      const dataFromDB = await performAggregation(
        pipelineShowAllRequests(userId, bucketId),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      //user is not admin
      if (dataFromDB.length == 0) {
        reject(makeError.Forbidden());
      }
      //returning a array containing single object
      return resolve(dataFromDB);
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

function makeJoinRequest(userId, bucketId) {
  return new Promise(async (resolve, reject) => {
    try {
      
      const checkData = await performAggregation(
        aggregationCheckWhetherUserIsPartOfBucketOrNot(userId, bucketId),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      //no such bucket exists
      if (checkData.length == 0) {
        return reject(makeError(404, "No such bucket exists"));
      }
      // if the user is already part of the bucket
      if (checkData[0].isPartOfBucket === true) {
        return reject(makeError(409, "Already part of the bucket"));
      }
      let dataFromDB = await updateOneByAggregation(
        conditionAddUserJoinRequest(bucketId),
        aggregationAddUserJoinRequest([objectId(userId)]),
        PROPS.dbName,
        PROPS.joinRequestCollection
      );

      //this means no request document for that bucket, 1st request
      if (dataFromDB.matchedCount == 0) {
        dataFromDB = await insertOne(
          {
            bucketId: objectId(bucketId),
            userIds: [objectId(userId)],
          },
          PROPS.dbName,
          PROPS.joinRequestCollection
        );
      }

      return resolve({
        status: 200,
        message: "Request sent successfully",
      });
    } catch (err) {
      return reject(makeError.InternalServerError);
    }
  });
}

function manageRequests(userId, requestsData) {
  return new Promise(async (resolve, reject) => {
    try {
      // checking if the user is admin or not and adding user to memberIds
      const updateResult = await updateOneByAggregation(
        conditionBucketFindWithAdminOrNot(userId, requestsData.bucketId),
        pipelineAddUserToBucket(
          requestsData.addedMembers,
          requestsData.addedMembers.length
        ),
        PROPS.dbName,
        PROPS.bucketCollection
      );

      if (updateResult.matchedCount > 0) {
        // removing all the requests from the requests document -> both added and rejected members
        const removingRequestsResult = await updateOneByAggregation(
          conditionForRemovingRequest(requestsData.bucketId),
          pipelineRemovingRequest(
            requestsData.addedMembers,
            requestsData.rejectedMembers
          ),
          PROPS.dbName,
          PROPS.joinRequestCollection
        );

        // if the matched count was zero, it means there is no document for that bucketId -> forbidden
        if (removingRequestsResult.matchedCount === 0) {
          return reject(makeError.Forbidden());
        }

        // after removing the requests, we need to modify the userBucket mapping of every user
        const updateMappingResult = await updateManyByAggregation(
          conditionAddBucketToUserBucketMapping(requestsData.addedMembers),
          pipelineAddBucketToUserBucketMapping([
            objectId(requestsData.bucketId),
          ]),
          PROPS.dbName,
          PROPS.userBucketMappingCollection
        );
      } else {
        //user is not admin
        return reject(makeError.Forbidden());
      }

      const acknowledgement = {
        status: 200,
        message: "Requests are managed accordingly",
      };
      return resolve(acknowledgement);
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

module.exports = {
  joinRequests,
  makeJoinRequest,
  manageRequests,
};
