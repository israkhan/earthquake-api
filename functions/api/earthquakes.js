const router = require("express").Router();
const { db } = require("../firebase");
const {
  locationToLongLat,
  getEarthquakesByLocation,
  convertDate,
  convertRadius,
} = require("./utility");

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

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/earthquakes/:
 *  get:
 *    description: Get earthquakes given various query paramters
 *    parameters:
 *    - name: location
 *      description: String describing location to search near
 *      in: query
 *      type: string
 *      required: true
 *    - name: radius
 *      description: Radius from location to constrain results to
 *      in: query
 *      type: integer
 *      required: true
 *    - name: startDate
 *      description: Start date to constrain results to
 *      in: query
 *      type: string
 *      required: true
 *    - name: endDate
 *      description: End Date to constrain results to
 *      in: query
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
router.get(`/`, async (req, res, next) => {
  try {
    const params = req.query;
    //TODO: add error handling if geoCode returns an error
    const geoCode = await locationToLongLat(params.location);
    const { minLat, maxLat, minLng, maxLng } = convertRadius(
      geoCode,
      params.radius
    );

    // Need to be YYYY-MM-DD
    const startDate = convertDate(params.startDate);
    const endDate = convertDate(params.endDate);

    const earthquakes = await getEarthquakesByLocation(
      minLat,
      maxLat,
      minLng,
      maxLng,
      startDate,
      endDate
    );
    return res.json(earthquakes);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/earthquakes/:
 *  post:
 *    description: Store earthquake in db
 *    parameters:
 *    - name: earthquake
 *      description: Attributes of earthquake
 *      in: body
 *      type: object
 *      required: true
 *      schema:
 *        $ref: '#/definitions/Earthquake'
 *    responses:
 *      200:
 *        description: Report created succesfully
 */
router.post("/", async (req, res, next) => {
  try {
    await quakeRef.doc(req.body.id).set(req.body);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
