const MongoClient = require("mongodb").MongoClient;
let mongoClient;

const mongoConnect = (callback) => {
  new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .connect()
    .then((client) => {
      console.log("Connected to MongoDB Operation");
      mongoClient = client;
      callback();
    })
    .catch((err) => {
      console.log("Mongodb", err.message);
    });
};
const getClient = () => {
  if (mongoClient) {
    return mongoClient;
  }
  throw "No Mongo Client Found";
};
exports.mongoConnect = mongoConnect;
exports.getMongoClient = getClient;

exports.mongodb = require("mongodb");
