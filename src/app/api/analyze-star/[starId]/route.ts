import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { starId: string } }
) {
  try {
    const { starId } = params;

    if (!starId) {
      return NextResponse.json(
        { error: 'Se requiere un ID de estrella' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://backend-cshm.onrender.com/analyze-star/${starId}`, {
      method: 'GET',
      headers: {
        'X-API-Key': 'WXviSp$hK8',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'No se encontró la curva de luz para esta estrella', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling star analysis API:', error);
    return NextResponse.json(
      { error: 'Error al analizar la estrella' },
      { status: 500 }
    );
  }
}
