const router = require("express").Router();
const { db } = require("../firebase");

let ref = db.collection("users");

router.get("/", async (req, res, next) => {
  try {
    const snapshot = await ref.get();

    let users = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();
      users.push({ id, ...data });
    });

    return res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const snapshot = await ref.doc(req.params.id).get();
    const data = { id: req.params.id, ...snapshot.data() };

    return res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const response = await db.collection("users").add(req.body);
    return res.json({ id: response.id });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await db.collection("users").doc(req.params.id).update(req.body);
    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
