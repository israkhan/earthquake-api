const router = require("express").Router();
const { db } = require("../firebase");

//Create a subscription for a user
router.post("/", async (req, res, next) => {
  try {
    const subscription = await db
      .collection("subscriptions")
      .doc()
      .set(req.body.subscription);

    // add subsciption as a subcollection of the authenticated user
    await db
      .collection("users")
      .document(req.body.uid)
      .collection("subscriptions")
      .document(subscription.id)
      .set(req.body.subscription);

    return res.json(subscription);
  } catch (err) {
    next(err);
  }
});

// Get all subscriptions for the current user
router.get("/:userId", async (req, res, next) => {
  try {
    const subscriptions = await db
      .collection("users")
      .document(req.body.uid)
      .collection("subscriptions")
      .get();

    return res.json(subscriptions);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await db
      .collection("users")
      .document(req.body.uid)
      .collection("subscriptions")
      .document(req.params.id)
      .delete();

    await db.collection("subscriptions").document(req.params.id).delete();

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
