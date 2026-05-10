// routes/booking.js

const express = require("express");

const router = express.Router();

const { protect, admin } = require("../middlewares/auth");

const {
  sendBookingOTP,
  bookEvent,
  getMyBookings,
  getAllBookings,
  confirmBooking,
  cancelBooking,
} = require("../controllers/bookingController");

router.post("/send-otp", protect, sendBookingOTP);

router.post("/", protect, bookEvent);

router.get("/my", protect, getMyBookings);

router.get("/", protect, admin, getAllBookings);

router.put("/:id/confirm", protect, admin, confirmBooking);

router.delete("/:id", protect, cancelBooking);

module.exports = router;
