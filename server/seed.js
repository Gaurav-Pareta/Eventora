const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const User = require("./models/User");
const Event = require("./models/Event");
const Booking = require("./models/Booking");

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        await Booking.deleteMany();
        await Event.deleteMany();
        await User.deleteMany();

        console.log("Old Data Removed");

        const hashedPassword = await bcrypt.hash("123456", 10);

        const users = await User.insertMany([
            {
                name: "Admin User",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin",
            },
            {
                name: "Gaurav Pareta",
                email: "gaurav@example.com",
                password: hashedPassword,
                role: "user",
            },
            {
                name: "Rahul Sharma",
                email: "rahul@example.com",
                password: hashedPassword,
                role: "user",
            },
            {
                name: "Ananya Verma",
                email: "ananya@example.com",
                password: hashedPassword,
                role: "user",
            },
            {
                name: "Priya Singh",
                email: "priya@example.com",
                password: hashedPassword,
                role: "user",
            },
            {
                name: "Aman Jain",
                email: "aman@example.com",
                password: hashedPassword,
                role: "user",
            },
            {
                name: "Rohit Meena",
                email: "rohit@example.com",
                password: hashedPassword,
                role: "user",
            },
            {
                name: "Sneha Kapoor",
                email: "sneha@example.com",
                password: hashedPassword,
                role: "user",
            },
            {
                name: "Vikas Yadav",
                email: "vikas@example.com",
                password: hashedPassword,
                role: "user",
            },
            {
                name: "Neha Gupta",
                email: "neha@example.com",
                password: hashedPassword,
                role: "user",
            },
        ]);

        console.log("Users Seeded");

        const adminUser = users[0];

        const events = await Event.insertMany([
            {
                title: "React Developer Summit",
                description: "A large React conference with workshops and networking.",
                date: new Date("2026-06-10"),
                location: "Jaipur",
                ticketPrice: 999,
                category: "Tech",
                totalSeats: 300,
                availableSeats: 280,
                imageURL: "https://images.unsplash.com/photo-1511578314322-379afb476865",
                createdBy: adminUser._id,
            },
            {
                title: "AI Workshop",
                description: "Hands-on AI and Machine Learning workshop.",
                date: new Date("2026-06-18"),
                location: "Delhi",
                ticketPrice: 1499,
                category: "Tech",
                totalSeats: 200,
                availableSeats: 190,
                imageURL: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
                createdBy: adminUser._id,
            },
            {
                title: "Startup Meetup",
                description: "Meet founders and investors from across India.",
                date: new Date("2026-07-01"),
                location: "Bangalore",
                ticketPrice: 799,
                category: "Business",
                totalSeats: 150,
                availableSeats: 130,
                imageURL: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
                createdBy: adminUser._id,
            },
            {
                title: "Live Music Concert",
                description: "Experience live music from top artists.",
                date: new Date("2026-07-12"),
                location: "Mumbai",
                ticketPrice: 1999,
                category: "Music",
                totalSeats: 500,
                availableSeats: 420,
                imageURL: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
                createdBy: adminUser._id,
            },
            {
                title: "Comedy Night",
                description: "A night full of stand-up comedy and fun.",
                date: new Date("2026-07-20"),
                location: "Pune",
                ticketPrice: 699,
                category: "Comedy",
                totalSeats: 250,
                availableSeats: 220,
                imageURL: "https://images.unsplash.com/photo-1527224857830-43a7acc85260",
                createdBy: adminUser._id,
            },
            {
                title: "Cricket Tournament",
                description: "Local teams competing in an exciting cricket tournament.",
                date: new Date("2026-08-05"),
                location: "Ahmedabad",
                ticketPrice: 899,
                category: "Sports",
                totalSeats: 700,
                availableSeats: 650,
                imageURL: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
                createdBy: adminUser._id,
            },
            {
                title: "Digital Marketing Bootcamp",
                description: "Learn modern digital marketing strategies.",
                date: new Date("2026-08-15"),
                location: "Hyderabad",
                ticketPrice: 1299,
                category: "Business",
                totalSeats: 180,
                availableSeats: 170,
                imageURL: "https://images.unsplash.com/photo-1552664730-d307ca884978",
                createdBy: adminUser._id,
            },
            {
                title: "Cyber Security Seminar",
                description: "Cyber security awareness and ethical hacking seminar.",
                date: new Date("2026-08-25"),
                location: "Chennai",
                ticketPrice: 1599,
                category: "Tech",
                totalSeats: 220,
                availableSeats: 200,
                imageURL: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87",
                createdBy: adminUser._id,
            },
            {
                title: "Photography Workshop",
                description: "Master mobile and DSLR photography.",
                date: new Date("2026-09-01"),
                location: "Udaipur",
                ticketPrice: 599,
                category: "Education",
                totalSeats: 120,
                availableSeats: 100,
                imageURL: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
                createdBy: adminUser._id,
            },
            {
                title: "Gaming Championship",
                description: "National gaming tournament with exciting prizes.",
                date: new Date("2026-09-10"),
                location: "Noida",
                ticketPrice: 999,
                category: "Sports",
                totalSeats: 400,
                availableSeats: 350,
                imageURL: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
                createdBy: adminUser._id,
            },
            {
                title: "Blockchain Expo",
                description: "Explore blockchain and Web3 technologies.",
                date: new Date("2026-09-20"),
                location: "Gurgaon",
                ticketPrice: 1799,
                category: "Tech",
                totalSeats: 280,
                availableSeats: 250,
                imageURL: "https://images.unsplash.com/photo-1639762681057-408e52192e55",
                createdBy: adminUser._id,
            },
            {
                title: "Food Festival",
                description: "Taste dishes from famous chefs and restaurants.",
                date: new Date("2026-10-01"),
                location: "Kota",
                ticketPrice: 499,
                category: "Other",
                totalSeats: 600,
                availableSeats: 520,
                imageURL: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
                createdBy: adminUser._id,
            },
        ]);

        console.log("Events Seeded");

        const bookings = await Booking.insertMany([
            {
                userId: users[1]._id,
                eventId: events[0]._id,
                status: "Confirmed",
                paymentStatus: "Paid",
                amount: events[0].ticketPrice,
            },
            {
                userId: users[2]._id,
                eventId: events[1]._id,
                status: "Confirmed",
                paymentStatus: "Paid",
                amount: events[1].ticketPrice,
            },
            {
                userId: users[3]._id,
                eventId: events[2]._id,
                status: "Pending",
                paymentStatus: "Pending",
                amount: events[2].ticketPrice,
            },
            {
                userId: users[4]._id,
                eventId: events[3]._id,
                status: "Confirmed",
                paymentStatus: "Paid",
                amount: events[3].ticketPrice,
            },
            {
                userId: users[5]._id,
                eventId: events[4]._id,
                status: "Cancelled",
                paymentStatus: "Failed",
                amount: events[4].ticketPrice,
            },
            {
                userId: users[6]._id,
                eventId: events[5]._id,
                status: "Confirmed",
                paymentStatus: "Paid",
                amount: events[5].ticketPrice,
            },
            {
                userId: users[7]._id,
                eventId: events[6]._id,
                status: "Pending",
                paymentStatus: "Pending",
                amount: events[6].ticketPrice,
            },
            {
                userId: users[8]._id,
                eventId: events[7]._id,
                status: "Confirmed",
                paymentStatus: "Paid",
                amount: events[7].ticketPrice,
            },
            {
                userId: users[9]._id,
                eventId: events[8]._id,
                status: "Confirmed",
                paymentStatus: "Paid",
                amount: events[8].ticketPrice,
            },
            {
                userId: users[1]._id,
                eventId: events[9]._id,
                status: "Pending",
                paymentStatus: "Pending",
                amount: events[9].ticketPrice,
            },
            {
                userId: users[2]._id,
                eventId: events[10]._id,
                status: "Confirmed",
                paymentStatus: "Paid",
                amount: events[10].ticketPrice,
            },
            {
                userId: users[3]._id,
                eventId: events[11]._id,
                status: "Confirmed",
                paymentStatus: "Paid",
                amount: events[11].ticketPrice,
            },
        ]);

        console.log("Bookings Seeded");
        console.log("Database Seeded Successfully");

        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

seedData();