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
            <img src="images/telicon.png" width="28" height="28" alt="電話アイコン" style="vertical-align: middle;">
            03-4330-4444
        </div>
    </div>

    <div style="padding: 0 20px; margin-bottom: 20px;">
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdiudRL0RKO8iXlA-ITugtBdkkOjMn_Zro2fA8vIKAqcXLmXg/viewform" target="_blank" style="display: block; background: #00aaff; color: #fff; text-align: center; padding: 12px 0; border-radius: 6px; font-weight: bold; font-size: 0.9rem; text-decoration: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: 0.3s;">
            ✉️ 既存ソフト<br>問い合わせフォーム
        </a>
    </div>

    <div style="padding: 0 20px; margin-bottom: 20px; display: flex; gap: 8px;">
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfi1aOX0Ttv070YuDYiuiZcED0WqDrtYpd6aLYvfl2_qbGlDA/viewform?usp=publish-editor" target="_blank" style="flex: 1; display: flex; align-items: center; justify-content: center; background: #ff9900; color: #fff; text-align: center; padding: 10px 0; border-radius: 6px; font-weight: bold; font-size: 0.9rem; text-decoration: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: 0.3s;">
            💡 新規ご要望フォーム
        </a>
        <a href="https://docs.google.com/spreadsheets/d/1i5SI3GwsjRCBCd3ZYmACnh3ZQvfyZzVe3abCWBg2jyA/edit?gid=0#gid=0" target="_blank" style="display: flex; align-items: center; justify-content: center; background: #28a745; color: #fff; padding: 0 15px; border-radius: 6px; font-weight: bold; font-size: 0.9rem; text-decoration: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: 0.3s; white-space: nowrap;">
            回答
        </a>
    </div>

    <div class="sidebar-footer">
    </div>
</aside>
`);

// ▼ 追加：ボタンの動作設定
(function() {
    function init() {
        const btn = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (!btn || !sidebar) return;

        btn.onclick = function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            btn.classList.toggle('open');
        };

        document.addEventListener('click', function(e) {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== btn) {
                sidebar.classList.remove('active');
                btn.classList.remove('open');
            }
        });
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
    else { init(); }
})();
