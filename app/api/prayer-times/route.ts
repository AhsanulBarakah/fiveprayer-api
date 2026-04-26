import { NextResponse } from 'next/server';
import { fetchPrayerTimes } from '../../../lib/api';

export async function GET() {
  try {
    console.log('API Key available:', !!process.env.FIVEPRAYER_API_KEY);
    const prayerTimes = await fetchPrayerTimes();
    return NextResponse.json(prayerTimes);
  } catch (error) {
    console.error('Error in prayer-times API:', error);
    let errorMessage = 'Failed to fetch prayer times';
    if (error instanceof Error) {
      // Try to parse JSON error message
      try {
        const errorJson = JSON.parse(error.message);
        errorMessage = errorJson.message || error.message;
      } catch {
        errorMessage = error.message;
      }
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
