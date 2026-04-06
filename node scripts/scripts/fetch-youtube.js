import fs from 'fs';
import axios from 'axios';
const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID || 'UC41xXhw22o6Q2I2pTKB2kOg';
if (!API_KEY) {
  console.error('❌ Error: YOUTUBE_API_KEY is missing in GitHub Secrets.');
  process.exit(1);
}
async function fetchVideos() {
  try {
    console.log(`📡 Fetching videos for channel ${CHANNEL_ID}...`);
        // Fetch only public, published videos (max 50)
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`;
        const response = await axios.get(url);
    const items = response.data.items;
    if (!items || items.length === 0) {
      console.warn('⚠️ No videos found.');
      fs.writeFileSync('public/data/videos.json', JSON.stringify([]));
      return;
    }
    const videos = items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
    // Ensure public/data folder exists
    if (!fs.existsSync('public/data')) {
      fs.mkdirSync('public/data', { recursive: true });
    }
    fs.writeFileSync('public/data/videos.json', JSON.stringify(videos, null, 2));
    console.log(`✅ Successfully fetched ${videos.length} videos.`);
  } catch (error) {
    console.error('❌ Failed to fetch videos:', error.response ? error.response.data : error.message);
    process.exit(1); // Stop build if fetch fails
  }
}
fetchVideos();
