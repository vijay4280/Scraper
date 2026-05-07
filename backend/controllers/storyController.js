const Story = require("../models/Story");
const User = require("../models/User");

async function getAllStories(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Story.countDocuments();
    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getStoryById(req, res) {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function toggleBookmark(req, res) {
  try {
    const storyId = req.params.id;
    const user = await User.findById(req.user._id);

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== storyId);
    } else {
      user.bookmarks.push(storyId);
    }

    await user.save();

    res.json({ bookmarked: !isBookmarked, bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getBookmarkedStories(req, res) {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "bookmarks",
      options: { sort: { points: -1 } },
    });

    res.json({ stories: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllStories, getStoryById, toggleBookmark, getBookmarkedStories };
