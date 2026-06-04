import { NextResponse } from "next/server";

const getBaseUrl = () => {
  return process.env.PESAPAL_ENV === "live" 
    ? "https://pay.pesapal.com/v3/api" 
    : "https://cybqa.pesapal.com/pesapalv3/api";
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, email, phone, first_name, last_name, order_id } = body;

    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const baseUrl = getBaseUrl();

    // 1. GET AUTH TOKEN
    const authRes = await fetch(`${baseUrl}/Auth/RequestToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ consumer_key: consumerKey, consumer_secret: consumerSecret }),
    });
    const authData = await authRes.json();
    if (!authData.token) throw new Error("Pesapal Auth Failed");
    const token = authData.token;

    // 2. REGISTER / GET IPN (Instant Payment Notification) URL
    // Pesapal requires this to know where to send payment confirmations
    const ipnUrl = `https://zapatoscave.com/api/pesapal/webhook`;
    let ipnId = "";

    const ipnRes = await fetch(`${baseUrl}/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ url: ipnUrl, ipn_notification_type: "POST" }),
    });
    const ipnData = await ipnRes.json();
    
    // If it already exists or just created, extract the ID
    if (ipnData.error && ipnData.error.message.includes("already registered")) {
      // Fetch existing IPNs
      const listRes = await fetch(`${baseUrl}/URLSetup/GetIpnList`, {
        headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` }
      });
      const listData = await listRes.json();
      const existingIpn = listData.find((ipn: any) => ipn.url === ipnUrl);
      ipnId = existingIpn?.ipn_id || listData[0].ipn_id;
    } else {
      ipnId = ipnData.ipn_id;
    }

    // 3. SUBMIT ORDER REQUEST
    const orderData = {
      id: order_id,
      currency: "KES",
      amount: amount,
      description: "Zapatos Cave Order",
      callback_url: "https://zapatoscave.com/checkout/success",
      notification_id: ipnId,
      billing_address: {
        email_address: email,
        phone_number: phone,
        first_name: first_name,
        last_name: last_name,
        country_code: "KE",
      }
    };

    const submitRes = await fetch(`${baseUrl}/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderData),
    });

    const submitResult = await submitRes.json();

    if (submitResult.redirect_url) {
      return NextResponse.json({ redirect_url: submitResult.redirect_url });
    } else {
      throw new Error("Failed to generate Pesapal redirect URL");
    }

  } catch (error: any) {
    console.error("PESAPAL ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}