const Booking = require("../models/Booking.js");
const Event = require("../models/Event.js");
const OTP = require("../models/Otp.js");

const {
    sendOtpEmail,
    sendBookingConfirmationEmail,
} = require("../utils/email");

const sendBookingOTP = async (req, res) => {
    try {
        const email = req.user.email;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.findOneAndDelete({
            email,
            action: "event_booking",
        });

        await OTP.create({
            email,
            otp,
            action: "event_booking",
        });

        await sendOtpEmail(email, otp, "event_booking");

        res.status(200).json({
            message: "OTP sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
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
                error: "Invalid or expired OTP",
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                error: "Event not found",
            });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                error: "No seats available",
            });
        }

        const existingBooking = await Booking.findOne({
            userId: req.user._id,
            eventId,
        });

        if (existingBooking) {
            return res.status(400).json({
                error: "You already booked this event",
            });
        }

        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            status: "Confirmed",
            paymentStatus: "Paid",
            amount: event.ticketPrice,
        });

        event.availableSeats -= 1;
        await event.save();

        await OTP.findOneAndDelete({
            email: req.user.email,
            action: "event_booking",
        });

        await sendBookingConfirmationEmail(
            req.user.email,
            event.title,
            booking._id
        );

        res.status(201).json({
            message: "Booking successful",
            booking,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.user._id,
        })
            .populate("eventId")
            .populate("userId", "name email");

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found",
            });
        }

        booking.status = "Confirmed";
        booking.paymentStatus = "Paid";

        await booking.save();

        res.status(200).json({
            message: "Booking confirmed",
            booking,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found",
            });
        }

        if (booking.status === "Cancelled") {
            return res.status(400).json({
                error: "Booking already cancelled",
            });
        }

        const event = await Event.findById(booking.eventId);

        if (event) {
            event.availableSeats += 1;
            await event.save();
        }

        booking.status = "Cancelled";

        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

module.exports = {
    sendBookingOTP,
    bookEvent,
    getMyBookings,
    confirmBooking,
    cancelBooking,
};