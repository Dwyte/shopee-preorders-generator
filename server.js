import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;
const GET_ORDERS_URL =
  "https://www.bigseller.com/api/v1/order/new/pageList.json";
const EDIT_ORDER_NOTE =
  "https://www.bigseller.com/api/v1/order/sign/edit/remark.json";

// Enable CORS for all routes
app.use(
  cors({
    allowedHeaders: ["X-Bigseller-Cookie", "content-type"],
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Example route
app.get("/orders", async (req, res) => {
  const cookie = req.header("X-Bigseller-Cookie");

  const response = await axios.post(
    GET_ORDERS_URL,
    {
      status: "new",
      packState: "0",
      pageNo: 1,
    },
    {
      headers: {
        cookie,
      },
    }
  );

  return res.send(response.data);
});

app.post("/orderNote", async (req, res) => {
  const cookie = req.header("X-Bigseller-Cookie");

  const formData = new FormData();
  const { orderId, newOrderNote } = req.body;
  console.log(req.body);
  formData.append("orderId", orderId);
  formData.append("remarkType", "1");
  formData.append("content", newOrderNote);
  formData.append("orderNotApproved", "false");

  const response = await axios.post(EDIT_ORDER_NOTE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      cookie,
    },
  });

  return res.send(response.data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
