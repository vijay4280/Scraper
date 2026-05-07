const axios = require("axios");
const Story = require("../models/Story");

const HN_API_BASE = "https://hacker-news.firebaseio.com/v0";

function timeAgo(unixSeconds) {
  const seconds = Math.floor(Date.now() / 1000) - unixSeconds;
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

async function fetchItem(id) {
  const { data } = await axios.get(`${HN_API_BASE}/item/${id}.json`, {
    timeout: 8000,
  });
  return data;
}

async function scrapeHackerNews() {
  const { data: topIds } = await axios.get(`${HN_API_BASE}/topstories.json`, {
    timeout: 8000,
  });

  const top10Ids = topIds.slice(0, 10);
  const items = await Promise.all(top10Ids.map(fetchItem));

  return items
    .filter((item) => item && item.title)
    .map((item) => ({
      hnId: String(item.id),
      title: item.title,
      url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
      points: item.score || 0,
      author: item.by || "unknown",
      postedAt: item.time ? timeAgo(item.time) : "",
    }));
}

async function runScraper() {
  try {
    console.log("Scraper started — fetching from HN API...");
    const stories = await scrapeHackerNews();

    for (const story of stories) {
      await Story.findOneAndUpdate({ hnId: story.hnId }, story, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }

    console.log(`Scraper finished: ${stories.length} stories saved`);
    return { success: true, count: stories.length };
  } catch (err) {
    console.error("Scraper error:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { runScraper, scrapeHackerNews };
