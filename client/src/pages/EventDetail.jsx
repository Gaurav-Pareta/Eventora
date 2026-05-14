// EventDetail.jsx

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTicketAlt,
    FaChair,
} from "react-icons/fa";

import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

const EventDetail = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);

    const [loading, setLoading] = useState(true);

    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [bookingLoading, setBookingLoading] =
        useState(false);

    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchEvent();
    }, []);

    const fetchEvent = async () => {
        try {
            const { data } = await api.get(
                `/events/${id}`
            );

            setEvent(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const sendOTP = async () => {
        try {
            setBookingLoading(true);

            const { data } = await api.post(
                "/bookings/send-otp"
            );

            setOtpSent(true);

            setMessage(data.message);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Failed to send OTP"
            );
        } finally {
            setBookingLoading(false);
        }
    };

    const handleBooking = async () => {
        try {
            setBookingLoading(true);

            const { data } = await api.post(
                "/bookings",
                {
                    eventId: event._id,
                    otp,
                }
            );

            setMessage(data.message);

            navigate("/dashboard");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Booking failed"
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
                Loading...
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-500">
                Event Not Found
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="w-full h-[350px] overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-6 py-10">
                    <div className="lg:col-span-2">
                        <span className="bg-gray-200 text-gray-700 text-sm font-bold px-4 py-2 rounded-full uppercase">
                            {event.category}
                        </span>

                        <h1 className="text-5xl font-black text-gray-900 mt-6 mb-6">
                            {event.title}
                        </h1>

                        <p className="text-gray-600 text-2xl leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8 h-fit">
                        <h2 className="text-4xl font-black text-gray-900 mb-10">
                            Booking Details
                        </h2>

                        <div className="space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                    <FaTicketAlt className="text-xl text-gray-800" />
                                </div>

                                <div>
                                    <p className="text-gray-400 uppercase font-bold text-sm">
                                        Ticket Price
                                    </p>

                                    <h3 className="text-3xl font-black text-gray-900">
                                        ₹
                                        {
                                            event.ticketPrice
                                        }
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                    <FaChair className="text-xl text-gray-800" />
                                </div>

                                <div>
                                    <p className="text-gray-400 uppercase font-bold text-sm">
                                        Availability
                                    </p>

                                    <h3 className="text-3xl font-black text-gray-900">
                                        {
                                            event.availableSeats
                                        }{" "}
                                        /{" "}
                                        {
                                            event.totalSeats
                                        }
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                    <FaCalendarAlt className="text-xl text-gray-800" />
                                </div>

                                <div>
                                    <p className="text-gray-400 uppercase font-bold text-sm">
                                        Date
                                    </p>

                                    <h3 className="text-2xl font-black text-gray-900">
                                        {new Date(
                                            event.date
                                        ).toLocaleDateString()}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                    <FaMapMarkerAlt className="text-xl text-gray-800" />
                                </div>

                                <div>
                                    <p className="text-gray-400 uppercase font-bold text-sm">
                                        Location
                                    </p>

                                    <h3 className="text-2xl font-black text-gray-900">
                                        {
                                            event.location
                                        }
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className="mt-8 bg-gray-100 text-gray-800 p-4 rounded-xl text-center font-semibold">
                                {message}
                            </div>
                        )}

                        {!user ? (
                            <button
                                onClick={() =>
                                    navigate("/login")
                                }
                                className="w-full mt-10 bg-black text-white py-5 rounded-2xl font-bold text-2xl hover:bg-gray-900 transition"
                            >
                                Login To Book
                            </button>
                        ) : user.role ===
                          "admin" ? (
                            <div className="w-full mt-10 bg-yellow-100 text-yellow-800 py-5 rounded-2xl font-bold text-center text-lg">
                                Admin accounts cannot
                                book events
                            </div>
                        ) : (
                            <>
                                {!otpSent ? (
                                    <button
                                        onClick={
                                            sendOTP
                                        }
                                        disabled={
                                            bookingLoading ||
                                            event.availableSeats <=
                                                0
                                        }
                                        className="w-full mt-10 bg-black text-white py-5 rounded-2xl font-bold text-2xl hover:bg-gray-900 transition disabled:opacity-50"
                                    >
                                        {bookingLoading
                                            ? "Sending OTP..."
                                            : "Request Booking"}
                                    </button>
                                ) : (
                                    <div className="mt-8">
                                        <input
                                            type="text"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(
                                                e
                                            ) =>
                                                setOtp(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="w-full border px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-black text-center text-2xl tracking-widest font-bold"
                                        />

                                        <button
                                            onClick={
                                                handleBooking
                                            }
                                            disabled={
                                                bookingLoading
                                            }
                                            className="w-full mt-5 bg-green-600 text-white py-5 rounded-2xl font-bold text-2xl hover:bg-green-700 transition disabled:opacity-50"
                                        >
                                            {bookingLoading
                                                ? "Processing..."
                                                : "Submit Booking Request"}
                                        </button>
                                    </div>
                                )}

                                {event.availableSeats <=
                                    0 && (
                                    <div className="mt-8 bg-red-100 text-red-600 py-4 rounded-xl text-center font-bold">
                                        Event Sold Out
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;