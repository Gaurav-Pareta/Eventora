const User = require("../models/User");
const { sendOtpEmail } = require("../utils/email");
const OTP = require("../models/otp");
const bcrypt = require('bcrypt');

const generateToken = (id, role) =>  {
    return jwt.sign({id,role}, process.env.JWT_SECRET, {expireIn: '7d'});
}

exports.registerUser = async (req, res) => {
    const {name, password, email} = req.body;

    let userExists = await User.findOne({email});
    if(userExists){
        res.status(400).json({error: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const user = new User({name, password: hashedPassword , email, role:"user", isVarified: false});
        await user.save();
        
        const otp = Math.floor(100000 + Math.random * 900000).toString();

        await OTP.create({email, otp, action:"account_verification"});
        await sendOtpEmail(email, otp, "account_verification");

        res.status(201).json({message: "User register successfully. Please check your email.", email: user.email});
    } catch (error){
        res.status(400).json({error: error.message});
    }
}

exports.loginUser = async (req,res) => {
    const {email, password} = req.body;

    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json({error: "Invalid Credentials"});
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({error: "Wrong Password"});
    }

    if(!user.isVarified && user.role === "user"){
        const otp = Math.floor(100000 + Math.random * 900000).toString();
        await OTP.deleteMany({email: email, action: "account_verification"});
        await OTP.create({email, otp, action:"account_verification"});
        await sendOtpEmail(email, otp, "account_verification");
        
        res.status(400).json({error: "Account is not verified. A new OTP is sent to your Email."});
    }

    res.json({
        message: "Login Successfull",
        _id : user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        token: generateToken(user._id, user.role)
    })
}

