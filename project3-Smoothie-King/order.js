currOrder = [];
currOrderId = null;

/**
 * Handles the click event for an item.
 * Appends the item ID to the textarea element's value and adds the item ID to the current order array.
 * @param {string} itemId - The ID of the clicked item.
 */
function handleClick(itemId) {
  // Get the input element by its ID
  var textArea = document.getElementsByTagName("textarea")[0];

  // Change the value of the text area element to display the item name
  textArea.value += itemId + "\n";
  lastClicked = itemId;
  currOrder.push(itemId);
}

/**
 * Handles the delete event.
 * Clears the textarea element's value, removes the last item from the current order array,
 * and updates the textarea value with the remaining items.
 */
function handleDelete() {
  var textArea = document.getElementsByTagName("textarea")[0];
  textArea.value = "";
  currOrder.pop();
  for (var i = 0; i < currOrder.length; i++) {
    textArea.value += currOrder[i] + "\n";
  }
}

/**
 * Handles the order event.
 * Retrieves the menu ID and calculates the total price for each item in the current order.
 * Inserts a new order into the database with the order details and updates the current order array.
 * @returns {Promise<void>} A Promise that resolves when the order is handled.
 */
async function handleOrder() {
  var textArea = document.getElementsByTagName("textarea")[0];

  if (textArea.value == "") {
    return;
  }
  textArea.value = "";
  let totalPrice = 0.0; // initialize the total price
  const promises = currOrder.map((item) => {
    const query = encodeURIComponent(
      `SELECT menuid, itemprice FROM menu WHERE itemname = '${item}'`
    );
    return fetch(`/orderquery?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        const { menuid, itemprice } = data[0];
        totalPrice += Number(itemprice); // add the price to the total
        return menuid; // return the menu ID
      });
  });

  const orderIDs = await Promise.all(promises);
  const orderIDString = orderIDs.join(", "); 
   

  //get largest order id:
  if(currOrderId == null){
    const query2 = encodeURIComponent(
        `SELECT MAX(orderid) as max_orderid FROM orders`
      );
      const response = await fetch(`/orderquery?query=${query2}`);
      const data = await response.json();
      const maxOrderID = data[0].max_orderid;
      currOrderId = maxOrderID + 1;
  }
    
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hour = String(currentDate.getHours()).padStart(2, "0");
  const minute = String(currentDate.getMinutes()).padStart(2, "0");
  const second = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  const query3 = encodeURIComponent(
    "INSERT INTO orders VALUES (" +
      currOrderId +
      ", '" +
      formattedDate +
      "', " +
      1 +
      ", " +
      1 +
      ", '" +
      orderIDString +
      "', " +
      totalPrice +
      ")"
  ); 
  const response = await fetch(`/orderquery?query=${query3}`);

   
  currOrder.splice(0, currOrder.length);
  currOrderId++;
}
