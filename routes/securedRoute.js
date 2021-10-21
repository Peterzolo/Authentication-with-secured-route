const express = require("express");
const { getSecuredData } = require("../controllers/securedData");
const { secured } = require("../middleWares/authentication");

const router = express.Router();

router.get("/", secured, getSecuredData);

module.exports = router;
