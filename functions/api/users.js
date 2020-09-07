const router = require("express").Router();
const { db } = require("../firebase");

let ref = db.collection("users");

/**
 * @swagger
 *
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      id:
 *        type: string
 *      firstName:
 *        type: string
 *      lastName:
 *        type: string
 *      email:
 *        type: string
 *      phoneNumber:
 *        type: string
 *    NewUser:
 *      type: object
 *      required:
 *        - id
 *      properties:
 *        id:
 *          type: string
 *
 */

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/users/:
 *  get:
 *    description: Get all users in db
 *    responses:
 *      200:
 *        description: Users returned succesfully
 *        schema:
 *          type: array,
 *          items:
 *            $ref: '#/definitions/User'
 */
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

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/users/{id}:
 *  get:
 *    description: Get a specific user from the database
 *    parameters:
 *    - name: id
 *      description: Id of user
 *      in: path
 *      type: string
 *      required: true
 *    responses:
 *      200:
 *        description: User returned succesfully
 *        schema:
 *          $ref: '#/definitions/User'
 *      404:
 *        description: User not found
 */
router.get("/:id", async (req, res, next) => {
  try {
    const snapshot = await ref.doc(req.params.id).get();
    const data = { id: req.params.id, ...snapshot.data() };

    return res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/users/:
 *  post:
 *    description: Creae a user
 *    parameters:
 *    - name: user
 *      description: User object to store in db
 *      in: body
 *      type: object
 *      required: true
 *      schema:
 *        $ref: '#/definitions/User'
 *    responses:
 *      200:
 *        description: User created successfully
 *        schema:
 *          $ref: '#/definitions/NewUser'
 */
router.post("/", async (req, res, next) => {
  try {
    const response = await db.collection("users").add(req.body);
    return res.json({ id: response.id });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /earthquake-notification-59115/us-central1/app/api/users/{id}:
 *  put:
 *    description: Update user attributes
 *    parameters:
 *    - name: id
 *      description: Id of user
 *      in: path
 *      type: string
 *      required: true
 *    - name: user
 *      description: User attributes to update
 *      in: body
 *      type: object
 *      required: true
 *      schema:
 *        $ref: '#/definitions/User'
 *    responses:
 *      200:
 *        description: User updated succesfully
 */
router.put("/:id", async (req, res, next) => {
  try {
    await db.collection("users").doc(req.params.id).update(req.body);
    return res.sendStatus(200);
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
