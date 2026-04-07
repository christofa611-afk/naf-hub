<template>
  <div class="app">
    <header>
      <h1>Nature Frontiers Hub</h1>
      <p>Latest from UC41xXhw22o6Q2I2pTKB2kOg</p>
    </header>
    <main class="grid">
      <div v-for="video in videos" :key="video.id" class="card">
        <img :src="video.thumbnail" :alt="video.title" />
        <h3>{{ video.title }}</h3>
        <a :href="'https://www.youtube.com/watch?v=' + video.id" target="_blank">Watch Now</a>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const videos = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('./data/videos.json');
    videos.value = await res.json();
  } catch (e) {
    console.error("Error loading videos", e);
  }
});
</script>

<style>
body { font-family: sans-serif; background: #111; color: #fff; margin: 0; }
.app { max-width: 1000px; margin: 0 auto; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
.card { background: #222; padding: 10px; border-radius: 8px; }
img { width: 100%; border-radius: 4px; }
a { display: inline-block; margin-top: 10px; color: #4caf50; text-decoration: none; }
</style>
