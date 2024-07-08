import axios from "axios";

const GET_ORDERS_URL =
  "https://www.bigseller.com/api/v1/order/new/pageList.json";

const EDIT_ORDER_NOTE =
  "https://www.bigseller.com/api/v1/order/sign/edit/remark.json";

export const getNewOrders = async (cookie: string) => {
  const response = await axios.post(
    GET_ORDERS_URL,
    {
      status: "new",
      packState: "0",
      pageNo: 1,
    },
    { headers: { cookie } }
  );
  console.log(response.data);
  return response.data;
};

export const updateOrderNote = async (
  orderId: string,
  newOrderNote: string,
  cookie: string
) => {
  const formData = new FormData();
  formData.append("orderId", orderId);
  formData.append("remarkType", "1");
  formData.append("content", newOrderNote);
  formData.append("orderNotApproved", "false");

  const response = await axios.post(EDIT_ORDER_NOTE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      cookie: cookie,
    },
  });

  return response.data;
};

export const parseMinerList = (minerListText: string) => {
  // Array of lines of the text (split by \n newline)
  let lines = minerListText.split("\n");

  // Remove empty lines
  lines = lines.filter((line) => line !== "");

  // Remove whitespaces after lines
  lines = lines.map((line) => line.trim());

  // Parsed List
  const parsedMinerList = [];

  let currentCode = null;
  let currentCodeMiners = [];

  // Loop through the lines, check each line if code set code
  // if not, its a usernamme, add buyer to codeMiners List
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const upperCasedLine = currentLine.toUpperCase();

    if (upperCasedLine.includes("CODE:")) {
      if (currentCode !== null) {
        parsedMinerList.push({
          code: currentCode,
          miners: currentCodeMiners,
        });
      }

      currentCode = upperCasedLine.replace("CODE:", "").trim();
      currentCodeMiners = [];
    }

    currentCodeMiners.push(currentLine);
  }

  // When the loop ends, the last current code and miners are not
  // added yet, so we need to run this again when the loop ends.
  parsedMinerList.push({
    code: currentCode,
    miners: currentCodeMiners,
  });

  return parsedMinerList;
};
