var inputDate;
/**
 * Event listener for the "DOMContentLoaded" event that retrieves and displays the weather information for College Station.
 * @param {Event} event - The DOMContentLoaded event object.
 */
document.addEventListener("DOMContentLoaded", function () {
  var dateInput = document.getElementById("date-input");

  dateInput.addEventListener("input", function (event) {
    inputDate = event.target.value;
  });

  const weatherDiv = document.getElementById("weather");

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=College Station&appid=744dd002e597c065d1804fa120d67300`
  )
    .then((response) => response.json())
    .then((data) => {
      const temperature = (data.main.temp - 273.15) * 1.8 + 32;
      const roundedTemp = temperature.toFixed(2);
      const description = data.weather[0].description;
      const city = data.name;
      const country = data.sys.country;

      weatherDiv.innerHTML = `The weather in ${city}, ${country} is ${roundedTemp}°F and ${description}.`;
    })
    .catch((error) => {
      console.log(error);
    });
});

/**
 * Function to delete an item from the inventory.
 */
function deleteItem() {
  const selectedValue = parseInt(
    document.getElementById("inventoryitems-dropdown").value,
    10
  );
  const query = `DELETE FROM inventory WHERE invid = ${selectedValue}`;

  fetch(`/orderquery?query=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data 
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * Function to edit an item in the inventory.
 */
function editItem() {
  if(selectedValue == "ADD" || selectedValue == "ADD"){
    return;
  }
  const selectedValue = parseInt(
    document.getElementById("inventoryitems-dropdown").value,
    10
  ); 
  const itemNameInput = document.getElementById("inventory-itemname");
  const costPerInput = document.getElementById("inventory-costper");
  const numItemsInput = document.getElementById("inventory-numitems");

  const query = `UPDATE inventory SET 
                  itemname = '${itemNameInput.value}', 
                  costper = ${parseFloat(costPerInput.value)}, 
                  numitems = ${parseInt(numItemsInput.value, 10)}
                WHERE invid = ${selectedValue}`;

  fetch(`/orderquery?query=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data 
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


/**
 * Function to add a new item to the inventory.
 */
function addItem() {
  const selectedValue =  document.getElementById("inventoryitems-dropdown").value 
  if(selectedValue != "ADD"){
    return;
  }
  let newID;

const query1 = `SELECT MAX(invid) FROM inventory`;

fetch(`/orderquery?query=${encodeURIComponent(query1)}`)
  .then((response) => response.json())
  .then((data) => { 
    newID = data[0].max;

    const itemNameInput = document.getElementById("inventory-itemname");
    const costPerInput = document.getElementById("inventory-costper");
    const numItemsInput = document.getElementById("inventory-numitems");

    const query2 = `INSERT INTO inventory (invid, numitems, costper, itemname) 
                    VALUES (${newID + 1}, '${numItemsInput.value}', ${parseFloat(costPerInput.value)}, 
                    '${itemNameInput.value}')`;

    fetch(`/orderquery?query=${encodeURIComponent(query2)}`)
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data 
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}

/**
 * Function to delete a menu item.
 */
function deleteMenu() {
  const selectedValue = parseInt(
    document.getElementById("menuitems-dropdown").value,
    10
  );
  const query = `DELETE FROM menu WHERE menuid = ${selectedValue}`;

  fetch(`/orderquery?query=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data 
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * Function to edit a menu item.
 */
function editMenu() {
  const selectedValue = parseInt(
    document.getElementById("menuitems-dropdown").value,
    10
  ); 
  const itemNameInput = document.getElementById("menu-itemname");
  const itemPriceInput = document.getElementById("menu-itemprice");
  const invListInput = document.getElementById("menu-invlist");
  const picsInput = document.getElementById("menu-pics");
  const categoryInput = document.getElementById("menu-category");

  const query = `UPDATE menu SET  
                  itemname = '${itemNameInput.value}', 
                  itemprice = ${parseFloat(itemPriceInput.value)}, 
                  invlist = '${invListInput.value}', 
                  pics = '${picsInput.value}', 
                  category = '${categoryInput.value}'
                WHERE menuid = ${selectedValue}`;

  fetch(`/orderquery?query=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data 
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


/**
 * Function to edit a menu item.
 */
function addMenu() {
  const selectedValue =  document.getElementById("menuitems-dropdown").value 
  if(selectedValue != "ADD"){
    return;
  }
  let newID;

const query1 = `SELECT MAX(menuid) FROM MENU`;

fetch(`/orderquery?query=${encodeURIComponent(query1)}`)
  .then((response) => response.json())
  .then((data) => { 
    newID = data[0].max;

    const itemNameInput = document.getElementById("menu-itemname");
    const itemPriceInput = document.getElementById("menu-itemprice");
    const invListInput = document.getElementById("menu-invlist");
    const picsInput = document.getElementById("menu-pics");
    const categoryInput = document.getElementById("menu-category");

    const query2 = `INSERT INTO menu (menuid, itemname, itemprice, invlist, pics, category) 
                    VALUES (${newID + 1}, '${itemNameInput.value}', ${parseFloat(itemPriceInput.value)}, 
                    '${invListInput.value}', '${picsInput.value}', '${categoryInput.value}')`;

    fetch(`/orderquery?query=${encodeURIComponent(query2)}`)
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data 
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

}


/**
 * Function to run a report based on the selected option.
 */
function runReport() {
  var dropdown = document.getElementById("report-dropdown");
  var selectedValue = dropdown.value;

  if (selectedValue == "option0") {
  } else if (selectedValue == "option1") {
    generateXReport();
  } else if (selectedValue == "option2") {
    generateZReport();
  } else if (selectedValue == "option3") {
    generateRestockReport();
  } else if (selectedValue == "option4") {
    generateExcessReport();
  }
}


/**
 * Function to generate an X Report.
 */
function generateXReport() {
  let salesOrderList = "";
  let count = 0;
  let salesAmount = 0.0;
  let itemQuantities = new Map();

  let currentDate = new Date();
  let formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");

  let startDate = currentDate.toISOString().slice(0, 10);

  try {
    const query = encodeURIComponent(
      `SELECT orderlist, orderprice FROM orders WHERE ordertime >= '${startDate}' AND ordertime < '${formattedDate}'`
    );
    fetch(`/orderquery?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        for (let result of data) {
          salesOrderList = result.orderlist;
          salesAmount += parseFloat(result.orderprice);
          let items = salesOrderList.split(",");
          count++;
          for (let item of items) {
            let quantity = itemQuantities.get(item) || 0;
            itemQuantities.set(item, quantity + 1);
          }
        }

        // Generate x report
        let reportOutput = document
          .getElementById("output-report")
          .querySelector("p");
        let curr = "X Report (Ran At Time: " + formattedDate + "): <br>";
        curr = curr + "-------------------------------------------------- <br>";
        curr = curr + "# of Orders Up to now: " + count + "<br>";
        curr = curr + "-------------------------------------------------- <br>";

        // Fetch menu items for each item in the report
        let promises = [];
        for (let [item, quantity] of itemQuantities) {
          const menuQuery = encodeURIComponent(
            `SELECT itemname FROM menu WHERE menuid = ${item}`
          );
          let promise = fetch(`/orderquery?query=${menuQuery}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.length > 0) {
                const itemName = data[0].itemname;
                curr = curr + itemName + ": " + quantity + "<br>";
                return itemName;
              }
            });
          promises.push(promise);
        }

        // Update the report output with the menu item names
        Promise.all(promises).then(() => {
          let roundedNum = salesAmount.toFixed(2);
          reportOutput.innerHTML =
            curr.replace(/\n/g, "<br>") +
            "<br><br> Total Sales: " +
            roundedNum +
            "<br>";
        });
      });
  } catch (d) {
    console.error(d);
  }
}

/**
 * Function to generate a Z Report.
 */
function generateZReport() {
  let salesOrderList = "";
  let count = 0;
  let salesAmount = 0.0;
  let itemQuantities = {};

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  const sqlStatement = `SELECT * from orders WHERE ordertime >= '${formattedDate}'`;

  const query = encodeURIComponent(sqlStatement);

  fetch(`/orderquery?query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const fetchPromises = [];

      for (const result of data) {
        salesOrderList = result.orderlist;
        salesAmount += parseFloat(result.orderprice);
        const items = salesOrderList.split(",");
        count++;
        for (const item of items) {
          const quantity = itemQuantities[item] || 0;
          itemQuantities[item] = quantity + 1;
        }
      }

      // Generate report
      let reportOutput = document
        .getElementById("output-report")
        .querySelector("p");
      let curr = "Z Report(" + formattedDate + ")\n";
      curr += "-------------------------------------------------- \n";
      curr += "# of Orders Today: " + count + "\n";
      curr += "-------------------------------------------------- \n";

      // Iterate over entries in hash map
      for (const [item, quantity] of Object.entries(itemQuantities)) {
        try {
          const query = encodeURIComponent(
            `SELECT itemname FROM menu WHERE menuid = ${item}`
          );
          const fetchPromise = fetch(`/orderquery?query=${query}`)
            .then((response) => response.json())
            .then((data) => {
              const itemName = data[0].itemname; // Access the correct property name in the response
              curr += itemName + ": " + quantity + "\n";
            })
            .catch((error) => {
              console.error(error);
            });

          fetchPromises.push(fetchPromise);
        } catch (d) {
          d.printStackTrace();
          console.error(d.constructor.name + ": " + d.message);
        }
      }

      Promise.all(fetchPromises)
        .then(() => {
          const df = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
          });
          const roundedNum = parseFloat(df.format(salesAmount));
          reportOutput.innerHTML =
            curr.replace(/\n/g, "<br>") +
            "<br><br> Total Sales: " +
            roundedNum +
            "<br>";
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * Function to generate a restock report.
 */
function generateRestockReport() {
  let reportOutput = document
    .getElementById("output-report")
    .querySelector("p");

  reportOutput.innerText = "Items with stock below 100: \n \n";

  const query =
    "SELECT itemname, numitems FROM inventory WHERE numitems <= 100";
  const fetchPromise = fetch(`/orderquery?query=${query}`);

  fetchPromise
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const itemName = item.itemname;
        const numItems = item.numitems;
        const curr = reportOutput.innerText;
        reportOutput.innerText =
          curr + itemName + ": " + numItems + " remaining \n";
      });
    })
    .catch((error) => {
      console.error(error);
      console.error(error.name + ": " + error.message);
    });
}
/////////////////////////////////
/**
 * Function to generate an excess report based on a specific date.
 */
function generateExcessReport() {
  let reportOutput = document
    .getElementById("output-report")
    .querySelector("p");
  reportOutput.innerHTML = "";

  const sqlStatement = `SELECT orderlist FROM orders WHERE ordertime >= '${inputDate}'`;
  const query = encodeURIComponent(sqlStatement);
  fetch(`/orderquery?query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      let excessOrderList = "";
      let orderList = [];
      let invListVec = [];
      let inventoryCurr = {};
      let inventoryBefore = {};

      for (const result of data) {
        excessOrderList = result.orderlist;
        const items = excessOrderList.split(",");
        orderList.push(...items);
      }
      fetch(
        `/orderquery?query=${encodeURIComponent(`SELECT * FROM inventory`)}`
      )
        .then((response) => response.json())
        .then((inventoryData) => {
          for (const inventoryResult of inventoryData) {
            const currInv = inventoryResult.invid;
            const numItems = inventoryResult.numitems;
            inventoryCurr[currInv] = numItems;
          }

          const invListPromises = orderList.map((menuItem) =>
            fetch(
              `/orderquery?query=${encodeURIComponent(
                `SELECT invlist FROM menu WHERE menuid = ${menuItem}`
              )}`
            ).then((response) => response.json())
          );

          Promise.all(invListPromises)
            .then((invListData) => {
              for (const result of invListData) {
                const currInv = result[0]?.invlist; // Add a check for undefined
                if (currInv) {
                  const items = currInv.split(",");
                  invListVec.push(...items);
                }
              }

              for (const key in inventoryCurr) {
                inventoryBefore[key] = inventoryCurr[key];
              }

              for (const x of invListVec) {
                const quantity = inventoryBefore[x] || 0;
                if (quantity !== 0) {
                  inventoryBefore[x] = quantity + 1;
                }
              }

              for (const key in inventoryCurr) {
                let currName = "";
                const valBefore = inventoryBefore[key];
                const valCurr = inventoryCurr[key];

                const diff = valBefore - valCurr;
                const diffPercentage = (diff / valBefore) * 100;

                if (diffPercentage < 10) {
                  fetch(
                    `/orderquery?query=${encodeURIComponent(
                      `SELECT itemname FROM inventory WHERE invid = ${key}`
                    )}`
                  )
                    .then((response) => response.json())
                    .then((result) => {
                      currName = result[0].itemname;
                      const formattedDiffPercentage = diffPercentage.toFixed(2);
                      reportOutput.innerHTML += `${currName}: ${formattedDiffPercentage}%<br>`;
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              }
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}
