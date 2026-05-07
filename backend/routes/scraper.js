const express = require("express");
const { triggerScrape } = require("../controllers/scraperController");

const router = express.Router();

router.post("/", triggerScrape);

module.exports = router;
