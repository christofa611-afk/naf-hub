import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.YOUTUBE_API_KEY;
const channelId = 'UC41xXhw22o6Q2I2pTKB2kOg';

async function fetchVideos() {
  if (!apiKey) {
    console.error('❌ Error: YOUTUBE_API_KEY not found in environment variables.');
    // Create dummy data for testing if key is missing
    const dummyData = [{ id: 'demo', title: 'Add API Key to Secrets', description: 'Go to Settings > Secrets' }];
    ensureDir();
    fs.writeFileSync(path.join(__dirname, '../public/data/videos.json'), JSON.stringify(dummyData));
    return;
  }

  try {
    const youtube = google.youtube({ version: 'v3', auth: apiKey });
    
    const response = await youtube.search.list({
      part: 'snippet',
      channelId: channelId,
      maxResults: 25,
      order: 'date',
      type: 'video'
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt
    }));

    ensureDir();
    fs.writeFileSync(
      path.join(__dirname, '../public/data/videos.json'), 
      JSON.stringify(videos, null, 2)
    );
    console.log(`✅ Successfully fetched ${videos.length} videos.`);

  } catch (error) {
    console.error('❌ Error fetching videos:', error.message);
    // Fallback to empty array to prevent build crash
    ensureDir();
    fs.writeFileSync(path.join(__dirname, '../public/data/videos.json'), '[]');
  }
}

function ensureDir() {
  const dir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

fetchVideos();
