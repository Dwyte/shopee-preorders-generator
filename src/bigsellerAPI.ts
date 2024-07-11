import axios from "axios";

const endpoints = {
  local: "http://localhost:3000",
  render: "https://shopee-preorders-generator.onrender.com",
};

export const getNewOrders = async (cookie: string) => {
  const proxyURL = endpoints["render"] + "/orders";

  const response = await axios.get(proxyURL, {
    headers: { "X-Bigseller-Cookie": cookie },
  });

  console.log(response.data);
  return response.data;
};

export const updateOrderNote = async (
  orderId: string,
  newOrderNote: string,
  cookie: string
) => {
  const proxyURL = endpoints["render"] + "/orderNote";

  const requestBody = { orderId, newOrderNote };

  const response = await axios.post(proxyURL, requestBody, {
    headers: {
      "X-Bigseller-Cookie": cookie,
    },
  });

  console.log(response.data);

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

      currentCode = upperCasedLine.replace("CODE:", "").trim().split(" ")[0];
      currentCodeMiners = [];
    } else {
      currentCodeMiners.push(currentLine);
    }
  }

  // When the loop ends, the last current code and miners are not
  // added yet, so we need to run this again when the loop ends.
  parsedMinerList.push({
    code: currentCode,
    miners: currentCodeMiners,
  });

  return parsedMinerList;
};
