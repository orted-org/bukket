const PROPS = {
  dbName: "dummy-data",
  userCollection: "users",
  userBucketMappingCollection: "UserBucketMapping",
  bucketCollection: "buckets",
  bucketItemCollection: "bucketItems",
  joinRequestCollection: "joinRequests",
  remarkCollection: "remarks",
  limits: {
    minNameLen: 3,
    maxNameLen: 45,
    minDescLen: 0,
    maxDescLen: 300,
    maxBucketMembers: 200,
    maxBucketItems: 50,
    maxTagsNumber: 10,
    minRemarkLen: 0,
    maxRemarkLen: 65,
    minIconValue: 1,
    maxIconValue: 10,
  },
};

module.exports = { PROPS };
