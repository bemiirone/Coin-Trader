import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { env } from '../config/env';
import { sendPasswordResetEmail } from '../services/email.service';

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    console.log(`\n📧 Password reset requested for: ${email}`);

    if (!email) {
      console.log('❌ Email is required');
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log('ℹ️  User not found - returning success message for security');
      return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent' });
    }

    console.log('✅ User found in database');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const resetExpires = new Date(Date.now() + 3600000);

    console.log('🔑 Reset token generated');
    console.log(`   Token expires at: ${resetExpires.toLocaleString()}`);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    console.log('📝 Reset token saved to database');

    const resetUrl = `${env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

    console.log(`\n📤 Attempting to send reset email to: ${user.email}`);
    console.log(`   SMTP Config: ${env.SMTP_HOST}:${env.SMTP_PORT}, User: ${env.SMTP_USER}`);
    console.log(`   Reset URL: ${resetUrl}\n`);

    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      console.log('✅ Reset email sent successfully\n');
    } catch (emailError) {
      console.log('❌ Email send failed:');
      if (emailError instanceof Error) {
        console.log(`   Error: ${emailError.message}`);
        console.log(`   Stack: ${emailError.stack}`);
      } else {
        console.log(`   Error: ${JSON.stringify(emailError, null, 2)}`);
      }
      console.log('\n⚠️  Reset token remains valid - you can use the URL above to test manually\n');
    }

    res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent' });
  } catch (error) {
    console.log('❌ Unexpected error in requestPasswordReset:');
    if (error instanceof Error) {
      console.log(`   Error: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
      res.status(500).json({ error: error.message });
    } else {
      console.log(`   Error: ${JSON.stringify(error, null, 2)}`);
      res.status(500).json({ error: 'Failed to request password reset' });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    console.log('\n🔐 Reset password attempt');
    console.log(`   Token received: ${token?.substring(0, 10)}...`);

    if (!token || !password) {
      console.log('❌ Token and password are required');
      return res.status(400).json({ message: 'Token and password are required' });
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    console.log('   Looking for user with valid token...');

    const user = await User.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user || !user.resetPasswordToken) {
      console.log('❌ No user found with valid token');
      console.log('   Possible causes: Token never generated, expired, or already used');
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    console.log(`✅ User found: ${user.email}`);
    console.log(`   Token valid until: ${user.resetPasswordExpires?.toLocaleString()}`);

    const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);

    if (!isValidToken) {
      console.log('❌ Token comparison failed - tokens do not match');
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    console.log('🔍 Token comparison: MATCH');

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('✅ Password reset successful\n');

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.log('❌ Unexpected error in resetPassword:');
    if (error instanceof Error) {
      console.log(`   Error: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
      res.status(500).json({ error: error.message });
    } else {
      console.log(`   Error: ${JSON.stringify(error, null, 2)}`);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }
};
