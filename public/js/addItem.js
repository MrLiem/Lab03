const button = document.querySelector("#addProduct");
button.addEventListener("click", (event) => {
  event.preventDefault();

  let id = document.querySelector("#id").value;
  let title = document.querySelector("#title").value;
  let summary = document.querySelector("#summary").value;
  let price = document.querySelector("#price").value;
  let number = document.querySelector("#number").value;

  let item = {
    id,
    title,
    summary,
    price,
    number,
  };

  const addItem = async () => {
    const response = await axios.post("/addItem", item);
    if (response.data.success) {
      // send image
      let formData = new FormData();
      let images = document.querySelector("#images");
      formData.append("image", images.files[0]);
      const response2 = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response2.data.success) {
        location.href = "/admin";
      } else {
        alert(response2.data.message);
      }
    } else {
      alert(response.data.message);
    }
  };

  addItem();
});
