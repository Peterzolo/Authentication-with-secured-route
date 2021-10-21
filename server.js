const express = require("express");
const app = express();
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const securedRoute = require("./routes/securedRoute");
const DBConnect = require("./config/database");

const errorHandler = require("./middleWares/errorHandlerMiddleWare");

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/private", securedRoute);

DBConnect();

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
