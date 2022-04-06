const bgSyncPlugin = new workbox.backgroundSync.Plugin("myQueueName", {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.core.setCacheNameDetails({
    prefix: "JesusKing",
    suffix: "app",
    cacheName: "JesusKing"
});
workbox.routing.registerRoute(
    "/socket.io/socket.io.js",
    new workbox.strategies.NetworkFirst({
        plugins: [
            bgSyncPlugin
        ]
    })
);
workbox.routing.registerRoute(
    'https://cdn.jsdelivr.net/*',
    new workbox.strategies.NetworkFirst({
        plugins: [
            bgSyncPlugin
        ]
    })
)
workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: "googleapi",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            bgSyncPlugin
        ]
    })
);
workbox.routing.registerRoute(
    /\/api\/*\.(?:png|jpg|jpeg|svg|gif)$/,
    new workbox.strategies.CacheFirst({
        cacheName: "my-image-cache",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 1 * 60 * 60, // 30 Days
                purgeOnQuotaError: true
            }),
            bgSyncPlugin
        ]
    })
);

workbox.routing.registerRoute(
    "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic",
    new workbox.strategies.StaleWhileRevalidate({
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            bgSyncPlugin
        ]
    })
);

workbox.routing.registerRoute(
    "https://use.fontawesome.com/releases/v5.0.8/css/all.css",
    new workbox.strategies.StaleWhileRevalidate({
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            bgSyncPlugin
        ]
    })
);
workbox.routing.registerRoute(
    ({ event }) => event.request.mode === "navigate",
    async () => {
        const defaultBase = "/index.html";
        return caches
            .match(workbox.precaching.getCacheKeyForURL(defaultBase))
            .then(response => {
                return response || fetch(defaultBase);
            })
            .catch(err => {
                return fetch(defaultBase);
            });
    }
);
workbox.routing.registerRoute(
    new RegExp("/api/*"),
    new workbox.strategies.NetworkFirst()
);
self.addEventListener("push", function(e) {
    var notif = JSON.parse(e.data.text());
    if (Notification.permission === "granted") {
        e.waitUntil(
            // eslint-disable-next-line no-restricted-globals
            self.registration.showNotification(notif.title, notif.options)
        );
    }
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);
