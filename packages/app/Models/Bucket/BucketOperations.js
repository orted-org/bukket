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
  conditionAddBucketToUserBucketMapping,
  pipelineAddBucketToUserBucketMapping,
  conditionDeleteBucket,
  conditionDeleteBucketItemsOfABucket,
  conditionDeleteRemarksOfABucket,
  conditionDeleteRequestDocumentOfBucket,
  conditionRemoveBucketIdFromUserMappingOnDeltingBucket,
  aggregationRemoveBucketIdFromUserMapping,
} = require("../DBQueries/Admin/DBQueries.Admin.Operations");

const {
  pipelineGetAllBucketsOfUser,
  pipelineGetAllBucketItemsOfBucket,
} = require("../DBQueries/NormalUser/DBQueries.NormalUser.Operations");


//1. inserting data in bucketCollection
//2. add bucketId in userBucketMapping
//will return new bucket data
function createBucket(adminId, bucketData) {
  return new Promise(async (resolve, reject) => {
    try {
      const dataFromDb = await insertOne(
        bucketData,
        PROPS.dbName,
        PROPS.bucketCollection
      );

      const newBucketId = dataFromDb.ops[0]._id;

      const updateInfo = await updateOneByAggregation(
        conditionAddBucketToUserBucketMapping([objectId(adminId)]),
        pipelineAddBucketToUserBucketMapping([objectId(newBucketId)]),
        PROPS.dbName,
        PROPS.userBucketMappingCollection
      );

      return resolve(dataFromDb.ops[0]);
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}


//will return object containing joined and created buckets
function allBucketsOfUser(userId, tag) {
  return new Promise(async (resolve, reject) => {
    try {
      const allBuckets = await performAggregation(
        pipelineGetAllBucketsOfUser(userId),
        PROPS.dbName,
        PROPS.userBucketMappingCollection
      );
      //invalid userId 
      if(allBuckets.length===0){
        reject(makeError.NotFound());
      }

      let resData = getAccordingToTag(allBuckets[0], tag);

      resolve(resData);
    } catch (err) {
      reject(makeError.InternalServerError());
    }
  });
}

//segregating buckets into joined created buckets 
function getAccordingToTag(allBuckets, tag) {
  let createdBuckets = [];
  let joinedBuckets = [];
  allBuckets.userId = allBuckets.userId.toString();

  allBuckets.joinedBuckets.forEach((bucket) => {
    let found = -1;
    bucket.bucketAdmins.forEach((uid) => {
      uid = uid.toString();
      if (uid.toString() === allBuckets.userId) {
        found = 1;
      }
    });
    bucket.bucketAdmins = undefined;
    if (found === 1) {
      createdBuckets.push(bucket);
    } else {
      joinedBuckets.push(bucket);
    }
  });

  if (tag === 0) {
    allBuckets.createdBuckets = createdBuckets;
    allBuckets.joinedBuckets = [];
    return allBuckets;
  }
  if (tag === -1) {
    allBuckets.joinedBuckets = joinedBuckets;
    allBuckets.createdBuckets = [];
    return allBuckets;
  }
  if (tag === undefined || tag === 1) {
    allBuckets.createdBuckets = createdBuckets;
    allBuckets.joinedBuckets = joinedBuckets;
    return allBuckets;
  }
}

/*
1. if the given user is not admin will return forbidden error
2. else will return acknowledgemment
*/
function deleteBucket(adminId, bucketId) {
  return new Promise(async (resolve, reject) => {
    try {
      //1. delete the bucket only if user is admin
      const deleteBucketRes = await deleteOneByAggregation(
        conditionDeleteBucket(adminId, bucketId),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      if (deleteBucketRes.deletedCount == 0) {
        //user is not admin
        return reject(makeError.Forbidden());
      }

      //2.deleting all bucketItems of that bucket
      const deleteItemRes = await deleteManyByAggregation(
        conditionDeleteBucketItemsOfABucket(bucketId),
        PROPS.dbName,
        PROPS.bucketItemCollection
      );
      //3. deleting all the remarks of that bucket
      const deleteRemarksRes = await deleteManyByAggregation(
        conditionDeleteRemarksOfABucket(bucketId),
        PROPS.dbName,
        PROPS.remarkCollection
      );
      //4. delete request document
      const deleteRequestRes = await deleteOneByAggregation(
        conditionDeleteRequestDocumentOfBucket(bucketId),
        PROPS.dbName,
        PROPS.joinRequestCollection
      );
      //5. updating user bucket mapping
      const updateUserMappingRes = await updateManyByAggregation(
        conditionRemoveBucketIdFromUserMappingOnDeltingBucket(bucketId),
        aggregationRemoveBucketIdFromUserMapping(bucketId),
        PROPS.dbName,
        PROPS.userBucketMappingCollection
      );

      return resolve({
        status: 200,
        msg: "Deleted successfully",
      });
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

//will return a object containing the bucketData with bucketitems and remarks
function getAllBucketItemsOfBucket(userId, bucketId) {
  return new Promise(async (resolve, reject) => {
    try {
      let allItems = await performAggregation(
        pipelineGetAllBucketItemsOfBucket(userId, bucketId),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      // user is not part of the bucket / bucket doesnt exist => 403
      if (allItems.length == 0) {
        return reject(makeError.Forbidden());
      }

      allItems = togetherRemarkAndItem(allItems[0]);
      resolve(allItems);
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

function togetherRemarkAndItem(data) {
  for (let i = 0; i < data.remarks.length; i++) {
    data.remarks[i].bucketItemId = data.remarks[i].bucketItemId.toString();
    for (let j = 0; j < data.bucketItems.length; j++) {
      if (data.bucketItems[j]._id.toString() === data.remarks[i].bucketItemId) {
        data.bucketItems[j].remark = data.remarks[i].text;
        break;
      }
    }
  }
  data.remarks = undefined;
  return data;
}

module.exports = {
  createBucket,
  allBucketsOfUser,
  deleteBucket,
  getAllBucketItemsOfBucket,
};
