const CronJob = require("cron").CronJob;
const {
  pollEarthquakeFeed,
  parseEarthquakeFeed,
  updateOrCreateQuakeInDb,
  findSubscribersToNotify,
  sendTextMessage,
} = require("./utility");
// const functions = require("firebase-functions");

// Implementation of a cron job using Google Cloud Scheduler and Google PubSub APi
// Function is deployed and PubSub topic is created
// Function to prevent accumulating on Google Cloud

// exports.pollUSGAndSendUpdates = functions.pubsub
//   .topic("earthquake-polling")
//   .onPublish(async () => {
//     const quakeData = await pollEarthquakeFeed();

//     if (!quakeData) {
//       return console.log("No earthquakes received in feed.");
//     }

//     const parsedQuakeData = parseEarthquakeFeed(quakeData);

//     const newQuakes = await updateOrCreateQuakeInDb(parsedQuakeData);

//     if (!newQuakes) {
//       return console.log("No new earthquakes.");
//     }

//     const subscribersToNotfiy = await findSubscribersToNotify(newQuakes);

//     if (!subscribersToNotfiy) {
//       return console.log("No subscribers to notify");
//     }

//     subscribersToNotfiy.forEach((obj) => {
//       obj.subscriptions.forEach((subscription) => {
//         sendTextMessage(
//           obj.url,
//           obj.mag,
//           subscription.location,
//           subscription.id,
//           subscription.phoneNumber
//         );
//       });
//     });
//   });

// The below function is the an implementation of cron using the node cron package

const pollUSGAndSendUpdates = new CronJob(
  "* 30 * * * *",
  async () => {
    const quakeData = await pollEarthquakeFeed();

    if (!quakeData) {
      return console.log("No earthquakes received in feed.");
    }

    const parsedQuakeData = parseEarthquakeFeed(quakeData);

    const newQuakes = await updateOrCreateQuakeInDb(parsedQuakeData);

    if (!newQuakes) {
      return console.log("No new earthquakes.");
    }

    const subscribersToNotfiy = await findSubscribersToNotify(newQuakes);

    if (!subscribersToNotfiy) {
      return console.log("No subscribers to notify");
    }

    subscribersToNotfiy.forEach((obj) => {
      obj.subscriptions.forEach((subscription) => {
        sendTextMessage(
          obj.url,
          obj.mag,
          subscription.location,
          subscription.id,
          subscription.phoneNumber
        );
      });
    });
  },
  null,
  false
);

module.exports = pollUSGAndSendUpdates;
