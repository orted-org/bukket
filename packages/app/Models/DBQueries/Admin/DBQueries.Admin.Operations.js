const ObjectId = require("mongodb").ObjectId;
const {PROPS} = require("../../../Helpers/DataAccess/DBInfo");

/*
-------------------------------------------------------------------------------------------------
1. creating the bucket
1a.just push data in bucket collection(just call insertOne function)
1b.add bucket id in user bucket mapping(Above wrote)---->conditionAddBucketToUserBucketMapping
*/

/*
--------------------------------------------------------------------------------------------------
2. showing the setting page
*/
module.exports.pipelineShowSettingPageToAdmins = (userId, bucketId) => {
  return [
    {
      $match: {
        _id: ObjectId(bucketId),
        bucketAdmins: {
          $elemMatch: {
            $eq: ObjectId(userId),
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "memberIds",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $project: {
        memberIds: 0,
      },
    },
  ];
};

/*
---------------------------------------------------------------------------------------------------
3. can edit the bucket details
this condition will find the bucket only when the user is admin of that bucket
*/
module.exports.conditionBucketFindWithAdminOrNot = (userId, bucketId) => {
  return {
    _id: ObjectId(bucketId),
    bucketAdmins: {
      $elemMatch: {
        $eq: ObjectId(userId),
      },
    },
  };
};

//Updating bucket details
module.exports.aggregationUpdateBucketDetails = (
  newBucketName,
  newBucketDescription
) => {
  return [
    {
      $set: {
        bucketName: newBucketName,
        bucketDescription: newBucketDescription,
      },
    },
  ];
};

/*
------------------------------------------------------------------------------------------------
4.deleting the bucket
deleting the bucket is independent means it will only get deleted when admins wants to delete it

tasks
4.1. now finally remove the bucket from bucket(this will get deleted)
4.2. delete all remarks of that bucket
4.3. delete all the bucket items of that bucket
4.4  delete request document of that bucket
4.5. update user bucket mapping of all the users that were part of that (search the documets whose joined bucket containes perticular bucket id)

4.1. only the admins can delete it(this will get deleted only the user is admin)
if he is not admin this will deleted 0 documents
*/
module.exports.conditionDeleteBucket = (userId, bucketId) => {
  return {
    _id: ObjectId(bucketId),
    bucketAdmins: {
      $elemMatch: {
        $eq: ObjectId(userId),
      },  
    },
  };
};

//4.2 do this only if 4.1 is successful
module.exports.conditionDeleteRemarksOfABucket = (bucketId) => {
  return {
    bucketId: ObjectId(bucketId),
  };
};

//4.3.do this only if 4.1 is successful
module.exports.conditionDeleteBucketItemsOfABucket = (bucketId) => {
  return {
    bucketId: ObjectId(bucketId),
  };
};

//4.4 do this only if 4.1 is successful
module.exports.conditionDeleteRequestDocumentOfBucket = (bucketId) => {
  return {
    bucketId: ObjectId(bucketId),
  };
};

//4.5.  updateMany  (do this only if 4.1 is successful)
module.exports.conditionRemoveBucketIdFromUserMappingOnDeltingBucket = (
  bucketId
) => {
  return {
    joinedBuckets: {
      $elemMatch: {
        $eq: ObjectId(bucketId),
      },
    },
  };
};

module.exports.aggregationRemoveBucketIdFromUserMapping = (bucketId) => {
  return [
    {
      $set: {
        joinedBuckets: {
          $filter: {
            input: "$joinedBuckets",
            as: "id",
            cond: { $ne: ["$$id", ObjectId(bucketId)] },
          },
        },
      },
    },
  ];
};


/*
---------------------------------------------------------------------------------------------------
5.Create/edit/delete Bucket item
5.1--> check whether the user that wants to delete/edit/create is admin or not
.......(during creating check total bucketItems should not exceed 50)
5.2--> createBucketItem ===> just call the insert function to do so
5.3--> update the bucketItem details
5.4--> delete bucketItems
5.4.1 --> delete bucketItem
5.4.2 --> delete all remarks of that bucketItem
*/

module.exports.aggregationCheckWhetherUserIsAdminOrNot = (userId, bucketId) => {
  return [
    {
      $match: {
        _id: ObjectId(bucketId),
      },
    },
    {
      $addFields: {
        isAdmin: {
          $in: [ObjectId(userId), "$bucketAdmins"],
        },
      },
    },
    {
      $project: {
        isAdmin: 1,
      },
    },
  ];
};
//this will give both whether admin or not with total bucketItems of that bucket
module.exports.aggregationCheckAdminWithTotalBucketItems = (
  userId,
  bucketId
) => {
  return [
    {
      $match: {
        _id: ObjectId(bucketId),
      },
    },
    {
      $lookup: {
        from: "bucketItems",
        localField: "_id",
        foreignField: "bucketId",
        as: "bucketItems",
      },
    },
    {
      $addFields: {
        isAdmin: {
          $in: [ObjectId(userId), "$bucketAdmins"],
        },
        totalBucketItems: { $size: "$bucketItems" },
      },
    },
    {
      $project: {
        isAdmin: 1,
        totalBucketItems: 1,
      },
    },
  ];
};

//5.3
module.exports.conditionUpdateBucketItemDetail = (bucketId, bucketItemId) => {
  return {
    _id: ObjectId(bucketItemId),
    bucketId: ObjectId(bucketId),
  };
};

module.exports.aggregationUpdateBucketItemDetail = (
  newBucketItemName,
  newBucketItemLink,
  newBucketItemDescription,
  newBucketItemTag
) => {
  return [
    {
      $set: {
        bucketItemName: newBucketItemName,
        bucketItemLink: newBucketItemLink,
        bucketItemDescription: newBucketItemDescription,
        bucketItemTag: newBucketItemTag,
      },
    },
  ];
};

//5.4.1
module.exports.conditionDeleteBucketItem = (bucketId, bucketItemId) => {
  return {
    _id: ObjectId(bucketItemId),
    bucketId: ObjectId(bucketId),
  };
};

//5.4.2
module.exports.conditionDeleteRemarksOfABucketItem = (
  bucketId,
  bucketItemId
) => {
  return {
    bucketItemId: ObjectId(bucketItemId),
    bucketId: ObjectId(bucketId),
  };
};

/*
------------------------------------------------------------------------------------------------------------------------
6. show request page to admin(will see only if he is admin)
*/
module.exports.pipelineShowAllRequests = (userId, bucketId) => {
  return [
    {
      $match: {
        _id: ObjectId(bucketId),
        bucketAdmins: {
          $elemMatch: {
            $eq: ObjectId(userId),
          },
        },
      },
    },
    {
      $lookup: {
        from: "joinRequests",
        localField: "_id",
        foreignField: "bucketId",
        as: "joinRequests",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "joinRequests.userIds",
        foreignField: "_id",
        as: "joinRequests",
      },
    },
    {
      $addFields: {
        userCount: { $size: "$memberIds" },
      },
    },
    {
      $project: {
        bucketName: 1,
        joinRequests: 1,
        userCount :1
      },
    },
  ];
};

/*
-------------------------------------------------------------------------------------------------------------------------------
7. Approve the Requests and make the users, members
7.1 add userId in member id(this will happen only if user(one who is approving requests) is admin) max 200 member
7.2 remove the users from joinRequest(do this only above is successful so no need to check authorization)
7.3 add bucket id in joinedBuckets in userBucket Mapping of all the added users

7.1
@conditionBucketFindWithAdminOrNot(find bucket with admin condition)
*/

module.exports.pipelineAddUserToBucket = (addedMembers, addedMembersSize) => {
  return [
    {
      $set: {
        memberIds: {
          $cond: {
            if: {
              $lte: [{ $add: [addedMembersSize, { $size: "$memberIds" }] }, PROPS.limits.maxBucketMembers],
            },
            then: { $concatArrays: ["$memberIds", addedMembers] },
            else: "$memberIds",
          },
        },
      },
    },
  ];
};

//7.2
module.exports.conditionForRemovingRequest = (bucketId) => {
  return {
    bucketId: ObjectId(bucketId),
  };
};

//addedMembers -> approved, removedMembers -> disApproved(both are array ob objectOds)
//removing both from requestJoin
module.exports.pipelineRemovingRequest = (addedMembers, rejectedMembers) => {
  return [
    {
      $set: {
        userIds: {
          $filter: {
            input: "$userIds",
            as: "id",
            cond: {
              $not: [
                {
                  $or: [
                    { $in: ["$$id", addedMembers] },
                    { $in: ["$$id", rejectedMembers] },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  ];
};

//7.3
//here this should happen only after adding user in memberIds
//if that is unsuccessful skip it
//array of userIds
module.exports.conditionAddBucketToUserBucketMapping = (addedMembers) => {
  return {
    userId: { $in: addedMembers },
  };
};

//one single bucket will be in array of object ID;
//add this to all the users
module.exports.pipelineAddBucketToUserBucketMapping = (newBucketArray) => {
  return [
    {
      $set: {
        joinedBuckets: {
          $concatArrays: ["$joinedBuckets", newBucketArray],
        },
      },
    },
  ];
};
/*
-------------------------------------------------------------------------------------------
8.manage users (removing the users from bucket)
8.1. delete userId from bucketId members
8.2. delete bucket id from userBucketMapping for every removed users(do this only when the 8.1.matchedCount==1)
8.3. remove remarks of that users from remarks

8.1 @conditionBucketFindWithAdminOrNot
removed user will be array of object ids
*/
module.exports.aggregationRemoveUserFromMemberIds = (removedUsers)=>{
  return [
    {
      $set: {
        memberIds: {
          $filter: {
            input: "$memberIds",
            as: "id",
            cond: {
              $not: [{ $in: ["$$id", removedUsers] }],
            },
          },
        },
      },
    },
  ];
}

//8.2 
module.exports.conditionRemoveBucketIdFromUserMappingOnRemovingUserFromBucket = (removedUsers)=>{
  return {
    userId: { $in: removedUsers },
  };
}

module.exports.aggregationRemoveBucketIdFromUserMappingOnRemovingUser = (bucketId) => {
  return [
    {
      $set: {
        joinedBuckets: {
          $filter: {
            input: "$joinedBuckets",
            as: "id",
            cond: {
              $not: [{ $eq: ["$$id", ObjectId(bucketId)] }],
            },
          },
        },
      },
    },
  ];
};

module.exports.conditionDeleteRemarksOfUsersOfaBucketOnRemovingFromBucket = (removedUsers, bucketId)=>{
  return {
    userId : {$in : removedUsers},
    bucketId : ObjectId(bucketId)
  }
}
