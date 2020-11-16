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

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));
app.set("view engine", "hbs");

app.use("/api/items", require("./controllers/item"));

// route for page
app.get("/admin", (req, res) => {
  res.render("index", { items });
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
  const { id, title, summary, price, number } = req.body;
  if (id) {
    item.id = id;
    item.title = title;
    item.summary = summary;
    item.price = price;
    item.number = number;
    return res.status(200).json({ success: true, item });
  }
  res.json({ success: false, message: "Please type the Id!!!" });
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
app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    item.image = req.file.buffer;
    items.push(item);
    let newItems = JSON.stringify(items);
    fs.writeFileSync("items.json", newItems);
    res.status(200).json({ success: true });
  }
});

//delete item
app.delete("/deleteItem/:id", (req, res) => {
  const itemId = req.params.id;
  let removeIndex = items
    .map((item, key) => {
      return item.id === itemId;
    })
    .indexOf(itemId);
  //remove obj
  items.splice(removeIndex, 1);

  let newItems = JSON.stringify(items);
  fs.writeFileSync("items.json", newItems);
  res.status(200).json({ success: true });
});
app.listen(port, () => {
  console.log(`server listen on port ${port}`);
});
