const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

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
  aggregationCheckWhetherUserIsAdminOrNot,
  conditionUpdateBucketItemDetail,
  aggregationUpdateBucketItemDetail,
  aggregationCheckAdminWithTotalBucketItems,
  conditionAddOneItemToBucket,
  conditionDeleteBucketItem,
  conditionDeleteRemarksOfABucketItem,
} = require("../DBQueries/Admin/DBQueries.Admin.Operations");

const {
  aggregationCheckWhetherUserIsPartOfBucketOrNot,
  aggregationEditRemark,
  conditionEditOrDeleteRemark,
} = require("../DBQueries/NormalUser/DBQueries.NormalUser.Operations");

/*
user can edit item in the bucket only if he is an admin. So check if he is admin first
if(!adminOfBucket){throw Forbidden() error}
else{edit the item}
*/
function editItem(userId, newBucketData) {
  return new Promise(async (resolve, reject) => {
    try {
      const checkData = await performAggregation(
        aggregationCheckWhetherUserIsAdminOrNot(userId, newBucketData.bucketId),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      if (checkData.length === 0) {
        return reject(makeError.Forbidden());
      }
      if (checkData[0].isAdmin === false) {
        return reject(makeError.Forbidden());
      }
      const updateResult = await updateOneByAggregation(
        conditionUpdateBucketItemDetail(
          newBucketData.bucketId,
          newBucketData.bucketItemId
        ),
        aggregationUpdateBucketItemDetail(
          newBucketData.bucketItemName,
          newBucketData.bucketItemLink,
          newBucketData.bucketItemDescription,
          newBucketData.bucketItemTag
        ),
        PROPS.dbName,
        PROPS.bucketItemCollection
      );

      //no such bucketItem id exist
      if (updateResult.matchedCount === 0) {
        return reject(makeError.Forbidden());
      }

      // sending an acknowledgement that item is successfully added
      const acknowledgement = {
        status: 200,
        message: "Item successfully updated",
      };
      return resolve(acknowledgement);
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

//return new BucketItemData
function addItem(userId, bucketItemData) {
  return new Promise(async (resolve, reject) => {
    try {
      // checking if the user is admin and getting number of bucketItems
      const addCheck = await performAggregation(
        aggregationCheckAdminWithTotalBucketItems(
          userId,
          bucketItemData.bucketId
        ),
        PROPS.dbName,
        PROPS.bucketCollection
      );

      //no such bucket exists
      if (addCheck.length === 0) {
        return reject(makeError.Forbidden());
      }

      bucketItemData = finalBucketItemObject(bucketItemData);
      // if the user trying to add the bucket item is not admin, throw forbidden error
      if (addCheck[0].isAdmin === false) {
        return reject(makeError.Forbidden());
      }

      //bucketItems limit exhausted
      if (addCheck[0].totalBucketItems > PROPS.limits.maxBucketItems) {
        return reject(makeError.NotAcceptable());
      }

      // inserting the bucketItem to the database since all the above conditions were met
      const insertionResult = await insertOne(
        bucketItemData,
        PROPS.dbName,
        PROPS.bucketItemCollection
      );

      if (insertionResult.matchedCount === 0) {
        return reject(makeError.Forbidden());
      }

      // sending an acknowledgement that item is successfully added
      const acknowledgement = {
        status: 200,
        message: "Document created successful",
        bucketItemDetails: insertionResult.ops[0],
      };

      return resolve(acknowledgement);
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

function finalBucketItemObject(bucketItemData) {
  return {
    bucketId: ObjectId(bucketItemData.bucketId),
    bucketItemName: bucketItemData.bucketItemName,
    bucketItemLink: bucketItemData.bucketItemLink,
    bucketItemDescription: bucketItemData.bucketItemDescription,
    bucketItemTag: bucketItemData.bucketItemTag,
    bucketItemCreateDate: bucketItemData.bucketItemCreateDate,
  };
}


function deleteItem(userId, bucketItemData) {
  return new Promise(async (resolve, reject) => {
    try {
      // getting data to check if the user is admin of the bucket
      const checkData = await performAggregation(
        aggregationCheckWhetherUserIsAdminOrNot(
          userId,
          bucketItemData.bucketId
        ),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      //no such bucket exists
      if (checkData.length == 0) {
        return reject(makeError.Forbidden());
      }

      // if the user attempting to change the data is not admin, throw forbidden error
      if (checkData[0].isAdmin === false) {
        return reject(makeError.Forbidden());
      }

      // as the above condition is met, we are deleting the item from the collection
      const itemDeleteResult = await deleteOneByAggregation(
        conditionDeleteBucketItem(
          bucketItemData.bucketId,
          bucketItemData.bucketItemId
        ),
        PROPS.dbName,
        PROPS.bucketItemCollection
      );
      //no such bucketItem exist
      if (itemDeleteResult.deletedCount === 0) {
        return reject(makeError.Forbidden());
      }

      // deleting the remarks regarding that bucket
      const remarksDeleteResult = await deleteManyByAggregation(
        conditionDeleteRemarksOfABucketItem(
          bucketItemData.bucketId,
          bucketItemData.bucketItemId
        ),
        PROPS.dbName,
        PROPS.remarkCollection
      );

      // sending the acknowledgement that the item is deleted
      const acknowledgement = {
        status: 200,
        message: "Bucket item deleted successfully",
      };
      return resolve(acknowledgement);
    } catch (err) {
      // in case of some error
      return reject(makeError.InternalServerError());
    }
  });
}


function manageRemarks(userId, remarkData) {
  return new Promise(async (resolve, reject) => {
    try {
      //checking whether user is part of bucket or not
      const checkData = await performAggregation(
        aggregationCheckWhetherUserIsPartOfBucketOrNot(
          userId,
          remarkData.bucketId
        ),
        PROPS.dbName,
        PROPS.bucketCollection
      );
      //no such bucket exists
      if (checkData.length == 0) {
        return reject(makeError.Forbidden());
      }
      // if the user is not part of bucket, it is forbidden to make changes to remarks
      if (checkData[0].isPartOfBucket === false) {
        return reject(makeError.Forbidden());
      }

      // as above condition is met, we will edit the remark
      // if the text length is zero, that means we have to delete the remark
      if (remarkData.text.length === 0) {
        const deleteResult = await deleteOneByAggregation(
          conditionEditOrDeleteRemark(
            userId,
            remarkData.bucketId,
            remarkData.bucketItemId
          ),
          PROPS.dbName,
          PROPS.remarkCollection
        );
        const acknowledgement = {
          status: 200,
          message: "Bucket item remark deleted successfully",
        };
        return resolve(acknowledgement);
      }

      //now there is two cases
      //case 1 :- No remarks exists
      //case 2 :- remark exists
      //so first go for updating
      const updateResult = await updateOneByAggregation(
        conditionEditOrDeleteRemark(
          userId,
          remarkData.bucketId,
          remarkData.bucketItemId
        ),
        aggregationEditRemark(remarkData.text),
        PROPS.dbName,
        PROPS.remarkCollection
      );
      //means remark exist and its updated in a single query so resolve
      if (updateResult.matchedCount == 1) {
        const acknowledgement = {
          status: 200,
          message: "Bucket item remark edited successfully",
        };
        return resolve(acknowledgement);
      }
      //means no remark exists, then create one
      if (updateResult.matchedCount == 0) {
        remarkData.userId = ObjectId(userId);
        const createdData = await insertOne(
          remarkData,
          PROPS.dbName,
          PROPS.remarkCollection
        );
        return resolve(createdData.ops[0]);
      }
    } catch (err) {
      return reject(makeError.InternalServerError());
    }
  });
}

module.exports = {
  editItem,
  addItem,
  deleteItem,
  manageRemarks,
};
