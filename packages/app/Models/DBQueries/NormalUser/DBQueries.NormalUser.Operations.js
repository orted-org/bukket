const ObjectId = require("mongodb").ObjectId;

/*
-------------------------------------------------------------------------------------------------------------
1. showing Bucket List of the of user
*/
module.exports.pipelineGetAllBucketsOfUser = (userId) => {
  return [
    {
      $match: {
        userId: ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "buckets",
        localField: "joinedBuckets",
        foreignField: "_id",
        as: "joinedBuckets",
      },
    },
    {
      $project: {
        userId: 1,
        "joinedBuckets.bucketName": 1,
        "joinedBuckets._id": 1,
        "joinedBuckets.bucketAdmins": 1,
      },
    },
  ];
};

/*
------------------------------------------------------------------------------------------------------------
2. Showing the bucket Page, only he is part of that
showing the complete bucketPage
showing all bucketItems of a bucket
*/
module.exports.pipelineGetAllBucketItemsOfBucket = (userId, bucketId) => {
  return [
    {
      $match: {
        _id: ObjectId(bucketId),
        memberIds: {
          $elemMatch: {
            $eq: ObjectId(userId),
          },
        },
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
      $lookup: {
        from: "users",
        localField: "bucketAdmins",
        foreignField: "_id",
        as: "bucketAdmins",
      },
    },
    {
      $lookup: {
        from: "remarks",
        let: {
          bucketItemIds: "$bucketItems",
        },
        pipeline: [
          {
            $match: {
              userId: ObjectId(userId),
              $expr: { $in: ["$bucketItemId", "$$bucketItemIds._id"] },
            },
          },
        ],
        as: "remarks",
      },
    },
    {
      $lookup: {
        from: "joinRequests",
        pipeline: [
          {
            $match: {
              bucketId: ObjectId(bucketId),
            },
          },
        ],
        as: "Requests",
      },
    },
    {
      $addFields: {
        isAdmin: { $in: [ObjectId(userId), "$bucketAdmins._id"] },
        userCount: { $size: "$memberIds" },
        firstElement: {
          $cond: {
            if: {
              $eq: [{ $size: "$Requests" }, 0],
            },
            then: {
              userIds: [],
            },
            else: {
              $first: "$Requests",
            },
          },
        },
      },
    },
    {
      $addFields: {
        isNewRequest: {
          $cond: {
            if: {
              $eq: [{ $size: "$firstElement.userIds" }, 0],
            },
            then: false,
            else: true,
          },
        },
      },
    },
    {
      $project: {
        memberIds: 0,
        // "bucketAdmins._id": 0,
        "bucketAdmins.subId": 0,
        "bucketAdmins.email": 0,
        "bucketAdmins.profilePictureUrl": 0,
        "remarks.userId": 0,
        "remarks.bucketId": 0,
        "remarks._id": 0,
        "bucketItems.bucketId": 0,
        Requests: 0,
        firstElement : 0
      },
    },
  ];
};
/*
--------------------------------------------------------------------------------------------------
4. create/edit/delete remarks
4.1 create remarks (only the user that is part of that bucket can create remark for any of the item)
4.2 edit remark(no need to check any condition just put the new data)
4.3 delete remark(no need to check any condition just put the new data)

4.1(after checking just call the insert method)
*/
module.exports.aggregationCheckWhetherUserIsPartOfBucketOrNot = (
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
      $addFields: {
        isPartOfBucket: {
          $in: [ObjectId(userId), "$memberIds"],
        },
      },
    },
    {
      $project: {
        isPartOfBucket: 1,
      },
    },
  ];
};

//4.2 edit remark
module.exports.conditionEditOrDeleteRemark = (
  userId,
  bucketId,
  bucketItemId
) => {
  return {
    userId: ObjectId(userId),
    bucketId: ObjectId(bucketId),
    bucketItemId: ObjectId(bucketItemId),
  };
};
module.exports.aggregationEditRemark = (newText) => {
  return [
    {
      $set: {
        text: newText,
      },
    },
  ];
};

/*
4.3 delete ----> condition same as editRemark

----------------------------------------------------------------------------------------------------
5. Can send the joinRequest To any bucket
newJoinRequest must be an array of single element
this will only add userRequest if he is not in userRequests
*/
module.exports.conditionAddUserJoinRequest = (bucketId) => {
  return {
    bucketId: ObjectId(bucketId),
  };
};

module.exports.aggregationAddUserJoinRequest = (newJoinRequests) => {
  return [
    {
      $set: {
        userIds: {
          $cond: {
            if: {
              $in: [newJoinRequests[0], "$userIds"],
            },
            then: "$userIds",
            else: { $concatArrays: ["$userIds", newJoinRequests] },
          },
        },
      },
    },
  ];
};


module.exports.conditionFindBucketUserIsPartOrNot = (userId, bucketId) => {
  return {
    _id: ObjectId(bucketId),
    memberIds: {
      $elemMatch: {
        $eq: ObjectId(userId),
      },
    },
    bucketAdmins: {
      $elemMatch: {
        $ne: ObjectId(userId),
      },
    },
  };
};

