const deleteButtons = document.querySelectorAll("#deleteButton");

for (let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener("click", () => {
    const operateDiv = deleteButtons[i].parentElement;
    const tableRow = operateDiv.parentElement;
    const itemId = tableRow.querySelector(".itemId").innerHTML;
    const deleteItem = async () => {
      const response = await axios.delete(
        `/deleteItem/${itemId}`,
        { itemId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        alert("Delete Ok");
        location.reload();
      } else {
        alert(response.data.message);
      }
    };
    deleteItem();
  });
}
