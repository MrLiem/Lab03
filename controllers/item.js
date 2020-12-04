const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();

// import file define Item object
const Item = require("../models/Item");

// Đọc file data
let rawdata = fs.readFileSync("items.json");
let items = JSON.parse(rawdata);

// khởi tạo instance item
let item = new Item();

// Add Item
router.post("/addItem", (req, res) => {
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

//Middleware Xử lí image user gửi lên
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

//Upload Image
router.post("/uploadNewImage", upload.single("image"), (req, res) => {
  if (req.file) {
    let data = req.file.buffer;
    let buff = Buffer.from(data, "utf-8");
    let base64Data = buff.toString("base64");

    item.image = base64Data;
    items.push(item);
    let newItems = JSON.stringify(items);
    fs.writeFileSync("items.json", newItems);
    item = new Item();
    res.status(200).json({ success: true });
  }
});

//Delete Item
router.delete("/deleteItem/:id", (req, res) => {
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

let updatedItem = new Item();
//Get UpdatedItem data
router.post("/getUpdatedItem", (req, res) => {
  const itemId = req.body.itemId;

  let filterdItem = items.filter((item) => item.id === itemId);
  filterdItem = filterdItem[0];
  // set image cho updatedItem trong th user ko update image
  updatedItem.image = filterdItem.image;
  res.status(200).json({ success: true, item: filterdItem });
});

// Save UpdatedItem
router.put("/saveUpdatedItem", (req, res) => {
  const { id, title, brand, summary, price, number } = req.body;
  updatedItem.id = id;
  updatedItem.title = title;
  updatedItem.brand = brand;
  updatedItem.summary = summary;
  updatedItem.price = price;
  updatedItem.number = number;
  return res.status(200).json({ success: true, item: updatedItem });
});

// Save Updated Image
router.put("/uploadUpdatedImage", upload.single("image"), (req, res) => {
  if (req.file) {
    let data = req.file.buffer;
    let buff = Buffer.from(data, "utf-8");
    let base64Data = buff.toString("base64");

    updatedItem.image = base64Data;
  }
  let newItems = items.filter((item) => item.id !== updatedItem.id);
  newItems.push(updatedItem);
  newItems = JSON.stringify(newItems);
  fs.writeFileSync("items.json", newItems);
  updatedItem = new Item();
  res.status(200).json({ success: true });
});

module.exports = router;
