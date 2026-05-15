const User = require("../models/User");
const OTP = require("../models/temp.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { sendOtpEmail } = require("../utils/email");

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({
            email,
        });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
            isVerified: false,
        });

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await OTP.deleteMany({
            email,
            action: "account_verification",
        });

        await OTP.create({
            email,
            otp,
            action: "account_verification",
        });

        await sendOtpEmail(
            email,
            otp,
            "account_verification"
        );

        return res.status(201).json({
            message:
                "User registered successfully. Please verify OTP.",
            email: user.email,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Wrong password",
            });
        }

        if (!user.isVerified && user.role === "user") {
            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            await OTP.deleteMany({
                email,
                action: "account_verification",
            });

            await OTP.create({
                email,
                otp,
                action: "account_verification",
            });

            await sendOtpEmail(
                email,
                otp,
                "account_verification"
            );

            return res.status(400).json({
                needsVerification: true,
                message:
                    "Account not verified. OTP sent to email.",
            });
        }

        return res.status(200).json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            token: generateToken(
                user._id,
                user.role
            ),
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTP.findOne({
            email,
            otp,
            action: "account_verification",
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
            });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        await OTP.deleteMany({
            email,
            action: "account_verification",
        });

        return res.status(200).json({
            message:
                "Account verified successfully",
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            token: generateToken(
                user._id,
                user.role
            ),
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};