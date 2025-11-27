const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'YOUR_EMAIL@gmail.com',
        pass: process.env.EMAIL_PASS || 'YOUR_APP_PASSWORD'
    }
});

// Route to handle form submissions
app.post('/send-form', (req, res) => {
    const formData = req.body;
    console.log("New Form Received:", formData);

    const mailOptions = {
        from: process.env.EMAIL_USER || 'YOUR_EMAIL@gmail.com',
        to: process.env.EMAIL_TO || 'WHERE_TO_RECEIVE@gmail.com',
        subject: `New Form Submission: ${formData.subject || 'Website Contact'}`,
        text: `
            Name: ${formData.name}
            Email: ${formData.email}
            Message: ${formData.message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
            res.status(500).json({ error: "Error sending email. Check server logs." });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: "Form submitted successfully!" });
        }
    });
});

// Home Route
app.get('/', (req, res) => {
    res.send('Your Custom Form Server is Running! 🚀');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
