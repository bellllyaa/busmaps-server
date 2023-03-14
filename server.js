import { Telegraf } from "telegraf";
const TELEGRAM_BOT_TOKEN = "5678768571:AAFBWvY88xyhNj623c_R_3FPr5jQis_n6q8";
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const CHAT_ID = "758319926";

const LOCAL_URL = "https://8080-cs-794102293669-default.cs-europe-west4-bhnf.cloudshell.dev";
const GOOGLE_PROXY_URL = "https://bypass-cors-server.ew.r.appspot.com";
const AZURE_PROXY_URL = "https://busmaps-server.azurewebsites.net";
const PROXY_URL = AZURE_PROXY_URL;

import express from "express";
const app = express();
import fetch from "node-fetch";
import cors from "cors";

const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header('Access-Control-Allow-Origin', 'https://3000-cs-794102293669-default.cs-europe-west4-bhnf.cloudshell.dev');
  res.append("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.append("Access-Control-Allow-Headers", "*");
  // res.append('Access-Control-Allow-Origin', '*');
  // res.append('Access-Control-Allow-Origin', 'https://3000-cs-794102293669-default.cs-europe-west4-bhnf.cloudshell.dev');
  // res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

import {
  importGtfs,
  openDb,
  closeDb,
  getStops,
  getTrips,
  getRoutes,
  getCalendarDates,
  getStoptimes,
} from "gtfs";
// import { readFile } from "fs/promises";

// const config = JSON.parse(
//   await readFile(new URL('./config.json', import.meta.url))
// );

const configSKMTrojmiasto = {
  agencies: [
    {
      agency_id: "SKMTr",
      url: "https://przyjazdy.pl/latest/skmt.zip",
      // url: "https://www.skm.pkp.pl/gtfs-mi-kpd.zip",
    },
  ],
  verbose: false,
};

const configPolRegio = {
  agencies: [
    {
      agency_id: "4",
      url: "https://mkuran.pl/gtfs/polregio.zip",
    },
  ],
  verbose: false,
};

const configPKPIntercity = {
  agencies: [
    {
      agency_id: "0",
      url: "https://mkuran.pl/gtfs/pkpic.zip",
    },
  ],
  verbose: false,
};

// import * as gtfs from "gtfs";
// console.log(Object.getOwnPropertyNames(gtfs))

import FormData from "form-data"
import fs from "fs";
import moment from "moment-timezone";
let cwd;
if (process.env.DEV && process.env.DEV === "Yes") {
  cwd = process.cwd();
} else {
  // console.log("Setting cwd to '/tmp'")
  cwd = "/tmp";
}

async function sendTelegramMessage(text, photo) {

  bot.telegram.sendMessage(CHAT_ID, text, {});

  // const formText = new FormData();
  // formText.append("text", text);

  // fetch(
  //   `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}`,
  //   {
  //     method: "POST",
  //     body: formText,
  //   }
  // )
  
  // if (photo) {
  //   setTimeout(() => {
  //     bot.telegram.sendPhoto(CHAT_ID, photo, {})
  //   }, 700);
  // }
}

// function to create file from base64 encoded string
function base64DecodeAndSave(base64str, savePath) {
  const base64strCut = base64str.split("base64,")[1];
  // console.log(base64strCut);

  // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
  var bitmap = new Buffer.from(base64strCut, "base64");
  // console.log(bitmap);

  // write buffer to file
  fs.writeFileSync(savePath + "image.png", bitmap);

  console.log("Image encoded successfully");
}

function saveObjToFile(obj, filePath = "output.json") {
  fs.writeFile(filePath, JSON.stringify(obj, null, 2), "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
}

function isNumeric(num) {
  return !isNaN(num);
}

// Learning sqlite3

/*import sqlite3 from "sqlite3"
sqlite3.verbose()
// console.log(Object.getOwnPropertyNames(sqlite3))

const db = new sqlite3.Database('./db/test.db', (err) => { // ':memory:'
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
})*/



let lastDataLoad = 0;
let history = {
  stops: []
}

let stops = [];
const ztmGdansk = {
  departures: {}
}
const zkmGdynia = {
  departures: {}
}
const skmTrojmiasto = {
  departures: {}
}
const polRegio = {
  departures: {}
}
const pkpIntercity = {
  departures: {}
}

// const stops = JSON.parse(fs.readFileSync("jsons/Output/stops.json", "utf-8"));
// ztmGdansk.departures = JSON.parse(
//   fs.readFileSync("jsons/Output/ztmGdanskDepartures.json", "utf-8")
// );
// zkmGdynia.departures = JSON.parse(
//   fs.readFileSync("jsons/Output/zkmGdyniaDepartures.json", "utf-8")
// );
// skmTrojmiasto.departures = JSON.parse(
//   fs.readFileSync("jsons/Output/skmTrojmiastoDepartures.json", "utf-8")
// );
// polRegio.departures = JSON.parse(
//   fs.readFileSync("jsons/Output/polRegioDepartures.json", "utf-8")
// );

async function loadData() {
  if (moment().tz("Europe/Warsaw") - lastDataLoad > 86400000) {
    // Loading data
    console.log("•");
    console.log("Loading data...");
    console.log("•");
    sendTelegramMessage("Loading data...")
    lastDataLoad = moment().tz("Europe/Warsaw");

    // Current date | .format('YYYY-MM-DD HH:mm:ss Z')
    const dateNow = moment().tz("Europe/Warsaw");
    const dateNextDay = moment().tz("Europe/Warsaw").add(1, "days");
    const dates = [dateNow, dateNextDay];

    // Objects
    const ztmGdanskLoad = {
      raw: {
        stopTimes: {},
      },
      stops: [],
    };
    const zkmGdyniaLoad = {
      raw: {},
      stops: [],
      serviceIds: {},
    };
    const skmTrojmiastoLoad = {
      raw: {
        stops: [],
        calendarDates: [],
        stopTimes: [],
        trips: [],
        routes: []
      },
      serviceIds: {},
    };
    const polRegioLoad = {
      raw: {
        stops: [],
        calendarDates: [],
        stopTimes: [],
        trips: [],
        routes: []
      },
      serviceIds: {}
    };
    // const pkpIntercityLoad = {
    //   raw: {},
    //   serviceIds: {}
    // };

    // Resetting values
    stops = [];
    ztmGdansk.departures = {}
    zkmGdynia.departures = {}
    skmTrojmiasto.departures = {}
    polRegio.departures = {}
    // pkpIntercity = {
    //   departures: {}
    // }

    for (const date of dates) {
      ztmGdansk.departures[date.format("YYYY-MM-DD")] = {};
      ztmGdanskLoad.raw.stopTimes[date.format("YYYY-MM-DD")] = [];

      zkmGdynia.departures[date.format("YYYY-MM-DD")] = {};
      zkmGdyniaLoad.serviceIds[date.format("YYYY-MM-DD")] = [];

      skmTrojmiasto.departures[date.format("YYYY-MM-DD")] = {};
      skmTrojmiastoLoad.serviceIds[date.format("YYYY-MM-DD")] = [];

      polRegio.departures[date.format("YYYY-MM-DD")] = {};
      polRegioLoad.serviceIds[date.format("YYYY-MM-DD")] = [];

      // pkpIntercity.departures[date.format("YYYY-MM-DD")] = {};
      // pkpIntercityLoad.serviceIds[date.format("YYYY-MM-DD")] = [];
    }

    // Trojmiasto

    // Stops
    ztmGdanskLoad.raw.stops = await (
      await fetch(
        "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json"
      )
    ).json();
    zkmGdyniaLoad.raw.stops = await (
      await fetch("http://api.zdiz.gdynia.pl/pt/stops")
    ).json();

    // Routes
    ztmGdanskLoad.raw.routes = await (
      await fetch(
        "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/22313c56-5acf-41c7-a5fd-dc5dc72b3851/download/routes.json"
      )
    ).json();
    zkmGdyniaLoad.raw.routes = await (
      await fetch("http://api.zdiz.gdynia.pl/pt/routes")
    ).json();

    // Trips
    ztmGdanskLoad.raw.trips = await (
      await fetch(
        "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/b15bb11c-7e06-4685-964e-3db7775f912f/download/trips.json"
      )
    ).json();
    zkmGdyniaLoad.raw.trips = await (
      await fetch("http://api.zdiz.gdynia.pl/pt/trips")
    ).json();

    // Other
    ztmGdanskLoad.raw.stopsInTrip = await (
      await fetch(
        "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/3115d29d-b763-4af5-93f6-763b835967d6/download/stopsintrip.json"
      )
    ).json();
    ztmGdanskLoad.raw.stopTimesLinks = await (
      await fetch(
        "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/a023ceb0-8085-45f6-8261-02e6fcba7971/download/stoptimes.json"
      )
    ).json();
    zkmGdyniaLoad.raw.stopTimes = await (
      await fetch("http://api.zdiz.gdynia.pl/pt/stop_times")
    ).json();
    zkmGdyniaLoad.raw.calendarDates = await (
      await fetch("http://api.zdiz.gdynia.pl/pt/calendar_dates")
    ).json();

    // Stop times of ZTM Gdansk
    for (const [key, value] of Object.entries(ztmGdanskLoad.raw.stopTimesLinks)) {
      // console.log(key);

      for (const date of dates) {
        const link = value.find(
          (link) => link.search(date.format("YYYY-MM-DD")) !== -1
        );
        // console.log(link);

        if (link) {
          ztmGdanskLoad.raw.stopTimes[date.format("YYYY-MM-DD")].push(
            ...(await (await fetch(link)).json()).stopTimes
          );
        }
      }
    }

    // Saving data to jsons
    /*saveObjToFile(ztmGdanskLoad.raw.stops, "jsons/ZTMGdansk/stopsFull.json");
    saveObjToFile(ztmGdanskLoad.raw.routes, "jsons/ZTMGdansk/routes.json");
    saveObjToFile(ztmGdanskLoad.raw.trips, "jsons/ZTMGdansk/trips.json");
    saveObjToFile(
      ztmGdanskLoad.raw.stopsInTrip,
      "jsons/ZTMGdansk/stopsInTrip.json"
    );
    saveObjToFile(
      ztmGdanskLoad.raw.stopTimesLinks,
      "jsons/ZTMGdansk/stopTimesLinks.json"
    );
    saveObjToFile(zkmGdyniaLoad.raw.stops, "jsons/ZKMGdynia/stops.json");
    saveObjToFile(zkmGdyniaLoad.raw.routes, "jsons/ZKMGdynia/routes.json");
    saveObjToFile(zkmGdyniaLoad.raw.trips, "jsons/ZKMGdynia/trips.json");
    saveObjToFile(zkmGdyniaLoad.raw.stopTimes, "jsons/ZKMGdynia/stopTimes.json");
    saveObjToFile(
      zkmGdyniaLoad.raw.calendarDates,
      "jsons/ZKMGdynia/calendarDates.json"
    );*/

    // Trains

    // SKM Trójmiasto
    try {
      await importGtfs(configSKMTrojmiasto);
      const dbSKMTrojmiasto = openDb(configSKMTrojmiasto);
      skmTrojmiastoLoad.raw.stops = getStops({}, [], [], { db: dbSKMTrojmiasto });
      skmTrojmiastoLoad.raw.routes = getRoutes({}, [], [], { db: dbSKMTrojmiasto });
      skmTrojmiastoLoad.raw.trips = getTrips({}, [], [], { db: dbSKMTrojmiasto });
      skmTrojmiastoLoad.raw.calendarDates = getCalendarDates({}, [], [], { db: dbSKMTrojmiasto });
      skmTrojmiastoLoad.raw.stopTimes = getStoptimes({}, [], [], { db: dbSKMTrojmiasto });
      closeDb(dbSKMTrojmiasto)
    } catch (err) {
      console.log(err.message)
      sendTelegramMessage(err.message)
    }

    // PolRegio
    try {
      await importGtfs(configPolRegio);
      const dbPolRegio = openDb(configPolRegio);
      polRegioLoad.raw.stops = getStops({}, [], [], { db: dbPolRegio });
      polRegioLoad.raw.routes = getRoutes({}, [], [], { db: dbPolRegio });
      polRegioLoad.raw.trips = getTrips({}, [], [], { db: dbPolRegio });
      polRegioLoad.raw.calendarDates = getCalendarDates({}, [], [], { db: dbPolRegio });
      polRegioLoad.raw.stopTimes = getStoptimes({}, [], [], { db: dbPolRegio });
      closeDb(dbPolRegio)
    } catch (err) {
      console.log(err.message)
      sendTelegramMessage(err.message)
    }

    // PKP Intercity
    /*await importGtfs(configPKPIntercity);
    const dbPKPIntercity = openDb(configPKPIntercity);
    pkpIntercityLoad.raw.stops = getStops({}, [], [], { db: dbPKPIntercity });
    pkpIntercityLoad.raw.routes = getRoutes({}, [], [], { db: dbPKPIntercity });
    pkpIntercityLoad.raw.trips = getTrips({}, [], [], { db: dbPKPIntercity });
    pkpIntercityLoad.raw.calendarDates = getCalendarDates({}, [], [], { db: dbPKPIntercity });
    pkpIntercityLoad.raw.stopTimes = getStoptimes({}, [], [], { db: dbPKPIntercity });
    closeDb(dbPKPIntercity)*/

    // pkpIntercityLoad.raw.stops = JSON.parse(
    //   fs.readFileSync("jsons/PKPIntercity/stops.json", "utf-8")
    // );
    // pkpIntercityLoad.raw.routes = JSON.parse(
    //   fs.readFileSync("jsons/PKPIntercity/routes.json", "utf-8")
    // );
    // pkpIntercityLoad.raw.trips = JSON.parse(
    //   fs.readFileSync("jsons/PKPIntercity/trips.json", "utf-8")
    // );
    // pkpIntercityLoad.raw.calendarDates = JSON.parse(
    //   fs.readFileSync("jsons/PKPIntercity/calendarDates.json", "utf-8")
    // );
    // pkpIntercityLoad.raw.stopTimes = JSON.parse(
    //   fs.readFileSync("jsons/PKPIntercity/stopTimes.json", "utf-8")
    // );

    // Saving data to jsons
    /*saveObjToFile(skmTrojmiastoLoad.raw.stops, "jsons/SKMTrojmiasto/stops.json");
    saveObjToFile(skmTrojmiastoLoad.raw.routes, "jsons/SKMTrojmiasto/routes.json");
    saveObjToFile(skmTrojmiastoLoad.raw.trips, "jsons/SKMTrojmiasto/trips.json");
    saveObjToFile(skmTrojmiastoLoad.raw.calendarDates, "jsons/SKMTrojmiasto/calendarDates.json");
    saveObjToFile(skmTrojmiastoLoad.raw.stopTimes, "jsons/SKMTrojmiasto/stopTimes.json");
    saveObjToFile(polRegioLoad.raw.stops, "jsons/PolRegio/stops.json");
    saveObjToFile(polRegioLoad.raw.routes, "jsons/PolRegio/routes.json");
    saveObjToFile(polRegioLoad.raw.trips, "jsons/PolRegio/trips.json");
    saveObjToFile(polRegioLoad.raw.calendarDates, "jsons/PolRegio/calendarDates.json");
    saveObjToFile(polRegioLoad.raw.stopTimes, "jsons/PolRegio/stopTimes.json");
    saveObjToFile(pkpIntercityLoad.raw.stops, "jsons/PKPIntercity/stops.json");
    saveObjToFile(pkpIntercityLoad.raw.routes, "jsons/PKPIntercity/routes.json");
    saveObjToFile(pkpIntercityLoad.raw.trips, "jsons/PKPIntercity/trips.json");
    saveObjToFile(pkpIntercityLoad.raw.calendarDates, "jsons/PKPIntercity/calendarDates.json");
    saveObjToFile(pkpIntercityLoad.raw.stopTimes, "jsons/PKPIntercity/stopTimes.json");*/

    console.log("•");
    console.log("Data loaded successfully!", dateNow.format("YYYY-MM-DD HH:mm:ss"));
    console.log("•");
    // sendTelegramMessage("Data loaded successfully!")

    // Working with loaded data

    // ZTM Gdańsk
    function ztmGdanskGetStopType(stop) {
      const stopId = stop.stopId;

      // name: Władysława IV 01, id: 2169
      // name: Dąbrowa Centrum 04, id: 8227

      const routeTypes = [];
      for (const stop of ztmGdanskLoad.raw.stopsInTrip[dateNow.format("YYYY-MM-DD")]
        .stopsInTrip) {
        if (stop.stopId === stopId) {
          stop.routeType = "bus";
          for (const route of ztmGdanskLoad.raw.routes[dateNow.format("YYYY-MM-DD")]
            .routes) {
            if (route.routeId === stop.routeId) {
              stop.routeType = route.routeType;
              break;
            }
          }
          routeTypes.push(stop.routeType);
        }
      }

      if (
        routeTypes.find((routeType) => routeType === "TRAM") !== undefined &&
        routeTypes.find((routeType) => routeType === "BUS") !== undefined
      ) {
        return "bus, tram";
      } else if (
        routeTypes.find((routeType) => routeType === "TRAM") !== undefined
      ) {
        return "tram";
      } else {
        return "bus";
      }
    }

    for (const [key, value] of Object.entries(ztmGdanskLoad.raw.stops)) {
      // console.log(key)
      for (const stop of ztmGdanskLoad.raw.stops[key].stops) {
        if (stop.stopName === null) {
          // console.log(stop)
        } else {
          if (
            ztmGdanskLoad.stops.find(
              (stop1) => stop1.providers[0].stopId == stop.stopId
            ) === undefined
          ) {
            ztmGdanskLoad.stops.push({
              stopName: `${stop.stopName} ${stop.stopCode}`
                .replaceAll('.', ". ")
                .replace(/\s+/g, " ")
                .trim(),
              location: { lat: stop.stopLat, lng: stop.stopLon },
              zoneName: stop.zoneName === null ? "Gdańsk" : stop.zoneName,
              stopType: ztmGdanskGetStopType(stop),
              providers: [
                {
                  stopProvider: "ZTM Gdańsk",
                  stopId: Number(stop.stopId),
                },
              ],
            });
          }
        }
      }
    }

    // ZKM Gdynia
    for (const stop of zkmGdyniaLoad.raw.stops) {
      zkmGdyniaLoad.stops.push({
        stopName: stop.stopName
          .replaceAll('.', ". ")
          .replace(/\s+/g, " ")
          .trim(),
        location: { lat: Number(stop.stopLat), lng: Number(stop.stopLon) },
        zoneName: stop.zoneId,
        stopType: "bus",
        providers: [
          {
            stopProvider: "ZKM Gdynia",
            stopId: Number(stop.stopId),
          },
        ],
      });
    }

    /*
      .trim()
        .replaceAll('"', "")
        .replaceAll("'", "")
        .replaceAll("  ", " ")
        .replaceAll(" -", "")
        .replaceAll(".", "")
        .replaceAll(" (N/Ż)", "")
        .toLowerCase()
    */

    // Trains

    let trainStops = [];

    // SKM Trojmiasto
    for (const stop of skmTrojmiastoLoad.raw.stops) {
      trainStops.push({
        stopName: stop.stop_name
          .replaceAll('.', ". ")
          .replace(/\s+/g, " ")
          .trim(),
        location: {lat: Number(stop.stop_lat), lng: Number(stop.stop_lon)},
        // zoneName: stop.stop_name.split(" ")[0].trim(),
        zoneName: null,
        stopType: "train",
        providers: [
          {
            stopProvider: "SKM Trójmiasto",
            stopId: Number(stop.stop_id)
          }
        ]
      })
    }

    // PolRegio
    for (const stop of polRegioLoad.raw.stops) {
      const comparedStop = trainStops.find(trainStop => trainStop.stopName === stop.stop_name)
      if (comparedStop !== undefined) {
        trainStops[trainStops.indexOf(comparedStop)].providers.push({
          stopProvider: "PolRegio",
          stopId: Number(stop.stop_id)
        });
      } else {
        trainStops.push({
          stopName: stop.stop_name
            .replaceAll('.', ". ")
            .replace(/\s+/g, " ")
            .trim(),
          location: {lat: Number(stop.stop_lat), lng: Number(stop.stop_lon)},
          // zoneName: stop.stop_name.split(" ")[0].trim(),
          zoneName: null,
          stopType: "train",
          providers: [
            {
              stopProvider: "PolRegio",
              stopId: Number(stop.stop_id)
            }
          ]
        })
      }
    }

    // PKP Intercity
    /*for (const stop of pkpIntercityLoad.raw.stops) {
      const comparedStop = trainStops.find(trainStop => trainStop.stopName === stop.stop_name)
      if (comparedStop !== undefined) {
        trainStops[trainStops.indexOf(comparedStop)].providers.push({
          stopProvider: "PKP Intercity",
          stopId: Number(stop.stop_id)
        });
      } else {
        trainStops.push({
          stopName: stop.stop_name
            .replaceAll('.', ". ")
            .replace(/\s+/g, " ")
            .trim(),
          location: {lat: Number(stop.stop_lat), lng: Number(stop.stop_lon)},
          // zoneName: stop.stop_name.split(" ")[0].trim(),
          zoneName: null,
          stopType: "train",
          providers: [
            {
              stopProvider: "PKP Intercity",
              stopId: Number(stop.stop_id)
            }
          ]
        })
      }
    }*/

    // All stops
    stops = [...ztmGdanskLoad.stops];
    for (const zkmStop of zkmGdyniaLoad.stops) {
      const comparedStop = stops.find(
        (stop) =>
          stop.stopName === zkmStop.stopName &&
          stop.zoneName === zkmStop.zoneName
      );
      if (comparedStop !== undefined) {
        stops[stops.indexOf(comparedStop)].providers.push(zkmStop.providers[0]);
      } else {
        stops.push(zkmStop);
      }
    }
    stops.push(...trainStops)
    console.log("Stops have been loaded")
    // sendTelegramMessage("Stops have been loaded")
    // saveObjToFile(stops, "jsons/Output/stops.json");

    // for (const stop of stops) {
    //   if (stop.stopType === "bus, tram") {
    //     // console.log(stop)
    //   }
    // }

    // Scheduled departures

    // ZTM Gdańsk

    for (const stop of ztmGdanskLoad.stops) {
      for (const date of dates) {
        ztmGdansk.departures[date.format("YYYY-MM-DD")][
          stop.providers[0].stopId
        ] = [];
      }
    }

    const brokenBruh = {};
    for (const date of dates) {
      brokenBruh[date.format("YYYY-MM-DD")] = [];
    }

    for (const date of dates) {
      for (const element of ztmGdanskLoad.raw.stopTimes[date.format("YYYY-MM-DD")]) {
        if (
          ztmGdanskLoad.stops.find(
            (stop) => stop.providers[0].stopId === element.stopId
          ) === undefined
        ) {
          brokenBruh[date.format("YYYY-MM-DD")].push(element);
          continue;
        }

        element.routeObj = ztmGdanskLoad.raw.routes[date.format("YYYY-MM-DD")].routes.find((r) => r.routeId == element.routeId);

        if (element.routeObj.routeType === "UNKNOWN") {
          element.routeType = null;
        } else if (element.routeObj.routeType === "TRAM") {
          element.routeType = "tram";
        } else {
          element.routeType = "bus";
        }

        // element.routeId = zkmGdyniaTripsRaw.find(t => t.tripId === element.tripId)?.routeId;

        ztmGdansk.departures[date.format("YYYY-MM-DD")][element.stopId].push({
          routeName: element.routeObj.routeShortName,
          routeType: element.routeType,
          provider: "ZTM Gdańsk",
          routeId: element.routeId,
          tripId: element.tripId,
          status: "SCHEDULED",
          theoreticalTime: `${date.format("YYYY-MM-DD")}T${
            element.departureTime.split("T")[1]
          }${date.format("Z")}`,
          estimatedTime: null,
          headsign: element.routeObj.routeLongName.split(" - ")[0],
          stopSequence: element.stopSequence,
        });
      }
      for (const [key, value] of Object.entries(
        ztmGdansk.departures[date.format("YYYY-MM-DD")]
      )) {
        ztmGdansk.departures[date.format("YYYY-MM-DD")][key].sort(
          (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
        );
      }
    }

    console.log("ZTM Gdańsk departures have been loaded")
    // sendTelegramMessage("ZTM Gdańsk departures have been loaded")
    // saveObjToFile(ztmGdansk.departures, "jsons/Output/ztmGdanskDepartures.json");
    // saveObjToFile(brokenBruh, "jsons/Output/ztmGdanskDeparturesBroken.json");

    // ZKM Gdynia

    // ServiceIds
    for (const element of zkmGdyniaLoad.raw.calendarDates) {
      for (const date of dates) {
        if (element.date === date.format("YYYYMMDD")) {
          zkmGdyniaLoad.serviceIds[date.format("YYYY-MM-DD")].push(
            element.serviceId
          );
          break;
        }
      }
    }

    // Scheduled departures
    for (const element of zkmGdyniaLoad.raw.stopTimes) {
      for (const date of dates) {
        if (
          zkmGdyniaLoad.serviceIds[date.format("YYYY-MM-DD")].find(
            (serviceId) => serviceId === element.tripId
          ) !== undefined
        ) {
          zkmGdynia.departures[date.format("YYYY-MM-DD")][element.stopId] = [];
        }
      }
    }

    for (const element of zkmGdyniaLoad.raw.stopTimes) {
      if (element.departureTime.slice(0, 2) == "24") {
        element.departureTime = "00" + element.departureTime.slice(2);
      } else if (element.departureTime.slice(0, 2) == "25") {
        element.departureTime = "01" + element.departureTime.slice(2);
      } else if (element.departureTime.slice(0, 2) == "26") {
        element.departureTime = "02" + element.departureTime.slice(2);
      } else if (element.departureTime.slice(0, 2) == "27") {
        element.departureTime = "03" + element.departureTime.slice(2);
      }

      element.routeId = zkmGdyniaLoad.raw.trips.find(
        (t) => t.tripId === element.tripId
      )?.routeId;
      element.routeShortName = zkmGdyniaLoad.raw.routes.find(
        (r) => r.routeId === element.routeId
      )?.routeShortName;

      for (const date of dates) {
        if (
          zkmGdyniaLoad.serviceIds[date.format("YYYY-MM-DD")].find(
            (serviceId) => serviceId === element.tripId
          ) !== undefined
        ) {
          zkmGdynia.departures[date.format("YYYY-MM-DD")][element.stopId].push({
            routeName: element.routeShortName,
            routeType: "bus",
            provider: "ZKM Gdynia",
            routeId: element.routeId,
            tripId: element.tripId,
            status: "SCHEDULED",
            theoreticalTime: `${date.format("YYYY-MM-DD")}T${
              element.departureTime
            }${date.format("Z")}`,
            estimatedTime: null,
            headsign: element.stopHeadsign,
            stopSequence: element.stopSequence,
          });
        }
      }
    }
    for (const date of dates) {
      for (const [key, value] of Object.entries(
        zkmGdynia.departures[date.format("YYYY-MM-DD")]
      )) {
        zkmGdynia.departures[date.format("YYYY-MM-DD")][key].sort(
          (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
        );
      }
    }

    console.log("ZKM Gdynia departures have been loaded")
    // sendTelegramMessage("ZKM Gdynia departures have been loaded")
    // saveObjToFile(zkmGdynia.departures, "jsons/Output/zkmGdyniaDepartures.json");

    // Trains
    
    // SKM Trójmiasto
    
    // ServiceIds
    for (const element of skmTrojmiastoLoad.raw.calendarDates) {
      for (const date of dates) {
        if (element.date.toString() === date.format("YYYYMMDD")) {
          skmTrojmiastoLoad.serviceIds[date.format("YYYY-MM-DD")].push(Number(element.service_id));
          break;
        }
      }
    }

    // Scheduled departures
    for (const element of skmTrojmiastoLoad.raw.stopTimes) {
      for (const date of dates) {
        if (
          skmTrojmiastoLoad.serviceIds[date.format("YYYY-MM-DD")].find(serviceId => serviceId === Number(element.trip_id)) !== undefined
        ) {
          skmTrojmiasto.departures[date.format("YYYY-MM-DD")][element.stop_id] = [];
        }
      }
    }

    for (const element of skmTrojmiastoLoad.raw.stopTimes) {
      if (element.departure_time.slice(0, 2) == "24") {
        element.departure_time = "00" + element.departure_time.slice(2);
      } else if (element.departure_time.slice(0, 2) == "25") {
        element.departure_time = "01" + element.departure_time.slice(2);
      } else if (element.departure_time.slice(0, 2) == "26") {
        element.departure_time = "02" + element.departure_time.slice(2);
      } else if (element.departure_time.slice(0, 2) == "27") {
        element.departure_time = "03" + element.departure_time.slice(2);
      }

      element.routeId = skmTrojmiastoLoad.raw.trips.find(t => t.trip_id === element.trip_id)?.route_id;
      element.routeShortName = skmTrojmiastoLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_short_name;
      element.headsign = skmTrojmiastoLoad.raw.trips.find(t => t.trip_id === element.trip_id)?.trip_headsign;
      element.backgroundColor = skmTrojmiastoLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_color;
      element.color = skmTrojmiastoLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_text_color;

      for (const date of dates) {
        if (
          skmTrojmiastoLoad.serviceIds[date.format("YYYY-MM-DD")].find(
            serviceId => serviceId === Number(element.trip_id)
          ) !== undefined
        ) {
          skmTrojmiasto.departures[date.format("YYYY-MM-DD")][element.stop_id].push({
            routeName: element.routeShortName,
            routeType: "train",
            provider: "SKM Trójmiasto",
            routeId: Number(element.routeId),
            tripId: Number(element.trip_id),
            color: {
              backgroundColor: "#" + element.backgroundColor,
              color: "#" + element.color
            },
            status: "SCHEDULED",
            theoreticalTime: `${date.format("YYYY-MM-DD")}T${
              element.departure_time
            }${date.format("Z")}`,
            estimatedTime: null,
            headsign: element.headsign,
            stopSequence: element.stop_sequence,
          });
        }
      }
    }
    for (const date of dates) {
      for (const [key, value] of Object.entries(skmTrojmiasto.departures[date.format("YYYY-MM-DD")])) {
        skmTrojmiasto.departures[date.format("YYYY-MM-DD")][key].sort(
          (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
        );
      }
    }

    // saveObjToFile(skmTrojmiasto.departures, "jsons/Output/skmTrojmiastoDepartures.json");
    console.log("SKM Trojmiasto departures have been loaded")
    // sendTelegramMessage("SKM Trojmiasto departures have been loaded")

    // PolRegio
    
    // ServiceIds
    for (const element of polRegioLoad.raw.calendarDates) {
      for (const date of dates) {
        if (element.date.toString() === date.format("YYYYMMDD")) {
          polRegioLoad.serviceIds[date.format("YYYY-MM-DD")].push(Number(element.service_id));
          break;
        }
      }
    }

    // Scheduled departures
    for (const element of polRegioLoad.raw.stopTimes) {
      for (const date of dates) {
        if (
          polRegioLoad.serviceIds[date.format("YYYY-MM-DD")].find(serviceId => serviceId === Number(element.trip_id)) !== undefined
        ) {
          polRegio.departures[date.format("YYYY-MM-DD")][element.stop_id] = [];
        }
      }
    }

    for (const element of polRegioLoad.raw.stopTimes) {
      if (element.departure_time.slice(0, 2) == "24") {
        element.departure_time = "00" + element.departure_time.slice(2);
      } else if (element.departure_time.slice(0, 2) == "25") {
        element.departure_time = "01" + element.departure_time.slice(2);
      } else if (element.departure_time.slice(0, 2) == "26") {
        element.departure_time = "02" + element.departure_time.slice(2);
      } else if (element.departure_time.slice(0, 2) == "27") {
        element.departure_time = "03" + element.departure_time.slice(2);
      }

      element.routeId = polRegioLoad.raw.trips.find(t => t.trip_id === element.trip_id)?.route_id;
      element.routeShortName = polRegioLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_short_name;
      element.headsign = polRegioLoad.raw.trips.find(t => t.trip_id === element.trip_id)?.trip_headsign;
      element.backgroundColor = polRegioLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_color;
      element.color = polRegioLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_text_color;

      for (const date of dates) {
        if (
          polRegioLoad.serviceIds[date.format("YYYY-MM-DD")].find(
            serviceId => serviceId === Number(element.trip_id)
          ) !== undefined
        ) {
          polRegio.departures[date.format("YYYY-MM-DD")][element.stop_id].push({
            routeName: element.routeShortName,
            routeType: "train",
            provider: "PolRegio",
            routeId: Number(element.routeId),
            tripId: Number(element.trip_id),
            color: {
              backgroundColor: "#" + element.backgroundColor,
              color: "#" + element.color
            },
            status: "SCHEDULED",
            theoreticalTime: `${date.format("YYYY-MM-DD")}T${
              element.departure_time
            }${date.format("Z")}`,
            estimatedTime: null,
            headsign: element.headsign,
            stopSequence: element.stop_sequence,
          });
        }
      }
    }
    for (const date of dates) {
      for (const [key, value] of Object.entries(polRegio.departures[date.format("YYYY-MM-DD")])) {
        polRegio.departures[date.format("YYYY-MM-DD")][key].sort(
          (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
        );
      }
    }

    // saveObjToFile(polRegio.departures, "jsons/Output/polRegioDepartures.json");
    console.log("PolRegio departures have been loaded")
    // sendTelegramMessage("PolRegio departures have been loaded")

    // PKP Intercity
      
    // ServiceIds
    /*for (const element of pkpIntercityLoad.raw.calendarDates) {
      for (const date of dates) {
        if (element.date.toString() === date.format("YYYYMMDD")) {
          pkpIntercityLoad.serviceIds[date.format("YYYY-MM-DD")].push(element.service_id);
          break;
        }
      }
    }
  
    // Scheduled departures
    for (const element of pkpIntercityLoad.raw.stopTimes) {
      for (const date of dates) {
        if (
          pkpIntercityLoad.serviceIds[date.format("YYYY-MM-DD")].find(serviceId => serviceId === element.trip_id.split("_")[0]) !== undefined
        ) {
          pkpIntercity.departures[date.format("YYYY-MM-DD")][element.stop_id] = [];
        }
      }
    }
  
    for (const element of pkpIntercityLoad.raw.stopTimes) {
      if (element.departure_time.slice(0, 2) == "24") {
        element.departure_time = "00" + element.departure_time.slice(2);
      } else if (element.departure_time.slice(0, 2) == "25") {
        element.departure_time = "01" + element.departure_time.slice(2);
      } else if (element.departure_time.slice(0, 2) == "26") {
        element.departure_time = "02" + element.departure_time.slice(2);
      } else if (element.departure_time.slice(0, 2) == "27") {
        element.departure_time = "03" + element.departure_time.slice(2);
      }
  
      // element.routeId = pkpIntercityLoad.raw.trips.find(t => `${t.trip_id.split("_")[0]}_${t.trip_id.split("_")[1]}` === element.trip_id)?.route_id;
      element.routeId = pkpIntercityLoad.raw.trips.find(t => t.trip_id === element.trip_id)?.route_id;
      element.routeShortName = pkpIntercityLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_short_name;
      // element.headsign = pkpIntercityLoad.raw.trips.find(t => `${t.trip_id.split("_")[0]}_${t.trip_id.split("_")[1]}` === element.trip_id)?.trip_headsign;
      element.headsign = pkpIntercityLoad.raw.trips.find(t => t.trip_id === element.trip_id)?.trip_headsign;
      element.backgroundColor = pkpIntercityLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_color;
      element.color = pkpIntercityLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_text_color;
    
      for (const date of dates) {
        if (
          pkpIntercityLoad.serviceIds[date.format("YYYY-MM-DD")].find(
            serviceId => serviceId === element.trip_id.split("_")[0]
          ) !== undefined
        ) {
          pkpIntercity.departures[date.format("YYYY-MM-DD")][element.stop_id].push({
            routeName: element.routeShortName,
            routeType: "train",
            provider: "PKP Intercity",
            routeId: element.routeId,
            tripId: element.trip_id,
            color: {
              backgroundColor: "#" + element.backgroundColor,
              color: "#" + element.color
            },
            status: "SCHEDULED",
            theoreticalTime: `${date.format("YYYY-MM-DD")}T${
              element.departure_time
            }${date.format("Z")}`,
            estimatedTime: null,
            headsign: element.headsign,
            stopSequence: element.stop_sequence,
          });
        }
      }
    }
    for (const date of dates) {
      for (const [key, value] of Object.entries(pkpIntercity.departures[date.format("YYYY-MM-DD")])) {
        pkpIntercity.departures[date.format("YYYY-MM-DD")][key].sort(
          (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
        );
      }
    }
    
    // saveObjToFile(pkpIntercity.departures, "jsons/Output/pkpIntercityDepartures.json");
    console.log("PKP Intercity has been loaded")*/

    // Setting lastDataLoad
    lastDataLoad = moment()
      .tz("Europe/Warsaw")
      .set({ hour: 4, minute: 0, second: 0, millisecond: 0 });
    console.log("Data processed successfully!", lastDataLoad.format("YYYY-MM-DD HH:mm:ss"));
    console.log("•");
    sendTelegramMessage("Data processed successfully!")

  } else {
    // const keep_from_sleep = await fetch(
    //   PROXY_URL + "/dev/bruh"
    // );
    // console.log(await keep_from_sleep.json());
    // console.log("Nah");
  }
}

loadData();
const interval = setInterval(() => loadData(), 120000);

async function testLoadData() {

  console.log("Loading PKP Intercity...")
  // sendTelegramMessage("Loading data...")
  console.log("sent")
  // return

  // Current date | .format('YYYY-MM-DD HH:mm:ss Z')
  const dateNow = moment().tz("Europe/Warsaw");
  const dateNextDay = moment().tz("Europe/Warsaw").add(1, "days");
  const dates = [dateNow, dateNextDay];

  const pkpIntercityLoad = {
    raw: {},
    serviceIds: {}
  };
  
  for (const date of dates) {
    pkpIntercity.departures[date.format("YYYY-MM-DD")] = {};
    pkpIntercityLoad.serviceIds[date.format("YYYY-MM-DD")] = [];
  }
  
  // PKP Intercity
  // await importGtfs(configPKPIntercity);
  // const dbPKPIntercity = openDb(configPKPIntercity);
  // pkpIntercityLoad.raw.stops = getStops({}, [], [], { db: dbPKPIntercity });
  // pkpIntercityLoad.raw.routes = getRoutes({}, [], [], { db: dbPKPIntercity });
  // pkpIntercityLoad.raw.trips = getTrips({}, [], [], { db: dbPKPIntercity });
  // pkpIntercityLoad.raw.calendarDates = getCalendarDates({}, [], [], { db: dbPKPIntercity });
  // pkpIntercityLoad.raw.stopTimes = getStoptimes({}, [], [], { db: dbPKPIntercity });
  // closeDb(dbPKPIntercity)

  pkpIntercityLoad.raw.stops = JSON.parse(
    fs.readFileSync("jsons/PKPIntercity/stops.json", "utf-8")
  );
  pkpIntercityLoad.raw.routes = JSON.parse(
    fs.readFileSync("jsons/PKPIntercity/routes.json", "utf-8")
  );
  pkpIntercityLoad.raw.trips = JSON.parse(
    fs.readFileSync("jsons/PKPIntercity/trips.json", "utf-8")
  );
  pkpIntercityLoad.raw.calendarDates = JSON.parse(
    fs.readFileSync("jsons/PKPIntercity/calendarDates.json", "utf-8")
  );
  pkpIntercityLoad.raw.stopTimes = JSON.parse(
    fs.readFileSync("jsons/PKPIntercity/stopTimes.json", "utf-8")
  );
  
  // saveObjToFile(pkpIntercityLoad.raw.stops, "jsons/PKPIntercity/stops.json");
  // saveObjToFile(pkpIntercityLoad.raw.routes, "jsons/PKPIntercity/routes.json");
  // saveObjToFile(pkpIntercityLoad.raw.trips, "jsons/PKPIntercity/trips.json");
  // saveObjToFile(pkpIntercityLoad.raw.calendarDates, "jsons/PKPIntercity/calendarDates.json");
  // saveObjToFile(pkpIntercityLoad.raw.stopTimes, "jsons/PKPIntercity/stopTimes.json");
  
  // let trainStops = [];
  // PKP Intercity
  // for (const stop of pkpIntercityLoad.raw.stops) {
  //   const comparedStop = trainStops.find(trainStop => trainStop.stopName === stop.stop_name)
  //   if (comparedStop !== undefined) {
  //     trainStops[trainStops.indexOf(comparedStop)].providers.push({
  //       stopProvider: "PKP Intercity",
  //       stopId: Number(stop.stop_id)
  //     });
  //   } else {
  //     trainStops.push({
  //       stopName: stop.stop_name,
  //       location: {lat: Number(stop.stop_lat), lng: Number(stop.stop_lon)},
  //       // zoneName: stop.stop_name.split(" ")[0].trim(),
  //       zoneName: null,
  //       stopType: "train",
  //       providers: [
  //         {
  //           stopProvider: "PKP Intercity",
  //           stopId: Number(stop.stop_id)
  //         }
  //       ]
  //     })
  //   }
  // }
  
  // stops.push(...trainStops)
  // saveObjToFile(stops, "jsons/Output/stops.json");
  
  // PKP Intercity
      
  // ServiceIds
  for (const element of pkpIntercityLoad.raw.calendarDates) {
    for (const date of dates) {
      if (element.date.toString() === date.format("YYYYMMDD")) {
        pkpIntercityLoad.serviceIds[date.format("YYYY-MM-DD")].push(element.service_id);
        break;
      }
    }
  }
  
  // Scheduled departures
  for (const element of pkpIntercityLoad.raw.stopTimes) {
    for (const date of dates) {
      if (
        pkpIntercityLoad.serviceIds[date.format("YYYY-MM-DD")].find(serviceId => serviceId === element.trip_id.split("_")[0]) !== undefined
      ) {
        pkpIntercity.departures[date.format("YYYY-MM-DD")][element.stop_id] = [];
      }
    }
  }
  
  for (const element of pkpIntercityLoad.raw.stopTimes) {
    if (element.departure_time.slice(0, 2) == "24") {
      element.departure_time = "00" + element.departure_time.slice(2);
    } else if (element.departure_time.slice(0, 2) == "25") {
      element.departure_time = "01" + element.departure_time.slice(2);
    } else if (element.departure_time.slice(0, 2) == "26") {
      element.departure_time = "02" + element.departure_time.slice(2);
    } else if (element.departure_time.slice(0, 2) == "27") {
      element.departure_time = "03" + element.departure_time.slice(2);
    }
  
    // element.routeId = pkpIntercityLoad.raw.trips.find(t => `${t.trip_id.split("_")[0]}_${t.trip_id.split("_")[1]}` === element.trip_id)?.route_id;
    element.routeId = pkpIntercityLoad.raw.trips.find(t => t.trip_id === element.trip_id)?.route_id;
    element.routeShortName = pkpIntercityLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_short_name;
    // element.headsign = pkpIntercityLoad.raw.trips.find(t => `${t.trip_id.split("_")[0]}_${t.trip_id.split("_")[1]}` === element.trip_id)?.trip_headsign;
    element.headsign = pkpIntercityLoad.raw.trips.find(t => t.trip_id === element.trip_id)?.trip_headsign;
    element.backgroundColor = pkpIntercityLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_color;
    element.color = pkpIntercityLoad.raw.routes.find(r => r.route_id === element.routeId)?.route_text_color;

    // console.log(element)
  
    for (const date of dates) {
      if (
        pkpIntercityLoad.serviceIds[date.format("YYYY-MM-DD")].find(
          serviceId => serviceId === element.trip_id.split("_")[0]
        ) !== undefined
      ) {
        pkpIntercity.departures[date.format("YYYY-MM-DD")][element.stop_id].push({
          routeName: element.routeShortName,
          routeType: "train",
          provider: "PKP Intercity",
          routeId: Number(element.routeId),
          tripId: Number(element.trip_id),
          color: {
            backgroundColor: "#" + element.backgroundColor,
            color: "#" + element.color
          },
          status: "SCHEDULED",
          theoreticalTime: `${date.format("YYYY-MM-DD")}T${
            element.departure_time
          }${date.format("Z")}`,
          estimatedTime: null,
          headsign: element.headsign,
          stopSequence: element.stop_sequence,
        });
      }
    }
  }
  for (const date of dates) {
    for (const [key, value] of Object.entries(pkpIntercity.departures[date.format("YYYY-MM-DD")])) {
      pkpIntercity.departures[date.format("YYYY-MM-DD")][key].sort(
        (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
      );
    }
  }
  
  saveObjToFile(pkpIntercity.departures, "jsons/Output/pkpIntercityDepartures.json");
  console.log("PKP Intercity has been loaded")
}

// testLoadData()

setTimeout(() => {
  return
  const gdyniaGlowna = {
    stopName: "Gdynia Główna",
    location: {
      lat: 54.5201913,
      lng: 18.5313512
    },
    zoneName: null,
    stopType: "train",
    providers: [
      {
        stopProvider: "SKM Trójmiasto",
        stopId: 5900
      },
      {
        stopProvider: "PolRegio",
        stopId: 5900
      }
    ]
  }
  const dabrowaCentrum01 = {
    stopName: "Dąbrowa Centrum 01",
    location: {
      lat: 54.47394,
      lng: 18.46597,
    },
    zoneName: "Gdynia",
    stopType: "bus",
    providers: [
      {
        stopProvider: "ZTM Gdańsk",
        stopId: 8247,
      },
      {
        stopProvider: "ZKM Gdynia",
        stopId: 32470,
      },
    ],
  };
  const dabrowaCentrum04 = {
    stopName: "Dąbrowa Centrum 04",
    location: {
      lat: 54.47317,
      lng: 18.46509,
    },
    zoneName: "Gdynia",
    stopType: "bus",
    providers: [
      {
        stopProvider: "ZTM Gdańsk",
        stopId: 8227,
      },
      {
        stopProvider: "ZKM Gdynia",
        stopId: 32270,
      },
    ],
  };

  fetch(PROXY_URL + "/get-departures", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gdyniaGlowna),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log()
    });
}, 2000);

app.post("/get-departures", async (req, res) => {
  console.log(req.url);
  console.log(req.get("origin"))

  if (!(req.body && req.body.stopName && req.body.providers && req.body.stopType)) {
    res.json({ status: "err" });
    return;
  }

  // Dates
  const datePreviousDay = moment().tz("Europe/Warsaw").add(-1, "days");
  const dateNow = moment().tz("Europe/Warsaw"); //.format('YYYY-MM-DD HH:mm:ss')
  const dateNextDay = moment().tz("Europe/Warsaw").add(1, "days"); //.format('YYYY-MM-DD HH:mm:ss')
  const dates = [datePreviousDay, dateNow, dateNextDay];

  const currentStop = req.body;
  currentStop.departures = [];
  const departuresAll = [];

  if (history.stops[0] && history.stops[0].stopName === currentStop.stopName) {
    history.stops[0].count++
  } else {
    history.stops.unshift({
      stopName: currentStop.stopName,
      requestDate: `${dateNow.format("YYYY-MM-DD")}T${dateNow.format("HH:mm:ss")}${dateNow.format("Z")}`,
      count: 1
    })
  }

  // Loading realtime data
  if (currentStop.stopType === "train") {

    for (const provider of currentStop.providers) {
      if (provider.stopProvider === "SKM Trójmiasto") {
        currentStop.skmTrojmiasto = {
          stopId: provider.stopId,
        };
      } else if (provider.stopProvider === "PolRegio") {
        currentStop.polRegio = {
          stopId: provider.stopId,
        };
      } /*else if (provider.stopProvider === "PKP Intercity") {
        currentStop.pkpIntercity = {
          stopId: provider.stopId,
        };
      }*/
    }
    console.log(currentStop);

    for (const date of dates) {
      if (
        currentStop.skmTrojmiasto &&
        skmTrojmiasto.departures[date.format("YYYY-MM-DD")] &&
        skmTrojmiasto.departures[date.format("YYYY-MM-DD")][currentStop.skmTrojmiasto.stopId]
      ) {
        departuresAll.push(...skmTrojmiasto.departures[date.format("YYYY-MM-DD")][currentStop.skmTrojmiasto.stopId]);
      }

      if (
        currentStop.polRegio &&
        polRegio.departures[date.format("YYYY-MM-DD")] &&
        polRegio.departures[date.format("YYYY-MM-DD")][currentStop.polRegio.stopId]
      ) {
        departuresAll.push(...polRegio.departures[date.format("YYYY-MM-DD")][currentStop.polRegio.stopId]);
      }

      /*if (
        currentStop.pkpIntercity &&
        pkpIntercity.departures[date.format("YYYY-MM-DD")] &&
        pkpIntercity.departures[date.format("YYYY-MM-DD")][currentStop.pkpIntercity.stopId]
      ) {
        departuresAll.push(...pkpIntercity.departures[date.format("YYYY-MM-DD")][currentStop.pkpIntercity.stopId]);
      }*/
    }

    // Sorting departures
    departuresAll.sort(
      (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
    );
    const dateMin = moment().tz("Europe/Warsaw").add(-1, "hours");
    const dateMax = moment().tz("Europe/Warsaw").add(1, "days");

    for (const element of departuresAll) {
      if (
        dateMin < moment(element.theoreticalTime)
        && moment(element.theoreticalTime) < dateMax
      ) {
        currentStop.departures.push(element);
      }
    }

    currentStop.departures.sort(
      (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
    );

    // saveObjToFile(currentStop.departures, "jsons/Output/departuresTable.json");
    // console.log("Departures table has been saved to the file");
    
    res.json(currentStop.departures);

  } else if (
    currentStop.stopType === "bus" ||
    currentStop.stopType === "bus, tram" ||
    currentStop.stopType === "tram"
  ) {

    let ztmGdanskDeparturesRealtime;
    let zkmGdyniaDeparturesRealtime;

    for (const provider of currentStop.providers) {
      if (provider.stopProvider === "ZTM Gdańsk") {
        currentStop.ztmGdansk = {
          stopId: provider.stopId,
        };
        ztmGdanskDeparturesRealtime = await (await fetch(`http://ckan2.multimediagdansk.pl/departures?stopId=${provider.stopId}`)).json();
      } else if (provider.stopProvider === "ZKM Gdynia") {
        currentStop.zkmGdynia = {
          stopId: provider.stopId,
        };
        zkmGdyniaDeparturesRealtime = await (await fetch(`http://ckan2.multimediagdansk.pl/departures?stopId=${provider.stopId}`)).json();
        // zkmGdyniaDeparturesRealtimeTest = await (await fetch(`http://api.zdiz.gdynia.pl/pt/delays?stopId=${provider.stopId}`)).json();
      }
    }
    console.log(currentStop);

    // Adding realtime data to departures
    if (ztmGdanskDeparturesRealtime) {
      for (const element of ztmGdanskDeparturesRealtime.departures) {
        if (element.status === "REALTIME") {
          const theoreticalTime = moment(element.theoreticalTime).tz("Europe/Warsaw");
          const estimatedTime = moment(element.estimatedTime).tz("Europe/Warsaw");
          // element.estimatedTime = moment(element.estimatedTime).tz(
          //   "Europe/Warsaw"
          // );
          // const estimatedTime =
          //   element.estimatedTime.second() ||
          //   element.estimatedTime.millisecond()
          //     ? element.estimatedTime.add(1, "minute").startOf("minute")
          //     : element.estimatedTime.startOf("minute");

          if (!(ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")] && ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId])) {
            continue
          }

          const comparedTrip = ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId].find(
            (t) =>
              moment(t.theoreticalTime).tz("Europe/Warsaw").format("HH:mm:ss") ===
                theoreticalTime.format("HH:mm:ss") &&
              t.tripId === element.tripId &&
              t.routeId === element.routeId
          );
          if (!comparedTrip) {
            continue;
          }

          const comparedTripIndex =
            ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId].indexOf(comparedTrip);

          ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId][comparedTripIndex].status = "REALTIME";
          ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId][comparedTripIndex].estimatedTime =
            `${estimatedTime.format("YYYY-MM-DD")}T${estimatedTime.format("HH:mm:ss")}${estimatedTime.format("Z")}`;
        }
      }
    }

    if (zkmGdyniaDeparturesRealtime) {
      for (const element of zkmGdyniaDeparturesRealtime.departures) {
        if (element.status === "REALTIME") {
          const theoreticalTime = moment(element.theoreticalTime).tz("Europe/Warsaw");
          const estimatedTime = moment(element.estimatedTime).tz("Europe/Warsaw");
          // element.estimatedTime = moment(element.estimatedTime).tz("Europe/Warsaw");
          // const estimatedTime =
          //   element.estimatedTime.second() ||
          //   element.estimatedTime.millisecond()
          //     ? element.estimatedTime.add(1, "minute").startOf("minute")
          //     : element.estimatedTime.startOf("minute");

          if (!(zkmGdynia.departures[theoreticalTime.format("YYYY-MM-DD")] && zkmGdynia.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId])) {
            continue
          }

          const comparedTrip = zkmGdynia.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId].find(
            (t) =>
              moment(t.theoreticalTime).tz("Europe/Warsaw").format("HH:mm:ss") ===
                theoreticalTime.format("HH:mm:ss") &&
              t.routeId === element.routeId
          );
          if (!comparedTrip) {
            console.log("comparedTrip is undefined for:")
            console.log(element)
            continue;
          }
          
          const comparedTripIndex =
            zkmGdynia.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId].indexOf(comparedTrip);

          zkmGdynia.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId][comparedTripIndex].status = "REALTIME";
          zkmGdynia.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId][comparedTripIndex].estimatedTime =
            `${estimatedTime.format("YYYY-MM-DD")}T${estimatedTime.format("HH:mm:ss")}${estimatedTime.format("Z")}`;
        }
      }
    }

    // Combining data from all providers
    for (const date of dates) {

      if (
        currentStop.ztmGdansk &&
        ztmGdansk.departures[date.format("YYYY-MM-DD")] &&
        ztmGdansk.departures[date.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId]
      ) {
        departuresAll.push(...ztmGdansk.departures[date.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId]);
      }

      if (
        currentStop.zkmGdynia &&
        zkmGdynia.departures[date.format("YYYY-MM-DD")] &&
        zkmGdynia.departures[date.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId]
      ) {
        departuresAll.push(...zkmGdynia.departures[date.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId]);
      }

    }

    // Sorting departures
    departuresAll.sort(
      (a, b) =>
        moment(a.status === "REALTIME" ? a.estimatedTime : a.theoreticalTime) -
        moment(b.status === "REALTIME" ? b.estimatedTime : b.theoreticalTime)
    );
    const dateMin = moment().tz("Europe/Warsaw").add(-1, "hours");
    const dateMax = moment().tz("Europe/Warsaw").add(1, "days");

    for (const element of departuresAll) {
      if (
        dateMin < moment(element.status === "REALTIME" ? element.estimatedTime : element.theoreticalTime)
        && moment(element.status === "REALTIME" ? element.estimatedTime : element.theoreticalTime) < dateMax
      ) {
        currentStop.departures.push(element);
      }
    }

    // saveObjToFile(currentStop.departures, "jsons/Output/departuresTable.json");
    // console.log("Departures table has been saved to the file");

    // saveObjToFile({
    //   ztmGdanskDeparturesRealtime: ztmGdanskDeparturesRealtime,
    //   zkmGdyniaDeparturesRealtime: zkmGdyniaDeparturesRealtime,
    // }, "jsons/Output/logs.json");
    // console.log("Logs have been saved to the file");
    
    res.json(currentStop.departures);

  } else {
    res.json([]);
  }
});

