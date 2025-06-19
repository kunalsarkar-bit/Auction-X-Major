// controllers/UserControllers/contactController/contactController.js
const nodemailer = require("nodemailer");
const Contact = require("../../../models/UserModels/Contact/Contact");

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        code: "ERROR",
        message: "All fields are required to send a message.",
        theme: "dark",
        timestamp: new Date().toISOString(),
      });
    }

    // Save to database
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHTML = `
      <div style="background-color: #1a1a1a; padding: 20px; font-family: Arial, sans-serif; color: #f1f1f1; border-radius: 10px;">
        <h2 style="color: #e2b714;">New Contact Form Submission</h2>
        <hr style="border-top: 1px solid #333;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #f1f1f1; text-decoration: underline;">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #333; padding: 15px; border-radius: 5px; color: #d3d3d3;">
          ${message.replace(/\n/g, "<br>")}
        </div>
        <hr style="border-top: 1px solid #333;">
        <p style="font-size: 12px; color: #666;">This message was sent from your website contact form.</p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      code: "SUCCESS",
      message: "Your message was sent successfully! We'll get back to you soon.",
      theme: "dark",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      code: "ERROR",
      message: "Oops! An error occurred while sending your message. Please try again later.",
      theme: "dark",
      timestamp: new Date().toISOString(),
      errorDetail: error.message,
    });
  }
};


// @desc    Get all contact requests
// @route   GET /api/contact
// @access  Public
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Contact Request by ID
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact request not found" });
        }

        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = { submitContact, getAllContacts,getContactById };
