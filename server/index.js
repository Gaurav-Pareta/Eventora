const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require("./routes/auth.js");
const bookingRoutes = require('./routes/booking.js');
const eventRoutes = require('./routes/events.js');

dotenv.config();

const app = express();
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.get("/", (req, res) => {
   res.send("Eventoria API Running");
});
app.use("/api/auth",authRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/bookings",bookingRoutes);



mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.log(`Error connecting MongoDB: ${error}`)
})

const PORT = process.env.PORT || 5000;


app.listen(PORT, () =>{
    console.log(`Server is connected to post ${PORT}`);
})