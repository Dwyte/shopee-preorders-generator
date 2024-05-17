// XLSX is a global from the standalone script
import * as XLSX from "xlsx";
import {
  GeneratedListMap,
  GeneratedList,
  MasuerteStallColor,
  DTSFileMetadata,
  BigSellerOrdersMetadata,
} from "./types";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const validDaysToShipHeader = [
  "Product ID",
  "Parent SKU",
  "Product Name",
  "Category",
  "Non Pre-order DTS",
  "Pre-order DTS Range",
  "Days to ship",
  "Fail Reason",
];

const validBigSellerOrdersHeader = [
  "Product Name",
  "SKU",
  "Variation Name",
  "Quantity",
  "Order No",
  "Title",
];

const simplifyGeneratedList = (generatedListMap: GeneratedListMap) => {
  const simplifiedGeneratedList: GeneratedList = {};

  for (let supplierCode in generatedListMap) {
    let temporaryValue = "";
    const generatedListItem = generatedListMap[supplierCode];
    for (let productName in generatedListMap[supplierCode]) {
      temporaryValue += `${productName
        .match(/^[a-zA-Z0-9\s-]+/)?.[0]
        .toUpperCase()}\n`;
      for (let variation in generatedListItem[productName]) {
        temporaryValue += `${generatedListItem[productName][variation]} ${variation} \n`;
      }
      temporaryValue += "\n";
    }
    simplifiedGeneratedList[supplierCode] = temporaryValue;
  }

  return simplifiedGeneratedList;
};

export const generateListFromFiles = async (
  daysToShipFiles: File[],
  bigSellerOrdersFiles: File[],
  isNonPreorderIncluded: boolean = false
): Promise<GeneratedList> => {
  const preOrderProducts: { [key: string]: any } = {};

  for (let daysToShipFile of daysToShipFiles) {
    const daysToShipWorkbook = XLSX.read(await daysToShipFile?.arrayBuffer());

    // Assuming the first sheet is the one you want to read
    const daysToShipSheetName = daysToShipWorkbook.SheetNames[0];
    const daysToShipWorksheet = daysToShipWorkbook.Sheets[daysToShipSheetName];

    // Convert Excel data to Array
    const daysToShipRows = XLSX.utils.sheet_to_json(daysToShipWorksheet, {
      header: 1,
    });

    // Run a loop for the rows
    // 0-indexed starting row is 7 in the actual file
    const daysToShipStartingRow: number = 6;

    for (
      let rowIndex = daysToShipStartingRow;
      rowIndex < daysToShipRows.length;
      rowIndex++
    ) {
      const row: string[] = daysToShipRows[rowIndex];

      const productName: string = row[2];
      const parentSKU: string = row[1];
      const daysToShip: number = parseInt(row[6]);

      if (daysToShip > 2 || isNonPreorderIncluded) {
        preOrderProducts[productName] = parentSKU;
      }
    }
  }

  const generatedListMap: GeneratedListMap = {};
  for (let bigSellerOrdersFile of bigSellerOrdersFiles) {
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

    // 0-indexed it's 3rd row in the actual file
    const startingRow = 1;
    // This (generatedListMap) will be a mapping of the products needed to be ordered.
    // Mapping generatedListMap -> SupplierCode/ParentSKU -> Product Name -> Variation -> Quantity

    for (
      let rowIndex = startingRow;
      rowIndex < bigSellerOrdersRows.length;
      rowIndex++
    ) {
      const row = bigSellerOrdersRows[rowIndex];

      const productName: string = row[0];
      // const sku: string = row[1];
      const variationName: string = row[2];
      const quantity: number = parseInt(row[3]);

      if (productName in preOrderProducts) {
        const supplierCode: string = preOrderProducts[productName];

        // Set default to empty object
        generatedListMap[supplierCode] ??= {};

        // Set default to empty object
        generatedListMap[supplierCode][productName] ??= {};

        // Set default to 0
        generatedListMap[supplierCode][productName][variationName] ??= 0;

        // Increase the quantity we need to order for this product
        generatedListMap[supplierCode][productName][variationName] += quantity;
      }
    }
  }

  return simplifyGeneratedList(generatedListMap);
};

