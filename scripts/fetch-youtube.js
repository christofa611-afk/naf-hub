import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// CONFIGURATION
const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UC41xXhw22o6Q2I2pTKB2kOg'; // Your Channel ID
async function fetchVideos() {
  if (!API_KEY) {
    console.error('❌ Error: YOUTUBE_API_KEY not found in secrets.');
    process.exit(1);
  }
  const youtube = google.youtube({ version: 'v3', auth: API_KEY });
  try {
    console.log('📡 Fetching videos from YouTube API...');
        // Fetch only public, published videos (max 50)
    const response = await youtube.search.list({
      part: 'snippet',
      channelId: CHANNEL_ID,
      maxResults: 50,
      order: 'date',
      type: 'video',
      event: 'completed', // Only finished videos
    });
    const items = response.data.items || [];
        if (items.length === 0) {
      console.warn('⚠️ No videos found.');
      return [];
    }
    const videos = items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
    console.log(`✅ Successfully fetched ${videos.length} videos.`);
    return videos;
  } catch (error) {
    console.error('❌ API Error:', error.message);
    process.exit(1);
  }
}
async function main() {
  const videos = await fetchVideos();
    // Ensure public/data directory exists
  const dataDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  // Save to JSON
  fs.writeFileSync(
    path.join(dataDir, 'videos.json'), 
    JSON.stringify(videos, null, 2)
  );
  console.log('💾 Data saved to public/data/videos.json');
}
main();
