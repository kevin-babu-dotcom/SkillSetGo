import Razorpay from 'razorpay'

const key_id = process.env.RAZORPAY_KEY_ID
const key_secret = process.env.RAZORPAY_KEY_SECRET

if (!key_id || !key_secret) {
  throw new Error('Missing Razorpay env vars: RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET')
}

const razorpay = new Razorpay({ key_id, key_secret })

export default razorpay