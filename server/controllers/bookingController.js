// controllers/bookingController.js

const Booking = require("../models/Booking");
const Event = require("../models/Event");
const OTP = require("../models/OTP");

const {
  sendOtpEmail,
  sendBookingConfirmationEmail,
} = require("../utils/email");

const sendBookingOTP = async (req, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    await OTP.create({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    await sendOtpEmail(req.user.email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const bookEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      eventId,
      status: {
        $ne: "cancelled",
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You already booked this event",
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      eventId,
      status: "pending",
      paymentStatus: "not_paid",
      amount: event.ticketPrice,
    });

    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    await sendBookingConfirmationEmail(
      req.user.email,
      req.user.name,
      event.title,
    );

    return res.status(201).json({
      message: "Booking request submitted successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate("eventId")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("eventId")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id).populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled booking cannot be confirmed",
      });
    }

    booking.status = "confirmed";
    booking.paymentStatus = paymentStatus;

    await booking.save();

    if (booking.eventId) {
      booking.eventId.availableSeats -= 1;

      await booking.eventId.save();
    }

    return res.status(200).json({
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    if (booking.eventId && booking.status === "confirmed") {
      booking.eventId.availableSeats += 1;

      await booking.eventId.save();
    }

    return res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendBookingOTP,
  bookEvent,
  getMyBookings,
  getAllBookings,
  confirmBooking,
  cancelBooking,
};