export const timestampToDatetimeText = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.toLocaleString()} (${daysOfWeek[date.getDay()]})`;
};

export const extractColor = (str: string) => {
  const regex = /\b(blue|pink|yellow|green|violet|red|orange)\b/i;
  const match = str.match(regex);

  if (!match) {
    return "";
  }

  return match[0].toUpperCase();
};

export const extractNumbers = (str: string) => {
  const regex = /\b(\d+(?:-\d+)?)\b/g;
  const matches = str.match(regex);

  if (!matches) {
    return "";
  }

  return matches.join(",");
};
// Accepts a string, assuming the string holds info about the supplier
// returns an object of stall name, color and number
export const disectSupplierCode = (
  supplierCode: string
): { number: string; color: MasuerteStallColor; name: string } => {
  const number = extractNumbers(supplierCode)?.toLowerCase();
  const color = extractColor(supplierCode)?.toLowerCase() as MasuerteStallColor;
  const name = supplierCode
    .toLowerCase()
    .replace("#", "")
    .replace(number, "")
    .replace(color, "")
    .trim();

  const result = {
    number,
    color,
    name,
  };

  return result;
};

export const validateDTSFile = async (
  daysToShipFile: File
): Promise<DTSFileMetadata | null> => {
  const daysToShipWorkbook = XLSX.read(await daysToShipFile?.arrayBuffer());

  // Assuming the first sheet is the one you want to read
  const daysToShipSheetName = daysToShipWorkbook.SheetNames[0];
  const daysToShipWorksheet = daysToShipWorkbook.Sheets[daysToShipSheetName];

  // Convert Excel data to Array
  const daysToShipRows = XLSX.utils.sheet_to_json(daysToShipWorksheet, {
    header: 1,
  });

  // Compare the headers
  const daysToShipHeaderRow: number = 2;
  const daysToShipFileHeader: string[] = daysToShipRows[daysToShipHeaderRow];

  // Valid header and file header should be the same
  if (daysToShipFileHeader.length !== validDaysToShipHeader.length) {
    return null;
  }

  // Check if file header is the same with the valid header.
  for (let i in daysToShipFileHeader) {
    if (daysToShipFileHeader[i] !== validDaysToShipHeader[i]) {
      return null;
    }
  }

  // If both checks are ok, file must be valid, loop through
  const daysToShipStartingRow = 6;
  let totalPreorderProducts = 0;

  for (
    let rowIndex = daysToShipHeaderRow;
    rowIndex < daysToShipRows.length;
    rowIndex++
  ) {
    const row = daysToShipRows[rowIndex];

    const daysToShip = parseInt(row[6]);

    if (daysToShip > 2) {
      totalPreorderProducts += 1;
    }
  }

  return {
    totalPreorderProducts,
    totalProducts: daysToShipRows.length - daysToShipStartingRow,
  };
};

export const validateBigSellerOrdersFile = async (
  bigSellerOrdersFile: File
): Promise<DTSFileMetadata | BigSellerOrdersMetadata | null> => {
  const bigSellerOrdersWorkbook = XLSX.read(
    await bigSellerOrdersFile?.arrayBuffer()
  );

  // Assuming the first sheet is the one you want to read
  const bigSellerOrdersSheetName = bigSellerOrdersWorkbook.SheetNames[0];
  const bigSellerOrdersWorkSheet =
    bigSellerOrdersWorkbook.Sheets[bigSellerOrdersSheetName];

  // Convert Excel data to Array
  const bigSellerOrdersRows = XLSX.utils.sheet_to_json(
    bigSellerOrdersWorkSheet,
    {
      header: 1,
    }
  );

  // Compare the headers
  const bigSellerOrdersHeaderRow: number = 0;
  const bigSellerOrdersHeader: string[] =
    bigSellerOrdersRows[bigSellerOrdersHeaderRow];

  // Valid header and file header should be the same
  console.log(bigSellerOrdersHeader);
  if (bigSellerOrdersHeader.length !== validBigSellerOrdersHeader.length) {
    return null;
  }

  // Check if file header is the same with the valid header.
  for (let i in bigSellerOrdersHeader) {
    if (bigSellerOrdersHeader[i] !== validBigSellerOrdersHeader[i]) {
      return null;
    }
  }

  // If both checks are ok, file must be valid, loop through
  const bigSellerOrdersStartingRow = 1;

  const orderIds = new Set();

  for (
    let rowIndex = bigSellerOrdersStartingRow;
    rowIndex < bigSellerOrdersRows.length;
    rowIndex++
  ) {
    const row = bigSellerOrdersRows[rowIndex];
    const orderId = row[4];
    orderIds.add(orderId);
  }

  return { totalOrders: orderIds.size };
};
