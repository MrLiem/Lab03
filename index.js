// import thư viện có sẵn
const path = require("path");
const fs = require("fs");
// import thư viện cài đặt thêm
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");

// Khởi chạy express
const app = express();
const port = process.env.PORT || 3000;

// set JSON parse cho request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
hbs.registerHelper("isPositive", (number) => number > 0);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// route for Page
app.get("/", (req, res) => {
  let rawdata = fs.readFileSync("items.json");
  let items = JSON.parse(rawdata);
  res.render("mainPage", { items });
});
app.get("/admin", (req, res) => {
  let rawdata = fs.readFileSync("items.json");
  let items = JSON.parse(rawdata);
  res.render("adminPage", { items });
});

app.get("/addItemPage", (req, res) => {
  res.render("addItemPage");
});

app.get("/updateItemPage", (req, res) => {
  res.render("updateItemPage");
});

// route for request add, update, delete item
app.use("/", require("./controllers/item"));

app.listen(port, () => {
  console.log(`server listen on port ${port}`);
});
