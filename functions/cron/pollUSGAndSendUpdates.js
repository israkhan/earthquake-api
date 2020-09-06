const CronJob = require("cron").CronJob;
const {
  pollEarthquakeFeed,
  parseEarthQuakeFeed,
  updateOrCreateQuakeInDb,
  findSubscribersToNotify,
  sendTextMessage,
} = require("./utility");

const pollUSGAndSendUpdates = new CronJob(
  "* 30 * * * *",
  async () => {
    const quakeData = await pollEarthquakeFeed();

    if (!quakeData) {
      this.stop();
    }

    const parsedQuakeData = parseEarthQuakeFeed(quakeData);

    const newQuakes = await updateOrCreateQuakeInDb(parsedQuakeData);

    if (!newQuakes) {
      this.stop();
    }

    const subscribersToNotfiy = await findSubscribersToNotify(newQuakes);

    if (!subscribersToNotfiy) {
      this.stop();
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
