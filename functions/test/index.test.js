const httpMocks = require("node-mocks-http");
const {
  FIREBASE_DB_URL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_PROJECT_ID,
} = require("../secrets.js");

const test = require("firebase-functions-test")(
  {
    databaseURL: FIREBASE_DB_URL,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    projectId: FIREBASE_PROJECT_ID,
  },
  "test-permissions.json"
);

const sinon = require("sinon");
const admin = require("firebase-admin");
const expect = require("chai").expect;
const myFunctions = require("../index");

// admin.initializeApp(functions.config().firebase);

describe("Error Handling", async () => {
  var req = httpMocks.createRequest({
    method: "POST",
    url: `/bookseats`,
    params: {
      uid: 123,
    },
    body: {
      seatIdArray: [1, 2, 23, 3, 9],
      turnId: "",
      startStation: "",
      endStation: "",
    },
  });
  // A fake response object, with a stubbed redirect function which asserts that it is called
  // with parameters 303, 'new_ref'.
  const res = httpMocks.createResponse({
    eventEmitter: require("events").EventEmitter,
  });

  // Invoke addMessage with our fake request and response objects. This will cause the
  // assertions in the response object to be evaluated.
  myFunctions.app(req, res);
});
