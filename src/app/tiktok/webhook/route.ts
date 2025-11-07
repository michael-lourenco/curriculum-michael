import { NextRequest, NextResponse } from 'next/server';
import { Webhooks } from '@/lib/tiktok';

export async function POST(request: NextRequest) {
  try {
    const webhooks = new Webhooks();
    const payload = await webhooks.getJsonPayloadData(request);
    console.log('Webhook received:', payload);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const challenge = searchParams.get('challenge');

    if (challenge) {
      return NextResponse.json({ challenge });
    }

    return NextResponse.json({ message: 'Webhook endpoint is active' });
  } catch (error: any) {
    console.error('Error in webhook GET:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

