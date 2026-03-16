const CACHE_NAME = 'roompin-cache-v-2026-03-05-A';
// ▲▲▲ 変更ここまで ▲▲▲

const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js?v=fix02',
    './manifest.json',
    './icon-192-v4.png',   
    './icon-512-v4.png',
    './favicon.ico'
];

// インストール処理
self.addEventListener('install', (event) => {
    self.skipWaiting(); // 新しいSWを待機させずに即有効化
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// アクティブ化処理
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 新しいバージョン以外を削除
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // ページをすぐにコントロール下に置く
});

// フェッチ処理（ネットワーク第一戦略に修正）
self.addEventListener('fetch', (event) => {
    // API通信などはキャッシュせずネットワークへ
    if (event.request.url.includes('amazonaws.com')) {
        return;
    }

    event.respondWith(
        // 1. まずネットワークから最新の取得を試みる
        fetch(event.request).then((response) => {
            // 正常に取得できたらキャッシュを更新して返す
            if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
            }
            return response;
        }).catch(() => {
            // 2. ネットワークがオフライン等の場合はキャッシュから返す
            return caches.match(event.request);
        })
    );
});

// プッシュ通知を受け取った時の処理
self.addEventListener('push', function(event) {
    // データが空の場合のデフォルト値
    let title = "部屋ピン";
    let body = "更新があります";
    let url = "./index.html";

    if (event.data) {
        try {
            const json = event.data.json();
            title = json.title || title;
            body = json.body || body;
            // 通知データにURLが含まれていればそれを使う
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
        icon: "./icon-192-v4.png", // パスを明示
        badge: "./icon-192-v4.png", // Androidのステータスバー用
        vibrate: [100, 50, 100],
        data: {
            url: url
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 通知をクリックした時の処理
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // クリックされたURLを取得
    const targetUrl = event.notification.data.url || './index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // 既に開いているタブがあればフォーカスする
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                // 同じURL（またはアプリ内）ならフォーカス
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // 開いていなければ新しく開く
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
