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
 * /earthquake-notification-59115/us-central1/app/api/reports/{quakeId}:
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
      .collection("reports")
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
 * /earthquake-notification-59115/us-central1/app/api/reports/:
 *  post:
 *    description: Create a report for an earthquake
 *    parameters:
 *    - name: report
 *      desciprtion: Report details to add to earthquake
 *      in: body
 *      type: object
 *      required: true
 *      schema:
 *        $ref: '#/definitions/Report'
 *    responses:
 *      200:
 *        description: Report created succesfully
 */

router.post("/", async (req, res, next) => {
  try {
    await earthQuakeRef
      .doc(req.body.quakeId)
      .collection("reports")
      .set(req.body);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/reports/{quakeId}/{reportId}:
 *  put:
 *    description: Update report info
 *    parameters:
 *    - name: quakeId
 *      description: Id of earthquake
 *      in: path
 *      type: string
 *      required: true
 *    - name: reportId
 *      description: Id of report
 *      in: path
 *      type: string
 *      required: true
 *    - name: report
 *      description: Report attributes to update
 *      in: body
 *      type: object
 *      required: fals
 *      schema:
 *        $ref: '#/definitions/Report'
 *    responses:
 *      200:
 *        description: User updated succesfully
 */
router.put("/:quakeId/:reportId", async (req, res, next) => {
  try {
    await earthQuakeRef
      .doc(req.body.quakeId)
      .collection("reports")
      .doc(req.params.reportId)
      .update(req.body);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
