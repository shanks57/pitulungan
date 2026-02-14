const CACHE_NAME = 'siperkasa-v1.0.0';
const STATIC_CACHE = 'siperkasa-static-v1.0.0';
const DYNAMIC_CACHE = 'siperkasa-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/dashboard',
    '/offline',
    '/offline.html',
    '/site.webmanifest',
    '/build/manifest.json',
    '/build/assets/app.css',
    '/build/assets/app.js',
    '/assets/android/android-launchericon-192-192.png',
    '/assets/android/android-launchericon-512-512.png',
    '/assets/ios/192.png',
    '/assets/ios/512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Install event');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch((error) => {
                console.error('[SW] Error caching static assets:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activate event');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests
    if (!url.origin.includes(self.location.origin)) return;

    // Handle API requests differently
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful API responses
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // Return cached API response if available
                    return caches.match(request);
                })
        );
        return;
    }

    // Handle static assets and pages
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Cache the response
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/offline');
                        }
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle offline actions that need to be synced
    console.log('[SW] Performing background sync');
    // This could be extended to sync offline ticket submissions, comments, etc.
}

// Push notifications (web-push)
self.addEventListener('push', (event) => {
    console.log('[SW] Push received');

    if (!event.data) {
        console.log('[SW] Push received but no data');
        return;
    }

    try {
        const data = event.data.json();
        const options = {
            body: data.body || '',
            icon: data.icon || '/assets/android/android-launchericon-192-192.png',
            badge: data.badge || '/assets/android/android-launchericon-96-96.png',
            image: data.image || undefined,
            vibrate: [100, 50, 100],
            tag: data.tag || 'notification',
            requireInteraction: data.requireInteraction || true,
            data: {
                dateOfArrival: Date.now(),
                url: data.url || '/dashboard',
                primaryKey: data.primaryKey || Date.now()
            }
        };

        // Add actions if available
        if (data.actions && Array.isArray(data.actions)) {
            options.actions = data.actions;
        } else {
            options.actions = [
                {
                    action: 'view',
                    title: data.actionTitle || 'Lihat',
                    icon: '/assets/android/android-launchericon-96-96.png'
                },
                {
                    action: 'close',
                    title: 'Tutup'
                }
            ];
        }

        event.waitUntil(
            self.registration.showNotification(data.title || 'Notifikasi', options)
        );
    } catch (error) {
        console.error('[SW] Error processing push:', error);
        // Fallback notification
        event.waitUntil(
            self.registration.showNotification('Notifikasi Baru', {
                body: event.data.text(),
                icon: '/assets/android/android-launchericon-192-192.png',
            })
        );
    }
});

// Handle notification clicks and actions
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);

    event.notification.close();

    const urlToOpen = event.notification.data.url || '/dashboard';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if app is already open
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not open, open it
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});