import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.get("/bigSeller/orders", async (req, res) => {
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

app.post("/bigSeller/orderNote", async (req, res) => {
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

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
