(function() {
    // 1. 【最優先】スマホ用スタイルをHTMLの最下部に直接注入する
    const injectStyle = () => {
        const css = `
            @media (max-width: 768px) {
                /* 全体のレイアウトを縦並びに強制変更 */
                .wrapper { display: block !important; flex-direction: column !important; }
                
                /* サイドバーを画面外（左側）へ飛ばす */
                .sidebar {
                    position: fixed !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 280px !important;
                    height: 100vh !important;
                    transform: translateX(-100%) !important;
                    transition: transform 0.3s ease-out !important;
                    z-index: 9999 !important;
                    margin-left: 0 !important;
                    box-shadow: 5px 0 15px rgba(0,0,0,0.3) !important;
                }
                
                /* activeクラスがついたら画面に出現 */
                .sidebar.active { transform: translateX(0) !important; }
                
                /* メインコンテンツを横幅いっぱいに広げる */
                .main-content {
                    margin-left: 0 !important;
                    width: 100% !important;
                    padding-top: 70px !important;
                    display: block !important;
                }

                /* ハンバーガーボタン（三本線）の設置 */
                .menu-btn {
                    display: flex !important;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: fixed;
                    top: 15px;
                    left: 15px;
                    width: 45px;
                    height: 45px;
                    background: #003366 !important;
                    border: none;
                    border-radius: 5px;
                    z-index: 10000 !important;
                    cursor: pointer;
                    gap: 5px;
                }
                .menu-btn span {
                    display: block;
                    width: 25px;
                    height: 3px;
                    background: #fff;
                    transition: 0.3s;
                }
                /* 開いている時は「X」に変形 */
                .menu-btn.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
                .menu-btn.open span:nth-child(2) { opacity: 0; }
                .menu-btn.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
            }
        `;
        const styleTag = document.createElement('style');
        styleTag.innerHTML = css;
        document.head.appendChild(styleTag);
    };

    // 2. サイドバーとボタンのHTMLを出力
    document.write(`
        <button id="menu-toggle" class="menu-btn" style="display:none;">
            <span></span><span></span><span></span>
        </button>
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1 class="logo">
                    <a href="/"><img src="images/logo.png" alt="TOHO HOUSE NEXT"></a>
                </h1>
                <div style="color: #003366; font-weight: bold; font-size: 0.85rem; margin-top: 5px; line-height:1.2;">システム課<br>作成ソフト一覧</div>
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
                <p class="sc-label" style="font-size:0.7rem; color:#aaccff; margin-bottom:5px;">システムに関するご相談</p>
                <div class="sc-number" style="font-weight:bold; font-size:0.9rem;">
                    <img src="images/telicon.png" width="20" height="20" alt="TEL" style="vertical-align: middle; margin-right:3px;">
                    03-4330-4444
                </div>
            </div>
            <div style="padding: 15px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <a href="https://forms.gle/..." target="_blank" style="display: block; background: #00aaff; color: #fff; text-align: center; padding: 10px 5px; border-radius: 6px; font-weight: bold; font-size: 0.75rem; text-decoration: none;">
                    💻 既存ソフト専用窓口
                </a>
                <a href="https://forms.gle/..." target="_blank" style="display: block; background: #00aaff; color: #fff; text-align: center; padding: 10px 5px; border-radius: 6px; font-weight: bold; font-size: 0.75rem; text-decoration: none;">
                    📩 ご要望フォーム
                </a>
            </div>
        </aside>
    `);

    // 3. クリック動作の設定
    const init = () => {
        injectStyle();
        const btn = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (!btn || !sidebar) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            btn.classList.toggle('open');
        });

        // 画面のどこかをタップしたら閉じる
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== btn) {
                sidebar.classList.remove('active');
                btn.classList.remove('open');
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
