let title = document.querySelector("#title");
let brand = document.querySelector("#brand");
let summary = document.querySelector("#summary");
let price = document.querySelector("#price");
let number = document.querySelector("#number");

window.onload = function () {
  const item = JSON.parse(localStorage.getItem("item"));
  console.log(item);

  title.value = item.title;
  summary.value = item.summary;
  price.value = item.price;
  number.value = item.number;
  brand.value = item.brand;
};

const button = document.querySelector("#saveItemButton");
button.addEventListener("click", (event) => {
  event.preventDefault();
  const item = JSON.parse(localStorage.getItem("item"));
  let updatedItem = {
    id: item.id,
    title: title.value,
    brand: brand.value,
    summary: summary.value,
    price: price.value,
    number: number.value,
  };

  const saveUpdatedITem = async () => {
    if (!title || !summary || !price || !number || !brand) {
      return alert("Please type all the field!!!");
    }

    const response = await axios.put("/saveUpdatedItem", updatedItem);

    if (response.data.success) {
      // send image
      let formData = new FormData();
      let images = document.querySelector("#images");
      formData.append("image", images.files[0]);
      const response2 = await axios.put("/uploadUpdatedImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response2.data.success) {
        alert("upload image Ok");
      } else {
        alert(response2.data.message);
      }
      location.href = "/admin";
    } else {
      alert(response.data.message);
    }
  };
  saveUpdatedITem();
});