app.get("/stops", (req, res) => {
  console.log(req.url);
  console.log(req.get("origin"))
  res.json(stops);
});

app.get("/redirect", async (req, res) => {
  if (req.url.slice(10, 13) === "url") {
    console.log("url");
    console.log(req.url.split("/redirect?url=")[1]);

    const response = await fetch(req.url.split("/redirect?url=")[1]);
    res.json(await response.json());
  }
});

app.get("/dev/bruh", async (req, res) => {
  res.json([{ bruh: "bruh" }]);
});

app.get("/dev/last-data-load", async (req, res) => {
  res.json(lastDataLoad);
})

app.get("/dev/history/stops", async (req, res) => {
  // res.json(JSON.stringify(history.stops, null, 2))
  res.json(history.stops)
})

app.get("/get-telebot-token", async (req, res) => {
  // console.log(req);
  console.log(req.get("origin"));
  if (
    req.get("origin") === "https://busmaps.pl" ||
    req.get("origin") === "https://3000-cs-794102293669-default.cs-europe-west4-bhnf.cloudshell.dev" ||
    req.get("origin") === "http://192.168.0.3:3000"
  ) {
    res.json([{ ok: true, token: TELEGRAM_BOT_TOKEN, chat_id: CHAT_ID }]);
  } else {
    res.json([
      {
        ok: "success",
        token: "6578783972:AABCWvY88xyhNiG23c_R_3FPr5kQiz_b6q8",
        chat_id: "359118824",
      },
    ]);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


// Old

app.post('/report-a-problem', (req, res) => {
  //   console.log();
  //   console.log("/report-a-problem");
  //   // console.log(req.body);
  //   console.log(req.body.description);
  
  //   console.log(cwd + "/data/reports");
  
  //   // check if directory exists
  //   console.log("Checking if /data exists...");
  //   if (fs.existsSync(cwd + "/data")) {
  //     console.log('Directory exists!');
  //   } else {
  //     console.log('Directory not found.');
  //     fs.mkdir(cwd + "/data", (err, files) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //     })
  //   }
  
  //   // check if directory exists
  //   console.log("Checking if /data/reports exists...");
  //   if (fs.existsSync(cwd + "/data/reports")) {
  //     console.log('Directory exists!');
  //   } else {
  //     console.log('Directory not found.');
  //     fs.mkdir(cwd + "/data/reports", (err, files) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //     })
  //   }
  
  //   fs.readdir(cwd + "/data/reports", (err, files) => {
  //     // console.log(cwd + "/data/reports");
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  
  //     const folderLen = files.length;
  //     // console.log(folderLen);
  //     // console.log(files);
  
  //     fs.mkdir(cwd + "/data/reports/" + folderLen, (err, files) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  
  //       // console.log("created");
  //       fs.writeFile(cwd + "/data/reports/" + folderLen + '/' + 'logs.json', JSON.stringify(req.body.logs), function (err) {
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  
  //         let imageAttached = false;
  //         if (req.body.image != null) {
  //           base64DecodeAndSave(req.body.image, cwd + "/data/reports/" + folderLen + '/');
  //           imageAttached = true;
  //         }
  //         console.log("Report saved successfully");
  //         console.log("Notifying through telegram...");
  
  //         setTimeout(() => {sendTelegramMessage(req.body.description, imageAttached, folderLen)}, 1000)
  //       });
  //     })
  
  //   });
  
  //   res.json({status: "success"});
  })
  
  app.get("/reports", async (req, res) => {
  //   console.log("/reports");
  
  //   // check if directory exists
  //   console.log("Checking if /data exists...");
  //   if (fs.existsSync(cwd + "/data")) {
  //     console.log('Directory exists!');
  //   } else {
  //     console.log('Directory not found.');
  //     fs.mkdir(cwd + "/data", (err, files) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //     })
  //   }
  
  //   // check if directory exists
  //   console.log("Checking if /data/reports exists...");
  //   if (fs.existsSync(cwd + "/data/reports")) {
  //     console.log('Directory exists!');
  //   } else {
  //     console.log('Directory not found.');
  //     fs.mkdir(cwd + "/data/reports", (err, files) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //     })
  //   }
  
  //   fs.readdir(cwd + "/data/reports", (err, files) => {
  
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     console.log(files.length);
  //     res.json([{reportsAvailable: files.length}])
  //     // res.json([`There are ${files.length} reports`]);
  //   });
  
  //   // res.sendFile(cwd + '/' + "Billy.jpeg");
  })
  
  app.get("/reports/get-image", async (req, res) => {
  //   console.log();
  //   if (req.url.slice(19, 21) === "id") {
  
  //     console.log(req.url);
  //     let num = parseInt((req.url.split("/reports/get-image?id="))[1]);
  //     // console.log(num);
  
  //     if (isNumeric(num)) {
  //       fs.readdir(cwd + "/data/reports", (err, files) => {
  
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  
  //         // console.log(files.length);
  //         if (num < files.length && num >= 0) {
  //           console.log("Sending image from report...");
  //           res.sendFile(cwd + "/data/reports/" + num + "/image.png");
  //         } else {
  //           console.log("Wrong id has been provided");
  //           res.sendFile(cwd + '/' + "Billy.jpeg");
  //         }
  //       });
  //     } else {
  //       console.log("Wrong id has been provided")
  //       res.sendFile(cwd + '/' + "Billy.jpeg");
  //     }
  
  //   } else {
  //     console.log("Wrong id has been provided")
  //     res.sendFile(cwd + '/' + "Billy.jpeg");
  //   }
  })
  
  app.get("/reports/get-logs", async (req, res) => {
  //   console.log();
  //   if (req.url.slice(18, 20) === "id") {
  
  //     console.log(req.url);
  //     let num = parseInt((req.url.split("/reports/get-logs?id="))[1]);
  //     // console.log(num);
  
  //     if (isNumeric(num)) {
  //       fs.readdir(cwd + "/data/reports", (err, files) => {
  
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }
  
  //         // console.log(files.length);
  //         if (num < files.length && num >= 0) {
  //           console.log("Sending logs from report...")
  //           res.sendFile(cwd + "/data/reports/" + num + "/logs.json");
  //         } else {
  //           console.log("Wrong id has been provided");
  //           res.sendFile(cwd + '/' + "Billy.jpeg");
  //         }
  //       });
  //     } else {
  //       console.log("Wrong id has been provided")
  //       res.sendFile(cwd + '/' + "Billy.jpeg");
  //     }
  
  //   } else {
  //     console.log("Wrong id has been provided")
  //     res.sendFile(cwd + '/' + "Billy.jpeg");
  //   }
  })
  
   app.get("/reports/clear-all", async (req, res) => {
  //   console.log();
  //   console.log("/reports/clear-all");
  
  //   fs.rmSync(cwd + "/data/reports", { recursive: true, force: true });
  
  //   // check if directory exists
  //   console.log("Checking if /data exists...");
  //   if (fs.existsSync(cwd + "/data")) {
  //     console.log('Directory exists!');
  //   } else {
  //     console.log('Directory not found.');
  //     fs.mkdir(cwd + "/data", (err, files) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //     })
  //   }
  
  //   fs.mkdir(cwd + "/data/reports", (err, files) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //   })
  
  //   console.log("Reports cleared successfully");
  //   bot.telegram.sendMessage(CHAT_ID, "•", {});
  //   setTimeout(() => {bot.telegram.sendMessage(CHAT_ID, "All reports have been cleared successfully", {})}, 200)
  
  //   res.json([{answer: "Cleared successfully"}]);
  })