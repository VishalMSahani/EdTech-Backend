import Razorpay from 'razorpay'

var instance = new Razorpay(
    {
        key_id: "process.env.KEY_ID",
        key_secret: "process.env.SECRET" 
    }
)

instance.payments.fetch(paymentId)

export default instance;