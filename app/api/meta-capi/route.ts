import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Helper function to hash sensitive user data (SHA-256) required by Meta
function hashData(data: string | null | undefined): string | null {
  if (!data) return null;
  // Clean whitespace, convert to lowercase, and hash
  const cleaned = data.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return crypto.createHash('sha256').update(cleaned).digest('hex');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderReference, email, phone, totalAmount, eventName = 'Purchase' } = body;

    const DATASET_ID = '724724532257092';
    const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'META_CAPI_ACCESS_TOKEN is missing in environment variables' },
        { status: 500 }
      );
    }

    // Construct the Meta CAPI Payload
    const payload = {
      data: [
        {
          event_name: eventName, // 'Purchase' or 'InitiateCheckout'
          event_time: Math.floor(Date.now() / 1000),
          event_id: `ORDER_${orderReference}`, // Deduplication Key (e.g. ORDER_#4EE435E0)
          action_source: 'website',
          user_data: {
            em: email ? [hashData(email)] : [],
            ph: phone ? [hashData(phone)] : [],
          },
          custom_data: {
            currency: 'KES',
            value: Number(totalAmount),
          },
        },
      ],
    };

    // Execute server-to-server POST request to Meta
    const metaResponse = await fetch(
      `https://graph.facebook.com/v19.0/${DATASET_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const metaData = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('Meta CAPI Error:', metaData);
      return NextResponse.json({ success: false, metaData }, { status: 400 });
    }

    return NextResponse.json({ success: true, metaData });
  } catch (error: any) {
    console.error('Server CAPI Handler Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}