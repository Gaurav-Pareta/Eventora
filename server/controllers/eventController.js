const Event = require("../models/Event");

const getAllEvent = async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "name email");

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate(
            "createdBy",
            "name email"
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            location,
            ticketPrice,
            category,
            totalSeats,
            availableSeats,
            imageURL,
        } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            ticketPrice,
            category,
            totalSeats,
            availableSeats,
            imageURL,
            createdBy: req.user._id,
        });

        res.status(201).json({
            message: "Event created successfully",
            event,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Event updated successfully",
            updatedEvent,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        await event.deleteOne();

        res.status(200).json({
            message: "Event deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getAllEvent,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};