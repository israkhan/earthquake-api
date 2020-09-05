const admin = require("firebase-admin");

const serviceAccount = require("./ServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://earthquake-notification-59115.firebaseio.com",
});

const db = admin.firestore();

module.exports = { db };
