const router = require("express").Router();
const { db } = require("../firebase");

router.post("/", async (req, res, next) => {
  try {
    const subscription = await db
      .collection("subscriptions")
      .doc()
      .set(req.body.subscription);
    return res.json(subscription);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
