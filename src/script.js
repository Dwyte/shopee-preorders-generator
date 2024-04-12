// XLSX is a global from the standalone script

const dtsInfoFileInput = document.getElementById("dtsInfoFile");
const newOrdersFileInput = document.getElementById("newOrdersFile");
const outputDiv = document.getElementById("output");

const preOrderProducts = {};
const toOrderList = {};

async function handleDTSInfoFileChangeAsync(e) {
  const file = e.target.files[0];
  const data = await file.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbookDTSInfo = XLSX.read(data);

  // Assuming the first sheet is the one you want to read
  const sheetName = workbookDTSInfo.SheetNames[0];
  const worksheetShopee = workbookDTSInfo.Sheets[sheetName];

  // Convert Excel data to Array
  const dtsInfoRows = XLSX.utils.sheet_to_json(worksheetShopee, {
    header: 1,
  });

  const startingRow = 7;
  for (
    let rowIndex = startingRow - 1;
    rowIndex < dtsInfoRows.length;
    rowIndex++
  ) {
    const row = dtsInfoRows[rowIndex];

    productName = row[2];
    parentSKU = row[1];
    daysToShip = parseInt(row[6]);

    if (daysToShip > 2) {
      preOrderProducts[productName] = parentSKU;
    }
  }

  console.log(preOrderProducts);
}

async function handleNewOrdersFileChangeAsync(e) {
  const file = e.target.files[0];
  const data = await file.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbookNewOrders = XLSX.read(data);

  // Assuming the first sheet is the one you want to read
  const sheetName = workbookNewOrders.SheetNames[0];
  const worksheetShopee = workbookNewOrders.Sheets[sheetName];

  // Convert Excel data to JSON
  const newOrdersArray = XLSX.utils.sheet_to_json(worksheetShopee, {
    header: 1,
  });

  const startingRow = 2;

  for (
    let rowIndex = startingRow - 1;
    rowIndex < newOrdersArray.length;
    rowIndex++
  ) {
    const row = newOrdersArray[rowIndex];

    productName = row[0];
    sku = row[1];
    variationName = row[2];
    quantity = parseInt(row[3]);

    if (productName in preOrderProducts) {
      supplierCode = preOrderProducts[productName];
      toOrderList[supplierCode] ??= {};
      toOrderList[supplierCode][productName] ??= {};
      toOrderList[supplierCode][productName][variationName] ??= 0;
      toOrderList[supplierCode][productName][variationName] += quantity;
    }
  }
}

dtsInfoFileInput.addEventListener(
  "change",
  handleDTSInfoFileChangeAsync,
  false
);

newOrdersFileInput.addEventListener(
  "change",
  handleNewOrdersFileChangeAsync,
  false
);

function cutStringUntilNonAlphaNumeric(inputString) {
  // Use a regular expression to match the portion of the string until the next non-alphanumeric character
  const match = inputString.match(/^[a-zA-Z0-9\s]+/);

  // Check if there is a match
  if (match) {
    // Extract the matched portion
    const matchedSubstring = match[0];

    // Return the matched portion
    return matchedSubstring;
  } else {
    // If there is no match, return an empty string or handle it as needed
    return "";
  }
}

function handleUpload() {
  for (const supplier in toOrderList) {
    let output = "";
    let rows = 5;

    for (const productName in toOrderList[supplier]) {
      output += cutStringUntilNonAlphaNumeric(productName).trim() + "\n";
      rows += 1;
      for (const variationName in toOrderList[supplier][productName]) {
        quantity = toOrderList[supplier][productName][variationName];
        output += quantity + " " + variationName + "\n";
        rows += 1;
      }
      output += "\n";
      rows += 1;
    }

    outputDiv.innerHTML +=
      "<div>" +
      supplier +
      "\n<textarea rows=" +
      rows +
      " cols=50>" +
      output +
      "</textarea></div>";
  }
}
