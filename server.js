require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Endpoint for sending emails
app.post("/send-email", async (req, res) => {
    const { email } = req.body;
  
    console.log("Received request to send email to:", email);
  
    if (!email) {
      console.error("No email provided");
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Course Access & Telegram Support",
        html: `
          <h2>Thank You for Your Payment!</h2>
          <p>Your payment was successful. Please join our Telegram group here:</p>
          <a href="https://t.me/TargetCourseBot">Join Telegram</a>
        `,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email" });
    }
  });
  
// Listen on a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


