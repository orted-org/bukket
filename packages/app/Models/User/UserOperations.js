const { PROPS } = require("../../Helpers/DataAccess/DBInfo");
const {
  updateOneByAggregation,
  updateManyByAggregation,
  deleteManyByAggregation,
} = require("../../Helpers/DataAccess/DBOperation");
const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const {
  aggregationRemoveUserFromMemberIds,
  conditionRemoveBucketIdFromUserMappingOnRemovingUserFromBucket,
  aggregationRemoveBucketIdFromUserMappingOnRemovingUser,
  conditionDeleteRemarksOfUsersOfaBucketOnRemovingFromBucket,
} = require("../DBQueries/Admin/DBQueries.Admin.Operations");
const {
  conditionFindBucketUserIsPartOrNot,
} = require("../DBQueries/NormalUser/DBQueries.NormalUser.Operations");

function exitBucket(userId, bucketId, removedUsers) {
  return new Promise(async (resolve, reject) => {
    try {
      //removing the userId from memberIds
      let deleteRes = await updateOneByAggregation(
        conditionFindBucketUserIsPartOrNot(userId, bucketId),
        aggregationRemoveUserFromMemberIds(removedUsers),
        PROPS.dbName,
        PROPS.bucketCollection
      );

      // case 1: user is not part of the bucket
      // case 2: bucket doesn't exist
      // case 3: user is not the admin of the bucket
      if (deleteRes.matchedCount === 0) {
        return reject(makeError.Forbidden());
      }
      if (deleteRes.matchedCount === undefined) {
        return reject(makeError.InternalServerError());
      }

      // removing bucketId from mapping aggregationRemoveBucketIdFromUserMappingOnRemovingUser
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
        message: "Successfully exited the bucket",
      });
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

module.exports = {
  exitBucket,
};
