const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOtpEmail = async (email, otp , type) => {
    try{

        const title = type === "account_verification"? "Account Verification OTP": "Event Booking OTP"; 

        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
                    
                    <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        
                        <div style="background: #4f46e5; padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0;">${title}</h1>
                        </div>

                        <div style="padding: 30px; text-align: center;">
                            
                            <h2 style="color: #333;">Hello</h2>

                            <p style="color: #555; font-size: 16px;">
                                Use the following OTP to complete your verification process.
                            </p>

                            <div style="margin: 30px 0;">
                                <span style="
                                    display: inline-block;
                                    background: #eef2ff;
                                    color: #4f46e5;
                                    font-size: 32px;
                                    letter-spacing: 8px;
                                    padding: 15px 30px;
                                    border-radius: 8px;
                                    font-weight: bold;
                                ">
                                    ${otp}
                                </span>
                            </div>

                            <p style="color: #777; font-size: 14px;">
                                This OTP is valid for 5 minutes.
                            </p>

                            <p style="color: #777; font-size: 14px;">
                                If you did not request this OTP, please ignore this email.
                            </p>

                        </div>

                        <div style="background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                            © 2026 Your App Name. All rights reserved.
                        </div>

                    </div>

                </div>
            `
    }
    await transporter.sendMail(mailOptions);
    console.log(`Your OTP for ${type} is ${otp}`);
    } 
    catch(error){
        console.error(`Error sending otp email to ${email} for ${type}`);
    }
}

exports.sendBookingConfirmationEmail = async (
    userEmail,
    userName,
    eventTitle
) => {

    try {

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed - ${eventTitle}`,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 40px 20px;
                ">

                    <div style="
                        max-width: 550px;
                        margin: auto;
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    ">

                        <!-- Header -->
                        <div style="
                            background: #16a34a;
                            padding: 25px;
                            text-align: center;
                        ">
                            <h1 style="
                                color: white;
                                margin: 0;
                                font-size: 28px;
                            ">
                                Booking Confirmed
                            </h1>
                        </div>

                        <!-- Body -->
                        <div style="
                            padding: 35px 30px;
                            text-align: center;
                        ">

                            <h2 style="
                                color: #333;
                                margin-bottom: 20px;
                            ">
                                Hello ${userName},
                            </h2>

                            <p style="
                                color: #555;
                                font-size: 16px;
                                line-height: 1.6;
                            ">
                                Your booking for
                                <strong>${eventTitle}</strong>
                                has been successfully confirmed.
                            </p>

                            <div style="
                                margin: 30px 0;
                            ">
                                <span style="
                                    display: inline-block;
                                    background: #ecfdf5;
                                    color: #16a34a;
                                    font-size: 22px;
                                    padding: 15px 25px;
                                    border-radius: 10px;
                                    font-weight: bold;
                                    border: 2px dashed #16a34a;
                                ">
                                    ${eventTitle}
                                </span>
                            </div>

                            <p style="
                                color: #666;
                                font-size: 15px;
                                line-height: 1.6;
                            ">
                                Thank you for booking with Eventoria
                            </p>

                        </div>

                        <!-- Footer -->
                        <div style="
                            background: #f9f9f9;
                            padding: 15px;
                            text-align: center;
                            font-size: 12px;
                            color: #999;
                            border-top: 1px solid #eee;
                        ">
                            © 2026 Eventoria. All rights reserved.
                        </div>

                    </div>

                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(
            `Booking confirmation email sent successfully to ${userEmail}`
        );

    } 
    catch (error) {

        console.error(
            `Error sending booking confirmation email to ${userEmail}:`,
            error
        );
    }
};