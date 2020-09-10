const router = require("express").Router();
const { db } = require("../firebase");
const { user } = require("firebase-functions/lib/providers/auth");

let subRef = db.collection("subscriptions");
let userRef = db.collection("users");

/**
 * @swagger
 *
 * definitions:
 *  Subscription:
 *    type: object
 *    required:
 *      - location
 *      - minLat
 *      - minLng
 *      - maxLat
 *      - maxLng
 *      - phoneNumber
 *    properties:
 *      id:
 *        type: string
 *      location:
 *        type: string
 *      minLat:
 *        type: float
 *      minLng:
 *        type: float
 *      maxLat:
 *        type: float
 *      maxLng:
 *        type: float
 *      phoneNumber:
 *        type: string
 *  NewSubscription:
 *    type: object
 *    required:
 *      - id
 *    properties:
 *      id:
 *        type: string
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
 * /earthquake-notification-59115/us-central1/app/api/subscriptions/{userId}:
 *  post:
 *    description: Creae a subscription for a specific user
 *    parameters:
 *    - name: userId
 *      description: Id of user subscribing
 *      in: path
 *      type: string
 *      required: true
 *    - name: subscription
 *      description: Subscription details
 *      in: body
 *      type: object
 *      required: true
 *      schema:
 *        $ref: '#/definitions/Subscription'
 *    responses:
 *      200:
 *        description: Subscription created successfully
 *        schema:
 *          $ref: '#/definitions/NewSubscription'
 */
router.post("/:userId", async (req, res, next) => {
  try {
    const response = await subRef.add(req.body);
    // add subsciption as a subcollection of the authenticated user
    await userRef
      .doc(req.params.userId)
      .collection("subscriptions")
      .doc(response.id)
      .set(req.body);

    return res.json({ id: response.id });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/subscriptions/{userId}:
 *  get:
 *    description: Get all subscriptions for a user
 *    parameters:
 *    - name: userId
 *      description: Id of current user
 *      in: path
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Subscriptions returned succesfully
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Subscription'
 *      400:
 *        description: User does not exist
 */
router.get("/:userId", async (req, res, next) => {
  try {
    const snapshot = await userRef
      .document(req.params.uid)
      .collection("subscriptions")
      .get();

    let subscriptions = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();
      subscriptions.push({ id, ...data });
    });

    return res.json(subscriptions);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/subscriptions/{userId}/{subscriptionId}:
 *  get:
 *    description: Delete subscription for a user
 *    parameters:
 *    - name: userId
 *      description: Id of current user
 *      in: path
 *      type: string
 *      required: true
 *    - name: subscriptionId
 *      description: Id of subscription being deleted
 *      in: path
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Subscriptions deleted succesfully
 *      400:
 *        description: Subscription does not exist
 */
router.delete("/:userId/:subscriptionId", async (req, res, next) => {
  try {
    await userRef
      .document(req.params.uid)
      .collection("subscriptions")
      .document(req.params.id)
      .delete();

    await subRef.document(req.params.id).delete();

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/subscriptions/{id}/earthquakes:
 *  get:
 *    description: Get all earthquakes for a subscription
 *    parameters:
 *    - name: id
 *      description: Id of subscription
 *      in: path
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: Earthquakes subcollection returned succesfully
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Earthquake'
 */
router.get("/:id/earthquakes", async (req, res, next) => {
  try {
    const snapshot = await subRef
      .doc(req.params.id)
      .collection("earthquakes")
      .get();

    let quakes = [];
    snapshot.forEach((doc) => {
      let data = doc.data();
      quakes.push({ ...data });
    });

    return res.json(quakes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
