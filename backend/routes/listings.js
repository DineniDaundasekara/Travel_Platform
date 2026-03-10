const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const { protect } = require("../middleware/auth");

// @route   GET /api/listings
// Public - get all listings with search, filter, pagination
router.get("/", async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;

    const query = {};

    // Full-text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Listing.countDocuments(query);

    const listings = await Listing.find(query)
      .populate("creator", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      listings,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/listings/:id
// Public - get single listing
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("creator", "name email avatar bio");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/listings
// Protected - create listing
router.post("/", protect, async (req, res) => {
  try {
    const { title, location, imageUrl, description, price, currency, category } = req.body;

    if (!title || !location || !imageUrl || !description) {
      return res.status(400).json({ message: "Title, location, image, and description are required." });
    }

    const listing = await Listing.create({
      title,
      location,
      imageUrl,
      description,
      price: price || null,
      currency: currency || "USD",
      category: category || "Other",
      creator: req.user._id,
    });

    const populated = await listing.populate("creator", "name email avatar");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/listings/:id
// Protected - update listing (only creator)
router.put("/:id", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (listing.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this listing." });
    }

    const { title, location, imageUrl, description, price, currency, category } = req.body;

    listing.title = title || listing.title;
    listing.location = location || listing.location;
    listing.imageUrl = imageUrl || listing.imageUrl;
    listing.description = description || listing.description;
    listing.price = price !== undefined ? price : listing.price;
    listing.currency = currency || listing.currency;
    listing.category = category || listing.category;

    await listing.save();
    const updated = await listing.populate("creator", "name email avatar");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/listings/:id
// Protected - delete listing (only creator)
router.delete("/:id", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (listing.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing." });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/listings/:id/like
// Protected - toggle like
router.post("/:id/like", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    const userId = req.user._id;
    const isLiked = listing.likes.includes(userId);

    if (isLiked) {
      listing.likes = listing.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      listing.likes.push(userId);
    }

    await listing.save();
    res.json({ likes: listing.likes.length, isLiked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/listings/:id/save
// Protected - toggle save
router.post("/:id/save", protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    const userId = req.user._id;
    const isSaved = listing.saved.includes(userId);

    if (isSaved) {
      listing.saved = listing.saved.filter((id) => id.toString() !== userId.toString());
    } else {
      listing.saved.push(userId);
    }

    await listing.save();
    res.json({ saved: listing.saved.length, isSaved: !isSaved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
