const router = require("express").Router();
const { db } = require("../firebase");

const quakeRef = db.collection("earthquakes");

/**
 * @swagger
 *
 * definitions:
 *  Earthquake:
 *    type: object
 *    required:
 *      - id
 *      - update
 *      - properties
 *    properties:
 *      id:
 *        type: string
 *      update:
 *        type: integer
 *      properties:
 *        type: object
 *
 */

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/earthquakes/{id}:
 *  get:
 *    description: Get earthquake with given id
 *    parameters:
 *    - name: id
 *      description: Id of earthquake
 *      in: path
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Earthquakes returned succesfully
 *        schema:
 *          $ref: '#/definitions/Earthquake'
 *      400:
 *        description: Earthquake does not exist
 */

router.get("/:id", async (req, res, next) => {
  try {
    const quakes = await quakeRef.doc(req.params.id).get();
    return res.json(quakes.data());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
