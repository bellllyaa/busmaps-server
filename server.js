import { Telegraf } from "telegraf";
const TELEGRAM_BOT_TOKEN = "5678768571:AAFBWvY88xyhNj623c_R_3FPr5jQis_n6q8";
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const CHAT_ID = "758319926";

const LOCAL_URL = "http://localhost:8080";
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
let tmp;
if (process.env.USER === "belllyaa") {
  tmp = process.cwd();
} else {
  // tmp = "/dev/sdb";
  tmp = "/mnt/temp"
}
console.log(tmp)

console.log(`process.env.NODE_ENV === "production": ${process.env.NODE_ENV === "production"}`)
console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`process.env.DEV && process.env.DEV === "Yes": ${process.env.DEV && process.env.DEV === "Yes"}`)
console.log(`process.env.DEV: ${process.env.DEV}`)
sendTelegramMessage(`process.env.NODE_ENV === "production": ${process.env.NODE_ENV === "production"}`)
sendTelegramMessage(`process.env.NODE_ENV: ${process.env.NODE_ENV}`)
sendTelegramMessage(`process.env.DEV && process.env.DEV === "Yes": ${process.env.DEV && process.env.DEV === "Yes"}`)
sendTelegramMessage(`process.env.DEV: ${process.env.DEV}`)
sendTelegramMessage(tmp)

// let cwd;
// if (process.env.DEV && process.env.DEV === "Yes") {
//   cwd = process.cwd();
// } else {
//   // console.log("Setting cwd to '/tmp'")
//   cwd = "/tmp";
// }
// console.log(process.env.DEV)

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




// Preparing the database

// check if directory exists
console.log("Checking if /db exists...");
if (fs.existsSync(tmp + "/db")) {
  console.log('Directory exists!');
} else {
  console.log('Directory not found.');
  fs.mkdirSync(tmp + "/db", { recursive: true })
}

import Database from "better-sqlite3";
// const db = new Database('../sqlite/db/chinook.db');
const db = new Database(tmp + '/db/busmaps.db');
db.pragma('journal_mode = WAL');

const sqlStops = `SELECT StopName as stopName,
                    Lat as lat,
                    Lng as lng,
                    ZoneName as zoneName,
                    StopType as stopType,
                    Providers as providers
                  FROM stops`;

// for (const row of db.prepare(sqlStops).iterate()) {
//   console.log({
//     stopName: row.stopName,
//     location: {
//       lat: row.lat,
//       lng: row.lng
//     },
//     zoneName: row.zoneName,
//     stopType: row.stopType,
//     providers: JSON.parse(row.providers)
//   })
// }

// for (const row of db.prepare(`SELECT Date as date,
//     StopId as stopId,
//     RouteName as routeName,
//     RouteType as routeType,
//     Headsign as headsign,
//     Provider as provider,
//     RouteId as routeId,
//     TripId as tripId,
//     Status as status,
//     TheoreticalTime as theoreticalTime,
//     EstimatedTime as estimatedTime,
//     StopSequence as stopSequence
//   FROM ztmGdanskDepartures
//   WHERE StopId = '8227'`).iterate()) {
//   console.log({
//     routeName: row.routeName,
//     date: row.date,
//     theoreticalTime: row.theoreticalTime
//   })
// }






let lastDataLoad = 0;
let history = {
  stops: []
}

// const stops = JSON.parse(fs.readFileSync("../jsons/Output/stops.json", "utf-8"));

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

function prepareDB() {
  db.prepare(`CREATE TABLE IF NOT EXISTS stops(
    StopName TEXT,
    Lat REAL,
    Lng REAL,
    ZoneName TEXT,
    StopType TEXT,
    Providers TEXT
  )`)
    .run();
  
  db.prepare(`CREATE TABLE IF NOT EXISTS ztmGdanskDepartures(
    Date TEXT,
    StopId INTEGER,
    RouteName TEXT,
    RouteType TEXT,
    Headsign TEXT,
    Provider TEXT,
    RouteId INTEGER,
    TripId INTEGER,
    Status TEXT,
    TheoreticalTime TEXT,
    EstimatedTime TEXT,
    StopSequence INTEGER
  )`)
    .run();
  
  db.prepare(`CREATE TABLE IF NOT EXISTS zkmGdyniaDepartures(
    Date TEXT,
    StopId INTEGER,
    RouteName TEXT,
    RouteType TEXT,
    Headsign TEXT,
    Provider TEXT,
    RouteId INTEGER,
    TripId INTEGER,
    Status TEXT,
    TheoreticalTime TEXT,
    EstimatedTime TEXT,
    StopSequence INTEGER
  )`)
    .run();
  
  db.prepare(`CREATE TABLE IF NOT EXISTS skmTrojmiastoDepartures(
    Date TEXT,
    StopId INTEGER,
    RouteName TEXT,
    RouteType TEXT,
    Headsign TEXT,
    Provider TEXT,
    RouteId INTEGER,
    TripId INTEGER,
    Color TEXT,
    Status TEXT,
    TheoreticalTime TEXT,
    EstimatedTime TEXT,
    StopSequence INTEGER
  )`)
    .run();
  
  db.prepare(`CREATE TABLE IF NOT EXISTS polRegioDepartures(
    Date TEXT,
    StopId INTEGER,
    RouteName TEXT,
    RouteType TEXT,
    Headsign TEXT,
    Provider TEXT,
    RouteId INTEGER,
    TripId INTEGER,
    Color TEXT,
    Status TEXT,
    TheoreticalTime TEXT,
    EstimatedTime TEXT,
    StopSequence INTEGER
  )`)
    .run();
}

