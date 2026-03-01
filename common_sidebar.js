document.write(`
<button id="menu-toggle" class="menu-btn">
    <span></span>
    <span></span>
    <span></span>
</button>

<aside class="sidebar">
    <div class="sidebar-header">
        <h1 class="logo">
            <a href="/"><img src="images/logo.png" alt="TOHO HOUSE NEXT"></a>
        </h1>
        <div style="color: #003366; font-weight: bold; font-size: 0.9rem; margin-top: 5px;">システム課<br>作成ソフト一覧</div>
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
        <p class="sc-label">システムに関するご相談</p>
        <div class="sc-number">
            <img src="images/telicon.png" width="24" height="24" alt="電話" style="vertical-align: middle; margin-right:5px;">
            03-4330-4444
        </div>
    </div>

    <div style="padding: 0 15px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
        <a href="https://forms.gle/..." target="_blank" style="display: block; background: #00aaff; color: #fff; text-align: center; padding: 10px 0; border-radius: 6px; font-weight: bold; font-size: 0.8rem; text-decoration: none;">
            💻 既存ソフト専用<br>お問い合わせフォーム
        </a>
        <a href="https://forms.gle/..." target="_blank" style="display: block; background: #00aaff; color: #fff; text-align: center; padding: 10px 0; border-radius: 6px; font-weight: bold; font-size: 0.8rem; text-decoration: none;">
            📩 こんな事できたらなぁ<br>要望フォーム
        </a>
    </div>
</aside>
`);

// 動作スクリプト
(function() {
    function initMobileMenu() {
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

    if (document.readyState === 'complete') {
        initMobileMenu();
    } else {
        window.addEventListener('load', initMobileMenu);
    }
})();
