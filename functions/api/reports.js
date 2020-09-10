const router = require("express").Router();
const { db } = require("../firebase");

let earthQuakeRef = db.collection("earthquakes");

/**
 * @swagger
 *
 * definitions:
 *  Report:
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *      firstName:
 *        type: string
 *      lastName:
 *        type: string
 *      status:
 *        type: string
 *      contact:
 *        type: string
 *
 */

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/users/{quakeId}:
 *  get:
 *    description: Get a report for an earthquake
 *    parameters:
 *    - name: quakeId
 *      description: Id of the earthquake to pull reports from
 *      in: path
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Reports returned succesfully
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Report'
 *      404:
 *        description: Earthquake not found
 */

router.get("/:quakeId", async (req, res, next) => {
  try {
    const snapshot = await earthQuakeRef
      .doc(req.params.quakeId)
      .colletion("reports")
      .get();

    let reports = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();
      reports.push({ id, ...data });
    });
    return res.json(reports);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/users/{quakeId}:
 *  post:
 *    description: Create a report for an earthquake
 *    parameters:
 *    - name: quakeId
 *      description: Id of the earthquake to create report for
 *      in: path
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Report created succesfully
 */

router.post("/:quakeId", async (req, res, next) => {
  try {
    await earthQuakeRef
      .doc(req.params.quakeId)
      .colletion("reports")
      .set(req.body);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});
