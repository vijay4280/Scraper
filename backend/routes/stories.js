const express = require("express");
const {
  getAllStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
} = require("../controllers/storyController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllStories);
router.get("/bookmarks", protect, getBookmarkedStories);
router.get("/:id", getStoryById);
router.post("/:id/bookmark", protect, toggleBookmark);

module.exports = router;
