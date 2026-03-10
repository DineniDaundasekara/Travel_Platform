const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

// @route GET /api/users/:id/listings
// Public - get listings by user
router.get("/:id/listings", async (req, res) => {
  try {
    const listings = await Listing.find({ creator: req.params.id })
      .populate("creator", "name email avatar")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/users/profile
// Protected - update profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
