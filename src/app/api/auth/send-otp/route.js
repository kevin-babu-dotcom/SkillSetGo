import { NextResponse } from 'next/server';

// In-memory store for OTPs. In production, use Redis or Firestore.
export const OTP_STORE = new Map();

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store with 5-minute expiry
    OTP_STORE.set(email, {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    console.log(`\n================================`);
    console.log(`MOCK EMAIL SENT TO: ${email}`);
    console.log(`YOUR OTP IS: ${otp}`);
    console.log(`================================\n`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully (Check server console)' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
