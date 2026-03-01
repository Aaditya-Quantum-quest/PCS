import { NextResponse } from 'next/server';

// POST - Create new nameplate order
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📦 Received order data:', body);
    
    const { design, size, customer, shippingAddress } = body;

    if (!design || !size || !customer || !shippingAddress) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const orderId = body.orderId || `NP${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const orderData = {
      orderId,
      _id: orderId,
      ...body,
      createdAt: new Date().toISOString()
    };

    console.log('✅ Order created successfully:', orderData);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        orderId: orderData.orderId,
        _id: orderData._id,
        total: orderData.pricing.total
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order', error: error.message },
      { status: 500 }
    );
  }
}

// GET - Test endpoint
export async function GET(request) {
  return NextResponse.json({
    success: true,
    message: 'Nameplate Orders API is working! ✅',
    timestamp: new Date().toISOString()
  });
}
