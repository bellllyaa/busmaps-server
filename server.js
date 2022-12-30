// var http = require('http');
// var url = require('url');
// var request = require('request');
// const cors = require('cors')

// http.createServer(onRequest).listen(8080);

// function onRequest(req, res) {

//   var queryData = url.parse(req.url, true).query;
//   if (queryData.url) {
//       request({
//           url: queryData.url
//       }).on('error', function(e) {
//           res.end(e);
//       }).pipe(res);
//   }
//   else {
//       res.end("no url found");
//   }
// }

const express = require("express")
const app = express()
const fetch = require("node-fetch")
const cors = require("cors")

let busStopsStatic;
let trips;
let routes;
let calendarDates;

let lastDataLoad = 0;
let serviceIds;

const PORT = process.env.PORT || 8080

// app.use(cors({
//   origin: 'https://busmaps.pl'
// }));

app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

Date.prototype.yyyymmdd = function(divider) {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();
  if (divider === undefined) {
    divider = "";
  }

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join(divider);
};

const convertToDate = (departureTime, timeNow) => {
  return new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), departureTime.slice(0,2), departureTime.slice(3, 5))
}

async function loadData () {
  if (new Date() - lastDataLoad > 86400000) {
    console.log("Loading data...");

    busStopsStatic = await (await fetch("http://api.zdiz.gdynia.pl/pt/stop_times")).json()
    trips = await (await fetch("http://api.zdiz.gdynia.pl/pt/trips")).json()
    routes = await (await fetch("http://api.zdiz.gdynia.pl/pt/routes")).json()
    calendarDates = await (await fetch("http://api.zdiz.gdynia.pl/pt/calendar_dates")).json()

    if (await busStopsStatic && await trips && await routes && await calendarDates) {
      const timeNow = new Date();
      let timeTomorrow = new Date();
      timeTomorrow.setDate(timeTomorrow.getDate() + 1);

      console.log("Today: " + timeNow.yyyymmdd());
      console.log("Tomorrow: " + timeTomorrow.yyyymmdd());

      for (element in busStopsStatic) {
        busStopsStatic[element].status = "SCHEDULED";

        if (busStopsStatic[element].departureTime.slice(0, 2) == "24") {
          busStopsStatic[element].departureTime = "00" + busStopsStatic[element].departureTime.slice(2, 5)
          // console.log(busStopsStatic[element].departureTime)
        } else if (busStopsStatic[element].departureTime.slice(0, 2) == "25") {
          busStopsStatic[element].departureTime = "01" + busStopsStatic[element].departureTime.slice(2, 5)
          // console.log(busStopsStatic[element].departureTime)
        } else {
          busStopsStatic[element].departureTime = busStopsStatic[element].departureTime.slice(0, 5)
        }
      }
      busStopsStatic.sort((a, b) => (convertToDate(a.departureTime, timeNow) - convertToDate(b.departureTime, timeNow)));

      serviceIds = [[], []];
      for (element in calendarDates) {
        if (calendarDates[element].date === timeNow.yyyymmdd()) {
          // console.log(calendarDates[element]);
          serviceIds[0].push(calendarDates[element].serviceId);
        }
        if (calendarDates[element].date === timeTomorrow.yyyymmdd()) {
          // console.log(calendarDates[element]);
          serviceIds[1].push(calendarDates[element].serviceId);
        }
      }
      
      lastDataLoad = new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(), 4);

      console.log("Data loaded successfully! " + lastDataLoad.yyyymmdd(":") + " " + lastDataLoad.toTimeString().slice(0, 8));
    }
  } else {
    console.log("Nah");
  }
}

loadData();
const interval = setInterval(() => loadData(), 120000);

app.get("/redirect", async (req, res) => {
  // var date = new Date();
  // console.log(date.yyyymmdd());

  if (req.url.slice(10, 13) === "url") {

    console.log("url")
    console.log((req.url.split("/redirect?url="))[1])

    const response = await fetch((req.url.split("/redirect?url="))[1])
    res.json(await response.json())

  }
})

app.get("/trojmiasto", async (req, res) => {
  // var date = new Date();
  // console.log(date.yyyymmdd());

  if (req.url.slice(12, 30) === "bus-stop-id-static") {

    console.log("bus-stop-id-static")

    let busStopStatic = [[], []];
    const timeNow = new Date();
    let timeTomorrow = new Date();
    timeTomorrow.setDate(timeTomorrow.getDate() + 1);

    console.log("Today: " + timeNow.yyyymmdd());
    console.log("Tomorrow: " + timeTomorrow.yyyymmdd());

    const busStopId = Number((req.url.split("/trojmiasto?bus-stop-id-static="))[1])
    console.log(busStopId)

    busStopsStatic.forEach((e) => {
      if (e.stopId == busStopId) {
        if (serviceIds[0].find(serviceId => serviceId === e.tripId) != undefined) {
          e.routeId = trips.find(t => t.tripId === e.tripId)?.routeId;
          e.routeShortName = routes.find(r => r.routeId === e.routeId)?.routeShortName;

          busStopStatic[0].push(e)
        }
        if (serviceIds[1].find(serviceId => serviceId === e.tripId) != undefined) {
          e.routeId = trips.find(t => t.tripId === e.tripId)?.routeId;
          e.routeShortName = routes.find(r => r.routeId === e.routeId)?.routeShortName;

          busStopStatic[1].push(e)
        }
      }
    })

    res.json(busStopStatic);

  } else if (req.url.slice(12, 26) === "bus-stop-table") {
    
    console.log("bus-stop-table")

    // const busStopId = Number((req.url.split("/trojmiasto?bus-stop-table="))[1])
    // console.log(busStopId)

    let busStopTable;

    res.json(serviceIds);

  } else {
    res.json([{"bruh": "bruh"}]);
  }

  console.log()
})

app.get("/bruh", async (req, res) => {
  console.log("bruh");
  res.json([{"bruh": "bruh"}]);
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))