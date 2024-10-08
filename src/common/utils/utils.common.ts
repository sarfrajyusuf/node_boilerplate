
import nodemailer from 'nodemailer'
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function sendPasswordResetEmail(email: string, resetToken: string) {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "30ee5e813554a8",
            pass: "1329d5ed6a59c2"
        }
    });
    const resetUrl = `http://localhost:8080/v1/users/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: '"Your App" <no-reply@yourapp.com>', // Sender address
        to: email, // Recipient email address
        subject: 'Password Reset Request',
        html: `
      <h3>Password Reset Request</h3>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

export async function generateGoogleAuthQRCode(userEmail: string): Promise<string> {
    // Step 1: Generate a TOTP secret
    const secret = speakeasy.generateSecret({ length: 20 });

    // Step 2: Create a URL for the QR code
    const otpauth = `otpauth://totp/${userEmail}?secret=${secret.base32}&issuer=walletApp`;

    // Step 3: Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    return qrCodeUrl; // Returns the QR code as a Data URL
}

// async function verifyGoogleAuthCode(userEmail: string, token: string): Promise<boolean> {
//     // Retrieve the user's secret from the database
//     const userSecret = await getUserTOTPSecret(userEmail);

//     // Verify the token
//     const isValid = speakeasy.totp.verify({
//         secret: userSecret,
//         encoding: 'base32',
//         token: token,
//     });

//     return isValid;
// }
