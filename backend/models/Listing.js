const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: 100,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    price: {
      type: Number,
      min: 0,
      default: null,
    },
    currency: {
      type: String,
      default: "USD",
    },
    category: {
      type: String,
      enum: ["Adventure", "Culture", "Food & Drink", "Nature", "Wellness", "Water Sports", "Other"],
      default: "Other",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Index for search and sorting
listingSchema.index({ title: "text", description: "text", location: "text" });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ creator: 1 });

module.exports = mongoose.model("Listing", listingSchema);
