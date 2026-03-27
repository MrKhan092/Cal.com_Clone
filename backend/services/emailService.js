const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the default transport
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBookingConfirmation = async (bookingDetails) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email bypassed: Configure EMAIL_USER and EMAIL_PASS in your .env to send real emails.');
    return;
  }
  const mailOptions = {
    from: `"Cal.com Clone" <${process.env.EMAIL_USER}>`,
    to: bookingDetails.email,
    subject: `Booking Confirmed!`,
    text: `Hi ${bookingDetails.name},\n\nYour booking is officially confirmed!\n\nDate: ${bookingDetails.date}\nTime: ${bookingDetails.startTime} - ${bookingDetails.endTime}\n\nWe look forward to speaking with you!`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent instantly to ${bookingDetails.email}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

const sendBookingCancellation = async (bookingDetails) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  
  const mailOptions = {
    from: `"Cal.com Clone" <${process.env.EMAIL_USER}>`,
    to: bookingDetails.email,
    subject: `Booking Cancelled`,
    text: `Hi ${bookingDetails.name},\n\nYour booking for the date ${bookingDetails.date} from ${bookingDetails.startTime} to ${bookingDetails.endTime} has been cancelled.\n\nSorry for any inconvenience!`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Cancellation email sent to ${bookingDetails.email}`);
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingCancellation
};