async function loadStops() {

  console.log('•');
  console.log("Loading stops...");

  let stops = [];

  // Current date | .format('YYYY-MM-DD HH:mm:ss Z')
  const dateNow = moment().tz("Europe/Warsaw");

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
  };
  const skmTrojmiastoLoad = {
    raw: {
      stops: [],
    },
  };
  const polRegioLoad = {
    raw: {
      stops: [],
    },
  };

  // ZTM Gdańsk
  ztmGdanskLoad.raw.stops = await (
    await fetch(
      "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json"
    )
  ).json();
  ztmGdanskLoad.raw.routes = await (
    await fetch(
      "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/22313c56-5acf-41c7-a5fd-dc5dc72b3851/download/routes.json"
    )
  ).json();
  ztmGdanskLoad.raw.stopsInTrip = await (
    await fetch(
      "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/3115d29d-b763-4af5-93f6-763b835967d6/download/stopsintrip.json"
    )
  ).json();

  // ZKM Gdynia
  zkmGdyniaLoad.raw.stops = await (
    await fetch("http://api.zdiz.gdynia.pl/pt/stops")
  ).json();

  // SKM Trójmiasto
  try {
    await importGtfs(configSKMTrojmiasto);
    const dbSKMTrojmiasto = openDb(configSKMTrojmiasto);
    skmTrojmiastoLoad.raw.stops = getStops({}, [], [], { db: dbSKMTrojmiasto });
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
    closeDb(dbPolRegio)
  } catch (err) {
    console.log(err.message)
    sendTelegramMessage(err.message)
  }

  // Working with loaded data

  // ZTM Gdańsk
  function ztmGdanskGetStopType(stop) {
    const stopId = stop.stopId;

    // name: Władysława IV 01, id: 2169
    // name: Dąbrowa Centrum 04, id: 8227

    const routeTypes = [];
    for (const stop of ztmGdanskLoad.raw.stopsInTrip[dateNow.format("YYYY-MM-DD")].stopsInTrip) {
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
  // saveObjToFile(stops, "../jsons/Output/stops.json");

  // Inserting stops into the database

  db.prepare(`DELETE FROM stops`).run();

  const placeholders = stops.map(() => `(?, ?, ?, ?, ?, ?)`).join(',');
  const params = []
  for (const stop of stops) {
    params.push(...[
      stop.stopName.replace(`'`, `''`),
      stop.location.lat,
      stop.location.lng,
      stop.zoneName,
      stop.stopType,
      JSON.stringify(stop.providers)
    ])
  }

  db.prepare(`INSERT INTO stops (StopName, Lat, Lng, ZoneName, StopType, Providers)
    VALUES ` + placeholders).run(params);

  /*db.serialize(() => {
    db.run(`DELETE FROM stops`);

    const placeholders = stops.map(() => `(?, ?, ?, ?, ?, ?)`).join(',');
    const params = []
    for (const stop of stops) {
      params.push(...[
        stop.stopName.replace(`'`, `''`),
        stop.location.lat,
        stop.location.lng,
        stop.zoneName ? stop.zoneName : 'NULL',
        stop.stopType,
        JSON.stringify(stop.providers)
      ])
    }

    db.run(`INSERT INTO stops (StopName, Lat, Lng, ZoneName, StopType, Providers)
      VALUES ` + placeholders,
      params,
      (err) => {
        if (err) {
          console.error(err.message);
        }
      })

    // for (const stop of stops) {

    //   const prompt = `INSERT INTO stops (StopName, Lat, Lng, ZoneName, StopType, Providers)
    //   VALUES ('${stop.stopName.replace(`'`, `''`)}', ${stop.location.lat}, ${stop.location.lng}, ${stop.zoneName ? `'${stop.zoneName}'` : 'NULL'}, '${stop.stopType}', '${JSON.stringify(stop.providers)}')`
    
    //   db.run(prompt,
    //   (err) => {
    //     if (err) {
    //       console.log(prompt)
    //       console.error(err.message);
    //     }
    //   })
    // }
  });*/

  console.log("•");
  console.log("Stops have been loaded");
}

async function loadZTMGdansk() {

  console.log("•");
  console.log("Loading ZTM Gdańsk...");

  // Current date | .format('YYYY-MM-DD HH:mm:ss Z')
  const dateNow = moment().tz("Europe/Warsaw");
  const dateNextDay = moment().tz("Europe/Warsaw").add(1, "days");
  const dates = [dateNow, dateNextDay];

  // Object
  let ztmGdansk = {
    raw: {
      stopTimes: {},
    },
    stops: [],
    departures: {}
  };

  for (const date of dates) {
    ztmGdansk.departures[date.format("YYYY-MM-DD")] = {};
    ztmGdansk.raw.stopTimes[date.format("YYYY-MM-DD")] = [];
  }

  // Routes
  ztmGdansk.raw.routes = await (
    await fetch(
      "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/22313c56-5acf-41c7-a5fd-dc5dc72b3851/download/routes.json"
    )
  ).json();

  // Trips
  ztmGdansk.raw.trips = await (
    await fetch(
      "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/b15bb11c-7e06-4685-964e-3db7775f912f/download/trips.json"
    )
  ).json();

  // Stops in trip
  // ztmGdansk.raw.stopsInTrip = await (
  //   await fetch(
  //     "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/3115d29d-b763-4af5-93f6-763b835967d6/download/stopsintrip.json"
  //   )
  // ).json();

  // Stop times links
  ztmGdansk.raw.stopTimesLinks = await (
    await fetch(
      "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/a023ceb0-8085-45f6-8261-02e6fcba7971/download/stoptimes.json"
    )
  ).json();

  // Stop times of ZTM Gdansk
  for (const [key, value] of Object.entries(ztmGdansk.raw.stopTimesLinks)) {
    // console.log(key);

    for (const date of dates) {
      const link = value.find(
        (link) => link.search(date.format("YYYY-MM-DD")) !== -1
      );
      // console.log(link);

      if (link) {
        ztmGdansk.raw.stopTimes[date.format("YYYY-MM-DD")].push(
          ...(await (await fetch(link)).json()).stopTimes
        );
      }
    }
  }

  // Loading from jsons
  /*ztmGdansk.raw.trips = JSON.parse(
    fs.readFileSync("../jsons/ZTMGdansk/trips.json", "utf-8")
  );
  ztmGdansk.raw.routes = JSON.parse(
    fs.readFileSync("../jsons/ZTMGdansk/routes.json", "utf-8")
  );
  ztmGdansk.raw.stopTimesLinks = JSON.parse(
    fs.readFileSync("../jsons/ZTMGdansk/stopTimesLinks.json", "utf-8")
  );
  ztmGdansk.raw.stopTimes = JSON.parse(
    fs.readFileSync("../jsons/ZTMGdansk/stopTimes.json", "utf-8")
  );*/

  // Saving jsons
  // saveObjToFile(ztmGdansk.raw.routes, "../jsons/ZTMGdansk/routes.json")
  // saveObjToFile(ztmGdansk.raw.trips, "../jsons/ZTMGdansk/trips.json")
  // saveObjToFile(ztmGdansk.raw.stopTimesLinks, "../jsons/ZTMGdansk/stopTimesLinks.json")
  // saveObjToFile(ztmGdansk.raw.stopTimes, "../jsons/ZTMGdansk/stopTimes.json")
  // saveObjToFile(ztmGdansk.raw.stopsInTrip, "../jsons/ZTMGdansk/stopsInTrip.json")

  // Processing departures

  // for (const row of db
  //   .prepare(
  //     `SELECT Providers as providers
  //     FROM stops
  //     WHERE Providers LIKE '%ZTM Gdańsk%'`
  //   )
  //   .iterate()) {
    
  //   for (const date of dates) {
  //     ztmGdansk.departures[date.format("YYYY-MM-DD")][
  //       JSON.parse(row.providers).find(provider => provider.stopProvider === "ZTM Gdańsk").stopId
  //     ] = [];
  //   }

  // }

  /*db.serialize(() => {
    db.all(`SELECT Providers as providers
      FROM stops
      WHERE Providers LIKE '%ZTM Gdańsk%'`, (err, rows) => {
      if (err) {
        console.error(err.message);
      }
  
      for (const row of rows) {
        for (const date of dates) {
          ztmGdansk.departures[date.format("YYYY-MM-DD")][
            JSON.parse(row.providers).find(provider => provider.stopProvider === "ZTM Gdańsk").stopId
          ] = [];
        }
      }

      // console.log(ztmGdansk.departures)
    });

    console.log(ztmGdansk.departures)
  })*/

  // for (const stop of ztmGdansk.stops) {
  //   for (const date of dates) {
  //     ztmGdansk.departures[date.format("YYYY-MM-DD")][
  //       stop.providers[0].stopId
  //     ] = [];
  //   }
  // }

  // const brokenBruh = {};
  // for (const date of dates) {
  //   brokenBruh[date.format("YYYY-MM-DD")] = [];
  // }

  for (const date of dates) {
    for (const element of ztmGdansk.raw.stopTimes[date.format("YYYY-MM-DD")]) {
      ztmGdansk.departures[date.format("YYYY-MM-DD")][element.stopId] = [];
    }
  }

  // Cleaning the table
  db.prepare(`DELETE FROM ztmGdanskDepartures`).run();

  // let dayum = []

  for (const date of dates) {
    for (const element of ztmGdansk.raw.stopTimes[date.format("YYYY-MM-DD")]) {
      // if (
      //   ztmGdansk.stops.find(
      //     (stop) => stop.providers[0].stopId === element.stopId
      //   ) === undefined
      // ) {
      //   brokenBruh[date.format("YYYY-MM-DD")].push(element);
      //   continue;
      // }

      const routeObj = ztmGdansk.raw.routes[date.format("YYYY-MM-DD")].routes.find((r) => r.routeId == element.routeId);

      if (routeObj.routeType === "UNKNOWN") {
        element.routeType = null;
      } else if (routeObj.routeType === "TRAM") {
        element.routeType = "tram";
      } else {
        element.routeType = "bus";
      }

      const tripObj = ztmGdansk.raw.trips[date.format("YYYY-MM-DD")].trips.find(
        (t) => t.routeId == element.routeId && t.tripId == element.tripId
      );
      if (!tripObj) {
        console.log(element)
      }
      if (tripObj.type === "NON_PASSENGER") {
        continue
      }
      // console.log(tripObj.tripHeadsign)
      // dayum.push(tripObj.tripHeadsign)

      let headsign
      let direction = tripObj.directionId === 1 ? 1 : 0

      if (tripObj.type === "MAIN") {
        headsign = routeObj.routeLongName.split("-")[direction].trim()
      } else if (tripObj.tripHeadsign.includes(">")) {
        headsign = tripObj.tripHeadsign.split(">")[direction].trim()
      } else {
        headsign = tripObj.tripHeadsign.split("-")[direction].split("(")[0].trim()
      }

      /*if (tripObj.tripHeadsign.includes(">")) {

        headsign = tripObj.tripHeadsign.split(">")[direction].trim()

      } else if (tripObj.tripHeadsign.split("-")[direction].includes("(")) {

        const headsignStopId = tripObj.tripHeadsign
          .split("-")
          [direction].split("(")[1]
          .split(")")[0]
          .trim();
        headsign = db.prepare(
          `SELECT StopName as stopName
          FROM stops
          WHERE Providers LIKE '%{"stopProvider":"ZTM Gdańsk","stopId":${headsignStopId}}%'`
        ).get()
        if (!headsign) {
          headsign = tripObj.tripHeadsign
            .split("-")
            [direction].split("(")[0]
            .trim()
        } else {
          headsign = headsign.stopName
        }

      } else {
        headsign = tripObj.tripHeadsign.split("-")[direction].trim()
      }*/
      // if (!headsign) {
      //   console.log(element)
      // }
      // console.log(headsign)
      // dayum.push(headsign)

      // element.routeId = zkmGdyniaTripsRaw.find(t => t.tripId === element.tripId)?.routeId;

      ztmGdansk.departures[date.format("YYYY-MM-DD")][element.stopId].push({
        routeName: routeObj.routeShortName,
        routeType: element.routeType,
        provider: "ZTM Gdańsk",
        routeId: element.routeId,
        tripId: element.tripId,
        status: "SCHEDULED",
        theoreticalTime: `${date.format("YYYY-MM-DD")}T${
          element.departureTime.split("T")[1]
        }${date.format("Z")}`,
        estimatedTime: null,
        // headsign: routeObj.routeLongName.split(" - ")[0],
        headsign: headsign,
        stopSequence: element.stopSequence,
      });
    }
    for (const [key, value] of Object.entries(
      ztmGdansk.departures[date.format("YYYY-MM-DD")]
    )) {
      ztmGdansk.departures[date.format("YYYY-MM-DD")][key].sort(
        (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
      );
      for (const trip of ztmGdansk.departures[date.format("YYYY-MM-DD")][key]) {
        db.prepare(`INSERT INTO ztmGdanskDepartures (Date, StopId, RouteName, RouteType, Headsign, Provider, RouteId, TripId, Status, TheoreticalTime, EstimatedTime, StopSequence)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(date.format("YYYY-MM-DD"), Number(key), trip.routeName, trip.routeType, trip.headsign, trip.provider, Number(trip.routeId), Number(trip.tripId), trip.status, trip.theoreticalTime, trip.estimatedTime, trip.stopSequence)
      }
    }
  }

  // saveObjToFile(dayum)

  console.log("•")
  console.log("ZTM Gdańsk departures have been loaded")
  // sendTelegramMessage("ZTM Gdańsk departures have been loaded")
  // saveObjToFile(ztmGdansk.departures, "../jsons/Output/ztmGdanskDepartures.json");
  // saveObjToFile(brokenBruh, "jsons/Output/ztmGdanskDeparturesBroken.json");

}

async function loadZKMGdynia() {
  console.log("•");
  console.log("Loading ZKM Gdynia...");

  // Current date | .format('YYYY-MM-DD HH:mm:ss Z')
  const dateNow = moment().tz("Europe/Warsaw");
  const dateNextDay = moment().tz("Europe/Warsaw").add(1, "days");
  const dates = [dateNow, dateNextDay];

  const zkmGdynia = {
    raw: {},
    stops: [],
    serviceIds: {},
    departures: {}
  };

  for (const date of dates) {
    zkmGdynia.departures[date.format("YYYY-MM-DD")] = {};
    zkmGdynia.serviceIds[date.format("YYYY-MM-DD")] = [];
  }

  // Routes
  zkmGdynia.raw.routes = await (
    await fetch("http://api.zdiz.gdynia.pl/pt/routes")
  ).json();

  // Trips
  zkmGdynia.raw.trips = await (
    await fetch("http://api.zdiz.gdynia.pl/pt/trips")
  ).json();

  // Stop times
  zkmGdynia.raw.stopTimes = await (
    await fetch("http://api.zdiz.gdynia.pl/pt/stop_times")
  ).json();

  // Calendar dates
  zkmGdynia.raw.calendarDates = await (
    await fetch("http://api.zdiz.gdynia.pl/pt/calendar_dates")
  ).json();

  // Processing departures

  // ServiceIds
  for (const element of zkmGdynia.raw.calendarDates) {
    for (const date of dates) {
      if (element.date === date.format("YYYYMMDD")) {
        zkmGdynia.serviceIds[date.format("YYYY-MM-DD")].push(
          element.serviceId
        );
        break;
      }
    }
  }

  // Scheduled departures
  for (const element of zkmGdynia.raw.stopTimes) {
    for (const date of dates) {
      if (
        zkmGdynia.serviceIds[date.format("YYYY-MM-DD")].find(
          (serviceId) => serviceId === element.tripId
        ) !== undefined
      ) {
        zkmGdynia.departures[date.format("YYYY-MM-DD")][element.stopId] = [];
      }
    }
  }

  // Cleaning the table
  db.prepare(`DELETE FROM zkmGdyniaDepartures`).run();

  for (const element of zkmGdynia.raw.stopTimes) {
    if (element.departureTime.slice(0, 2) == "24") {
      element.departureTime = "00" + element.departureTime.slice(2);
    } else if (element.departureTime.slice(0, 2) == "25") {
      element.departureTime = "01" + element.departureTime.slice(2);
    } else if (element.departureTime.slice(0, 2) == "26") {
      element.departureTime = "02" + element.departureTime.slice(2);
    } else if (element.departureTime.slice(0, 2) == "27") {
      element.departureTime = "03" + element.departureTime.slice(2);
    }

    element.routeId = zkmGdynia.raw.trips.find(
      (t) => t.tripId === element.tripId
    )?.routeId;
    element.routeShortName = zkmGdynia.raw.routes.find(
      (r) => r.routeId === element.routeId
    )?.routeShortName;

    for (const date of dates) {
      if (
        zkmGdynia.serviceIds[date.format("YYYY-MM-DD")].find(
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
      for (const trip of zkmGdynia.departures[date.format("YYYY-MM-DD")][key]) {
        db.prepare(`INSERT INTO zkmGdyniaDepartures (Date, StopId, RouteName, RouteType, Headsign, Provider, RouteId, TripId, Status, TheoreticalTime, EstimatedTime, StopSequence)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(date.format("YYYY-MM-DD"), Number(key), trip.routeName, trip.routeType, trip.headsign, trip.provider, Number(trip.routeId), Number(trip.tripId), trip.status, trip.theoreticalTime, trip.estimatedTime, trip.stopSequence)
      }
    }
  }

  console.log("•")
  console.log("ZKM Gdynia departures have been loaded")
  // sendTelegramMessage("ZKM Gdynia departures have been loaded")
  // saveObjToFile(zkmGdynia.departures, "../jsons/Output/zkmGdyniaDepartures.json");

}

async function loadSKMTrojmiasto() {
  console.log("•");
  console.log("Loading SKM Trójmiasto...");

  // Current date | .format('YYYY-MM-DD HH:mm:ss Z')
  const dateNow = moment().tz("Europe/Warsaw");
  const dateNextDay = moment().tz("Europe/Warsaw").add(1, "days");
  const dates = [dateNow, dateNextDay];

  // Object
  const skmTrojmiasto = {
    raw: {
      stops: [],
      calendarDates: [],
      stopTimes: [],
      trips: [],
      routes: []
    },
    serviceIds: {},
    departures: {}
  };

  for (const date of dates) {
    skmTrojmiasto.departures[date.format("YYYY-MM-DD")] = {};
    skmTrojmiasto.serviceIds[date.format("YYYY-MM-DD")] = [];
  }
  
  // Loading data
  try {
    await importGtfs(configSKMTrojmiasto);
    const dbSKMTrojmiasto = openDb(configSKMTrojmiasto);
    skmTrojmiasto.raw.routes = getRoutes({}, [], [], { db: dbSKMTrojmiasto });
    skmTrojmiasto.raw.trips = getTrips({}, [], [], { db: dbSKMTrojmiasto });
    skmTrojmiasto.raw.calendarDates = getCalendarDates({}, [], [], { db: dbSKMTrojmiasto });
    skmTrojmiasto.raw.stopTimes = getStoptimes({}, [], [], { db: dbSKMTrojmiasto });
    closeDb(dbSKMTrojmiasto)
  } catch (err) {
    console.log(err.message);
    sendTelegramMessage(err.message);
    return;
  }
    
  // Processing the data
  
  // ServiceIds
  for (const element of skmTrojmiasto.raw.calendarDates) {
    for (const date of dates) {
      if (element.date.toString() === date.format("YYYYMMDD")) {
        skmTrojmiasto.serviceIds[date.format("YYYY-MM-DD")].push(Number(element.service_id));
        break;
      }
    }
  }

  // Scheduled departures
  for (const element of skmTrojmiasto.raw.stopTimes) {
    for (const date of dates) {
      if (
        skmTrojmiasto.serviceIds[date.format("YYYY-MM-DD")].find(serviceId => serviceId === Number(element.trip_id)) !== undefined
      ) {
        skmTrojmiasto.departures[date.format("YYYY-MM-DD")][element.stop_id] = [];
      }
    }
  }

  // Cleaning the table
  db.prepare(`DELETE FROM skmTrojmiastoDepartures`).run();
  
  for (const element of skmTrojmiasto.raw.stopTimes) {
    if (element.departure_time.slice(0, 2) == "24") {
      element.departure_time = "00" + element.departure_time.slice(2);
    } else if (element.departure_time.slice(0, 2) == "25") {
      element.departure_time = "01" + element.departure_time.slice(2);
    } else if (element.departure_time.slice(0, 2) == "26") {
      element.departure_time = "02" + element.departure_time.slice(2);
    } else if (element.departure_time.slice(0, 2) == "27") {
      element.departure_time = "03" + element.departure_time.slice(2);
    }

    element.routeId = skmTrojmiasto.raw.trips.find(t => t.trip_id === element.trip_id)?.route_id;
    element.routeShortName = skmTrojmiasto.raw.routes.find(r => r.route_id === element.routeId)?.route_short_name;
    element.headsign = skmTrojmiasto.raw.trips.find(t => t.trip_id === element.trip_id)?.trip_headsign;
    element.backgroundColor = skmTrojmiasto.raw.routes.find(r => r.route_id === element.routeId)?.route_color;
    element.color = skmTrojmiasto.raw.routes.find(r => r.route_id === element.routeId)?.route_text_color;

    for (const date of dates) {
      if (
        skmTrojmiasto.serviceIds[date.format("YYYY-MM-DD")].find(
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
      for (const trip of skmTrojmiasto.departures[date.format("YYYY-MM-DD")][key]) {
        db.prepare(`INSERT INTO skmTrojmiastoDepartures (Date, StopId, RouteName, RouteType, Headsign, Provider, RouteId, TripId, Color, Status, TheoreticalTime, EstimatedTime, StopSequence)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(date.format("YYYY-MM-DD"), Number(key), trip.routeName, trip.routeType, trip.headsign, trip.provider, Number(trip.routeId), Number(trip.tripId), JSON.stringify(trip.color), trip.status, trip.theoreticalTime, trip.estimatedTime, trip.stopSequence)
      }
    }
  }

  console.log("•")
  console.log("SKM Trojmiasto departures have been loaded")
  // saveObjToFile(skmTrojmiasto.departures, "jsons/Output/skmTrojmiastoDepartures.json");
  // sendTelegramMessage("SKM Trojmiasto departures have been loaded")
}

async function loadPolRegio() {
  console.log("•");
  console.log("Loading PolRegio...");

  // Current date | .format('YYYY-MM-DD HH:mm:ss Z')
  const dateNow = moment().tz("Europe/Warsaw");
  const dateNextDay = moment().tz("Europe/Warsaw").add(1, "days");
  const dates = [dateNow, dateNextDay];

  // Object
  const polRegio = {
    raw: {
      calendarDates: [],
      stopTimes: [],
      trips: [],
      routes: []
    },
    serviceIds: {},
    departures: {}
  };

  for (const date of dates) {
    polRegio.departures[date.format("YYYY-MM-DD")] = {};
    polRegio.serviceIds[date.format("YYYY-MM-DD")] = [];
  }
  
  // Loading data
  try {
    await importGtfs(configPolRegio);
    const dbPolRegio = openDb(configPolRegio);
    polRegio.raw.routes = getRoutes({}, [], [], { db: dbPolRegio });
    polRegio.raw.trips = getTrips({}, [], [], { db: dbPolRegio });
    polRegio.raw.calendarDates = getCalendarDates({}, [], [], { db: dbPolRegio });
    polRegio.raw.stopTimes = getStoptimes({}, [], [], { db: dbPolRegio });
    closeDb(dbPolRegio)
  } catch (err) {
    console.log(err.message);
    sendTelegramMessage(err.message);
    return;
  }

  // PolRegio
    
  // ServiceIds
  for (const element of polRegio.raw.calendarDates) {
    for (const date of dates) {
      if (element.date.toString() === date.format("YYYYMMDD")) {
        polRegio.serviceIds[date.format("YYYY-MM-DD")].push(Number(element.service_id));
        break;
      }
    }
  }

  // Scheduled departures
  for (const element of polRegio.raw.stopTimes) {
    for (const date of dates) {
      if (
        polRegio.serviceIds[date.format("YYYY-MM-DD")].find(serviceId => serviceId === Number(element.trip_id)) !== undefined
      ) {
        polRegio.departures[date.format("YYYY-MM-DD")][element.stop_id] = [];
      }
    }
  }

  // Cleaning the table
  db.prepare(`DELETE FROM polRegioDepartures`).run();

  for (const element of polRegio.raw.stopTimes) {
    if (element.departure_time.slice(0, 2) == "24") {
      element.departure_time = "00" + element.departure_time.slice(2);
    } else if (element.departure_time.slice(0, 2) == "25") {
      element.departure_time = "01" + element.departure_time.slice(2);
    } else if (element.departure_time.slice(0, 2) == "26") {
      element.departure_time = "02" + element.departure_time.slice(2);
    } else if (element.departure_time.slice(0, 2) == "27") {
      element.departure_time = "03" + element.departure_time.slice(2);
    }

    element.routeId = polRegio.raw.trips.find(t => t.trip_id === element.trip_id)?.route_id;
    element.routeShortName = polRegio.raw.routes.find(r => r.route_id === element.routeId)?.route_short_name;
    element.headsign = polRegio.raw.trips.find(t => t.trip_id === element.trip_id)?.trip_headsign;
    element.backgroundColor = polRegio.raw.routes.find(r => r.route_id === element.routeId)?.route_color;
    element.color = polRegio.raw.routes.find(r => r.route_id === element.routeId)?.route_text_color;

    for (const date of dates) {
      if (
        polRegio.serviceIds[date.format("YYYY-MM-DD")].find(
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
      for (const trip of polRegio.departures[date.format("YYYY-MM-DD")][key]) {
        db.prepare(`INSERT INTO polRegioDepartures (Date, StopId, RouteName, RouteType, Headsign, Provider, RouteId, TripId, Color, Status, TheoreticalTime, EstimatedTime, StopSequence)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(date.format("YYYY-MM-DD"), Number(key), trip.routeName, trip.routeType, trip.headsign, trip.provider, Number(trip.routeId), Number(trip.tripId), JSON.stringify(trip.color), trip.status, trip.theoreticalTime, trip.estimatedTime, trip.stopSequence)
      }
    }
  }

  console.log("•")
  console.log("PolRegio departures have been loaded")
  // saveObjToFile(polRegio.departures, "jsons/Output/polRegioDepartures.json");
  // sendTelegramMessage("PolRegio departures have been loaded")
}



async function loadData() {
  if (moment().tz("Europe/Warsaw") - lastDataLoad > 86400000) {

    // Loading data
    console.log("•");
    console.log("Loading data...");

    sendTelegramMessage("Loading data...")
    lastDataLoad = moment().tz("Europe/Warsaw");

    prepareDB();
    await loadStops();
    await loadZTMGdansk();
    await loadZKMGdynia();
    await loadSKMTrojmiasto();
    await loadPolRegio();

    // Setting lastDataLoad
    lastDataLoad = moment()
      .tz("Europe/Warsaw")
      .set({ hour: 4, minute: 0, second: 0, millisecond: 0 });
    
    console.log("•");
    console.log("Data loaded successfully!");

    sendTelegramMessage("Data loaded successfully!");

    return

    // Current date | .format('YYYY-MM-DD HH:mm:ss Z')
    const dateNow = moment().tz("Europe/Warsaw");
    const dateNextDay = moment().tz("Europe/Warsaw").add(1, "days");
    const dates = [dateNow, dateNextDay];

    const currentStop = {
      polRegio: {
        stopId: 260711
      }
    }
    const departuresAll = []

    for (const date of dates) {
      if(
        currentStop.skmTrojmiasto
      ) {
        for (const row of db.prepare(`SELECT RouteName as routeName,
          RouteType as routeType,
          Headsign as headsign,
          Provider as provider,
          RouteId as routeId,
          TripId as tripId,
          Color as color,
          Status as status,
          TheoreticalTime as theoreticalTime,
          EstimatedTime as estimatedTime,
          StopSequence as stopSequence
        FROM skmTrojmiastoDepartures
        WHERE
          StopId = '${currentStop.skmTrojmiasto.stopId}'
          AND Date = '${date.format("YYYY-MM-DD")}'`).iterate()) {
          departuresAll.push(
            {
              routeName: row.routeName,
              routeType: row.routeType,
              provider: row.provider,
              routeId: row.routeId,
              tripId: row.tripId,
              color: JSON.parse(row.color),
              status: row.status,
              theoreticalTime: row.theoreticalTime,
              estimatedTime: row.estimatedTime,
              headsign: row.headsign,
              stopSequence: row.stopSequence
            }
          )
        }
      }

      if (currentStop.polRegio) {
        for (const row of db.prepare(`SELECT RouteName as routeName,
          RouteType as routeType,
          Headsign as headsign,
          Provider as provider,
          RouteId as routeId,
          TripId as tripId,
          Color as color,
          Status as status,
          TheoreticalTime as theoreticalTime,
          EstimatedTime as estimatedTime,
          StopSequence as stopSequence
        FROM polRegioDepartures
        WHERE
          StopId = '${currentStop.polRegio.stopId}'
          AND Date = '${date.format("YYYY-MM-DD")}'`).iterate()) {
          departuresAll.push(
            {
              routeName: row.routeName,
              routeType: row.routeType,
              provider: row.provider,
              routeId: row.routeId,
              tripId: row.tripId,
              color: JSON.parse(row.color),
              status: row.status,
              theoreticalTime: row.theoreticalTime,
              estimatedTime: row.estimatedTime,
              headsign: row.headsign,
              stopSequence: row.stopSequence
            }
          )
        }
      }
    }

    departuresAll.sort(
      (a, b) => moment(a.theoreticalTime) - moment(b.theoreticalTime)
    );

    saveObjToFile(departuresAll)

    return

    // Objects
    // const pkpIntercityLoad = {
    //   raw: {},
    //   serviceIds: {}
    // };

    // for (const date of dates) {
      // pkpIntercity.departures[date.format("YYYY-MM-DD")] = {};
      // pkpIntercityLoad.serviceIds[date.format("YYYY-MM-DD")] = [];
    // }

    // Trains

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
    /*saveObjToFile(pkpIntercityLoad.raw.stops, "jsons/PKPIntercity/stops.json");
    saveObjToFile(pkpIntercityLoad.raw.routes, "jsons/PKPIntercity/routes.json");
    saveObjToFile(pkpIntercityLoad.raw.trips, "jsons/PKPIntercity/trips.json");
    saveObjToFile(pkpIntercityLoad.raw.calendarDates, "jsons/PKPIntercity/calendarDates.json");
    saveObjToFile(pkpIntercityLoad.raw.stopTimes, "jsons/PKPIntercity/stopTimes.json");*/

    

    // Scheduled departures

    // Trains

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

  } else {
    const keep_from_sleep = await fetch(
      PROXY_URL + "/dev/bruh"
    );
    // console.log(await keep_from_sleep.json());
    // console.log("Nah");
  }
}

loadData();
const interval = setInterval(() => loadData(), 120000);

setTimeout(() => {
  return
  const zrodloMarii01 = {
    stopName: "Źródło Marii 01",
    location: {
      lat: 54.469844,
      lng: 18.4971773
    },
    zoneName: "Gdynia",
    stopType: "bus",
    providers: [
      {
        stopProvider: "ZKM Gdynia",
        stopId: 33180
      }
    ]
  }
  const dworzecGlowny11 = {
    stopName: "Dworzec Główny 11",
    location: {
      lat: 54.35518,
      lng: 18.64582
    },
    zoneName: "Gdańsk",
    stopType: "bus",
    providers: [
      {
        stopProvider: "ZTM Gdańsk",
        stopId: 1020
      }
    ]
  }
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
    body: JSON.stringify(zrodloMarii01),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data)
      saveObjToFile(data)
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

  // Processing departures
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
      // if (
      //   currentStop.skmTrojmiasto &&
      //   skmTrojmiasto.departures[date.format("YYYY-MM-DD")] &&
      //   skmTrojmiasto.departures[date.format("YYYY-MM-DD")][currentStop.skmTrojmiasto.stopId]
      // ) {
      //   departuresAll.push(...skmTrojmiasto.departures[date.format("YYYY-MM-DD")][currentStop.skmTrojmiasto.stopId]);
      // }
      if (currentStop.skmTrojmiasto) {
        for (const row of db.prepare(`SELECT RouteName as routeName,
          RouteType as routeType,
          Headsign as headsign,
          Provider as provider,
          RouteId as routeId,
          TripId as tripId,
          Color as color,
          Status as status,
          TheoreticalTime as theoreticalTime,
          EstimatedTime as estimatedTime,
          StopSequence as stopSequence
        FROM skmTrojmiastoDepartures
        WHERE
          StopId = '${currentStop.skmTrojmiasto.stopId}'
          AND Date = '${date.format("YYYY-MM-DD")}'`).iterate()) {
          departuresAll.push(
            {
              routeName: row.routeName,
              routeType: row.routeType,
              provider: row.provider,
              routeId: row.routeId,
              tripId: row.tripId,
              color: JSON.parse(row.color),
              status: row.status,
              theoreticalTime: row.theoreticalTime,
              estimatedTime: row.estimatedTime,
              headsign: row.headsign,
              stopSequence: row.stopSequence
            }
          )
        }
      }

      // if (
      //   currentStop.polRegio &&
      //   polRegio.departures[date.format("YYYY-MM-DD")] &&
      //   polRegio.departures[date.format("YYYY-MM-DD")][currentStop.polRegio.stopId]
      // ) {
      //   departuresAll.push(...polRegio.departures[date.format("YYYY-MM-DD")][currentStop.polRegio.stopId]);
      // }
      if (currentStop.polRegio) {
        for (const row of db.prepare(`SELECT RouteName as routeName,
          RouteType as routeType,
          Headsign as headsign,
          Provider as provider,
          RouteId as routeId,
          TripId as tripId,
          Color as color,
          Status as status,
          TheoreticalTime as theoreticalTime,
          EstimatedTime as estimatedTime,
          StopSequence as stopSequence
        FROM polRegioDepartures
        WHERE
          StopId = '${currentStop.polRegio.stopId}'
          AND Date = '${date.format("YYYY-MM-DD")}'`).iterate()) {
          departuresAll.push(
            {
              routeName: row.routeName,
              routeType: row.routeType,
              provider: row.provider,
              routeId: row.routeId,
              tripId: row.tripId,
              color: JSON.parse(row.color),
              status: row.status,
              theoreticalTime: row.theoreticalTime,
              estimatedTime: row.estimatedTime,
              headsign: row.headsign,
              stopSequence: row.stopSequence
            }
          )
        }
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

          // if (!(ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")] && ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId])) {
          //   continue
          // }
          if (!(db.prepare(`SELECT RouteName FROM ztmGdanskDepartures
            WHERE Date = '${theoreticalTime.format("YYYY-MM-DD")}' AND StopId = ${currentStop.ztmGdansk.stopId}`)
            .get())) {
            console.log("Skipping")
            continue
          }
          if (!(db.prepare(
            `SELECT RouteName FROM ztmGdanskDepartures
            WHERE TheoreticalTime = '${theoreticalTime.format("YYYY-MM-DDTHH:mm:ssZ")}'
            AND StopId = ${currentStop.ztmGdansk.stopId}`
          ).get())) {
            console.log("Skipping")
            sendTelegramMessage("Failed to update estimatedTime!")
            sendTelegramMessage(JSON.stringify(element, null, 2))
            continue
          }

          // const comparedTripp = ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId].find(
          //   (t) =>
          //     moment(t.theoreticalTime).tz("Europe/Warsaw").format("HH:mm:ss") ===
          //       theoreticalTime.format("HH:mm:ss") &&
          //     t.tripId === element.tripId &&
          //     t.routeId === element.routeId
          // );
          /*const comparedTrip = db.prepare(
            `SELECT *
            FROM ztmGdanskDepartures
            WHERE TheoreticalTime = '${theoreticalTime.format("YYYY-MM-DDTHH:mm:ssZ")}'
            AND StopId = ${currentStop.ztmGdansk.stopId}
            AND TripId = ${element.tripId}
            AND RouteId = ${element.routeId}`
          ).get()
          if (!comparedTrip) {
            continue;
          }

          const comparedTripIndex =
            ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId].indexOf(comparedTrip);

          ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId][comparedTripIndex].status = "REALTIME";
          ztmGdansk.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId][comparedTripIndex].estimatedTime =
            `${estimatedTime.format("YYYY-MM-DD")}T${estimatedTime.format("HH:mm:ss")}${estimatedTime.format("Z")}`;*/
          
          db.prepare(
            `UPDATE ztmGdanskDepartures
            SET Status = 'REALTIME',
                EstimatedTime = '${estimatedTime.format("YYYY-MM-DDTHH:mm:ssZ")}'
            WHERE
                TheoreticalTime = '${theoreticalTime.format("YYYY-MM-DDTHH:mm:ssZ")}'
            AND StopId = ${currentStop.ztmGdansk.stopId}
            AND TripId = ${element.tripId}
            AND RouteId = ${element.routeId}`
          ).run()
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

          // if (!(zkmGdynia.departures[theoreticalTime.format("YYYY-MM-DD")] && zkmGdynia.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId])) {
          //   continue
          // }
          if (!(db.prepare(`SELECT RouteName FROM zkmGdyniaDepartures
            WHERE Date = '${theoreticalTime.format("YYYY-MM-DD")}' AND StopId = ${currentStop.zkmGdynia.stopId}`)
            .get())) {
            continue
          }
          if (!(db.prepare(
            `SELECT RouteName FROM zkmGdyniaDepartures
            WHERE TheoreticalTime = '${theoreticalTime.format("YYYY-MM-DDTHH:mm:ssZ")}'
            AND StopId = ${currentStop.zkmGdynia.stopId}`)
            .get())) {
            sendTelegramMessage("Failed to update estimatedTime!")
            sendTelegramMessage(JSON.stringify(element, null, 2))
            continue
          }

          /*const comparedTrip = zkmGdynia.departures[theoreticalTime.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId].find(
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
            `${estimatedTime.format("YYYY-MM-DD")}T${estimatedTime.format("HH:mm:ss")}${estimatedTime.format("Z")}`;*/
          
          db.prepare(
            `UPDATE zkmGdyniaDepartures
            SET Status = 'REALTIME',
                EstimatedTime = '${estimatedTime.format("YYYY-MM-DDTHH:mm:ssZ")}'
            WHERE
                TheoreticalTime = '${theoreticalTime.format("YYYY-MM-DDTHH:mm:ssZ")}'
            AND StopId = ${currentStop.zkmGdynia.stopId}
            AND RouteId = ${element.routeId}`
          ).run()
        }
      }
    }

    // Combining data from all providers
    for (const date of dates) {

      // if (
      //   currentStop.ztmGdansk &&
      //   ztmGdansk.departures[date.format("YYYY-MM-DD")] &&
      //   ztmGdansk.departures[date.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId]
      // ) {
      //   departuresAll.push(...ztmGdansk.departures[date.format("YYYY-MM-DD")][currentStop.ztmGdansk.stopId]);
      // }
      if (currentStop.ztmGdansk) {
        for (const row of db.prepare(`SELECT RouteName as routeName,
          RouteType as routeType,
          Headsign as headsign,
          Provider as provider,
          RouteId as routeId,
          TripId as tripId,
          Status as status,
          TheoreticalTime as theoreticalTime,
          EstimatedTime as estimatedTime,
          StopSequence as stopSequence
        FROM ztmGdanskDepartures
        WHERE
          StopId = ${currentStop.ztmGdansk.stopId}
          AND Date = '${date.format("YYYY-MM-DD")}'`).iterate()) {
          departuresAll.push(
            {
              routeName: row.routeName,
              routeType: row.routeType,
              provider: row.provider,
              routeId: row.routeId,
              tripId: row.tripId,
              status: row.status,
              theoreticalTime: row.theoreticalTime,
              estimatedTime: row.estimatedTime,
              headsign: row.headsign,
              stopSequence: row.stopSequence
            }
          )
        }
      }

      // if (
      //   currentStop.zkmGdynia &&
      //   zkmGdynia.departures[date.format("YYYY-MM-DD")] &&
      //   zkmGdynia.departures[date.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId]
      // ) {
      //   departuresAll.push(...zkmGdynia.departures[date.format("YYYY-MM-DD")][currentStop.zkmGdynia.stopId]);
      // }
      if (currentStop.zkmGdynia) {
        for (const row of db.prepare(`SELECT RouteName as routeName,
          RouteType as routeType,
          Headsign as headsign,
          Provider as provider,
          RouteId as routeId,
          TripId as tripId,
          Status as status,
          TheoreticalTime as theoreticalTime,
          EstimatedTime as estimatedTime,
          StopSequence as stopSequence
        FROM zkmGdyniaDepartures
        WHERE
          StopId = ${currentStop.zkmGdynia.stopId}
          AND Date = '${date.format("YYYY-MM-DD")}'`).iterate()) {
          departuresAll.push(
            {
              routeName: row.routeName,
              routeType: row.routeType,
              provider: row.provider,
              routeId: row.routeId,
              tripId: row.tripId,
              status: row.status,
              theoreticalTime: row.theoreticalTime,
              estimatedTime: row.estimatedTime,
              headsign: row.headsign,
              stopSequence: row.stopSequence
            }
          )
        }
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

  const stops = [];
  for (const row of db.prepare(sqlStops).iterate()) {
    stops.push({
      stopName: row.stopName,
      location: {
        lat: row.lat,
        lng: row.lng
      },
      zoneName: row.zoneName,
      stopType: row.stopType,
      providers: JSON.parse(row.providers)
    })
  }
  /*db.each(sqlStops, (err, row) => {  // WHERE providers LIKE '%ZTM Gdańsk%'
    if (err) {
      console.error(err.message);
    }
    
    stops.push({
      stopName: row.stopName,
      location: {
        lat: row.lat,
        lng: row.lng
      },
      zoneName: row.zoneName,
      stopType: row.stopType,
      providers: JSON.parse(row.providers)
    })
  });*/

  res.json(stops);
});

app.post("/report-stop", async (req, res) => {
  console.log(req.url);
  console.log(req.get("origin"))

  const currentStop = req.body;
  currentStop.departures = {};

  for (const provider of currentStop.providers) {
    if (provider.stopProvider === "ZTM Gdańsk") {
      currentStop.departures.ztmGdansk = await (await fetch(`http://ckan2.multimediagdansk.pl/departures?stopId=${provider.stopId}`)).json();
    } else if (provider.stopProvider === "ZKM Gdynia") {
      currentStop.departures.zkmGdynia = await (await fetch(`http://ckan2.multimediagdansk.pl/departures?stopId=${provider.stopId}`)).json();
    }
  }
  
  sendTelegramMessage(JSON.stringify(currentStop, null, 2))

  res.json({status: "success"})
})

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
  res.json(lastDataLoad.format("YYYY-MM-DDTHH:mm:ssZ"));
})

app.get("/dev/history/stops", async (req, res) => {
  // res.json(JSON.stringify(history.stops, null, 2))
  res.json(history.stops);
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