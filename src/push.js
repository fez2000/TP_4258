importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
  );
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin("task", {
    maxRetentionTime: 24 * 60
});
workbox.googleAnalytics.initialize();
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.core.setCacheNameDetails({
    prefix: "FC",
    suffix: "app",
    cacheName: "FC"
});
const FALLBACK_HTML_URL =  '/offline',
FALLBACK_IMAGE_URL = '/img/gray-art4.png';
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST,{
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/]
  });
workbox.precaching.precacheAndRoute(
    [
        { revision: '123456', url: FALLBACK_HTML_URL },
        { revision: '123456', url: FALLBACK_IMAGE_URL  },
   
    ]
)
workbox.routing.registerRoute(
    "https://cdn.jsdelivr.net/*",
    new workbox.strategies.NetworkFirst({
        plugins: [bgSyncPlugin]
    })
);
workbox.routing.registerRoute(
    "/api/*",
    new workbox.strategies.NetworkFirst({
        plugins: [bgSyncPlugin]
    })
);
workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: "googleapi",
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            bgSyncPlugin
        ]
    })
);
workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)$/,
    new workbox.strategies.CacheFirst({
        cacheName: "image-cache",
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 5*24 * 60 * 60, // 30 Days
                purgeOnQuotaError: true
            }),
            bgSyncPlugin
        ]
    })
);
workbox.routing.registerRoute(
    /.*\.(?:css|js|mjs|json)$/,
    new workbox.strategies.CacheFirst({
        cacheName: "style-and-script-cache",
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 5*24 * 60 * 60, 
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
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200] 
            }),
            bgSyncPlugin
        ]
    })
);



var networkFirst = new workbox.strategies.NetworkFirst({
  cacheName: 'cache-pages' 
});

const customHandler = async (args) => {
  try {
    const response = await networkFirst.handle(args);
    if(response) return response;
    if(!self.navigator.onLine){
     return caches.match( workbox.precaching.getCacheKeyForURL(FALLBACK_HTML_URL));
    }else{
     return   caches.match( workbox.precaching.getCacheKeyForURL(args.url))
    }
  } catch (error) {
    return  caches.match( workbox.precaching.getCacheKeyForURL(FALLBACK_HTML_URL));
  }
};
workbox.routing.registerRoute(
    ({ event }) => event.request.mode === "navigate",
    customHandler
);



self.addEventListener('notificationclick', function(event) {
    var notification = event.notification;
    var action = event.action;
    if (action === 'close') {
      notification.close();
    } else {
        if(event.data.url){
            clients.openWindow(event.data.url);
        }else{
            clients.openWindow(location.host);
        }
      
    }
  });
  
self.addEventListener("push", function(e) {
    
    var notif = JSON.parse(e.data.text());
    if(notif.showaction){
        notif.options.actions = [
            {action: 'explore', title: 'Ouvrir le site'},
            {action: 'close', title: 'Fermer'},
        ]
    }
    
    
    if (Notification.permission === "granted") {
        e.waitUntil(
          (()=>{
            
            let noti =
            self
            .registration
            .showNotification(notif.title, notif.options);
            console.log(noti)
          })()  
            // eslint-disable-next-line no-restricted-globals
            
        );
    }
});

