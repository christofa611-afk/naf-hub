<template>
  <div class="app">
    <header>
      <h1>Nature Frontiers Hub</h1>
      <p>Real Wildlife Documentaries & Global Conservation News</p>
    </header>
    <section class="videos-section">
      <h2>🎥 Latest from Nature Frontiers</h2>
      <div class="grid">
        <div v-for="video in videos" :key="video.id" class="card video-card">
          <a :href="video.url" target="_blank" class="link-overlay"></a>
          <img :src="video.thumbnail" :alt="video.title" loading="lazy" />
          <div class="play-icon">▶</div>
          <div class="info">
            <h3>{{ video.title }}</h3>
            <span class="date">{{ new Date(video.publishedAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="news-section">
      <h2>📰 Global Nature News</h2>
      <div class="news-list">
        <div v-for="item in newsItems" :key="item.title" class="news-item">
          <a :href="item.link" target="_blank">
            <h4>{{ item.title }}</h4>
            <span class="source">{{ item.source }}</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
const videos = ref([]);
const newsItems = ref([
  { title: "Loading news...", link: "#", source: "Aggregator" }
]);
onMounted(async () => {
  // Load Videos
  try {
    const res = await fetch('./data/videos.json');
    videos.value = await res.json();
  } catch (e) {
    console.error("Failed to load videos", e);
  }
  // Load Mock News (In a real app, fetch these via backend to avoid CORS)
  newsItems.value = [
    { title: "New Species Discovered in Amazon", link: "https://www.nationalgeographic.com", source: "National Geographic" },
    { title: "Rhino Population Rebounds in Kruger", link: "https://www.krugerpark.co.za", source: "Kruger Park" },
    { title: "Ocean Temperatures Hit Record High", link: "https://www.oceana.org", source: "Oceana" },
    { title: "Conservation Efforts Save Endangered Birds", link: "https://www.audubon.org", source: "Audubon" }
  ];
});
</script>
<style>
body { margin: 0; font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #fff; }
.app { max-width: 1200px; margin: 0 auto; padding: 20px; }
header { text-align: center; padding: 60px 20px; background: linear-gradient(to right, #064e3b, #065f46); border-radius: 12px; margin-bottom: 40px; }
h1 { font-size: 3rem; margin: 0; color: #34d399; }
h2 { border-left: 5px solid #34d399; padding-left: 15px; margin-top: 40px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
.card { background: #1e293b; border-radius: 8px; overflow: hidden; position: relative; transition: transform 0.2s; }
.card:hover { transform: translateY(-5px); }
.card img { width: 100%; height: 180px; object-fit: cover; }
.play-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; pointer-events: none; }
.info { padding: 15px; }
h3 { margin: 0 0 8px; font-size: 1.1rem; line-height: 1.4; }
.date { color: #94a3b8; font-size: 0.9rem; }
.link-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; }
.news-list { display: flex; flex-direction: column; gap: 15px; }
.news-item { background: #1e293b; padding: 15px; border-radius: 8px; }
.news-item a { text-decoration: none; color: inherit; display: block; }
.news-item h4 { margin: 0 0 5px; color: #34d399; }
.source { font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
</style>
