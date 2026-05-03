export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // 1. Get Access Token from PesaPal
    const authRes = await fetch("https://pay.pesapal.com/v3/api/Auth/RequestToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }),
    });
    const { token } = await authRes.json();

    // 2. Submit Order to get the Payment URL
    const orderRes = await fetch("https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: `PE-${Date.now()}`, // Unique Order ID
        currency: "UGX",
        amount: req.body.amount,
        description: `Deposit for ${req.body.propertyName}`,
        callback_url: "https://pearl-estate.netlify.app/success", 
        notification_id: "YOUR_IPN_ID", // We will get this next
        billing_address: {
          email_address: req.body.email,
          phone_number: req.body.phone
        }
      }),
    });

    const data = await orderRes.json();
    res.status(200).json(data); // Sends the redirect_url back to your button
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
