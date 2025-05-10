
import axios from 'axios';

// API Key (Use Caution - this should be in an environment variable for production)
const DAILY_API_KEY = "9fda41a42d3044b139f1489f1563b90322b40086fe11172f15a37d364f12c1be";

export async function createDailyRoom() {
  try {
    const res = await axios.post(
      'https://api.daily.co/v1/rooms',
      {
        properties: {
          enable_chat: true,
          start_video_off: false,
          start_audio_off: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data.url;
  } catch (error) {
    console.error("Error creating Daily.co room:", error);
    throw error;
  }
}
