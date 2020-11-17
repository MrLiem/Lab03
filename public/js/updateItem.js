const editButtons = document.querySelectorAll("#editButton");
for (let i = 0; i < editButtons.length; i++) {
  editButtons[i].addEventListener("click", () => {
    const operateDiv = editButtons[i].parentElement;
    const tableRow = operateDiv.parentElement;
    const itemId = tableRow.querySelector(".itemId").innerHTML;
    console.log(itemId);
    const updateItem = async () => {
      const response = await axios.post("/getUpdatedItem", { itemId });
      if (response.data.success) {
        localStorage.setItem("item", JSON.stringify(response.data.item));
        location.href = "/updateItemPage";
      } else {
        console.log(response.data.message);
      }
    };

    updateItem();
  });
}
