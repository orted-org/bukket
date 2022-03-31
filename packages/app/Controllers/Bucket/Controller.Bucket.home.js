const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { allBucketsOfUser } = require("../../Models/Bucket/BucketOperations");

const getHome = (req, res, next) => {
  const userId = req.userData.aud;
  
  allBucketsOfUser(userId, req.query.tag)
    .then((bucketList) => {
      res.status(200).json(bucketList);
    })
    .catch((err) => {
      //internal server error
      next(err);
    });
};

function validateGetHome(req, res, next) {
  try {
    let tag = req.query.tag;
    if (tag == undefined) {
      req.query.tag = undefined;
      return next();
    }

    if (typeof tag === "string") {
      tag = Number(tag);
    }
    if (!(tag === 1 || tag === 0 || tag === -1)) {
      return next(makeError(422, "Invalid inputs"));
    }

    req.query.tag = tag;
    return next();
  } catch (err) {
    return next(err);
  }
}
module.exports = { getHome, validateGetHome };
