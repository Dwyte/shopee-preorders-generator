import axios from "axios";

const COOKIE =
  "i18n_redirected=en_US; _ati=8712070975620; org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=en-US; MYJ_MKTG_yosu7anwoc=JTdCJTdE; muc_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzIyMTcxOTY2LCJpYXQiOjE3MjA0NDM5NjYsImluZm8iOiJ7XCJyZXF1ZXN0SWRcIjpcIm11Y181MWZiemRjazd2eWg0dnE3Z2FcIixcImxvZ2luVGltZVwiOjE3MTEwMjA4OTM5NDYsXCJyZWZyZXNoVGltZVwiOjE3MjA0NDM5NjY5ODcsXCJwdWlkXCI6NDg4OTI1LFwicmVxdWVzdElwXCI6XCIxNTIuMzIuOTkuMjA0XCIsXCJyZXF1ZXN0Q2xpZW50XCI6XCJEZXZpY2U6RGVza3RvcHxTeXN0ZW06V2luMTAsMTAuMHxDbGllbnQ6RWRnZSwwXCIsXCJ1aWRcIjo0ODg5MjUsXCJyYW5kb21TdHJcIjpcImFjODBmYmEwLTU4NzktNDc4YS1hNmYyLTg0MDdjYzU0YmYxMVwifSJ9.bY3MXje6THDbTup-S8yDO01jw8RhYYhHhk3smxgN26M; MYJ_yosu7anwoc=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjIyYmZjMTM2ZS1iOTQyLTQwNjYtYWFlMy1mZmYyZjAxYTQxNzklMjIlMkMlMjJ1c2VySWQlMjIlM0E0ODg5MjUlMkMlMjJwYXJlbnRJZCUyMiUzQTQ4ODkyNSUyQyUyMnNlc3Npb25JZCUyMiUzQTE3MjA0NDY0NDQ1OTElMkMlMjJvcHRPdXQlMjIlM0FmYWxzZSUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNzIwNDQ2NDQ1MjcxJTJDJTIybGFzdEV2ZW50SWQlMjIlM0E4MDQlN0Q=; JSESSIONID=E49FBE34673E9A99FDC2D62215857AEE";
const GET_ORDERS_URL =
  "https://www.bigseller.com/api/v1/order/new/pageList.json";
const EDIT_ORDER_NOTE =
  "https://www.bigseller.com/api/v1/order/sign/edit/remark.json";

const sampleNote = `
CODE: DOORWAY
japadugzdoorway
janeveronicailagandoorway
carrburacdoorway

CODE: FISH
jennellarellano

CODE: DOTA 
lovelymaerazodota
jennellarellano
`;

const getNewOrders = async (cookie) => {
  const response = await axios.post(
    GET_ORDERS_URL,
    {
      status: "new",
      packState: "0",
      pageNo: 1,
    },
    { headers: { cookie: COOKIE } }
  );
  console.log(response.data);
  return response.data;
};

const updateOrderNote = async (orderId, newOrderNote, cookie) => {
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

const parseMinerList = (minerListText) => {
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

const main = async () => {
  const newOrdersResponse = await getNewOrders(COOKIE);
  const newOrders = newOrdersResponse.data.page.rows;

  const parsedMinerList = parseMinerList(sampleNote);

  for (let order of newOrders) {
    const minedCodes = [];
    for (let minerListItem of parsedMinerList) {
      for (let miners of minerListItem.miners) {
        if (miners.includes(order.buyerUsername)) {
          minedCodes.push(minerListItem.code);
        }
      }
    }

    if (minedCodes.length > 0) {
      const orderNote = minedCodes.join(", ");
      await updateOrderNote(order.id, orderNote, COOKIE);
      console.log(`Code for ${order.buyerUsername} is ${orderNote}`);
    }
  }
};

main();
