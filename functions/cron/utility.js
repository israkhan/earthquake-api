const { db } = require("../firebase");
const { TWILIO_SECRET, TWILIO_SID } = require("../secrets");

/**
 * Polls USGS earthquake feed which returns earthquakes in the last hour
 * @returns {array} Array of earthquakes raw data
 */
const pollEarthquakeFeed = async () => {
  const result = await fetch(
    `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`,
    {
      method: "GET",
    }
  );

  const data = await result.json();

  return data.features;
};

/**
 * Reformats array of earthquake data and extracts important values
 * @returns {array} Array of earthquakes
 */
const parseEarthquakeFeed = (quakeArray) => {
  return quakeArray.map((obj) => {
    const props = obj.properties;
    return {
      id: obj.id,
      updated: props.updated,
      properties: {
        alert: props.alert,
        severity: props.cd,
        reports: props.felt,
        lng: obj.geometry.coordinates[0],
        lat: obj.geometry.coordinates[1],
        mag: props.mag,
        place: props.place,
        time: props.time,
        tsunami: props.tsunami,
        type: props.type,
        url: props.url,
      },
    };
  });
};

const updateOrCreateQuakeInDb = (quakeArray) => {
  return quakeArray
    .map(async (quake) => {
      const dbValue = await db
        .collection("earthquakes")
        .document(quake.id)
        .get();

      if (dbValue && dbValue.updated !== quake.updated) {
        await db.collection("earthquakes").document(quake.id).set(quake);

        return { quake };
      }

      if (!dbValue) {
        await db.collection("earthquakes").document(quake.id).set(quake);

        return { ...quake, status: "new" };
      }
    })
    .filter((quake) => quake.status);
};

const findSubscribersToNotify = async (quakeArray) => {
  const subscriptions = await db.collection("subscriptions").get();
  return quakeArray.map((quake) => {
    const { url, mag } = quake.properties;
    return {
      url,
      mag,
      subscriptions: subscriptions.filter((sub) => {
        return (
          sub.minLat < quake.lat &&
          sub.maxLat > quake.lat &&
          sub.minLng < quake.lng &&
          sub.maxLng > quake.lng
        );
      }),
    };
  });
};

const sendTextMessage = async (url, mag, location, subId, phoneNumber) => {
  try {
    const client = require("twilio")(TWILIO_SID, TWILIO_SECRET);
    await client.messages.create({
      to: `+1${phoneNumber}`,
      from: "+14247852017",
      body: `A ${mag} magnitude earthquake has been reported near ${location}. More info: ${url}`,
      statusCallback: `https://us-central1-earthquake-notification-59115.cloudfunctions.net/app/api/subscriptions/${subId}`,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  pollEarthquakeFeed,
  parseEarthquakeFeed,
  updateOrCreateQuakeInDb,
  findSubscribersToNotify,
  sendTextMessage,
};
