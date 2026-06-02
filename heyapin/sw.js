// ==========================================================
// キャッシュ機能を廃止し、プッシュ通知専用にした sw.js
// ==========================================================

// インストール処理（即時有効化）
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
});

// アクティブ化処理（※過去の憎きキャッシュをここで全消去します！）
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('古いキャッシュを強制消去しました:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
    return self.clients.claim();
});

// ※ここに以前あった `fetch` イベント（キャッシュからファイルを返す処理）を
// 完全に削除したため、今後は常にS3から最新のファイルが読み込まれます！

// ==========================================================
// 以下、プッシュ通知の受信機能（そのまま残します）
// ==========================================================
self.addEventListener('push', function(event) {
    let title = "部屋ピン";
    let body = "更新があります";
    let url = "./index.html";

    if (event.data) {
        try {
            const json = event.data.json();
            title = json.title || title;
            body = json.body || body;
            if (json.data && json.data.url) {
                url = json.data.url;
            } else if (json.url) {
                url = json.url;
            }
        } catch (e) {
            body = event.data.text();
        }
    }

    const options = {
        body: body,
        icon: "./icon-192-v4.png", 
        badge: "./icon-192-v4.png",
        vibrate: [100, 50, 100],
        data: { url: url }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const targetUrl = event.notification.data.url || './index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
