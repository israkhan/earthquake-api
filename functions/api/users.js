const router = require("express").Router();
const { db } = require("../firebase");

router.get("/:userId", async (req, res, next) => {
  try {
    const user = await db.collection("users").doc(req.params.id).get();
    return res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = req.body.user;
    const user = await db.collection("users").doc(body.id).set({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
    });
    return res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const attributes = req.body.attributes;
    const user = await db
      .collection("users")
      .doc(req.params.id)
      .set(attributes);
    return res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
