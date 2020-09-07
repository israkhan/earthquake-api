const router = require("express").Router();
const { db } = require("../firebase");

const quakeRef = db.collection("earthquakes");

//Get specific earthquake
router.get("/:quakeId", async (req, res, next) => {
  try {
    const quakes = await quakeRef.doc(req.params.quakeId).get();
    return res.json(quakes.data());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
