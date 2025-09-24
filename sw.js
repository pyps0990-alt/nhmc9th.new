self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/pages/about.html',
        '/pages/attendance.html',
        '/pages/admin.html',
        '/pages/checkin.html',
        '/pages/finance.html',
        '/pages/knowleddge.html',
        '/pages/map.html',
        '/pages/schedule.html',
        '/assets/images/NHMC.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
