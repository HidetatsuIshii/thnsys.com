(function() {
    // 1. HTMLを書き出し（ボタンとサイドバー）
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
                <p class="sc-label" style="font-size:0.75rem; color:#aaccff; margin-bottom:5px;">ご相談窓口</p>
                <div class="sc-number" style="font-weight:bold; color:#fff;">03-4330-4444</div>
            </div>
            <div style="padding: 15px; display: flex; flex-direction: column; gap: 8px;">
                <a href="#" style="display: block; background: #00aaff; color: #fff; text-align: center; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 0.8rem; text-decoration: none;">💻 問い合わせ</a>
                <a href="#" style="display: block; background: #00aaff; color: #fff; text-align: center; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 0.8rem; text-decoration: none;">📩 要望</a>
            </div>
        </aside>
    `);

    // 2. 実行関数
    const initMobileMenu = () => {
        const btn = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (btn && sidebar) {
            // ボタンクリックイベント
            btn.onclick = (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('active');
                btn.classList.toggle('open');
            };

            // 画面外クリックで閉じる
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                    if (!sidebar.contains(e.target) && e.target !== btn) {
                        sidebar.classList.remove('active');
                        btn.classList.remove('open');
                    }
                }
            });
        }
    };

    // 3. 確実に実行させる（DOM構築後とページ完全読み込み後の2段階）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
    window.onload = initMobileMenu;
})();
