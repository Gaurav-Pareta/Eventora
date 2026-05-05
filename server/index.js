const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require("./routes/auth.js");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);


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