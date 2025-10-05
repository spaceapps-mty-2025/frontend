import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('https://backend-cshm.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'WXviSp$hK8',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Error en la predicción', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling prediction API:', error);
    return NextResponse.json(
      { error: 'Error al realizar la predicción' },
      { status: 500 }
    );
  }
}
