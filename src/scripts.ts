// XLSX is a global from the standalone script
import * as XLSX from "xlsx"

interface ToOrderList  {
  // Supplier Code => Product Name => Variation => Quantity
  [key: string]: { [key: string]: { [key: string]: number } }
}

export interface ToOrderListSimple {
  // Supplier Code => Product List (includes formattings\n) free form text
  [key: string]: string
}

const simplifyToOrderList = (toOrderList: ToOrderList) => {
  const simplifiedToOrderList: ToOrderListSimple = {}

  for (let supplierCode in toOrderList) {
    let temporaryValue = "";
    const toOrderListItem = toOrderList[supplierCode];
    for (let productName in toOrderList[supplierCode]) {
      temporaryValue += `${productName
        .match(/^[a-zA-Z0-9\s-]+/)?.[0]
        .toUpperCase()}\n`;
        for (let variation in toOrderListItem[productName]) {
          temporaryValue += `${toOrderListItem[productName][variation]} ${variation} \n`;
        }
        temporaryValue += "\n";
      }
      simplifiedToOrderList[supplierCode] = temporaryValue;
    }

    return simplifiedToOrderList
}


export const generateToOrdersList = async (daysToShipFile: File, bigSellerOrdersFile: File): Promise<ToOrderListSimple> => {
  const daysToShipWorkbook = XLSX.read(await daysToShipFile?.arrayBuffer());

  // Assuming the first sheet is the one you want to read
  const daysToShipSheetName = daysToShipWorkbook.SheetNames[0];
  const daysToShipWorksheet = daysToShipWorkbook.Sheets[daysToShipSheetName];

  // Convert Excel data to Array
  const daysToShipRows = XLSX.utils.sheet_to_json(daysToShipWorksheet, {
    header: 1,
  });

  // Run a loop for the rows
  const daysToShipStartingRow: number = 7;
  const preOrderProducts: { [key: string]: any } = {};
  for (
    let rowIndex = daysToShipStartingRow - 1;
    rowIndex < daysToShipRows.length;
    rowIndex++
  ) {
    const row: string[] = daysToShipRows[rowIndex];

    const productName: string = row[2];
    const parentSKU: string = row[1];
    const daysToShip: number = parseInt(row[6]);

    if (daysToShip > 2) {
      preOrderProducts[productName] = parentSKU;
    }
  }

  const bigSellerOrdersWorkbook = XLSX.read(
    await bigSellerOrdersFile?.arrayBuffer()
  );

  const bigSellerOrdersSheetName = bigSellerOrdersWorkbook.SheetNames[0];
  const bigSellerOrdersWorkSheet =
    bigSellerOrdersWorkbook.Sheets[bigSellerOrdersSheetName];

  const bigSellerOrdersRows = XLSX.utils.sheet_to_json(
    bigSellerOrdersWorkSheet,
    {
      header: 1,
    }
  );

  const startingRow = 2;
  // This (toOrderList) will be a mapping of the products needed to be ordered.
  // Mapping toOrderlist -> SupplierCode/ParentSKU -> Product Name -> Variation -> Quantity
  const toOrderList: ToOrderList = {};



  for (
    let rowIndex = startingRow - 1;
    rowIndex < bigSellerOrdersRows.length;
    rowIndex++
  ) {
    const row = bigSellerOrdersRows[rowIndex];

    const productName: string = row[0];
    const sku: string = row[1];
    const variationName: string = row[2];
    const quantity: number = parseInt(row[3]);

    if (productName in preOrderProducts) {
      const supplierCode: string = preOrderProducts[productName];

      // Set default to empty object
      toOrderList[supplierCode] ??= {};

      // Set default to empty object
      toOrderList[supplierCode][productName] ??= {};

      // Set default to 0
      toOrderList[supplierCode][productName][variationName] ??= 0;

      // Increase the quantity we need to order for this product
      toOrderList[supplierCode][productName][variationName] += quantity;
      console.log(toOrderList);
    }
  }

  return simplifyToOrderList(toOrderList);
}


