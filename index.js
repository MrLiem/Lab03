// import thư viện có sẵn
const path = require("path");
const fs = require("fs");
// import thư viện cài đặt thêm
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const multer = require("multer");
// import file
const Item = require("./models/item.js");
const { Buffer } = require("buffer");

// Khởi chạy express
const app = express();
const port = 3000;

// Đọc file data
let rawdata = fs.readFileSync("items.json");
let items = JSON.parse(rawdata);

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
app.set("view engine", "hbs");

app.use("/api/items", require("./controllers/item"));

// route for page
app.get("/", (req, res) => {
  res.render("mainPage", { items });
});
app.get("/admin", (req, res) => {
  res.render("adminPage", { items });
});

app.get("/addItemPage", (req, res) => {
  res.render("addItemPage");
});

app.get("/updateItemPage", (req, res) => {
  res.render("updateItemPage");
});

// add Item
let item = new Item();
app.post("/addItem", (req, res) => {
  const { id, title, summary, brand, price, number } = req.body;

  // check item co trung id hay khong
  let filter = items.filter((item) => item.id === id);
  if (filter.length !== 0) {
    return res.json({ success: false, message: "Duplicate Id" });
  }
  item.id = id;
  item.title = title;
  item.brand = brand;
  item.summary = summary;
  item.price = price;
  item.number = number;

  return res.status(200).json({ success: true, item });
});

//Xử lí image user gửi lên
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPEG|JPG)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});
app.post("/uploadNewImage", upload.single("image"), (req, res) => {
  if (req.file) {
    let data = req.file.buffer;
    let buff = Buffer.from(data, "utf-8");
    let base64Data = buff.toString("base64");

    item.image = base64Data;
    items.push(item);
    let newItems = JSON.stringify(items);
    fs.writeFileSync("items.json", newItems);
    res.status(200).json({ success: true });
  }
});

//delete item
app.delete("/deleteItem/:id", (req, res) => {
  const itemId = req.params.id;
  // filter những item có id === itemId
  let newItems = items.filter((item, index) => {
    return item.id !== itemId;
  });

  //write newItems to file
  newItems = JSON.stringify(newItems);
  fs.writeFileSync("items.json", newItems);
  res.status(200).json({ success: true });
});

// update item
let updatedItem = new Item();

app.post("/getUpdatedItem", (req, res) => {
  const itemId = req.body.itemId;

  let filterdItem = items.filter((item) => item.id === itemId);
  filterdItem = filterdItem[0];
  // de chut nua su dung
  updatedItem.image = filterdItem.image;
  res.status(200).json({ success: true, item: filterdItem });
});

app.put("/saveUpdatedItem", (req, res) => {
  const { id, title, brand, summary, price, number } = req.body;
  updatedItem.id = id;
  updatedItem.title = title;
  updatedItem.brand = brand;
  updatedItem.summary = summary;
  updatedItem.price = price;
  updatedItem.number = number;
  return res.status(200).json({ success: true, item: updatedItem });
});
app.put("/uploadUploadedImage", upload.single("image"), (req, res) => {
  if (req.file) {
    updatedItem.image = req.file.buffer;
  }
  let newItems = items.filter((item) => item.id !== updatedItem.id);
  newItems.push(updatedItem);
  newItems = JSON.stringify(newItems);
  fs.writeFileSync("items.json", newItems);
  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`server listen on port ${port}`);
});
