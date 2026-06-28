"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderNotification = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
    }
});
const sendOrderNotification = async (orderData) => {
    const adminEmail = 'greenpublishersbd.com@gmail.com';
    const mailOptions = {
        from: `"Green Publishers Orders" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Order Placed! (Order Total: TK. ${orderData.totalAmount})`,
        html: `
      <h2>New Order Received!</h2>
      <p><strong>Customer Name:</strong> ${orderData.customerName}</p>
      <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
      <p><strong>Address:</strong> ${orderData.address}</p>
      <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
      <p><strong>Total Amount:</strong> TK. ${orderData.totalAmount}</p>
      
      <br />
      <h3>Items Ordered:</h3>
      <pre style="background: #f1f5f9; padding: 15px; border-radius: 8px;">${orderData.items}</pre>
      
      <br />
      <p>Please log in to your <a href="http://localhost:5173/admin">Admin Panel</a> to manage this order.</p>
    `
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Order notification email sent: ' + info.response);
    }
    catch (error) {
        console.error('Error sending order notification email:', error);
    }
};
exports.sendOrderNotification = sendOrderNotification;
