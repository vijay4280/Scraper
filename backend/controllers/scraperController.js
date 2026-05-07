const { runScraper } = require("../scraper/hnScraper");

async function triggerScrape(req, res) {
  const result = await runScraper();

  if (result.success) {
    res.json({ message: `Scraped ${result.count} stories successfully` });
  } else {
    res.status(500).json({ message: "Scrape failed", error: result.error });
  }
}

module.exports = { triggerScrape };
