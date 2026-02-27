import express from "express";
import cors from "cors";
import { PromocodeControllers } from "./src/controllers/promocode.controller.js";

const { validateCode } = PromocodeControllers();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/validate-promo", validateCode);

app.listen(5000, () => {
    console.log("Server running on port:5000");
});
