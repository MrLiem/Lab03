function Item(
  id = null,
  title = null,
  summary = null,
  image = null,
  price = null,
  number = null
) {
  this.id = id;
  this.title = title;
  this.summary = summary;
  this.image = image;
  this.price = price;
  this.number = number;
}

module.exports = Item;
