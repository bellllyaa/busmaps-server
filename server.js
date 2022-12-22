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

const PORT = process.env.PORT || 3000

//app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get("/", async (req, res) => {
  console.log((req.url.split("/?url="))[1])
  const response = await fetch((req.url.split("/?url="))[1])
  res.json(await response.json())
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))