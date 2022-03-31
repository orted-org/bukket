const { getMongoClient, mongodb } = require("../Helper.MongoInit");

function insertOne(data, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .insertOne(data)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}

function findOne(query, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .findOne(query)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}
function findOneByObjectId(objectId, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .findOne({ _id: new mongodb.ObjectID(objectId) })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}
function find(query, projection, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .find(query)
    .project(projection)
    .toArray()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}
function deleteOneByObjectId(objectId, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .deleteOne({ _id: new mongodb.ObjectID(objectId) })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}
function updateOneByObjectId(objectId, updateData, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .updateOne({ _id: new mongodb.ObjectID(objectId) }, { $set: updateData })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}

function performAggregation(pipeline, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .aggregate(pipeline)
    .toArray()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}

function updateOneByAggregation(condition, pipeline, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .updateOne(condition, pipeline)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}

function updateManyByAggregation(condition, pipeline, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .updateMany(condition, pipeline)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}

function deleteOneByAggregation(condition, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .deleteOne(condition)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}


function deleteManyByAggregation(condition, dbName, collectionName) {
  const db = getMongoClient().db(dbName);
  return db
    .collection(collectionName)
    .deleteMany(condition)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
}

module.exports = {
  insertOne,
  findOne,
  findOneByObjectId,
  find,
  updateOneByObjectId,
  deleteOneByObjectId,
  performAggregation,
  updateOneByAggregation,
  updateManyByAggregation,
  deleteOneByAggregation,
  deleteManyByAggregation
};
