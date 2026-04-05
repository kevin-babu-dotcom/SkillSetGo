import { NextResponse } from 'next/server';
import { OTP_STORE } from '../send-otp/route.js';

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and valid code are required' }, { status: 400 });
    }

    const record = OTP_STORE.get(email);
    
    if (!record) {
      return NextResponse.json({ error: 'No OTP found for this email or it expired' }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      OTP_STORE.delete(email);
      return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 });
    }

    if (record.code !== code) {
      return NextResponse.json({ error: 'Invalid OTP code' }, { status: 400 });
    }

    // Success! Clear it.
    OTP_STORE.delete(email);
    return NextResponse.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
