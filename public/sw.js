// public/sw.js
const CACHE_NAME = 'madify-audio-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Handle audio proxy requests
  if (event.request.url.includes('/api/audio-proxy')) {
    event.respondWith(handleAudioProxy(event.request));
  }
});

async function handleAudioProxy(request) {
  try {
    // This would interface with your backend proxy
    // For now, just pass through
    return fetch(request);
  } catch (error) {
    return new Response('Audio proxy error', { status: 500 });
  }
}