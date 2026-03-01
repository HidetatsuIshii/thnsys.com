(function() {
    // 1. JavaScriptから最優先のCSS（!important付き）を直接注入
    // これにより、既存のstyle.cssの設定を強制的に上書きしてサイドバーを隠します。
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 768px) {
            /* 全体を縦並びに強制し、横幅を100%にする */
            .wrapper { display: block !important; }
            
            /* サイドバーを画面外（左側）へ隠す */
            .sidebar {
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 260px !important;
                height: 100vh !important;
                transform: translateX(-100%) !important;
                transition: transform 0.3s ease !important;
                z-index: 9999 !important;
                margin-left: 0 !important;
                box-shadow: none !important;
            }

            /* activeクラスがついた時だけ画面内にスライド */
            .sidebar.active {
                transform: translateX(0) !important;
                box-shadow: 5px 0 15px rgba(0,0,0,0.3) !important;
            }

            /* メインコンテンツを全幅（横幅いっぱい）にする */
            .main-content {
                margin-left: 0 !important;
                width: 100% !important;
                display: block !important;
                padding-top: 60px !important;
            }

            /* 三本線ボタン（ハンバーガーメニュー）を強制表示 */
            .menu-btn {
                display: flex !important;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: fixed;
                top: 10px;
                left: 10px;
                width: 44px;
                height: 44px;
                background: #003366 !important;
                border: none;
                border-radius: 4px;
                z-index: 10000 !important;
                cursor: pointer;
                gap: 4px;
            }

            /* 三本線のデザイン */
            .menu-btn span {
                display: block;
                width: 24px;
                height: 2px;
                background: #fff;
                transition: 0.3s;
            }
            
            /* メニューが開いている時に三本線を「X」にする */
            .menu-btn.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
            .menu-btn.open span:nth-child(2) { opacity: 0; }
            .menu-btn.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        }
    `;
    document.head.appendChild(style);

    // 2. サイドバーとボタンのHTML構造を出力
    document.write(`
        <button id="menu-toggle" class="menu-btn" style="display:none;">
            <span></span><span></span><span></span>
        </button>
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1 class="logo">
                    <a href="/"><img src="images/logo.png" alt="TOHO HOUSE NEXT"></a>
                </h1>
                <div style="color: #003366; font-weight: bold; font-size: 0.85rem; margin-top: 5px;">システム課 作成ソフト一覧</div>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li>
                        <a href="#" class="tab-link active">稼働中のシステム</a>
                        <ul class="submenu open">
                            <li><a href="001_suumoquick.html">・SuumoQuick</a></li>
                            <li><a href="002_multiquick.html">・MultiQuick</a></li>
                            <li><a href="003_autobukkaku.html">・Auto物確</a></li>
                            <li><a href="004_tohouploader.html">・東宝アップローダー</a></li>
                            <li><a href="005_pdfcutter.html">・PDFCutter</a></li>
                            <li><a href="006_kashikabackup.html">・KASHIKA自動バックアップ</a></li>
                            <li><a href="007_kashikasummary.html">・KASHIKAデータ集計</a></li>
                            <li><a href="008_voicecatch.html">・コエキャッチ</a></li>
                            <li><a href="009_syslog.html">・シスろぐ</a></li>
                            <li><a href="013_heyapin.html">・部屋ピン</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="tab-link">開発検討中</a>
                        <ul class="submenu open">
                            <li><a href="010_automadorizu.html">・Auto間取り図</a></li>
                            <li><a href="011_pecuronquick.html">・ペキュロンクイック</a></li>
                            <li><a href="012_tohocopynote.html">・TohoCopyNote</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <div class="sidebar-contact">
                <p class="sc-label" style="font-size:0.75rem; color:#aaccff; margin-bottom:5px;">システムに関するご相談</p>
                <div class="sc-number" style="font-weight:bold; color:#fff;">03-4330-4444</div>
            </div>
            <div style="padding: 15px; display: flex; flex-direction: column; gap: 8px;">
                <a href="https://forms.gle/..." target="_blank" style="display: block; background: #00aaff; color: #fff; text-align: center; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 0.8rem; text-decoration: none;">💻 お問い合わせフォーム</a>
                <a href="https://forms.gle/..." target="_blank" style="display: block; background: #00aaff; color: #fff; text-align: center; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 0.8rem; text-decoration: none;">📩 要望フォーム</a>
            </div>
        </aside>
    `);

    // 3. クリックイベントを登録
    function initMenu() {
        const btn = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (!btn || !sidebar) return;

        btn.onclick = function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            btn.classList.toggle('open');
        };

        // メニュー外タップで閉じる
        document.addEventListener('click', function(e) {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== btn) {
                sidebar.classList.remove('active');
                btn.classList.remove('open');
            }
        });
    }

    // 読み込み完了後に実行
    if (document.readyState === 'complete') { initMenu(); }
    else { window.addEventListener('load', initMenu); }
})();
