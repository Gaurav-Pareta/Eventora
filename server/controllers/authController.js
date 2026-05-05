const User = require("../models/User");

exports.registerUser = async (req, res) => {
    const {name, password, email} = req.body;

    let userExists = await User.findOne({email});
    if(userExists){
        res.status(400).json({error: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try{
        const user = new User({name, password: hashedPassword , email});
        await user.save();
        res.status(201).json({message: "User register successfully."});

        const otp = Math.floor(100000 + Math.random * 900000).toString();
        console.log(`OTP for ${email} : ${otp}`);

        
    } catch (error){
        res.status(400).json({error: error.message});
    }
}