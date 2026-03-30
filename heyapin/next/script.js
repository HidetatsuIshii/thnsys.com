/* ==============================================
   1. 定数定義 & 設定
   ============================================== */
const API_URL = "https://reiafc2mje.execute-api.ap-northeast-1.amazonaws.com";
// --- ★修正：拠点名をURLから取得 (oji または nerima) ---
const CURRENT_BRANCH = window.location.pathname.split('/').filter(p => p && p !== 'heyapin')[0] || 'default';

// --- ★修正：キー名に拠点名を付与するように変更 ---
const SESSION_KEY_USER = `bookingApp_User_${CURRENT_BRANCH}`;
const SESSION_KEY_TIME = `bookingApp_LoginTime_${CURRENT_BRANCH}`;
const SESSION_DURATION = 15 * 24 * 60 * 60 * 1000;   
let pendingExternalData = null; // SS連携データの一時保存用
let currentViewMode = 'day'; // 'day', 'week', 'month' のいずれか
let activeBranchFilter = 'nerima'; // ★追加: 候補者リストの初期タブ状態

const IMG_7F = "data:image/png;base64,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"
const IMG_6F = "data:image/png;base64,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"

const mapConfig = {
    hq: { // ★ここを 7 から hq に変更しています
        image: IMG_7F, 
        areas: [
            { id: "Z 角", name: "Z 角", top: 11.1, left: 0.0, width: 12.0, height: 7.1, color: "rgba(0, 100, 255, 0.3)" },
            { id: "Z 中", name: "Z 中", top: 0.0, left: 56.0, width: 12.0, height: 6.8, color: "rgba(0, 100, 255, 0.3)" },
            { id: "会議室2", name: "会議室2", top: 15.0, left: 79.0, width: 21.0, height: 22.5, color: "rgba(0, 200, 80, 0.3)" },
            { id: "会議室1", name: "会議室1", top: 37.3, left: 79.0, width: 21.0, height: 15.0, color: "rgba(0, 200, 80, 0.3)" },
            { id: "応接室(8人)", name: "応接室(8人)", top: 71.0, left: 0.0, width: 22.5, height: 28.5, color: "rgba(255, 165, 0, 0.3)" },
            { id: "応接室(6人)", name: "応接室(6人)", top: 76.5, left: 22.6, width: 20.0, height: 23.0, color: "rgba(255, 165, 0, 0.3)" },
        ]
    },
    6: {
        image: IMG_6F,
        areas: [
             { id: "Ｚ １", name: "Ｚ １", top: 0.0, left: 63.4, width: 6.0, height: 17.7, color: "rgba(0, 100, 255, 0.3)" },
             { id: "Ｚ ２", name: "Ｚ ２", top: 0.0, left: 69.3, width: 6.0, height: 17.7, color: "rgba(0, 100, 255, 0.3)" },
             { id: "Ｚ ３", name: "Ｚ ３", top: 0.0, left: 75.4, width: 6.0, height: 17.7, color: "rgba(0, 100, 255, 0.3)" },
             { id: "応接室(10人)", name: "応接室(10人)", top: 0.0, left: 81.5, width: 18.2, height: 44.2, color: "rgba(255, 165, 0, 0.3)" },
             { id: "Ｚ ４", name: "Ｚ ４", top: 44.5, left: 88.8, width: 11.1, height: 7.0, color: "rgba(0, 100, 255, 0.3)" },
             { id: "Ｚ ５", name: "Ｚ ５", top: 51.9, left: 88.8, width: 11.1, height: 7.0, color: "rgba(0, 100, 255, 0.3)" },
             { id: "Ｚ ６", name: "Ｚ ６", top: 59.0, left: 88.8, width: 11.1, height: 7.2, color: "rgba(0, 100, 255, 0.3)" },
             { id: "Ｚ ７", name: "Ｚ ７", top: 66.4, left: 88.8, width: 11.1, height: 7.0, color: "rgba(0, 100, 255, 0.3)" },
             { id: "Ｚ ８", name: "Ｚ ８", top: 73.5, left: 88.8, width: 11.1, height: 7.5, color: "rgba(0, 100, 255, 0.3)" },
        ]
    }
};
const START_HOUR = 7;
const END_HOUR = 22;
const BASE_HOUR_HEIGHT = 100; 

let currentUser = null;
// 全ての項目を [] (空の配列) で初期化し、データが無くてもエラーにならないようにします
let masterData = { 
  rooms: [], 
  users: [], 
  reservations: [], 
  logs: [], 
  groups: [],
  returnReports: [], 
  allReturnReports: [] ,
  titleTags: []
};
let activeReportId = null;
let pendingTitle = "";

// 状態管理変数
let selectedParticipantIds = new Set();
let groupCreateSelectedIds = new Set();
let originalParticipantIds = new Set();
let currentMapRoomId = null; 
let currentFloor = 'hq'; 
let currentTimelineFloor = 'hq';
let currentLogPage = 1;
const LOGS_PER_PAGE = 50;
let isDeleteMode = false;
let isEditMode = false;
let currentDetailRes = null;
let hourRowHeights = {}; 
let notifiedReservationIds = new Set();

/* ==============================================
   2. 初期化 & API通信
   ============================================== */
window.onload = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // ▼▼▼ 追加：ページ読み込みのたびにSWの更新があるか確認する ▼▼▼
      reg.update(); 
      console.log('SW登録成功');
    }).catch(err => console.error('SW登録失敗', err));

    // 2. コントローラー（SW）が切り替わったらリロードする
    // (sw.jsの skipWaiting() と clients.claim() によって発火します)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      console.log("新しいバージョンを検知しました。リロードします。");
      window.location.reload();
    });
  }
checkUrlParamsForLogin();
  const d = new Date();
  
  // ローカル時間（端末の時間）に基づいて YYYY-MM-DD 文字列を作成
  const y = d.getFullYear();
  const m = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const todayStr = `${y}-${m}-${day}`;

  // .value に直接文字列をセットする（UTCズレを回避）
  if(document.getElementById('timeline-date')) document.getElementById('timeline-date').value = todayStr;
  if(document.getElementById('map-date')) document.getElementById('map-date').value = todayStr;

  checkAutoLogin();
  initMapResizer();
// ▼▼▼ ここから追加：日付エリアの横広がりを修正する処理 ▼▼▼
  const fixDateLayout = (inputId) => {
      const inputEl = document.getElementById(inputId);
      if (inputEl && inputEl.parentElement) {
          const parent = inputEl.parentElement;
          parent.style.display = "flex";
          parent.style.justifyContent = "center"; // 中央に寄せる
          parent.style.alignItems = "center";
          parent.style.gap = "15px"; // ボタンと日付の間に少し隙間をあける
          
          // 日付入力欄が勝手に横に伸びるのを防ぐ
          inputEl.style.width = "auto";
          inputEl.style.maxWidth = "160px"; 
          inputEl.style.flex = "none";
      }
  };
  fixDateLayout('map-date');       // マップタブの日付を修正
  fixDateLayout('timeline-date');  // 全部屋タブの日付を修正
  // ▲▲▲ 追加ここまで ▲▲▲
};

async function callAPI(params) {
  if(API_URL.indexOf("http") === -1) { alert("GASのURLを設定してください"); return { status: 'error' }; }
  document.getElementById('loading').style.display = 'flex';
  const options = { method: 'POST', body: JSON.stringify(params), headers: { 'Content-Type': 'text/plain;charset=utf-8' } };
  try {
    const res = await fetch(API_URL, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    document.getElementById('loading').style.display = 'none';
    if (json.status === 'error') { alert("システムエラー: " + json.message); return { status: 'error' }; }
    return json;
  } catch(e) {
    document.getElementById('loading').style.display = 'none';
    alert("通信エラー: " + e.message);
    return { status: 'error' };
  }
}

async function tryLogin() {
    // フォームから値を取得し、即座にトリム
    const idInput = document.getElementById('loginId');
    const passInput = document.getElementById('loginPass');
    
    const id = idInput.value.trim();
    const pass = passInput.value.trim();

    if(!id || !pass) {
        alert("IDとパスワードを入力してください");
        return;
    }

    document.getElementById('loading').style.display = 'flex';
    
    // fetchのbodyとして確実にJSONを送信
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'login',
                userId: id,
                password: pass
            })
        });

        const json = await response.json();
        document.getElementById('loading').style.display = 'none';
        
        if (json.status === 'success') {
            currentUser = json.user;
            document.getElementById('display-user-name').innerText = currentUser.userName;
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app-screen').style.display = 'flex'; 
            
            localStorage.setItem(SESSION_KEY_USER, JSON.stringify(currentUser));
            localStorage.setItem(SESSION_KEY_TIME, new Date().getTime().toString());
            loadAllData();
        } else { 
            alert(json.message); 
        }
    } catch (e) {
        document.getElementById('loading').style.display = 'none';
        alert("通信エラーが発生しました");
    }
}

function checkAutoLogin() {
  const storedUser = localStorage.getItem(SESSION_KEY_USER);
  const storedTime = localStorage.getItem(SESSION_KEY_TIME);

  if (storedUser && storedTime) {
    const now = new Date().getTime();
    const loginTime = parseInt(storedTime, 10);

    if (now - loginTime < SESSION_DURATION) {
      try {
        currentUser = JSON.parse(storedUser);
        document.getElementById('display-user-name').innerText = currentUser.userName;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-screen').style.display = 'flex'; 
        loadAllData();
        return;
      } catch (e) {
        console.error("保存データの読み込みに失敗しました", e);
      }
    } else {
      console.log("セッション有効期限切れです");
      localStorage.removeItem(SESSION_KEY_USER);
      localStorage.removeItem(SESSION_KEY_TIME);
    }
  }
}

function logout() { 
  // --- ★修正：現在の拠点のキーのみ削除 ---
  localStorage.removeItem(SESSION_KEY_USER);
  localStorage.removeItem(SESSION_KEY_TIME);
  location.reload(); 
}
async function loadAllData(isUpdate = false, isBackground = false) {
  if (!isBackground) document.getElementById('loading').style.display = 'flex';
  
  const url = new URL(API_URL);
  url.searchParams.append('action', 'getAllData');
  url.searchParams.append('_t', new Date().getTime()); 
  
  try {
    const res = await fetch(url.toString(), { method: 'GET', headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
    const json = await res.json();
    
    if (!isBackground) document.getElementById('loading').style.display = 'none';

   if (json.status === 'success') {
      // ▼▼▼ ここから追加：他拠点のユーザー名に拠点マークを自動付与 ▼▼▼
      if (json.data && json.data.users) {
          json.data.users.forEach(u => {
              // 所属(branch)が空ではなく、かつ「練馬(nerima)」ではない場合
              if (u.branch && u.branch !== 'nerima') {
                  // branch名（例: next）を大文字にして【NEXT】というバッジを作る
                  let prefix = '【' + u.branch.toUpperCase() + '】';
                  // まだバッジが付いていなければ名前にくっつける
                  if (!u.userName.startsWith(prefix)) {
                      u.userName = prefix + u.userName;
                  }
              }
          });
      }
      // 既存の masterData のプロパティを維持しつつ、届いたデータでマージする
      masterData = {
          ...masterData,
          ...json.data
      };
      
      if (isUpdate) {
         refreshUI();
      } else {
         initUI();
         checkUrlParamsForBooking(); 
      }
    } else { 
      if (!isBackground) alert("読込エラー: " + json.message); 
    }
  } catch(e) { 
    if (!isBackground) document.getElementById('loading').style.display = 'none'; 
    console.error("通信エラー(バックグラウンド):", e);
  }
}

/* --- ▼▼▼ 修正: フィルタ機能（ユーザーID紐付け版） ▼▼▼ --- */
const FILTER_STORAGE_KEY_BASE = 'roompin_filter_state_v2';// キーのベース名
let activeFilterIds = new Set(['ALL']); // デフォルトは全表示

let viewFilters = {
    day: ['ALL'],
    week: ['ALL'],
    month: ['ALL']
};

function loadFilterState() {
    if (!currentUser || !currentUser.userId) return;

    const userKey = `${FILTER_STORAGE_KEY_BASE}_${CURRENT_BRANCH}_${currentUser.userId}`;
    const saved = localStorage.getItem(userKey);

    if (saved) {
        try {
            const state = JSON.parse(saved);
            // モードごとのフィルターを復元
            if (state.viewFilters) {
                viewFilters = state.viewFilters;
            }
            // 最後に開いていた表示モードを復元
            if (state.currentViewMode) {
                currentViewMode = state.currentViewMode;
            }
            // ハイライトIDは共通または必要に応じて復元
            if (state.highlightId) {
                currentMapRoomId = state.highlightId;
            }

            // 現在のモードのフィルターを activeFilterIds にセット
            activeFilterIds = new Set(viewFilters[currentViewMode] || ['ALL']);
        } catch (e) {
            console.error("フィルター読み込みエラー", e);
            activeFilterIds = new Set(['ALL']);
        }
    } else {
        activeFilterIds = new Set(['ALL']);
    }
}

function saveFilterState() {
    if (!currentUser || !currentUser.userId) return;

    // 現在の activeFilterIds を現在のモードの配列として保存
    viewFilters[currentViewMode] = Array.from(activeFilterIds);

    const userKey = `${FILTER_STORAGE_KEY_BASE}_${CURRENT_BRANCH}_${currentUser.userId}`;
    const state = {
        viewFilters: viewFilters,
        currentViewMode: currentViewMode,
        highlightId: currentMapRoomId
    };
    localStorage.setItem(userKey, JSON.stringify(state));
}
// フィルタボタンを描画する (タイムラインの日付上に表示)
function renderTimelineFilters() {
  const container = document.getElementById('timeline-filter-row');
  if (!container) return;
  container.innerHTML = "";

  // 「全部屋」ボタン
  const allBtn = document.createElement('div');
  const isAll = activeFilterIds.has('ALL');
  allBtn.className = 'filter-btn btn-all' + (isAll ? ' active' : '');
  allBtn.innerText = "全部屋";
  /* script.js : renderTimelineFilters 関数内 */
  allBtn.onclick = () => {
    // --- 修正: 週表示の時に日表示へ戻してしまう制限を削除 ---
    activeFilterIds.clear();
    activeFilterIds.add('ALL');
    currentMapRoomId = null; 
    saveFilterState();
    renderTimelineFilters();
    renderVerticalTimeline('map'); 
  };
  container.appendChild(allBtn);

  // 各部屋のボタン
  if (masterData && masterData.rooms) {
    const sortedRooms = [...masterData.rooms].sort((a, b) => a.roomName.localeCompare(b.roomName, 'ja', { numeric: true }));

    sortedRooms.forEach(room => {
      const rId = String(room.roomId);
      const btn = document.createElement('div');
      const isActive = activeFilterIds.has(rId);
      
      btn.className = 'filter-btn' + (isActive ? ' active' : '');
      btn.innerText = room.roomName;
      
      btn.onclick = () => {
        // --- 修正: 週表示の時だけ単一選択にするロジックを削除し、一律でトグル処理にする ---
        if (activeFilterIds.has('ALL')) {
          activeFilterIds.clear();
          activeFilterIds.add(rId);
        } else {
          if (activeFilterIds.has(rId)) {
            activeFilterIds.delete(rId);
          } else {
            activeFilterIds.add(rId);
          }
        }
        
        if (activeFilterIds.size === 0) {
          activeFilterIds.add('ALL');
          currentMapRoomId = null;
        }

        if (activeFilterIds.has(rId)) {
            currentMapRoomId = rId;
        }

        saveFilterState();
        renderTimelineFilters();
        renderVerticalTimeline('map');
      };
      
      container.appendChild(btn);
    });
  }
}
/* ==============================================
   3. UI初期化・更新・タブ切り替え
   ============================================== */
/* --- script.js 修正後：initUIブロック --- */
/* --- script.js：initUIブロックを以下に書き換え --- */
/* script.js の 240行目付近にある initUI 関数を以下に差し替え */
function initUI() {
  updateRoomSelect();
  renderGroupButtons();
  loadFilterState();
  const viewButtons = document.querySelectorAll('.btn-view');
  viewButtons.forEach(btn => {
      const modeMap = { '日': 'day', '週': 'week', '月': 'month' };
      const btnMode = modeMap[btn.innerText];
      btn.classList.toggle('active', btnMode === currentViewMode);
  });
  renderTimelineFilters();
  
  // 1. 今日の日付をセット
  const d = new Date();
  const y = d.getFullYear();
  const m = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const todayStr = `${y}-${m}-${day}`;

  const dateInput = document.getElementById('map-date');
  if(dateInput) {
      dateInput.value = todayStr;
      // ★修正: updateWeeklyBar ではなく updateMonthlyCalendar を呼ぶ
      updateMonthlyCalendar(); 
  }
  
  currentFloor = 'hq'; 
  // ★重要: マップを描画してからタイムラインを表示
  renderHQMap();
  
  const timelineSection = document.getElementById('map-timeline-section');
  if(timelineSection) {
      timelineSection.style.display = 'block';
      timelineSection.classList.remove('map-timeline-hidden');
  }
  
  renderVerticalTimeline('map'); 
  document.getElementById('view-map-view').classList.add('active');

  initCustomTimePickers();
  updateRefreshTime();
  updateDayDisplay('map-date');
  startPolling();
  ensurePushSubscription();
  loadHolidays();
  checkReturnReports();
}

/* --- 自動更新 (ポーリング) --- */
const POLLING_INTERVAL_ACTIVE = 20000;   
const POLLING_INTERVAL_IDLE   = 600000;  
const IDLE_TIMEOUT            = 60000;   

let pollingTimer = null;
let idleCheckTimer = null;
let isUserIdle = false;
let lastActivityTime = new Date().getTime();

function initIdleDetection() {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(evt => {
        window.addEventListener(evt, () => {
            lastActivityTime = new Date().getTime();
            if (isUserIdle) {
                console.log("操作検知: アクティブモード復帰");
                isUserIdle = false;
                loadAllData(true, true);
                restartPolling(POLLING_INTERVAL_ACTIVE);
            }
        }, { passive: true });
    });

    if (idleCheckTimer) clearInterval(idleCheckTimer);
    idleCheckTimer = setInterval(() => {
        const now = new Date().getTime();
        if (!isUserIdle && (now - lastActivityTime > IDLE_TIMEOUT)) {
            console.log("アイドルモード移行");
            isUserIdle = true;
            restartPolling(POLLING_INTERVAL_IDLE);
        }
    }, 5000);
}

function restartPolling(interval) {
    if (pollingTimer) clearInterval(pollingTimer);
    pollingTimer = setInterval(() => {
        const modalOpen = document.querySelectorAll('.modal[style*="display: flex"]').length > 0;
        if (!modalOpen) {
            console.log(`自動更新実行 (${interval/1000}秒間隔)`);
            loadAllData(true, true);
        }
    }, interval);
}

function startPolling() {
    initIdleDetection();
    restartPolling(POLLING_INTERVAL_ACTIVE);
}

/* --- script.js 修正後：refreshUIブロック --- */
function refreshUI() {
  renderLogs();
  renderGroupButtons();
  updateRoomSelect();
  renderTimelineFilters();

  if (document.getElementById('view-receive-logs').classList.contains('active')) {
      renderReceiveLogs();
  }

  if (document.getElementById('view-map-view').classList.contains('active')) {
      renderHQMap(); 
      if(document.getElementById('map-timeline-section').style.display !== 'none') {
          renderVerticalTimeline('map');
      }
  }
  checkReturnReports();
}

function updateRoomSelect() {
  const roomSelect = document.getElementById('input-room');
  if (roomSelect) {
    const currentVal = roomSelect.value;
    roomSelect.innerHTML = "";
    
    // ▼▼▼ 修正：プルダウンの選択肢も部屋名（数字）で並び替える ▼▼▼
    const sortedRooms = [...masterData.rooms].sort((a, b) => a.roomName.localeCompare(b.roomName, 'ja', { numeric: true }));
    sortedRooms.forEach(r => {
      const op = document.createElement('option');
      op.value = r.roomId;
      op.innerText = r.roomName;
      roomSelect.appendChild(op);
    });
    if(currentVal) roomSelect.value = currentVal;
  }
}

/* switchTab 関数をこれに置き換え */
function switchTab(tabName) {
  document.querySelectorAll('.view-container').forEach(el => el.classList.remove('active'));
  const targetView = document.getElementById('view-' + tabName);
  if(targetView) targetView.classList.add('active');
  
  const backBtn = document.getElementById('btn-header-back');
  if (backBtn) {
      // 履歴または受信履歴の時に戻るボタンを表示
      backBtn.style.display = (tabName === 'logs' || tabName === 'receive-logs') ? 'inline-block' : 'none';
  }

  if (tabName === 'map-view') {
    setTimeout(() => { renderHQMap(); }, 50); 
  } else if (tabName === 'logs') {
      renderLogs();
  } else if (tabName === 'receive-logs') { 
      renderReceiveLogs();
  }
}

/* --- script.js 修正後：renderHQMapブロック --- */
/* ==============================================
   修正: マップ描画 (7階と6階の両方を描画)
   ============================================== */
function renderHQMap() {
    // 7階と6階の両方を処理する
    const floors = ['7', '6'];
    const now = new Date();

    floors.forEach(floor => {
        // mapConfigのキーが "hq" になっている場合の対策も含む
        const config = (floor === '7' && mapConfig['hq']) ? mapConfig['hq'] : mapConfig[floor];
        if (!config) return;

        const imgEl = document.getElementById(`map-img-${floor}`);
        const container = document.getElementById(`overlay-container-${floor}`);
        if (!imgEl || !container) return;

        if (!imgEl.src || imgEl.src !== config.image) {
            imgEl.src = config.image;
            imgEl.onload = () => {
                 if(typeof initMapResizer === 'function') initMapResizer();
            };
        }

        container.innerHTML = '';

        config.areas.forEach(area => {
            const div = document.createElement("div");
            div.className = "map-click-area"; 
            
            if (area.name.indexOf("会議室") !== -1) div.classList.add("type-meeting");
            else if (area.name.indexOf("応接室") !== -1) div.classList.add("type-reception");

            div.style.position = "absolute";
            div.style.top = area.top + "%";
            div.style.left = area.left + "%";
            div.style.width = area.width + "%";
            div.style.height = area.height + "%";
            
            div.style.display = "flex";
            div.style.justifyContent = "center";
            div.style.alignItems = "center";
            div.style.textAlign = "center";
            div.style.fontSize = "clamp(9px, 2.5vw, 14px)"; 
            div.style.lineHeight = "1.1";
            div.style.fontWeight = "bold";
            div.style.boxSizing = "border-box";
            div.style.padding = "2px";
            div.style.whiteSpace = "pre-wrap"; 
            div.style.overflow = "hidden"; 
            div.innerText = area.name.replace(" ", "\n").replace("(", "\n(");

            let isBusy = false;
            if (masterData && masterData.reservations) {
                isBusy = masterData.reservations.some(res => {
                    const rId = String(getVal(res, ['resourceId', 'roomId', 'room_id', 'resource_id', '部屋ID'])).trim();
                    if (rId !== String(area.id).trim() && rId !== String(area.name).trim()) return false;
                    
                    const startStr = res._startTime || res.startTime || res.start_time;
                    const endStr = res._endTime || res.endTime || res.end_time;
                    if (!startStr || !endStr) return false;

                    const rStart = new Date(String(startStr).replace(/-/g, '/'));
                    const rEnd = new Date(String(endStr).replace(/-/g, '/'));
                    return (now >= rStart && now < rEnd);
                });
            }

            if (isBusy) {
                div.style.backgroundColor = area.color || "rgba(255, 0, 0, 0.4)";
                const darkerColor = area.color ? area.color.replace('0.4', '0.8') : "red";
                div.style.border = `2px solid ${darkerColor}`;
            } else {
                div.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
                div.style.border = "1px dashed #666";
                div.style.color = "#333";
            }
            
            div.setAttribute('data-room-id', area.id);
            div.onclick = function() { selectRoomFromMap(this); };
            container.appendChild(div);
        });
    });
}

/* script.js 内の selectRoomFromMap 関数を以下のように差し替え */

function selectRoomFromMap(element) {
  const roomId = element.getAttribute('data-room-id');
  
  // masterData.rooms の中身をログ出力して、APIから何が届いているか確認してください
  console.log("現在保持している部屋リスト:", masterData.rooms);

  const roomObj = masterData.rooms.find(r => String(r.roomId).trim() === String(roomId).trim());
  
  if (!roomObj) {
      // 一致しない場合、どのIDを探して何が存在したかを表示します
      console.warn(`データベースに存在しない部屋IDがクリックされました: ${roomId}`);
      console.log("DB上の有効なID一覧:", masterData.rooms.map(r => r.roomId));
      return;
  }
  // モードを「日」に切り替え
  currentViewMode = 'day';
  const viewButtons = document.querySelectorAll('.btn-view');
  viewButtons.forEach(btn => btn.classList.toggle('active', btn.innerText === '日'));

  // フィルタ設定（クリックした部屋だけを表示）
  activeFilterIds.clear();
  activeFilterIds.add(roomId); 
  
  saveFilterState();            
  renderTimelineFilters();      
  currentMapRoomId = roomId;

  // タイムラインの表示更新
  const timelineSection = document.getElementById('map-timeline-section');
  if (timelineSection) {
      timelineSection.style.display = 'block';
      const parentView = document.getElementById('view-map-view');
      if (parentView) {
          parentView.scrollTo({
              top: timelineSection.offsetTop - 10,
              behavior: 'smooth'
          });
      }
  }

  renderVerticalTimeline('map', true);
}
/* ==============================================
   5. タイムライン関連処理
   ============================================== */
function switchTimelineFloor(floor) {
    currentTimelineFloor = floor;
    document.querySelectorAll('#view-timeline .floor-tab').forEach(tab => tab.classList.remove('active'));
    const activeTab = document.getElementById(`timeline-tab-${floor}f`);
    if(activeTab) activeTab.classList.add('active');
    renderVerticalTimeline('all');
}

function changeDate(days, inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const d = new Date(input.value);
  d.setDate(d.getDate() + days);
  input.valueAsDate = d;
  updateDayDisplay(inputId);
  if(inputId === 'map-date') renderVerticalTimeline('map');
}

function drawTimeAxis(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  
  const header = document.createElement('div');
  header.className = 'time-axis-header';
  header.style.height = "40px"; 
  header.style.minHeight = "40px"; 
  header.style.flexShrink = "0";
  container.appendChild(header);

  for (let i = START_HOUR; i < END_HOUR; i++) {
      const height = hourRowHeights[i] || BASE_HOUR_HEIGHT;
      const div = document.createElement('div');
      div.className = 'time-label';
      div.innerText = i + ":00";
      div.style.height = height + "px";
      div.style.minHeight = height + "px";
      container.appendChild(div);
  }
}
/* ==============================================
   レンダリング: 垂直タイムライン (日・週表示対応)
   ============================================== */
function renderVerticalTimeline(mode, shouldScroll = false) {
    if (typeof currentViewMode !== 'undefined') {
        if (currentViewMode === 'week') return renderMatrixWeekTimeline(mode, shouldScroll);
        // ★ここを1行追加！月表示の時は専用の関数を呼ぶ
        if (currentViewMode === 'month') return renderMatrixMonthTimeline(mode, shouldScroll);
    }

    let container, dateInputId, targetRooms, timeAxisId;

    if (mode === 'all') {
        container = document.getElementById('rooms-container-all');
        dateInputId = 'timeline-date';
        timeAxisId = 'time-axis-all';
        const floorConfig = mapConfig['hq'];
        if (floorConfig) {
            const floorRoomIds = floorConfig.areas.map(area => String(area.id)); 
            targetRooms = masterData.rooms.filter(r => floorRoomIds.includes(String(r.roomId)));
        } else { targetRooms = []; }
    } else if (mode === 'map') {
        container = document.getElementById('rooms-container-map');
        dateInputId = 'map-date';
        timeAxisId = 'time-axis-map';
        targetRooms = [];
        
        // ▼▼▼ 修正：7階と6階の両方から部屋情報を取得する ▼▼▼
        const floors = ['7', '6'];
        floors.forEach(floor => {
            const config = (floor === '7' && mapConfig['hq']) ? mapConfig['hq'] : mapConfig[floor];
            if (config && config.areas) {
                config.areas.forEach(area => {
                    const room = masterData.rooms.find(r => 
                        String(r.roomId).trim() === String(area.id).trim()
                    );
                    if (room && !targetRooms.includes(room)) {
                        targetRooms.push(room);
                    }
                });
            }
        });
        // ▲▲▲ 修正ここまで ▲▲▲
        if (!activeFilterIds.has('ALL')) {
            targetRooms = targetRooms.filter(r => activeFilterIds.has(String(r.roomId)));
        }
        // ▼▼▼ 追加：タイムラインの列を部屋名（数字）で並び替える ▼▼▼
        targetRooms.sort((a, b) => a.roomName.localeCompare(b.roomName, 'ja', { numeric: true }));
    } else { return; }

    const headerContainer = document.getElementById('map-room-headers');
    if (mode === 'map' && headerContainer) {
        headerContainer.style.display = 'flex';
        headerContainer.innerHTML = "";
        const spacer = document.createElement('div');
        spacer.className = 'sticky-header-spacer'; 
        headerContainer.appendChild(spacer);
    } else if (headerContainer) {
        headerContainer.style.display = 'none';
    }

    if (!targetRooms || targetRooms.length === 0) {
        if (container) container.innerHTML = "<div style='padding:20px;'>部屋データが見つかりません。</div>";
        return;
    }

    const mapWrapper = document.querySelector('.map-wrapper');
    const scrollableParent = container ? container.closest('.calendar-scroll-area') : null;
    const verticalScrollTarget = document.getElementById('view-map-view'); // ★追加
    let savedScrollTop = 0, savedScrollLeft = 0;

    if (!shouldScroll) {
        // ★修正: mapWrapper ではなく verticalScrollTarget から取得
        if (mode === 'map' && verticalScrollTarget) { savedScrollTop = verticalScrollTarget.scrollTop; } 
        else if (scrollableParent) { savedScrollTop = scrollableParent.scrollTop; }
        if (scrollableParent) { savedScrollLeft = scrollableParent.scrollLeft; }
    }

    if (container) {
        container.innerHTML = "";
        if (mode === 'map') { container.style.height = "auto"; container.style.overflowY = "visible"; } 
        else { container.style.height = "100%"; container.style.overflowY = "auto"; }
        container.style.width = "100%"; container.style.overflowX = "visible"; 
        container.style.display = "flex"; container.style.flexWrap = "nowrap";
        container.style.flexDirection = "row";
        container.style.alignItems = "flex-start"; container.style.position = "relative";
        container.style.cursor = "default"; container.style.userSelect = "none";
    }

    let isDown = false, startX, startY, startScrollLeftVal, startScrollTopVal, hasDragged = false, isTouch = false, rafId = null; 
    if (scrollableParent) {
        scrollableParent.addEventListener('touchstart', () => { isTouch = true; }, { passive: true });
        // ★修正: vScrollTarget を mapWrapper から verticalScrollTarget に変更
        const vScrollTarget = (mode === 'map') ? verticalScrollTarget : scrollableParent;
        scrollableParent.style.cursor = "default";
        scrollableParent.onwheel = (e) => { if (e.ctrlKey) return; if (e.deltaX !== 0 || e.shiftKey) { e.preventDefault(); scrollableParent.scrollLeft += (e.deltaX || e.deltaY); } };
        scrollableParent.onmousedown = (e) => {
            if (isTouch || e.target.closest('.v-booking-bar') || ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'].includes(e.target.tagName)) return;
            isDown = true; hasDragged = false; scrollableParent.style.cursor = "grabbing";
            startX = e.pageX; startY = e.pageY; startScrollLeftVal = scrollableParent.scrollLeft; startScrollTopVal = vScrollTarget ? vScrollTarget.scrollTop : 0;
            document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
        };
        const onMouseMove = (e) => {
            if (!isDown || isTouch) return; e.preventDefault(); if (rafId) return;
            rafId = requestAnimationFrame(() => {
                const walkX = (e.pageX - startX) * 1.5; const walkY = (e.pageY - startY) * 1.5;
                if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) hasDragged = true;
                scrollableParent.scrollLeft = startScrollLeftVal - walkX;
                if (vScrollTarget) vScrollTarget.scrollTop = startScrollTopVal - walkY;
                rafId = null;
            });
        };
        const onMouseUp = () => {
            isDown = false; if (scrollableParent) scrollableParent.style.cursor = "default";
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp);
            setTimeout(() => { hasDragged = false; }, 50);
        };
    }

    const rawDateVal = document.getElementById(dateInputId).value;
    const baseDate = new Date(rawDateVal);
    let columns = [];

    targetRooms.forEach(room => {
        columns.push({
            id: String(room.roomId),
            title: room.roomName,
            dateObj: baseDate,
            dateNum: formatDateToNum(baseDate),
            roomObj: room,
            isHighlight: (mode === 'map' && String(room.roomId) === String(currentMapRoomId)),
            dateStr: rawDateVal
        });
    });

    hourRowHeights = {}; 
    for (let h = START_HOUR; h < END_HOUR; h++) hourRowHeights[h] = BASE_HOUR_HEIGHT;
    const DYNAMIC_CHARS_PER_LINE = 12;

    const allRelevantReservations = masterData.reservations.filter(res => {
        const startTimeVal = getVal(res, ['startTime', 'start_time', '開始日時', '開始']);
        if (!startTimeVal) return false;
        const safeStart = String(startTimeVal).replace(/-/g, '/');
        const rId = String(getVal(res, ['resourceId', 'roomId', 'room_id', 'resource_id', '部屋ID']));
        const resDateNum = formatDateToNum(new Date(safeStart));
        
        res._startTime = safeStart;
        const endTimeVal = getVal(res, ['endTime', 'end_time', '終了日時', '終了']);
        res._endTime = String(endTimeVal).replace(/-/g, '/');
        res._resourceId = rId;

        const isTargetRoom = targetRooms.some(r => String(r.roomId) === rId);
        return isTargetRoom && (resDateNum === columns[0].dateNum);
    });

    allRelevantReservations.forEach(res => {
        const start = new Date(res._startTime);
        const sHour = start.getHours();
        let displayText = getVal(res, ['title', 'subject', '件名', 'タイトル']) || '予約';
        const titleLines = Math.ceil(displayText.length / DYNAMIC_CHARS_PER_LINE) || 1;
        const contentHeightPx = (titleLines * 15) + 65;
        let durationMin = (new Date(res._endTime) - new Date(res._startTime)) / 60000;
        if (durationMin < 15) durationMin = 15;
        const ratio = durationMin / 60;
        const requiredHourHeight = contentHeightPx / ratio;
        if (sHour >= START_HOUR && sHour < END_HOUR) {
            if (requiredHourHeight > hourRowHeights[sHour]) hourRowHeights[sHour] = requiredHourHeight;
        }
    });

    const hourTops = {};
    let currentTop = 0;
    for (let h = START_HOUR; h < END_HOUR; h++) {
        hourTops[h] = currentTop;
        currentTop += hourRowHeights[h];
    }
    hourTops[END_HOUR] = currentTop;

    let nowTopPx = -1;
    const now = new Date();
    if (columns.some(c => c.dateNum === formatDateToNum(now))) {
        const nowH = now.getHours();
        const nowM = now.getMinutes();
        if (nowH >= START_HOUR && nowH < END_HOUR) {
            nowTopPx = hourTops[nowH] + (hourRowHeights[nowH] * (nowM / 60));
        }
    }

    drawTimeAxis(timeAxisId);
    const axisContainer = document.getElementById(timeAxisId);
    if (axisContainer && container) {
        if (mode === 'map') {
            const extraHeader = axisContainer.querySelector('.time-axis-header');
            if (extraHeader) extraHeader.remove();
            axisContainer.style.height = currentTop + "px";
            axisContainer.style.overflow = "visible";
            axisContainer.classList.remove('matrix-axis-width');
        } else if (mode === 'all') {
            axisContainer.style.height = container.style.height;
            axisContainer.style.overflow = "hidden";
            axisContainer.scrollTop = savedScrollTop;
        }
        axisContainer.style.display = "block";
    }

    columns.forEach(col => {
        const divCol = document.createElement('div');
        divCol.className = 'room-col';
        if (mode === 'map' && col.isHighlight) divCol.classList.add('target-highlight');
        
        if (mode === 'map' && headerContainer) {
            const stickyHeader = document.createElement('div');
            stickyHeader.className = 'sticky-header-item'; 
            stickyHeader.innerText = col.title;

            if (col.isHighlight) {
                stickyHeader.style.backgroundColor = '#fff9c4';
                divCol.classList.add('target-highlight');
            }
            // ▼▼▼ 修正：他の部屋を消さずに、ハイライト対象だけを変更する ▼▼▼
            stickyHeader.style.cursor = "pointer";
            stickyHeader.onclick = () => {
                currentMapRoomId = col.id; // ハイライトする部屋のIDだけを更新
                renderVerticalTimeline('map', false);
            };

            headerContainer.appendChild(stickyHeader);
        } else {
            const header = document.createElement('div');
            header.className = 'room-header';
            header.innerText = col.title;
            divCol.appendChild(header);
        }

        const body = document.createElement('div');
        body.className = 'room-grid-body';
        body.style.height = currentTop + "px";
        body.style.position = "relative";
        body.style.cursor = "pointer"; 
        body.dataset.roomId = col.id;
        body.dataset.dateStr = col.dateStr;
        body.addEventListener('dragover', handleDragOver);
        body.addEventListener('drop', handleDropOnTimeline);
        
        if (nowTopPx !== -1 && col.dateNum === formatDateToNum(now)) {
            const line = document.createElement('div');
            line.className = 'current-time-line';
            line.style.top = nowTopPx + "px";
            line.style.position = 'absolute';
            line.style.left = '0'; line.style.width = '100%'; line.style.height = '2px';
            line.style.borderTop = '2px solid red'; line.style.zIndex = '50';
            line.style.pointerEvents = 'none';
            body.appendChild(line);
        }

        for (let h = START_HOUR; h < END_HOUR; h++) {
            const slot = document.createElement('div');
            slot.className = 'grid-slot';
            slot.style.height = hourRowHeights[h] + "px";
            slot.style.boxSizing = "border-box";
            slot.style.borderBottom = "1px dotted #eee";
            body.appendChild(slot);
        }

        body.onclick = (e) => {
            if (!isTouch && hasDragged) return;
            if (e.target.closest('.v-booking-bar')) return;
            const rect = body.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            let clickedHour = -1;
            let clickedMin = 0;
            for (let h = START_HOUR; h < END_HOUR; h++) {
                const top = hourTops[h];
                const bottom = hourTops[h + 1] !== undefined ? hourTops[h + 1] : (top + hourRowHeights[h]);
                if (clickY >= top && clickY < bottom) {
                    clickedHour = h;
                    const height = bottom - top;
                    const relativeY = clickY - top;
                    if (relativeY >= height / 2) clickedMin = 30;
                    break;
                }
            }
            if (clickedHour !== -1) {
                const rId = col.roomObj ? col.roomObj.roomId : null;
                openModal(null, rId, clickedHour, clickedMin, col.dateStr);
            }
        };

        const reservations = allRelevantReservations.filter(res => String(res._resourceId) === col.id);

        reservations.forEach(res => {
            const start = new Date(res._startTime);
            const end = new Date(res._endTime);
            let sHour = start.getHours();
            let sMin = start.getMinutes();
            let eHour = end.getHours();
            let eMin = end.getMinutes();

            if (sHour < START_HOUR) { sHour = START_HOUR; sMin = 0; }
            if (eHour >= END_HOUR) { eHour = END_HOUR; eMin = 0; }

            if (sHour < END_HOUR && (sHour > START_HOUR || (sHour === START_HOUR && sMin >= 0))) {
                const topPx = hourTops[sHour] + (hourRowHeights[sHour] * (sMin / 60));
                let bottomPx = 0;
                if (eHour === END_HOUR) bottomPx = hourTops[END_HOUR];
                else bottomPx = hourTops[eHour] + (hourRowHeights[eHour] * (eMin / 60));

                let heightPx = bottomPx - topPx;
                const minHeightPx = hourRowHeights[sHour] * (15 / 60);
                if (heightPx < minHeightPx) heightPx = minHeightPx;

                const bar = document.createElement('div');
                let cssType = col.roomObj ? col.roomObj.type : 'meeting';
                if (!cssType && col.roomObj) {
                    if (col.roomObj.roomName.indexOf("応接室") !== -1) cssType = "reception";
                    else if (col.roomObj.roomName.indexOf("Z") !== -1 || col.roomObj.roomName.indexOf("Ｚ") !== -1) cssType = "zoom";
                    else cssType = "meeting";
                }
                // 安全装置: 該当しない場合は強制的に meeting (青) にする
                if (!['meeting', 'reception', 'zoom'].includes(cssType)) cssType = 'meeting';
                bar.className = `v-booking-bar type-${cssType}`;
                if (res.isTentative) bar.classList.add('tentative-booking'); // ★追加
                bar.draggable = true;
                bar.dataset.resId = res.id;
                bar.addEventListener('dragstart', handleDragStart);
                bar.addEventListener('dragend', handleDragEnd);
                bar.style.top = (topPx + 1) + "px";
                bar.style.height = (heightPx - 2) + "px";
                bar.style.zIndex = "5";
                bar.style.position = "absolute";
                bar.style.left = "2px";
                bar.style.width = "calc(100% - 4px)";

                let displayTitle = getVal(res, ['title', 'subject', '件名', 'タイトル']) || '予約';
                const startTimeStr = `${start.getHours()}:${pad(start.getMinutes())}`;
                const endTimeStr = `${end.getHours()}:${pad(end.getMinutes())}`;
                const timeRangeStr = `${startTimeStr}-${endTimeStr}`;
                
                let participantsStr = "";
                let pIdsRaw = getVal(res, ['participantIds', 'participant_ids', '参加者', 'メンバー']);
                if (pIdsRaw) {
                     const cleanIds = String(pIdsRaw).replace(/['"]/g, "").split(/[,、\s]+/);
                     let names = [];
                     cleanIds.forEach(id => {
                         const trimId = id.trim();
                         if(!trimId) return;
                         const u = masterData.users.find(user => String(user.userId) === trimId);
                         names.push(u ? u.userName : trimId);
                     });
                     if (names.length > 0) {
                         if (names.length <= 4) participantsStr = names.join(', ');
                         else {
                             const showNames = names.slice(0, 4).join(', ');
                             const restCount = names.length - 4;
                             participantsStr = `${showNames} (+${restCount}名)`;
                         }
                     }
                }

                applyCustomTagColor(bar, displayTitle);

                bar.innerHTML = `
                      <div style="width:100%; font-weight:bold; font-size:0.85em; line-height:1.1; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${timeRangeStr}</div>
                      <div style="width:100%; font-weight:bold; font-size:0.9em; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${displayTitle}</div>
                      <div style="width:100%; font-weight:bold; font-size:0.9em; line-height:1.1; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${participantsStr}</div>
                  `;

                bar.onclick = (e) => {
                    if (!isTouch && hasDragged) return;
                    e.stopPropagation();
                    openDetailModal(res);
                };
                body.appendChild(bar);
            }
        });

        divCol.appendChild(body);
        container.appendChild(divCol);
    });

    if (scrollableParent) {
        if (!shouldScroll) {
            scrollableParent.scrollLeft = savedScrollLeft; 
            // ★修正: mapWrapper ではなく verticalScrollTarget を復元
            if (mode === 'map' && verticalScrollTarget) { verticalScrollTarget.scrollTop = savedScrollTop; } 
            else if (mode !== 'map') { scrollableParent.scrollTop = savedScrollTop; }
        }
        
        if (shouldScroll) {
            setTimeout(() => {
                const targetCol = container.querySelector('.target-highlight');
                if (targetCol) {
                    const colLeft = targetCol.offsetLeft;
                    const parentWidth = scrollableParent.clientWidth;
                    const colWidth = targetCol.offsetWidth;
                    const scrollTarget = colLeft - (parentWidth / 2) + (colWidth / 2);
                    scrollableParent.scrollTo({ left: scrollTarget, behavior: 'smooth' });
                }
            }, 300);
        }

        if (mode === 'map' && headerContainer) {
            const scrollBarWidth = scrollableParent.offsetWidth - scrollableParent.clientWidth;
            if (scrollBarWidth > 0) {
                headerContainer.style.paddingRight = scrollBarWidth + "px";
                headerContainer.style.boxSizing = "border-box";
            } else {
                headerContainer.style.paddingRight = "0px";
            }

            headerContainer.scrollLeft = scrollableParent.scrollLeft;
            scrollableParent.onscroll = () => {
                headerContainer.scrollLeft = scrollableParent.scrollLeft;
                if (mode === 'all' && axisContainer) axisContainer.scrollTop = scrollableParent.scrollTop;
            };
        }
    }
}
/* ==============================================
   6. 予約・詳細モーダル関連
   ============================================== */

/* ★修正: 共通時間計算関数 (新規予約・空き検索の両方で使用) */
function calculateEndTime(startId, endId) {
  const startInput = document.getElementById(startId);
  const endInput = document.getElementById(endId);
  
  if (!startInput || !endInput || !startInput.value) return;

  const parts = startInput.value.split(':');
  let h = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);

  // 1時間進める
  h += 2;

  // 21時を超える場合は21:00に制限
  if (h >= 21) {
    h = 21;
    m = 0;
  }

  const hStr = (h < 10 ? '0' : '') + h;
  const mStr = (m < 10 ? '0' : '') + m;
  
  endInput.value = `${hStr}:${mStr}`;
}

// ラッパー関数
function autoSetEndTime() { calculateEndTime('input-start', 'input-end'); }
function autoSetAvailEndTime() { calculateEndTime('avail-start', 'avail-end'); }

function selectTimePart(elm) {
    setTimeout(() => {
        const val = elm.value;
        if (!val || val.indexOf(':') === -1) return;
        const colonIndex = val.indexOf(':');
        const cursorPos = elm.selectionStart;
        if (cursorPos <= colonIndex) elm.setSelectionRange(0, colonIndex); 
        else elm.setSelectionRange(colonIndex + 1, val.length); 
    }, 10);
}

function handleTimeArrowKeys(event, elm) {
    if (event.key === 'Enter') { elm.blur(); return; }
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const val = elm.value;
    const colonIndex = val.indexOf(':');
    if (colonIndex === -1) return;
    const cursorPos = elm.selectionStart;
    if (event.key === 'ArrowRight' && cursorPos > colonIndex) {
        elm.setSelectionRange(colonIndex + 1, val.length);
    }
    if (event.key === 'ArrowLeft' && cursorPos <= colonIndex) {
        elm.setSelectionRange(0, colonIndex);
    }
}

function formatTimeInput(elm) {
    let val = elm.value.trim();
    if (!val) return;
    val = val.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    if (val.indexOf(':') === -1) return;
    let parts = val.split(':');
    let h = parseInt(parts[0]);
    let m = parseInt(parts[1]);
    if (!isNaN(h)) h = (h < 10 ? '0' : '') + h;
    if (!isNaN(m)) m = (m < 10 ? '0' : '') + m;
    if(!isNaN(h) && !isNaN(m)) {
        elm.value = `${h}:${m}`;
        if (elm.id === 'input-start') autoSetEndTime();
        if (elm.id === 'avail-start') autoSetAvailEndTime();
    }
}

/* ----- 修正後の openModal 関数 ----- */
function openModal(res = null, defaultRoomId = null, clickHour = null, clickMin = 0, clickDateStr = null) {
  initCustomTimePickers();
  const modal = document.getElementById('bookingModal');
  modal.style.display = 'flex';
  document.getElementById('btn-back-avail').style.display = 'none';   
  document.getElementById('btn-modal-cancel').style.display = 'inline-block'; 
   
  selectedParticipantIds.clear();
  originalParticipantIds.clear(); 
  document.getElementById('shuttle-search-input').value = "";

  if(document.getElementById('check-tentative')) {
      document.getElementById('check-tentative').checked = res ? !!res.isTentative : false;
  }

  // 編集用・新規用のエリア表示リセット
  const editSeriesOption = document.getElementById('edit-series-option');
  const seriesRuleDisplay = document.getElementById('series-rule-display'); // ★追加
  
  if(editSeriesOption) editSeriesOption.style.display = 'none';
  if(document.getElementById('check-sync-series')) document.getElementById('check-sync-series').checked = true;

  const createRepeatSection = document.getElementById('create-repeat-section');
  if(createRepeatSection) createRepeatSection.style.display = 'block';
   
  if (res) {
    // === 編集モード ===
    document.getElementById('modal-title').innerText = "予約編集";
    document.getElementById('edit-res-id').value = res.id;
    const rId = res._resourceId || res.resourceId || res.roomId; 
    document.getElementById('input-room').value = rId;

    let currentSeriesId = getVal(res, ['seriesId', 'series_id', 'group_id']); 
    
    // ★テスト用ダミーID付与（必要なければ削除可）
    if (!currentSeriesId && res) {
         // currentSeriesId = "temp-id-for-test"; 
    }

    if (currentSeriesId) {
        // --- シリーズ情報の分析と表示処理 (ここを追加) ---
        if(editSeriesOption) editSeriesOption.style.display = 'block';
        if(createRepeatSection) createRepeatSection.style.display = 'none';

        // 同じシリーズIDを持つ予約を全件取得して日付順にソート
        const seriesItems = masterData.reservations.filter(r => 
            String(getVal(r, ['seriesId', 'series_id', 'group_id'])) === String(currentSeriesId)
        ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        let ruleText = "登録条件：不明";
        
        if (seriesItems.length >= 1) {
            const first = new Date(seriesItems[0].startTime);
            const last = new Date(seriesItems[seriesItems.length - 1].startTime);
            const totalCount = seriesItems.length;
            
            // 終了日のフォーマット
            const lastDateStr = `${last.getFullYear()}年${last.getMonth() + 1}月${last.getDate()}日`;

            // 間隔の推測 (2件以上あれば差分を見る)
            let intervalText = "";
            if (seriesItems.length >= 2) {
                const second = new Date(seriesItems[1].startTime);
                const diffDays = Math.round((second - first) / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) intervalText = "毎日";
                else if (diffDays === 7) intervalText = "1週間おき";
                else if (diffDays === 14) intervalText = "2週間おき";
                else if (diffDays >= 28 && diffDays <= 31) intervalText = "1ヶ月おき";
                else intervalText = `${diffDays}日おき`;
            } else {
                intervalText = "単発(シリーズ設定あり)";
            }

            ruleText = `登録条件：${intervalText}、終了日：${lastDateStr} (全${totalCount}回)`;
        }

        if (seriesRuleDisplay) {
            seriesRuleDisplay.innerText = ruleText;
        }
        // ---------------------------------------------------

    } else {
        if(createRepeatSection) createRepeatSection.style.display = 'none';
    }

    const startObj = new Date(res._startTime || res.startTime);
    const endObj = new Date(res._endTime || res.endTime);
    
    const y = startObj.getFullYear();
    const m = ('0' + (startObj.getMonth() + 1)).slice(-2);
    const d = ('0' + startObj.getDate()).slice(-2);
    document.getElementById('input-date').value = `${y}-${m}-${d}`;

    document.getElementById('input-start').value = `${('0'+startObj.getHours()).slice(-2)}:${('0'+startObj.getMinutes()).slice(-2)}`;
    document.getElementById('input-end').value = `${('0'+endObj.getHours()).slice(-2)}:${('0'+endObj.getMinutes()).slice(-2)}`;
    
    document.getElementById('input-title').value = getVal(res, ['title', 'subject', '件名', 'タイトル', '用件', 'name']);
    document.getElementById('input-note').value = getVal(res, ['note', 'description', '備考', 'メモ', '詳細', 'body']);
    
    const pIds = getVal(res, ['participantIds', 'participant_ids', '参加者', 'メンバー']);
    if (pIds) {
        let idList = [];
        if (Array.isArray(pIds)) idList = pIds;
        else if (typeof pIds === 'string') idList = pIds.split(',');
        else if (typeof pIds === 'number') idList = [pIds];

        idList.forEach(rawId => { 
          if(rawId !== null && rawId !== undefined && String(rawId).trim() !== "") {
              const targetId = String(rawId).trim();
              const user = masterData.users.find(u => {
                  const uId = String(u.userId).trim();
                  return uId === targetId || (!isNaN(uId) && !isNaN(targetId) && Number(uId) === Number(targetId));
              });
              const finalId = user ? String(user.userId).trim() : targetId;
              selectedParticipantIds.add(finalId); 
              originalParticipantIds.add(finalId); 
          }
        });
    }
    document.getElementById('btn-delete').style.display = 'inline-block';

  } else {
    // === 新規予約モード ===
    document.getElementById('modal-title').innerText = "新規予約";
    document.getElementById('edit-res-id').value = "";
    if(defaultRoomId) document.getElementById('input-room').value = defaultRoomId;
    
    if(document.getElementById('check-repeat')) {
         document.getElementById('check-repeat').checked = false;
         toggleRepeatOptions();
    }

    const dateInput = document.getElementById('map-date');
    // クリックされた日付が渡されていればそれを優先する
    let currentTabDate = clickDateStr ? clickDateStr : (dateInput ? dateInput.value : '');
    if(!currentTabDate) {
        const now = new Date();
        currentTabDate = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}`;
    }
    document.getElementById('input-date').value = currentTabDate;

    const sHour = clickHour !== null ? clickHour : 9;
    const sMin  = clickMin;
    document.getElementById('input-start').value = `${pad(sHour)}:${pad(sMin)}`;
    autoSetEndTime();

 document.getElementById('input-title').value = ""; 
    if (typeof pendingTitle !== 'undefined' && pendingTitle !== "") {
        document.getElementById('input-title').value = pendingTitle;
        // ※ここでは pendingTitle = ""; をしない（保存/キャンセル時に closeModal で消す）
    }

    document.getElementById('input-note').value = "";
    document.getElementById('btn-delete').style.display = 'none';
  }
  renderShuttleLists(); 
  syncTitleTags();
  isTagDeleteMode = false;
  renderTitleTags();
  if (modal) modal.scrollTop = 0;
  const modalContent = modal.querySelector('.modal-content');
  if (modalContent) modalContent.scrollTop = 0;
}

function closeModal() { 
    document.getElementById('bookingModal').style.display = 'none'; 
    
    // activeReportId をリセットするだけ（画面更新はしない）
    activeReportId = null; 
    pendingTitle = ""; // ★予約が終わった、またはキャンセルした時に初めてリセットする
}

function getParticipantIdsFromRes(res) {
    const pIds = getVal(res, ['participantIds', 'participant_ids', '参加者', 'メンバー']);
    if (!pIds) return [];
    
    let list = [];
    if (Array.isArray(pIds)) {
        list = pIds;
    } else if (typeof pIds === 'string') {
        list = pIds.split(/[,、\s]+/);
    } else if (typeof pIds === 'number') {
        list = [pIds];
    }
    return list.map(id => String(id).trim()).filter(id => id !== "");
}

/* ==============================================
   繰り返しオプションの表示切替（この部分が足りていませんでした）
   ============================================== */
function toggleRepeatOptions() {
    const chk = document.getElementById('check-repeat');
    const area = document.getElementById('repeat-options');
    
    // 要素が存在する場合のみ表示・非表示を切り替え
    if (chk && area) {
        area.style.display = chk.checked ? 'block' : 'none';
    }
}

async function saveBooking() {
    // フォームから値を取得
    const id = document.getElementById('edit-res-id').value;
    const room = document.getElementById('input-room').value;
    const date = document.getElementById('input-date').value;
    const start = document.getElementById('input-start').value;
    const end = document.getElementById('input-end').value;
    const title = document.getElementById('input-title').value;
    const note = document.getElementById('input-note').value;
    
    // --- 入力値バリデーション ---
    const timePattern = /^([0-9]{1,2}):([0-9]{2})$/;
    if (!timePattern.test(start) || !timePattern.test(end)) {
        alert("時間は「09:00」のように半角数字とコロン(:)で入力してください。");
        return;
    }
    if (start >= end) { 
        alert("開始時間は終了時間より前に設定してください。"); 
        return; 
    }
    const startParts = start.split(':');
    const endParts = end.split(':');
    const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
    if (endMinutes - startMinutes < 15) {
        alert("最低でも15分以上の日時を設定してください。");
        return;
    }

    // --- 予約データの生成 ---
    let reservationList = []; 
    const pIds = Array.from(selectedParticipantIds).join(', ');
    
    // 状態判定用の変数
    const isRepeatChecked = document.getElementById('check-repeat') && document.getElementById('check-repeat').checked;
    const isEditMode = !!id;
    const isSeriesLinkChecked = document.getElementById('check-sync-series') && document.getElementById('check-sync-series').checked;
    
    let targetSeriesId = null;

    // 編集モードの場合
    let originalRes = null;
    if (isEditMode) {
        originalRes = masterData.reservations.find(r => String(r.id) === String(id));
        const oldSeriesId = getVal(originalRes, ['seriesId', 'series_id', 'group_id']);
        
        if (oldSeriesId) {
            if (isSeriesLinkChecked) targetSeriesId = oldSeriesId;
            else targetSeriesId = null;
        }
    }

    // ========== 【パターンA：新規登録 & 繰り返しON】 ==========
    if (!id && isRepeatChecked) {
        targetSeriesId = generateUUID();
        const interval = parseInt(document.getElementById('repeat-interval').value) || 1;
        const unit = document.getElementById('repeat-unit').value; 
        
        let endType = 'none';
        const radio = document.querySelector('input[name="repeat-end"]:checked');
        if (radio) endType = radio.value;

        let currentDate = new Date(date.replace(/-/g, '/'));
        let count = 0;
        const maxCount = (endType === 'count') ? parseInt(document.getElementById('repeat-count').value) : 1000;
        const untilDate = (endType === 'date') ? new Date(document.getElementById('repeat-until').value) : null;
        const maxLimitDate = new Date();
        maxLimitDate.setMonth(maxLimitDate.getMonth() + 3);

        while (true) {
            if (endType === 'count' && count >= maxCount) break;
            if (endType === 'date' && untilDate && currentDate > untilDate) break;
            if (endType === 'none' && currentDate > maxLimitDate) break; 
            if (count > 100) break; 

            const y = currentDate.getFullYear();
            const m = ('0' + (currentDate.getMonth() + 1)).slice(-2);
            const d = ('0' + currentDate.getDate()).slice(-2);
            
            reservationList.push({
                isUpdate: false,
                reservationId: "", 
                resourceId: room, 
                seriesId: targetSeriesId,
                date: `${y}-${m}-${d}`,
                startTime: `${y}/${m}/${d} ${start}`,
                endTime: `${y}/${m}/${d} ${end}`
            });

            count++;
            if (unit === 'day') currentDate.setDate(currentDate.getDate() + interval);
            else if (unit === 'week') currentDate.setDate(currentDate.getDate() + (interval * 7));
            else if (unit === 'month') currentDate.setMonth(currentDate.getMonth() + interval);
        }
    } 
    // ========== 【パターンB：編集モード & リンクON】 ==========
    else if (id && targetSeriesId && isSeriesLinkChecked) {
        const oldStartObj = new Date(originalRes._startTime || originalRes.startTime);
        const oldDateOnly = new Date(oldStartObj.getFullYear(), oldStartObj.getMonth(), oldStartObj.getDate());
        const newDateParts = date.split('-'); 
        const newDateOnly = new Date(parseInt(newDateParts[0]), parseInt(newDateParts[1]) - 1, parseInt(newDateParts[2]));
        const diffMillis = newDateOnly.getTime() - oldDateOnly.getTime();

        const currentStartObj = new Date(originalRes._startTime || originalRes.startTime);
        
        const relatedRes = masterData.reservations.filter(r => {
             const rSeriesId = getVal(r, ['seriesId', 'series_id', 'group_id']);
             const rStart = new Date(r._startTime || r.startTime);
             const isSameSeries = String(rSeriesId) === String(targetSeriesId);
             const isFuture = rStart.getTime() >= currentStartObj.getTime() - 1000; 
             return isSameSeries && isFuture;
        });

        if (relatedRes.length === 0) relatedRes.push(originalRes);

        relatedRes.forEach(r => {
            const rStartVal = new Date(r._startTime || r.startTime);
            const newDateForRes = new Date(rStartVal.getTime() + diffMillis);
            const y = newDateForRes.getFullYear();
            const m = ('0' + (newDateForRes.getMonth() + 1)).slice(-2);
            const d = ('0' + newDateForRes.getDate()).slice(-2);
            
            reservationList.push({
                isUpdate: true,
                reservationId: r.id,
                resourceId: room,
                seriesId: targetSeriesId,
                date: `${y}-${m}-${d}`,
                startTime: `${y}/${m}/${d} ${start}`,
                endTime: `${y}/${m}/${d} ${end}`
            });
        });
    }
    // ========== 【パターンC：単発 / リンク解除 / 単発編集】 ==========
    else {
        reservationList.push({
            isUpdate: !!id, 
            reservationId: id || "", 
            resourceId: room,
            seriesId: targetSeriesId,
            date: date,
            startTime: `${date.replace(/-/g, '/')} ${start}`,
            endTime: `${date.replace(/-/g, '/')} ${end}`
        });
    }

    if (reservationList.length === 0) {
        alert("予約データが生成されませんでした。");
        return;
    }

    // --- ▼▼▼ 重複チェック (部屋と人を分離) ▼▼▼ ---
    let roomConflictMessages = [];   // ★本予約の重複用
    let tentativeRoomConflictMessages = []; // ★仮予約の重複用
    let memberConflictMessages = []; // 人の重複用
    const checkTargets = Array.from(selectedParticipantIds);

    // 今回登録しようとしている全予約データをチェック
    for (const resData of reservationList) {
        const newStartObj = new Date(resData.startTime);
        const newEndObj = new Date(resData.endTime);
        const targetResourceId = resData.resourceId;

        // 全予約データ(masterData)と比較
        masterData.reservations.forEach(existingRes => {
            // 自分自身の更新は除外
            if (resData.isUpdate && String(existingRes.id) === String(resData.reservationId)) return;

            const exStart = new Date(existingRes._startTime || existingRes.startTime);
            const exEnd = new Date(existingRes._endTime || existingRes.endTime);
            if (isNaN(exStart.getTime()) || isNaN(exEnd.getTime())) return;

            // 時間被り判定
            const isTimeOverlap = (exStart < newEndObj && exEnd > newStartObj);
            if (!isTimeOverlap) return;

            // 1. 【部屋の重複】チェック
            const exResourceId = existingRes._resourceId || existingRes.resourceId;
            if (String(exResourceId) === String(targetResourceId)) {
                const dateStr = `${exStart.getMonth()+1}/${exStart.getDate()}`;
                const timeStr = `${pad(exStart.getHours())}:${pad(exStart.getMinutes())}-${pad(exEnd.getHours())}:${pad(exEnd.getMinutes())}`;
                const roomObj = masterData.rooms.find(r => String(r.roomId) === String(exResourceId));
                const roomName = roomObj ? roomObj.roomName : "不明な部屋";
                
                const msg = `・${dateStr} ${timeStr} ${roomName}`;
                // ▼▼▼ 修正：相手が「仮予約」かどうかでエラーを分類する ▼▼▼
                if (existingRes.isTentative) {
                    if (!tentativeRoomConflictMessages.includes(msg)) tentativeRoomConflictMessages.push(msg);
                } else {
                    if (!roomConflictMessages.includes(msg)) roomConflictMessages.push(msg);
                }
            }

            // 2. 【人の重複】チェック
            const exMemberIds = getParticipantIdsFromRes(existingRes);
            const overlappingMembers = checkTargets.filter(id => exMemberIds.includes(id));
            
            if (overlappingMembers.length > 0) {
                overlappingMembers.forEach(targetUserId => {
                    const conflictingUser = masterData.users.find(u => String(u.userId) === String(targetUserId));
                    const userName = conflictingUser ? conflictingUser.userName : targetUserId;
                    const dateStr = `${exStart.getMonth()+1}/${exStart.getDate()}`;
                    const timeStr = `${pad(exStart.getHours())}:${pad(exStart.getMinutes())}-${pad(exEnd.getHours())}:${pad(exEnd.getMinutes())}`;
                    
                    const msg = `・${dateStr} ${timeStr} ${userName}`;
                    if (!memberConflictMessages.includes(msg)) memberConflictMessages.push(msg);
                });
            }
        });
    }

    // ▼▼▼ 判定ロジック ▼▼▼
    
    const isTentativeChecked = document.getElementById('check-tentative') && document.getElementById('check-tentative').checked;

    // 1. 本予約との重複がある場合（今まで通り厳しく弾く）
    if (roomConflictMessages.length > 0) {
        if (isTentativeChecked) {
            if (!confirm(`【警告】すでに確定した「本予約」が存在しますが、「仮予約」として重ねて登録しますか？\n\n${roomConflictMessages.slice(0, 5).join('\n')}`)) return;
        } else {
            alert(`【登録できません】\n以下の日程ですでに「本予約」が入っています。\n時間を変更してください。\n\n${roomConflictMessages.slice(0, 5).join('\n')}` + (roomConflictMessages.length > 5 ? '\n...他' : ''));
            return; // 中断
        }
    }
    // 2. 相手が「仮予約」のみの場合（聞いてあげる）
    else if (tentativeRoomConflictMessages.length > 0) {
        if (isTentativeChecked) {
            if (!confirm(`【確認】この時間帯には他の「仮予約」が入っていますが、重ねて「仮予約」を登録しますか？\n\n${tentativeRoomConflictMessages.slice(0, 5).join('\n')}`)) return;
        } else {
            if (!confirm(`【確認】この時間帯には他の「仮予約」が入っていますが、優先して「本予約」として登録（確定）しますか？\n\n${tentativeRoomConflictMessages.slice(0, 5).join('\n')}`)) return;
        }
    }

    // 3. 人の重複がある場合 -> 【警告 (Confirm)】
    if (memberConflictMessages.length > 0) {
        const msg = `以下の予定と「参加者」が重複していますが、このまま登録しますか？\n(重複: ${memberConflictMessages.length}件)\n\n` + 
                    memberConflictMessages.slice(0, 5).join('\n') + 
                    (memberConflictMessages.length > 5 ? '\n...他' : '');
        
        // キャンセルを押したら中断、OKなら進む
        if (!confirm(msg)) return;
    } 
    // 3. 重複なしだが一括登録の場合 -> 【確認 (Confirm)】
    else if (reservationList.length > 1) {
        if (!confirm(`${reservationList.length}件の予約を一括登録/更新します。よろしいですか？`)) return;
    }

    // --- 送信処理 ---
    const loadingEl = document.getElementById('loading');
    const wrapper = document.getElementById('progress-wrapper');
    const bar = document.getElementById('progress-bar');
    const txt = document.getElementById('progress-text');
    
    loadingEl.style.display = 'flex';
    if (reservationList.length > 1) {
        wrapper.style.display = 'block';
        bar.style.width = '0%';
        txt.innerText = `0 / ${reservationList.length} 件完了`;
    } else {
        wrapper.style.display = 'none';
    }

    let successCount = 0;
    let failCount = 0;
    let processedCount = 0; 

    for (const resData of reservationList) {
        const params = {
            action: resData.isUpdate ? 'updateReservation' : 'createReservation',
            reservationId: resData.reservationId,
            resourceId: resData.resourceId,
            startTime: resData.startTime,
            endTime: resData.endTime,
            seriesId: resData.seriesId, 
            reserverId: currentUser.userId,
            operatorName: currentUser.userName,
            participantIds: pIds, 
            title: title,
            note: note,
            isTentative: isTentativeChecked // ★追加：仮予約フラグを送信
        };

        try {
            const result = await callAPI(params, false);
            if (result.status === 'success') successCount++;
            else failCount++;
        } catch(e) {
            failCount++;
            console.error("API Error:", e);
        }

        processedCount++;
        if (reservationList.length > 1) {
            const percentage = Math.round((processedCount / reservationList.length) * 100);
            bar.style.width = percentage + '%';
            txt.innerText = `${processedCount} / ${reservationList.length} 件完了`;
        }
    }

    setTimeout(() => {
        loadingEl.style.display = 'none';
        wrapper.style.display = 'none'; 

        if (failCount === 0) {
            // ▼▼▼ ここを修正：保存成功時のみ消去を実行 ▼▼▼
            if (activeReportId) {
                // ① データベースを既読（1）にする
                callAPI({ action: 'markReturnRead', reportId: activeReportId }, false);
                
                // ② 自分の画面（メモリ上）からもその報告を削除する
                masterData.returnReports = masterData.returnReports.filter(r => r.id !== activeReportId);
                
                // ③ 最新の状態をバナーに反映させる（これでバナーが消える）
                checkReturnReports();
                
                // ④ 終わったのでIDをリセット
                activeReportId = null;
            }
            alert("保存しました (" + successCount + "件)");
            closeModal();
            loadAllData(true);
        } else {
            alert(`完了しましたが、一部エラーが発生しました。\n成功: ${successCount}件\n失敗: ${failCount}件`);
            closeModal();
            loadAllData(true);
        }
    }, 200);
}

/* ==============================================
   詳細モーダル表示 (時刻ズレ・NaN修正版)
   ============================================== */
function openDetailModal(res) {
  currentDetailRes = res;
  const modal = document.getElementById('detailModal');
  
  // 日付文字列を安全にパース
  const safeDate = (str) => new Date(String(str).replace(/-/g, '/'));
  
  // サーバー時刻(UTC)をパースする関数
  const parseUtcDate = (str) => {
      if (!str) return null;
      let s = String(str).trim();
      s = s.replace(/\//g, '-').replace(' ', 'T');
      if (!s.endsWith('Z')) s += 'Z'; 
      return new Date(s);
  };

  // ★修正：週表示から渡された場合は _startTime がないので startTime を使う
  const sStr = res._startTime || res.startTime || res.start_time;
  const eStr = res._endTime || res.endTime || res.end_time;
  const s = safeDate(sStr);
  const e = safeDate(eStr);

  const week = ['日', '月', '火', '水', '木', '金', '土'];
  const dayIndex = s.getDay();
  const w = isNaN(dayIndex) ? '?' : week[dayIndex];
  
  const dateStr = `${s.getMonth()+1}/${s.getDate()}(${w})`;
  const timeStr = `${pad(s.getHours())}:${pad(s.getMinutes())} - ${pad(e.getHours())}:${pad(e.getMinutes())}`;
  
  document.getElementById('detail-time').innerText = `${dateStr} ${timeStr}`;
  
  // ★修正：部屋IDを確実に見つける
  const targetRoomId = res._resourceId || res.resourceId || res.roomId || res.room_id;
  const room = masterData.rooms.find(r => String(r.roomId) === String(targetRoomId));
  document.getElementById('detail-room').innerText = room ? room.roomName : (targetRoomId || '-');
  
  document.getElementById('detail-title').innerText = getVal(res, ['title', 'subject', '件名', 'タイトル']) || '(なし)';

  // 登録者・編集者情報
  const metaContainer = document.getElementById('detail-meta-info');
  if (metaContainer) {
      const fmt = (dObj) => { 
          if(!dObj || isNaN(dObj.getTime())) return "-";
          return `${dObj.getFullYear()}/${('0'+(dObj.getMonth()+1)).slice(-2)}/${('0'+dObj.getDate()).slice(-2)} ${('0'+dObj.getHours()).slice(-2)}:${('0'+dObj.getMinutes()).slice(-2)}`;
      };
      
      const createdTime = fmt(parseUtcDate(res.createdAt));
      const createdName = res.createdBy || "-";
      const updatedTime = fmt(parseUtcDate(res.updatedAt));
      const updatedName = res.updatedBy || "-";
      
      let html = `<div>登録 : ${createdTime} ${createdName}</div>`;
      html += `<div>編集 : ${updatedTime} ${updatedName}</div>`;
      metaContainer.innerHTML = html;
  }

  // 参加者リスト
  const membersContainer = document.getElementById('detail-members');
  membersContainer.innerHTML = "";
  let pIdsStr = getVal(res, ['participantIds', 'participant_ids', '参加者', 'メンバー']);
  
  if (String(pIdsStr).includes('e+')) {
      membersContainer.innerHTML = "<div class='detail-member-item' style='color:red;'>⚠️データ形式エラー</div>";
  } else if (pIdsStr) {
      const cleanIdsStr = String(pIdsStr).replace(/['"]/g, "");
      const resIds = cleanIdsStr.split(/,\s*/).map(id => id.trim());
      const names = resIds.map(id => {
          if(!id) return "";
          const u = masterData.users.find(user => {
              const uIdStr = String(user.userId).trim();
              return uIdStr === id || (!isNaN(uIdStr) && !isNaN(id) && Number(uIdStr) === Number(id));
          });
          return u ? u.userName : id;
      }).filter(n => n !== "");

      if(names.length > 0) {
          names.forEach(name => {
              const div = document.createElement('div');
              div.className = 'detail-member-item';
              div.innerText = name;
              membersContainer.appendChild(div);
          });
      } else { membersContainer.innerHTML = "<div class='detail-member-item'>-</div>"; }
  } else { membersContainer.innerHTML = "<div class='detail-member-item'>-</div>"; }

  // 備考欄
  let rawNote = getVal(res, ['note', 'description', '備考', 'メモ']) || '';
  let cleanNote = rawNote.replace(/【変更履歴】.*/g, '').replace(/^\s*[\r\n]/gm, '').trim();
  let escapedNote = cleanNote
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  let linkedNote = escapedNote.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #3498db; text-decoration: underline;">$1</a>'
  );
  document.getElementById('detail-note').innerHTML = linkedNote;

  document.getElementById('btn-go-edit').onclick = function() {
      closeDetailModal();        
      openModal(currentDetailRes); 
  };
  modal.style.display = 'flex';
}
function closeDetailModal() { document.getElementById('detailModal').style.display = 'none'; }

/* ==============================================
   7. メンバー/グループ選択 (シャトル)
   ============================================== */
function renderGenericShuttle(filterText, targetSet, candidatesContainerId, selectedContainerId, searchInputId) {
    const rawInput = (filterText || "").trim();
    const searchLower = rawInput.toLowerCase();
    const searchKata = hiraToKata(rawInput);
    const searchHira = kataToHira(rawInput);
    
    const leftList = document.getElementById(candidatesContainerId);
    const rightList = document.getElementById(selectedContainerId);
    if(!leftList || !rightList) return;

    leftList.innerHTML = "";
    rightList.innerHTML = "";

    masterData.users.forEach(u => {
        if (!u.userId) return;
        const uidStr = String(u.userId);
        
        if (targetSet.has(uidStr)) {
            const div = document.createElement('div');
            div.className = 'shuttle-item icon-remove';
            div.innerText = u.userName;
            div.onclick = () => {
                targetSet.delete(uidStr);
                renderGenericShuttle(rawInput, targetSet, candidatesContainerId, selectedContainerId, searchInputId);
            };
            rightList.appendChild(div);
        } else {
            const name = (u.userName || "").toLowerCase();
            const kana = (u.kana || "").toLowerCase();

            const isMatch = (rawInput === "") || 
                            name.includes(searchLower) || 
                            kana.includes(searchLower) || 
                            kana.includes(searchKata) || 
                            kana.includes(searchHira);

            if (isMatch) {
                const div = document.createElement('div');
                div.className = 'shuttle-item icon-add';
                div.innerText = u.userName;
                
                div.onclick = () => {
                    targetSet.add(uidStr);
                    if (searchInputId) {
                        const inputEl = document.getElementById(searchInputId);
                        if(inputEl) inputEl.value = "";
                    }
                    renderGenericShuttle("", targetSet, candidatesContainerId, selectedContainerId, searchInputId);
                };
                leftList.appendChild(div);
            }
        }
    });
}

function renderShuttleLists(filterText = "") {
    const searchId = 'shuttle-search-input'; 
    const text = filterText || document.getElementById(searchId).value;
    renderGenericShuttle(text, selectedParticipantIds, 'list-candidates', 'list-selected', searchId);
}

function renderGroupCreateShuttle() {
    const searchId = 'group-shuttle-search'; 
    const text = document.getElementById(searchId).value;
    renderGenericShuttle(text, groupCreateSelectedIds, 'group-create-candidates', 'group-create-selected', searchId);
}

function selectGroupMembers(idsStr) {
  if (!idsStr) return;
  const rawIds = String(idsStr).split(/[,、\s]+/);
  const targetUsers = [];
  rawIds.forEach(rawId => {
      const cleanIdStr = rawId.replace(/['"]/g, "").trim();
      if (!cleanIdStr) return; 
      const user = masterData.users.find(u => String(u.userId) === cleanIdStr);
      if (user) { targetUsers.push(user); }
  });

  const isAllSelected = targetUsers.every(u => selectedParticipantIds.has(String(u.userId)));
  if (isAllSelected) {
      targetUsers.forEach(u => selectedParticipantIds.delete(String(u.userId)));
  } else {
      targetUsers.forEach(u => selectedParticipantIds.add(String(u.userId)));
  }
  renderShuttleLists(document.getElementById('shuttle-search-input').value);
}

function renderGroupButtons() {
  const container = document.getElementById('group-buttons-area');
  container.innerHTML = "";
  (masterData.groups || []).forEach(grp => {
      createGroupButton(container, grp.groupName, grp.memberIds, true, grp.groupId);
  });

  const addBtn = document.createElement('div');
  addBtn.className = 'group-chip';
  addBtn.style.backgroundColor = '#4caf50';
  addBtn.style.color = 'white';
  addBtn.style.fontWeight = 'bold';
  addBtn.innerText = "＋新規作成";
  addBtn.style.opacity = (isDeleteMode || isEditMode) ? "0.3" : "1.0";
  addBtn.onclick = () => {
      if(isDeleteMode || isEditMode) return;
      openGroupModal();
  };
  container.appendChild(addBtn);

  if ((masterData.groups || []).length > 0) {
      const editBtn = document.createElement('div');
      editBtn.className = 'group-chip';
      editBtn.style.backgroundColor = isEditMode ? '#2980b9' : '#3498db';
      editBtn.style.color = 'white';
      editBtn.style.fontWeight = 'bold';
      editBtn.innerText = isEditMode ? "完了" : "✎ 編集";
      editBtn.onclick = () => {
          isEditMode = !isEditMode;
          isDeleteMode = false;
          renderGroupButtons();
      };
      container.appendChild(editBtn);

      const delBtn = document.createElement('div');
      delBtn.className = 'group-chip';
      delBtn.style.backgroundColor = isDeleteMode ? '#c0392b' : '#e74c3c';
      delBtn.style.color = 'white';
      delBtn.style.fontWeight = 'bold';
      delBtn.innerText = isDeleteMode ? "完了" : "× 削除";
      delBtn.onclick = () => {
          isDeleteMode = !isDeleteMode;
          isEditMode = false;  
          renderGroupButtons();
      };
      container.appendChild(delBtn);
  }
}

function createGroupButton(container, name, ids, isCustom, groupId) {
    const btn = document.createElement('div');
    btn.className = 'group-chip';
    btn.innerText = name;
    btn.onclick = () => {
        if (isDeleteMode) {
            if (isCustom) deleteSharedGroup(groupId, name);
            else alert("この項目はシステム固定のため削除できません。");
            return;
        }
        if (isEditMode) {
            if (isCustom) openGroupModal(groupId, name, ids);
            else alert("この項目はシステム固定のため編集できません。");
            return;
        }
        selectGroupMembers(ids);
    };

    if (isDeleteMode && isCustom) {
        btn.style.border = "2px dashed #c0392b"; 
        btn.style.color = "#c0392b";
        btn.style.backgroundColor = "#fdeaea";
    } else if (isEditMode && isCustom) {
        btn.classList.add('edit-mode-style');
    }
    container.appendChild(btn);
}

function openGroupModal(groupId = null, groupName = "", memberIds = "") {
    document.getElementById('groupCreateModal').style.display = 'flex';
    const titleEl = document.getElementById('group-modal-title');
    const nameInput = document.getElementById('new-group-name');
    const idInput = document.getElementById('edit-group-id');
    const searchInput = document.getElementById('group-shuttle-search');
    
    searchInput.value = "";
    groupCreateSelectedIds.clear();

    if (groupId) {
        titleEl.innerText = "グループ編集";
        idInput.value = groupId;
        nameInput.value = groupName;
        if (memberIds) {
            String(memberIds).split(/[,、\s]+/).map(s => s.trim()).forEach(id => {
               const u = masterData.users.find(user => String(user.userId) === id);
               if(u) groupCreateSelectedIds.add(String(u.userId));
            });
        }
    } else {
        titleEl.innerText = "グループ作成";
        idInput.value = "";
        nameInput.value = "";
    }
    renderGroupCreateShuttle();
}

async function saveNewGroup() {
    const id = document.getElementById('edit-group-id').value;
    const name = document.getElementById('new-group-name').value.trim();
    if (!name) { alert("グループ名を入力してください"); return; }
    if (groupCreateSelectedIds.size === 0) { alert("メンバーを1人以上選択してください"); return; }

    const idsStr = Array.from(groupCreateSelectedIds).join(',');
    const params = {
        action: id ? 'updateGroup' : 'createGroup',
        groupId: id,
        groupName: name,
        memberIds: idsStr,
        operatorName: currentUser ? currentUser.userName : 'Unknown'
    };
    const result = await callAPI(params);
    if (result.status === 'success') {
        const msg = id ? `グループ「${name}」を更新しました` : `グループ「${name}」を作成しました`;
        alert(msg);
        closeGroupModal();
        isEditMode = false;
        isDeleteMode = false;
        loadAllData(true); 
    } else {
        alert("保存エラー: " + result.message);
    }
}
function closeGroupModal() { document.getElementById('groupCreateModal').style.display = 'none'; }

async function deleteSharedGroup(groupId, groupName) {
    if(!confirm(`共有グループ「${groupName}」を本当に削除しますか？\n（全社員の画面から消えます）`)) return;
    const result = await callAPI({ action: 'deleteGroup', groupId: groupId });
    if (result.status === 'success') {
        alert("削除しました");
        isDeleteMode = false;
        loadAllData(true);
    } else {
        alert("削除エラー: " + result.message);
    }
}

/* ==============================================
   8. ログ関連
   ============================================== */
function searchLogs() { currentLogPage = 1; renderLogs(); }
function changeLogPage(direction) { currentLogPage += direction; renderLogs(); }

/* ==============================================
   ログ一覧描画 (時刻ズレ・クラッシュ修正版)
   ============================================== */
function renderLogs() {
    const tbody = document.getElementById('log-tbody');
    if (!tbody) return; 
    tbody.innerHTML = "";

    // データが空でもエラーにならないように保護
    const logsSource = masterData.logs || [];
    const paginationContainer = document.getElementById('log-pagination');

    if (logsSource.length === 0) {
        if (paginationContainer) paginationContainer.innerHTML = "履歴データがありません";
        return;
    }

    const parseUtcDate = (str) => {
        if (!str) return null;
        // Lambdaから既に日本時間(JST)として届いているため、Z(UTC)を付けずにそのまま読み込む
        return new Date(String(str).trim().replace(/-/g, '/'));
    };

    // 並び替え処理
    let allLogs = [...logsSource].sort((a, b) => {
        return parseUtcDate(b.timestamp) - parseUtcDate(a.timestamp);
    });

    const filterText = document.getElementById('log-search-input').value.toLowerCase().trim();
    if (filterText) {
        const searchKata = hiraToKata(filterText); 
        const searchHira = kataToHira(filterText);
        allLogs = allLogs.filter(log => {
            const d = parseUtcDate(log.timestamp);
            const dateStr = formatDate(d);
            let roomName = String(log.resourceName || log.resourceId || "");
            const roomObj = masterData.rooms.find(r => String(r.roomId) === String(log.resourceId || log.resourceName));
            if (roomObj) roomName = roomObj.roomName;
            const operatorUser = masterData.users.find(u => u.userName === log.operatorName);
            const operatorKana = operatorUser ? (operatorUser.kana || "") : "";

            return (
                dateStr.includes(filterText) ||
                (log.operatorName && String(log.operatorName).toLowerCase().includes(filterText)) ||
                (operatorKana && (operatorKana.includes(filterText) || operatorKana.includes(searchKata) || operatorKana.includes(searchHira))) ||
                (log.action && String(log.action).toLowerCase().includes(filterText)) ||
                (roomName && roomName.toLowerCase().includes(filterText)) ||
                (log.details && String(log.details).toLowerCase().includes(filterText))
            );
        });
    }

    const totalItems = allLogs.length;
    const totalPages = Math.ceil(totalItems / LOGS_PER_PAGE) || 1;
    if (currentLogPage < 1) currentLogPage = 1;
    if (currentLogPage > totalPages) currentLogPage = totalPages;

    const displayLogs = allLogs.slice((currentLogPage - 1) * LOGS_PER_PAGE, currentLogPage * LOGS_PER_PAGE);

    const resolveName = (id) => {
        const u = masterData.users.find(user => String(user.userId) === String(id));
        return u ? u.userName : id;
    };

    const formatRange = (rangeStr) => {
        if (!rangeStr || !String(rangeStr).includes(' - ')) return rangeStr;
        const parts = String(rangeStr).split(' - ');
        const sDate = new Date(String(parts[0]).replace(/-/g, '/'));
        const eDate = new Date(String(parts[1]).replace(/-/g, '/'));
        if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) return rangeStr;
        const week = ['日', '月', '火', '水', '木', '金', '土'];
        return `${sDate.getMonth() + 1}/${sDate.getDate()}(${week[sDate.getDay()]}) ${pad(sDate.getHours())}:${pad(sDate.getMinutes())} - ${pad(eDate.getHours())}:${pad(eDate.getMinutes())}`;
    };

    displayLogs.forEach(log => {
        const tr = document.createElement('tr');
        let rawResName = String(log.resourceName || log.resourceId || '-');
        let roomDisplay = rawResName;
        let detailLines = "";
        if (rawResName.includes('\n')) {
            const parts = rawResName.split('\n');
            const roomIdPart = parts[0].trim();
            detailLines = parts.slice(1).join('<br>');
            const roomObj = masterData.rooms.find(r => String(r.roomId) === String(roomIdPart));
            roomDisplay = roomObj ? roomObj.roomName : roomIdPart;
        } else {
            const roomObj = masterData.rooms.find(r => String(r.roomId) === String(rawResName));
            if (roomObj) roomDisplay = roomObj.roomName;
        }
        if (detailLines) detailLines = detailLines.replace(/(\d+)/g, (match) => resolveName(match));
        let timeDisplay = String(log.timeRange || '');
        if (timeDisplay.includes('→')) {
            const ranges = timeDisplay.split('→');
            timeDisplay = `${formatRange(ranges[0].trim())} <br><span style="color:#e67e22; font-weight:bold;">↓</span><br> ${formatRange(ranges[1].trim())}`;
        } else {
            timeDisplay = formatRange(timeDisplay);
        }
        const detailHtml = `<strong>${roomDisplay}</strong>${detailLines ? `<br><span style="font-size:0.85em; color:#666;">${detailLines}</span>` : ''}<br><span style="font-size:0.8em; color:#999;">${timeDisplay}</span>`;
        tr.innerHTML = `<td>${formatDate(parseUtcDate(log.timestamp))}</td><td>${log.operatorName || '-'}</td><td>${log.action || '-'}</td><td>${detailHtml}</td>`;
        tbody.appendChild(tr);
    });

    if (paginationContainer) {
        renderPaginationControls(totalPages, totalItems, (currentLogPage - 1) * LOGS_PER_PAGE + 1, Math.min(currentLogPage * LOGS_PER_PAGE, totalItems));
    }
}

function renderPaginationControls(totalPages, totalItems, startCount, endCount) {
    const container = document.getElementById('log-pagination');
    container.innerHTML = "";
    if (totalItems === 0) { container.innerText = "一致する履歴はありません"; return; }

    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerText = "< 前へ";
    prevBtn.disabled = (currentLogPage === 1);
    if (currentLogPage === 1) prevBtn.classList.add('disabled');
    prevBtn.onclick = () => changeLogPage(-1);
    container.appendChild(prevBtn);

    const infoSpan = document.createElement('span');
    infoSpan.className = 'page-info';
    infoSpan.innerText = ` ${startCount} - ${endCount} / ${totalItems}件 `;
    container.appendChild(infoSpan);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerText = "次へ >";
    nextBtn.disabled = (currentLogPage === totalPages);
    if (currentLogPage === totalPages) nextBtn.classList.add('disabled');
    nextBtn.onclick = () => changeLogPage(1);
    container.appendChild(nextBtn);
}

/* ==============================================
   9. ユーティリティ関数
   ============================================== */
function pad(n) { return n < 10 ? '0'+n : n; }

// ★修正: 曜日を追加 (安全対策済み)
function formatDate(d) {
    if (!d || isNaN(d.getTime())) return "日時不明";
    const week = ['日', '月', '火', '水', '木', '金', '土'];
    const dayIndex = d.getDay();
    const w = isNaN(dayIndex) ? '?' : week[dayIndex];
    return `${d.getMonth()+1}/${d.getDate()}(${w}) ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ...以下変更なし
function formatDateToNum(d) {
  if (isNaN(d.getTime())) return ""; 
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function hiraToKata(str) {
    return str.replace(/[\u3041-\u3096]/g, function(match) {
        var chr = match.charCodeAt(0) + 0x60;
        return String.fromCharCode(chr);
    });
}
function kataToHira(str) {
    return str.replace(/[\u30A1-\u30F6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
}
function getVal(obj, keys) {
    if(!obj) return "";
    for (const k of keys) {
        if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return ""; 
}

/* ==============================================
   10. マップ画像と座標枠の自動同期
   ============================================== */
function initMapResizer() {
  // ▼▼▼ 追加: ブラウザが対応していない場合は処理を中断する ▼▼▼
  if (!('ResizeObserver' in window)) {
      console.warn('ResizeObserver is not supported on this device.');
      return; 
  }
  // ▲▲▲ 追加ここまで ▲▲▲

  const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
          const img = entry.target;
          const wrapper = img.closest('.map-inner-wrapper');
          
          if (wrapper) {
              // ▼▼▼【修正】サイズが正の場合のみ適用（非表示時の0px固定防止）▼▼▼
              if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                  wrapper.style.width = entry.contentRect.width + 'px';
              }
          }
      }
  });

  const mapImages = document.querySelectorAll('.map-image');
  if (mapImages.length > 0) {
      mapImages.forEach(img => resizeObserver.observe(img));
  } else {
      setTimeout(initMapResizer, 500);
  }
}
/* ==============================================
   追加: 空き状況検索 (Availability Search) 機能
   ============================================== */

// モーダルを開く
function openAvailabilityModal() {
    const modal = document.getElementById('availabilityModal');
    if (!modal) return;
    
    const content = modal.querySelector('.modal-content');
    if(content) content.classList.remove('modal-expanded');
    
    // 現在の日時を初期値セット
    const now = new Date();
    const y = now.getFullYear();
    const m = ('0' + (now.getMonth() + 1)).slice(-2);
    const d = ('0' + now.getDate()).slice(-2);
    
    // 現在時刻から「次の00分か30分」を計算
    let h = now.getHours();
    let min = now.getMinutes();
    if(min < 30) min = 0;
    else { min = 30; } 
    
    document.getElementById('avail-date').value = `${y}-${m}-${d}`;
    document.getElementById('avail-start').value = `${('0'+h).slice(-2)}:${('0'+min).slice(-2)}`;
    // 終了時間は自動計算させる
    autoSetAvailEndTime();

    // 結果エリアリセット
    document.getElementById('avail-result-container').innerHTML = '';

    modal.style.display = 'flex';
}

// モーダルを閉じる
function closeAvailabilityModal() {
    const modal = document.getElementById('availabilityModal');
    if(modal) modal.style.display = 'none';
}
// 検索実行
function execAvailabilitySearch() {
    const dateVal = document.getElementById('avail-date').value;
    const startVal = document.getElementById('avail-start').value;
    const endVal = document.getElementById('avail-end').value;

    if (!dateVal || !startVal || !endVal) {
        alert("日付と時間を正しく入力してください");
        return;
    }

    const searchStart = new Date(`${dateVal}T${startVal}:00`);
    const searchEnd = new Date(`${dateVal}T${endVal}:00`);

    if (searchStart >= searchEnd) {
        alert("開始時間は終了時間より前に設定してください");
        return;
    }

    const resultContainer = document.getElementById('avail-result-container');
    resultContainer.innerHTML = ""; 

    let hasRoom = false;
    const rooms = masterData.rooms;

    rooms.forEach(room => {
        // その部屋の「指定日」の予約を取得
        const roomRes = masterData.reservations.filter(res => {
            const rId = getVal(res, ['resourceId', 'roomId', 'room_id', 'resource_id', '部屋ID', '部屋']);
            return String(rId) === String(room.roomId);
        });

        // 重複チェック
        const isBusy = roomRes.some(res => {
            const rStart = new Date(res._startTime || res.startTime);
            const rEnd = new Date(res._endTime || res.endTime);
            return (rStart < searchEnd && rEnd > searchStart);
        });

        const item = document.createElement('div');
        item.className = 'avail-list-item';
        
        // ▼▼▼ 修正：空きがない場合は背景色をグレーにし、クリック不可にする ▼▼▼
        if (isBusy) {
            item.style.backgroundColor = "#e0e0e0";
            item.style.pointerEvents = "none";
        }
        // ▲▲▲ 修正ここまで ▲▲▲

        let statusHtml = "";
        if (isBusy) {
            // 空きがない場合（グレーアウトした予約ボタン）
            statusHtml = `
              <div style="display:flex; align-items:center; gap:15px;">
                 <span style="color:#999; font-weight:bold; font-size:0.9rem;">空きなし</span>
                 <button class="btn-secondary" style="padding: 6px 15px; font-size: 0.85rem; opacity: 0.5; cursor: not-allowed;" disabled>予約</button>
              </div>`;
        } else {
            // 空きがある場合（赤文字の「空き」＋緑の「予約」ボタン）
            statusHtml = `
              <div style="display:flex; align-items:center; gap:15px;">
                 <span style="color:#e74c3c; font-weight:bold; font-size:0.9rem;">空き</span>
                 <button class="btn-primary" style="padding: 6px 15px; font-size: 0.85rem; background:#27ae60; border-color:#27ae60;" onclick="transitionToBooking('${room.roomName}', '${dateVal}', '${startVal}', '${endVal}')">予約</button>
              </div>`;
        }

        // ▼▼▼ 修正：空きがない場合は部屋名の文字色も薄いグレーにする ▼▼▼
        item.innerHTML = `
            <div class="avail-room-name" ${isBusy ? 'style="color:#999;"' : ''}>${room.roomName}</div>
            ${statusHtml}
        `;
        // ▲▲▲ 修正ここまで ▲▲▲
        
        resultContainer.appendChild(item);
        hasRoom = true;
    });

    if(!hasRoom) {
        resultContainer.innerHTML = '<p style="padding:20px; text-align:center;">部屋データがありません</p>';
    }
    const modalContent = document.querySelector('#availabilityModal .modal-content');
    if (modalContent) {
        modalContent.classList.add('modal-expanded');
    }
}
/* ==============================================
   11. 空き状況検索 ⇔ 予約画面連携 (最終修正版)
   ============================================== */
function transitionToBooking(roomName, dateVal, startVal, endVal) {
  // 1. 空き状況モーダルを閉じる
  document.getElementById('availabilityModal').style.display = 'none';

  // 2. 部屋IDの特定 (名前からIDを探す)
  const roomObj = masterData.rooms.find(r => r.roomName === roomName);
  const roomId = roomObj ? roomObj.roomId : null;

  // 3. 時間を分解 (例: "16:30" -> 時:16, 分:30)
  const [sH, sM] = startVal.split(':').map(Number);

  // 4. 【最重要】共通の初期化関数 openModal を実行
  // これにより、日付(dateVal)や時間、参加者の初期化が「正しい手順」で行われます
  openModal(null, roomId, sH, sM, dateVal);

  // 5. openModal が自動計算した「終了時間」を、空き状況画面で選んだ「終了時間」で上書き
  document.getElementById('input-end').value = endVal;

  // 6. ▼▼▼ 元のコードにあった「特殊データ」の引き継ぎ処理をここで実行 ▼▼▼
  if (pendingExternalData) {
      // SS連携（外部）データがある場合
      if (pendingExternalData.title) document.getElementById('input-title').value = pendingExternalData.title;
      if (pendingExternalData.note) document.getElementById('input-note').value = pendingExternalData.note;
      if (pendingExternalData.userId) {
          const uId = String(pendingExternalData.userId);
          const targetUser = masterData.users.find(u => String(u.userId) === uId);
          if (targetUser) selectedParticipantIds.add(uId);
      }
      pendingExternalData = null; // 使用後はリセット
  } 
  else if (pendingTitle !== "") {
      // 通知バナー（帰社報告）から来た場合
      document.getElementById('input-title').value = pendingTitle;
      // ※ここでは pendingTitle = ""; をしない（closeModalで消すため）
  }

  // 7. 参加者リストの表示を更新（追加した参加者を画面に反映）
  renderShuttleLists(); 

  // 8. ボタンの見た目を「空き状況から来た」モードに調整
  document.getElementById('btn-back-avail').style.display = 'inline-block'; 
  document.getElementById('btn-modal-cancel').style.display = 'none'; 
}

function backToAvailability() {
  document.getElementById('bookingModal').style.display = 'none';
  document.getElementById('availabilityModal').style.display = 'flex';
}

function scrollToNow() {
  const container = document.getElementById('rooms-container-all');
  const axis = document.getElementById('time-axis-all');
  if (!container) return;

  const redLine = container.querySelector('.current-time-line');
  if (redLine) {
    const lineTop = redLine.offsetTop;
    const containerHeight = container.clientHeight;
    const targetScroll = lineTop - (containerHeight / 2);

    container.scrollTop = targetScroll;
    if(axis) axis.scrollTop = targetScroll;
  }
}

/* ==============================================
   12. 設定メニュー & その他機能
   ============================================== */
function toggleSettingsMenu() {
  const dropdown = document.getElementById("settings-dropdown");
  dropdown.classList.toggle("show");
}

function manualRefresh() {
  const dropdown = document.getElementById("settings-dropdown");
  if(dropdown) dropdown.classList.remove("show");
  console.log("手動更新を実行します");
  loadAllData(true, false); 
  updateRefreshTime();
}

window.onclick = function(event) {
  if (event.target.matches('.settings-icon')) return;
  const dropdown = document.getElementById("settings-dropdown");
  if (dropdown && dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
}

/* パスワード変更 */
function openPasswordModal() {
  const dropdown = document.getElementById("settings-dropdown");
  if(dropdown) dropdown.classList.remove("show");
  document.getElementById('old-pass').value = "";
  document.getElementById('new-pass').value = "";
  document.getElementById('new-pass-confirm').value = "";
  document.getElementById('passwordModal').style.display = 'flex';
}
function closePasswordModal() { document.getElementById('passwordModal').style.display = 'none'; }

async function savePassword() {
  const oldPass = document.getElementById('old-pass').value;
  const newPass = document.getElementById('new-pass').value;
  const confirmPass = document.getElementById('new-pass-confirm').value;

  if (!oldPass || !newPass) { alert("全ての項目を入力してください"); return; }
  if (newPass !== confirmPass) { alert("新しいパスワードが一致しません"); return; }

  const params = {
    action: 'changePassword',
    userId: currentUser.userId,
    oldPassword: oldPass,
    newPassword: newPass
  };

  const result = await callAPI(params);
  if (result.status === 'success') {
    alert("パスワードを変更しました。\n次回ログイン時から有効です。");
    closePasswordModal();
  } else {
    alert("エラー: " + result.message);
  }
}

/* カスタム時間ピッカー */
function initCustomTimePickers() {
  const wrappers = document.querySelectorAll('.time-picker-wrapper');
  
  wrappers.forEach(wrapper => {
    if (wrapper.querySelector('.custom-time-dropdown')) return;

    const dropdown = document.createElement('div');
    dropdown.className = 'custom-time-dropdown';

    const times = [];
    for(let h=7; h<=21; h++) {
       const hStr = (h < 10 ? '0' : '') + h;
       if (h === 21) times.push("21:00");
       else ['00','15','30','45'].forEach(m => times.push(`${hStr}:${m}`));
    }

    times.forEach(time => {
       const item = document.createElement('div');
       item.className = 'time-option';
       item.innerText = time;
       
       item.onclick = (e) => {
         e.stopPropagation();
         const input = wrapper.querySelector('input');
         input.value = time;
         if (input.id === 'input-start') autoSetEndTime();
         if (input.id === 'avail-start') autoSetAvailEndTime();
         dropdown.classList.remove('show');
       };
       dropdown.appendChild(item);
    });

    wrapper.appendChild(dropdown);

    const arrow = wrapper.querySelector('.time-picker-arrow');
    if (arrow) {
      arrow.onclick = (e) => {
         e.stopPropagation();
         document.querySelectorAll('.custom-time-dropdown').forEach(d => {
            if(d !== dropdown) d.classList.remove('show');
         });
         
         if (dropdown.classList.contains('show')) {
             dropdown.classList.remove('show');
         } else {
             dropdown.classList.add('show');
             const currentVal = wrapper.querySelector('input').value;
             if (currentVal) {
                 const targetItem = Array.from(dropdown.children).find(child => child.innerText === currentVal);
                 if (targetItem) dropdown.scrollTop = targetItem.offsetTop;
             }
         }
      };
    }
  });
  document.addEventListener('click', () => {
     document.querySelectorAll('.custom-time-dropdown').forEach(d => d.classList.remove('show'));
  });
}

function updateRefreshTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    
    const el = document.getElementById('last-update-time');
    if (el) el.innerText = `更新：${h}:${m}`;
}

/* お問い合わせ */
function openContactModal() {
  const dropdown = document.getElementById("settings-dropdown");
  if(dropdown) dropdown.classList.remove("show");
  document.getElementById('contact-message').value = "";
  document.getElementById('contactModal').style.display = 'flex';
}
function closeContactModal() { document.getElementById('contactModal').style.display = 'none'; }

async function sendContactFeedback() {
  const msg = document.getElementById('contact-message').value.trim();
  if (!msg) { alert("お問い合わせ内容を入力してください"); return; }

  document.getElementById('loading').style.display = 'flex';
  const params = {
    action: 'sendFeedback',
    operatorName: currentUser ? currentUser.userName : 'Unknown',
    message: msg
  };

  try {
    const result = await callAPI(params);
    document.getElementById('loading').style.display = 'none';
    if (result.status === 'success') {
      alert("送信しました。\nご意見ありがとうございます！");
      closeContactModal();
    } else {
      alert("送信エラー: " + result.message);
    }
  } catch (e) {
    document.getElementById('loading').style.display = 'none';
    alert("通信エラーが発生しました");
  }
}

function openHistoryFromMenu() {
    const dropdown = document.getElementById("settings-dropdown");
    if(dropdown) dropdown.classList.remove("show");
    switchTab('logs');
}
/* ==============================================
   追加: 曜日表示の更新機能
   ============================================== */
function updateDayDisplay(inputId) {
    const input = document.getElementById(inputId);
    const displaySpan = document.getElementById(inputId + '-week'); // 例: map-date-week
    
    if (input && displaySpan) {
        const d = new Date(input.value);
        if (!isNaN(d.getTime())) {
            const week = ['日', '月', '火', '水', '木', '金', '土'];
            const w = week[d.getDay()];
            displaySpan.innerText = `(${w})`;
            
            // 土日は色を変える（任意）
            if (w === '土') displaySpan.style.color = 'blue';
            else if (w === '日') displaySpan.style.color = 'red';
            else displaySpan.style.color = '#333';
        } else {
            displaySpan.innerText = "";
        }
    }
}
/* ==============================================
   修正版: 予約削除機能 (シリーズ一括削除対応)
   ============================================== */
async function deleteBooking() {
    // 1. 編集中の予約IDを取得
    const resId = document.getElementById('edit-res-id').value;
    if (!resId) return; // 新規作成画面などでIDがない場合は何もしない

    // 2. 削除対象を特定する
    // 「リンクする」チェックボックスの状態を取得
    const isSeriesLinkChecked = document.getElementById('check-sync-series') && document.getElementById('check-sync-series').checked;
    
    // 現在の予約データをmasterDataから検索
    const targetRes = masterData.reservations.find(r => String(r.id) === String(resId));
    if (!targetRes) {
        alert("予約データが見つかりません。");
        return;
    }

    // シリーズIDを取得
    const seriesId = getVal(targetRes, ['seriesId', 'series_id', 'group_id']);

    let deleteTargets = [];

    if (isSeriesLinkChecked && seriesId) {
        // A. チェックON かつ シリーズIDがある場合 
        // -> 同じシリーズIDを持つ全ての予約を対象にする
        deleteTargets = masterData.reservations.filter(r => 
            String(getVal(r, ['seriesId', 'series_id', 'group_id'])) === String(seriesId)
        );
    } else {
        // B. チェックOFF または 単発予約の場合
        // -> この予約1件だけを対象にする
        deleteTargets = [targetRes];
    }

    if (deleteTargets.length === 0) return;

    // 3. 確認ダイアログ (件数に応じてメッセージを変える)
    let msg = "本当にこの予約を削除しますか？\n（この操作は取り消せません）";
    if (deleteTargets.length > 1) {
        msg = `【注意】シリーズ一括削除\n\nリンクされている 全 ${deleteTargets.length} 件 の予約をすべて削除します。\nよろしいですか？\n（この操作は取り消せません）`;
    }

    if (!confirm(msg)) return;

    // 4. 削除実行 (ループ処理)
    const loadingEl = document.getElementById('loading');
    if(loadingEl) loadingEl.style.display = 'flex';

    let successCount = 0;
    let failCount = 0;

    // 確実性を高めるため、対象IDを1つずつAPIに送信して削除します
    for (const res of deleteTargets) {
        
        // ▼▼▼ ①ここから追加：ログ用に部屋名を取得する処理 ▼▼▼
        const rId = res.resourceId || res._resourceId;
        const roomObj = masterData.rooms.find(r => String(r.roomId) === String(rId));
        const roomName = roomObj ? roomObj.roomName : (rId || "不明な部屋");
        // ▲▲▲ 追加ここまで ▲▲▲

        const params = {
            action: 'deleteReservation',
            reservationId: res.id,
            operatorName: currentUser ? currentUser.userName : 'Unknown',
            
            // ▼▼▼ ②ここから追加：削除APIに詳細情報を一緒に渡す ▼▼▼
            resourceId: rId,
            resourceName: roomName,
            startTime: res.startTime || res._startTime,
            endTime: res.endTime || res._endTime,
            title: getVal(res, ['title', 'subject', '件名', 'タイトル'])
            // ▲▲▲ 追加ここまで ▲▲▲
        };

        try {
            const result = await callAPI(params, false); 
            if (result.status === 'success') successCount++;
            else failCount++;
        } catch (e) {
            failCount++;
            console.error(e);
        }
    }

    if(loadingEl) loadingEl.style.display = 'none';

    // 5. 結果表示
    if (failCount === 0) {
        alert(`削除しました${deleteTargets.length > 1 ? ' (' + successCount + '件)' : ''}`);
        closeModal();       // モーダルを閉じる
        loadAllData(true);  // 画面を再読み込み
    } else {
        alert(`完了しましたが、一部エラーが発生しました。\n成功: ${successCount}件\n失敗: ${failCount}件`);
        closeModal();
        loadAllData(true);
    }
}
/* ==============================================
   追加: ユニークID生成 (シリーズID用)
   ============================================== */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/* ==============================================
   追加: AWS プッシュ通知登録機能 (デバッグ用)
   ============================================== */
// VAPIDキー（末尾の空白などを除去する .trim() を追加）
const PUBLIC_VAPID_KEY = "BKOtogrGf8BJz00kR5xQuS5-_Gbkj_hQ_B3IUryPkxlDA9p4rAyZyn77CPTv-mwZnfKkCv8EBl1JXOVvoJfhnJk".trim();

// Safari/iOS対応: Base64URLをUint8Arrayに変換する関数
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// AWSへの登録を実行する関数
async function registerPushNotification() {
  try {
    const registration = await navigator.serviceWorker.ready;

    // Safari/iOS/PC共通: VAPIDキーの変換
    const applicationServerKey = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);

    // 1. まず現在の登録状況を確認する
    let subscription = await registration.pushManager.getSubscription();

    // 2. もし既に登録が残っていたら、一旦解除(unsubscribe)する
    // これにより「A subscription with a different applicationServerKey...」のエラーを回避できます
    if (subscription) {
      await subscription.unsubscribe();
      console.log("既存の通知設定を解除しました（再登録のため）");
    }

    // 3. 新しいキーで改めて登録する
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });

    console.log("Push Subscription取得成功:", subscription);

   // 4. バックエンドAPIへ送信してRDSに保存
    const params = {
      action: 'registerPush',
      userId: currentUser.userId,
      subscription: subscription
    };
    
    const response = await callAPI(params);

    if (response.status === 'success') {
      alert("プッシュ通知の登録に成功しました！");
    } else {
      throw new Error("AWSへの登録に失敗しました");
    }
  } catch (error) {
    console.error("プッシュ通知登録エラー:", error);
    alert("登録エラー: " + error.message);
  }
}

// 通知許可の要求
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("このブラウザは通知に対応していません。");
    return;
  }
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      registerPushNotification();
    } else {
      alert("通知が拒否されました。");
    }
  });
}
/* ==============================================
   追加機能: URLパラメータから空き状況検索を開く (SS連携)
   ============================================== */
function checkUrlParamsForBooking() {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('action') !== 'external_book') return;

  // パラメータの取得
  const pDate   = urlParams.get('date');
  const pStart  = urlParams.get('start');
  const pEnd    = urlParams.get('end');
  const pTitle  = urlParams.get('title');
  const pNote   = urlParams.get('note');
  const pUserId = urlParams.get('user_id'); 
  const pRoomId = urlParams.get('room_id'); // ※空き検索なので部屋ID指定は検索には使いませんが、保存しておきます

  console.log("外部連携: 空き状況検索を起動します", { pDate, pStart, pUserId });

  // 1. 空き状況検索では入力できないデータ（用件や参加者）を一時保存しておく
  pendingExternalData = {
      title: pTitle,
      note: pNote,
      userId: pUserId,
      targetRoomId: pRoomId // 特定の部屋を指定していた場合用
  };

  // 2. 空き状況検索モーダルを開く
  openAvailabilityModal();

  // 3. 日付と時間をセット
  if (pDate) document.getElementById('avail-date').value = pDate;
  
  if (pStart) {
      document.getElementById('avail-start').value = pStart;
      // 終了時間が指定されていればセット、なければ自動計算
      if (pEnd) {
          document.getElementById('avail-end').value = pEnd;
      } else {
          autoSetAvailEndTime();
      }
  }

  // 4. 自動で検索を実行する (検索ボタンを押したのと同じ状態にする)
  if (pDate && pStart && (pEnd || document.getElementById('avail-end').value)) {
      setTimeout(() => {
          execAvailabilitySearch();
      }, 300); // モーダルの描画を少し待ってから実行
  }

  // 5. URLクリーンアップ
  const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  window.history.replaceState({path: newUrl}, '', newUrl);
}
/* ==============================================
   修正版: APIキーによる自動ログイン (SS連携)
   ============================================== */
async function checkUrlParamsForLogin() {
  const urlParams = new URLSearchParams(window.location.search);
  const pUserId = urlParams.get('user_id');
  const pApiKey = urlParams.get('api_key'); // パスワードの代わりにAPIキーを取得

  const loginInput = document.getElementById('loginId');

  // IDとAPIキーがある場合 -> 自動ログイン試行
  if (pUserId && pApiKey) {
      
      if (loginInput) loginInput.value = pUserId;
      console.log("SS連携: APIキーによる自動ログインを実行します...");

      document.getElementById('loading').style.display = 'flex';

      // ★APIキーを使ってログインAPIを叩く
      const url = new URL(API_URL);
      url.searchParams.append('action', 'login');
      url.searchParams.append('userId', pUserId);
      url.searchParams.append('apiKey', pApiKey); // パスワードの代わりにキーを送信

      try {
        const res = await fetch(url.toString(), { method: 'GET', headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
        const json = await res.json();
        document.getElementById('loading').style.display = 'none';
        
        if (json.status === 'success') {
          // ログイン成功時の処理
          currentUser = json.user;
          document.getElementById('display-user-name').innerText = currentUser.userName;
          document.getElementById('login-screen').style.display = 'none';
          document.getElementById('app-screen').style.display = 'flex'; 
          
          localStorage.setItem(SESSION_KEY_USER, JSON.stringify(currentUser));
          localStorage.setItem(SESSION_KEY_TIME, new Date().getTime().toString());

          // データの読み込み開始（これが終わると予約フローに進みます）
          loadAllData();
        } else { 
          alert("自動ログイン失敗: " + json.message); 
        }
      } catch (e) {
        document.getElementById('loading').style.display = 'none';
        alert("通信エラー: " + e.message);
      }

      return; 
  }
  // IDだけの場合など
  if (pUserId && loginInput) {
      loginInput.value = pUserId;
  }
}
/* script.js の末尾に追加 */

// アプリ起動時に通知設定を自動チェック・更新する関数（サイレント実行）
async function ensurePushSubscription() {
  // ログインしていない、または通知非対応なら何もしない
  if (!currentUser || !currentUser.userId) return;
  if (!("Notification" in window)) return;
  
  // ユーザーが「許可」していない場合は勝手に登録しない
  if (Notification.permission !== 'granted') return; 

  try {
    const registration = await navigator.serviceWorker.ready;
    const applicationServerKey = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);

    // 1. 現在のブラウザ側の登録情報を取得
    let subscription = await registration.pushManager.getSubscription();

    // 2. もし登録がなければ新しく登録する
    if (!subscription) {
       subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
       });
    }

   // 3. バックエンドAPIへ送信してRDSに保存
    await callAPI({
      action: 'registerPush',
      userId: currentUser.userId,
      subscription: subscription
    });
    
    console.log("プッシュ通知情報を自動更新しました");
  } catch (e) {
    console.error("通知情報の自動更新に失敗:", e);
    // 自動更新の失敗はユーザーに通知せずログのみに残す
  }
}
/* script.js に以下の関数を追加し、既存の関連箇所を修正 */

// A. 初期化時に週間バーを描画するように変更
// initUI() の中で updateWeeklyBar(); を呼ぶようにしてください。

/* script.js の updateWeeklyBar を updateMonthlyCalendar に書き換え */

// script.js 内の updateMonthlyCalendar 関数を以下に書き換え

function updateMonthlyCalendar() {
    const container = document.getElementById('calendar-grid-container');
    const dateInput = document.getElementById('map-date');
    const titleEl = document.getElementById('display-month-year');
    if (!container || !dateInput) return;

    const selectedDate = new Date(dateInput.value);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // 1. 年月表示の更新
    if (titleEl) {
        titleEl.innerText = `${year}年 ${month + 1}月`;
    }

    container.innerHTML = '';

    // 2. 月の初日の曜日と最終日を取得
    const firstDay = new Date(year, month, 1).getDay(); 
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 3. 曜日のラベルを表示したい場合はここに追加（オプション）
    // 今回は画像に合わせて数字のみのグリッドにします

    // 4. 初日の前の空白埋め
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day-item other-month';
        container.appendChild(emptyDiv);
    }

    // 5. 日付ボタンの生成
    for (let d = 1; d <= lastDate; d++) {
        const current = new Date(year, month, d);
        const dayItem = document.createElement('div');
        dayItem.className = 'day-item';

        if (current.getDay() === 0) dayItem.classList.add('sun');
        if (current.getDay() === 6) dayItem.classList.add('sat');
        if (d === selectedDate.getDate()) dayItem.classList.add('active');

        const dateStr = `${year}-${('0' + (month + 1)).slice(-2)}-${('0' + d).slice(-2)}`;

        dayItem.onclick = () => {
            dateInput.value = dateStr;
            renderVerticalTimeline('map'); 
            updateMonthlyCalendar();       
        };

        dayItem.innerText = d; // 余計なspanタグを使わず直接数字を入れる
        container.appendChild(dayItem);
    }
}

/* 月を切り替える関数（＜ ＞ ボタン用） */
function shiftMonth(dir) {
    const input = document.getElementById('map-date');
    const d = new Date(input.value);
    d.setMonth(d.getMonth() + dir);
    
    const y = d.getFullYear();
    const m = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    input.value = `${y}-${m}-${day}`;
    
    renderVerticalTimeline('map');
    updateMonthlyCalendar();
}

/* 初期化時にも実行するように initUI 内の関数名を変更してください */
// initUI() の中で updateMonthlyCalendar(); を呼ぶように修正
function shiftCalendar(dir) {
    const input = document.getElementById('map-date');
    const d = new Date(input.value);
    
    // 表示モードが「週」なら7日、それ以外なら1日移動
    const amount = (typeof currentViewMode !== 'undefined' && currentViewMode === 'week') ? 7 : 1;
    d.setDate(d.getDate() + (dir * amount));
    
    input.value = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
    
    renderVerticalTimeline('map');
    updateWeeklyBar();
}
/* ==============================================
   ★ カレンダー表示切替と移動の処理
   ============================================== */
/* script.js : switchCalendarView 関数を以下に差し替え */

function switchCalendarView(viewMode, btnEl) {
    const buttons = document.querySelectorAll('.btn-view');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnEl.classList.add('active');
    
    // 1. 切り替え前の状態を viewFilters に同期して保存
    saveFilterState();

    // 2. モードを更新
    currentViewMode = viewMode;

    // 3. 切り替え後のモード用のフィルターを復元
    activeFilterIds = new Set(viewFilters[currentViewMode] || ['ALL']);

    // UIの調整
    document.getElementById('view-map-view').style.overflowY = 'auto';
    document.querySelector('.calendar-scroll-area').style.height = 'auto';
    
    const verticalScrollTarget = document.getElementById('view-map-view');
    if (verticalScrollTarget && verticalScrollTarget._monthScrollListener) {
        verticalScrollTarget.removeEventListener('scroll', verticalScrollTarget._monthScrollListener);
        verticalScrollTarget._monthScrollListener = null;
    }

    // 表示を更新
    renderTimelineFilters(); 
    renderVerticalTimeline('map');
    
    // 4. 切り替え後の状態（新しいモード）を保存
    saveFilterState();
}

function shiftCalendar(dir) {
    const input = document.getElementById('map-date');
    const d = new Date(input.value);
    
    if (currentViewMode === 'day') {
        d.setDate(d.getDate() + dir); 
    } else if (currentViewMode === 'week') {
        d.setDate(d.getDate() + (dir * 7)); 
    } else if (currentViewMode === 'month') {
        d.setMonth(d.getMonth() + dir); // 月表示なら1ヶ月移動
    }
    
    const y = d.getFullYear();
    const m = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    input.value = `${y}-${m}-${day}`;
    
    renderVerticalTimeline('map');
    updateMonthlyCalendar();
}
/* ==============================================
   ★ 祝日データ取得処理
   ============================================== */
let holidaysCache = {}; // 祝日データを一時保存する変数

function loadHolidays() {
    fetch('https://holidays-jp.github.io/api/v1/date.json')
        .then(res => res.json())
        .then(data => {
            holidaysCache = data;
            // エラー箇所: updateWeeklyBar を updateMonthlyCalendar に変更
            if (typeof updateMonthlyCalendar === 'function') {
                updateMonthlyCalendar(); 
            }
        })
        .catch(err => console.log('祝日データの取得に失敗しました', err));
}
/* ==============================================
   ★ 新機能：週表示マトリックス生成関数 (自動高さ・クリック余白 強制確保版)
   ============================================== */
function renderMatrixWeekTimeline(mode, shouldScroll) {
    let container = document.getElementById('rooms-container-map');
    let timeAxisId = 'time-axis-map';
    let dateInputId = 'map-date';
    let headerContainer = document.getElementById('map-room-headers');
    
    let targetRooms = [];
    // ▼▼▼ 修正：7階と6階の両方から部屋情報を取得する ▼▼▼
    const floors = ['7', '6'];
    floors.forEach(floor => {
        const config = (floor === '7' && mapConfig['hq']) ? mapConfig['hq'] : mapConfig[floor];
        if (config && config.areas) {
            config.areas.forEach(area => {
                const room = masterData.rooms.find(r => 
                    String(r.roomId).trim() === String(area.id).trim()
                );
                if (room && !targetRooms.includes(room)) targetRooms.push(room);
            });
        }
    });
    // ▲▲▲ 修正ここまで ▲▲▲
    if (!activeFilterIds.has('ALL')) {
        targetRooms = targetRooms.filter(r => activeFilterIds.has(String(r.roomId)));
    }
    
    // ▼▼▼ 追加：週表示の列を部屋名（数字）で並び替える ▼▼▼
    targetRooms.sort((a, b) => a.roomName.localeCompare(b.roomName, 'ja', { numeric: true }));

    if (headerContainer) {
        headerContainer.style.display = 'flex';
        headerContainer.innerHTML = "<div class='sticky-header-spacer matrix-axis-width'></div>";
    }

    if (!targetRooms || targetRooms.length === 0) {
        if (container) container.innerHTML = "<div style='padding:20px;'>部屋データが見つかりません。</div>";
        return;
    }

    // --- ★部屋ごとの最大高さを計算する ---
    const roomHeights = {};
    const MIN_SLOT_HEIGHT = 120; 
    
    const baseDate = new Date(document.getElementById(dateInputId).value);
    const dayOfWeek = baseDate.getDay(); 
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - dayOfWeek);
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

    // 予約を安全にパースする関数
    const safeDate = (str) => new Date(String(str).replace(/-/g, '/'));

    targetRooms.forEach(room => {
        let maxCalculatedHeight = MIN_SLOT_HEIGHT;

        for (let i = 0; i < 7; i++) {
            const cur = new Date(startOfWeek);
            cur.setDate(startOfWeek.getDate() + i);
            const dateNum = formatDateToNum(cur);

            const resList = masterData.reservations.filter(res => {
                const rId = String(getVal(res, ['resourceId', 'roomId', 'room_id', 'resource_id']));
                const rStart = safeDate(res._startTime || res.startTime);
                return rId === String(room.roomId) && formatDateToNum(rStart) === dateNum;
            });

            if (resList.length > 0) {
                // 基本の余白（下部55px + 上部5px + 余裕10px = 70px）
                let dayHeight = 70; 
                resList.forEach(res => {
                    const title = getVal(res, ['title', 'subject', '件名', 'タイトル']) || '予約';
                    const lines = Math.ceil(title.length / 11) || 1; 
                    // 1予約あたりの高さを少し多め(約55px)に見積もる
                    dayHeight += 14 + (lines * 16) + 25; 
                });
                if (dayHeight > maxCalculatedHeight) {
                    maxCalculatedHeight = dayHeight;
                }
            }
        }
        roomHeights[room.roomId] = maxCalculatedHeight;
    });

    if (container) {
        container.innerHTML = "";
        container.style.height = "auto"; 
        container.style.overflowY = "visible";
        container.style.width = "100%"; 
        container.style.overflowX = "visible"; 
        container.style.display = "flex"; 
        container.style.flexWrap = "nowrap";
        container.style.flexDirection = "row";
        container.style.alignItems = "flex-start"; 
        container.style.position = "relative";
    }

    const axisContainer = document.getElementById(timeAxisId);
    if (axisContainer) {
        axisContainer.innerHTML = '';
        axisContainer.style.height = "auto";
        axisContainer.style.overflow = "visible";
        axisContainer.style.display = "block";
        axisContainer.classList.add('matrix-axis-width');

        targetRooms.forEach(room => {
            const lbl = document.createElement('div');
            lbl.className = 'matrix-room-label';
            // ★追加: 現在のハイライトIDと一致すればクラスを付与
            if (String(room.roomId) === String(currentMapRoomId)) {
                lbl.classList.add('target-highlight');
            }
            lbl.style.setProperty('height', roomHeights[room.roomId] + "px", "important");
            lbl.style.setProperty('min-height', roomHeights[room.roomId] + "px", "important");
            lbl.innerText = room.roomName;
            lbl.style.cursor = "pointer";
            lbl.onclick = () => {
                currentMapRoomId = String(room.roomId); // IDを更新
                saveFilterState();                      // 状態を保存
                renderMatrixWeekTimeline('map');        // 週表示を再描画
            };
            axisContainer.appendChild(lbl);
        });
    }

    for (let i = 0; i < 7; i++) {
        const cur = new Date(startOfWeek);
        cur.setDate(startOfWeek.getDate() + i);
        const y = cur.getFullYear();
        const m = ('0' + (cur.getMonth() + 1)).slice(-2);
        const d = ('0' + cur.getDate()).slice(-2);
        const dateStr = `${y}-${m}-${d}`;
        const dateNum = formatDateToNum(cur);

        const colDiv = document.createElement('div');
        colDiv.className = 'matrix-date-col';

        if (headerContainer) {
            const sHead = document.createElement('div');
            sHead.className = 'sticky-header-item matrix-header-item';
            sHead.innerText = `${cur.getMonth()+1}/${cur.getDate()}(${dayLabels[cur.getDay()]})`;
            if(cur.getDay() === 0 || (typeof holidaysCache !== 'undefined' && holidaysCache[dateStr])) sHead.style.color = '#d93025';
            else if(cur.getDay() === 6) sHead.style.color = '#1a73e8';
            if(dateStr === document.getElementById(dateInputId).value) sHead.style.backgroundColor = '#fff9c4'; 
            headerContainer.appendChild(sHead);
        }

        targetRooms.forEach(room => {
            const slot = document.createElement('div');
            slot.className = 'matrix-room-slot';
            if (String(room.roomId) === String(currentMapRoomId)) {
                slot.classList.add('target-highlight');
             }
            slot.style.setProperty('height', roomHeights[room.roomId] + "px", "important");
            slot.style.setProperty('min-height', roomHeights[room.roomId] + "px", "important");
            slot.dataset.roomId = room.roomId;
            slot.dataset.dateStr = dateStr;
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('drop', handleDropOnMatrix);
            
            slot.onclick = (e) => {
                if (e.target.closest('.v-booking-bar')) return;
                openModal(null, room.roomId, 9, 0, dateStr);
            };

            const resList = masterData.reservations.filter(res => {
                const rId = String(getVal(res, ['resourceId', 'roomId', 'room_id', 'resource_id']));
                const rStart = safeDate(res._startTime || res.startTime);
                return rId === String(room.roomId) && formatDateToNum(rStart) === dateNum;
            });

            resList.sort((a,b) => safeDate(a._startTime||a.startTime) - safeDate(b._startTime||b.startTime));

            resList.forEach(res => {
                const start = safeDate(res._startTime || res.startTime);
                const end = safeDate(res._endTime || res.endTime);
                const tStr = `${pad(start.getHours())}:${pad(start.getMinutes())}-${pad(end.getHours())}:${pad(end.getMinutes())}`;
                const title = getVal(res, ['title', 'subject', '件名', 'タイトル']) || '予約';

                // ▼▼▼ ① ここから追加：参加者の名前を取得する処理 ▼▼▼
                let participantsStr = "";
                let pIdsRaw = getVal(res, ['participantIds', 'participant_ids', '参加者', 'メンバー']);
                if (pIdsRaw) {
                     const cleanIds = String(pIdsRaw).replace(/['"]/g, "").split(/[,、\s]+/);
                     let names = [];
                     cleanIds.forEach(id => {
                         const trimId = id.trim();
                         if(!trimId) return;
                         const u = masterData.users.find(user => String(user.userId) === trimId);
                         names.push(u ? u.userName : trimId);
                     });
                     if (names.length > 0) {
                         if (names.length <= 4) participantsStr = names.join(', ');
                         else {
                             const showNames = names.slice(0, 4).join(', ');
                             const restCount = names.length - 4;
                             participantsStr = `${showNames} (+${restCount}名)`;
                         }
                     }
                }

                const bar = document.createElement('div');
                let cssType = room.type || 'meeting';
                if (!room.type) {
                    if (room.roomName.indexOf("応接室") !== -1) cssType = "reception";
                    else if (room.roomName.indexOf("Z") !== -1 || room.roomName.indexOf("Ｚ") !== -1) cssType = "zoom";
                }
                if (!['meeting', 'reception', 'zoom'].includes(cssType)) cssType = 'meeting';
                bar.className = `v-booking-bar type-${cssType} matrix-booking-bar`;
                if (res.isTentative) bar.classList.add('tentative-booking'); // ★追加
                bar.draggable = true;
                bar.dataset.resId = res.id;
                bar.addEventListener('dragstart', handleDragStart);
                bar.addEventListener('dragend', handleDragEnd);
                
                applyCustomTagColor(bar, title);
                
                bar.innerHTML = `
                      <div style="width:100%; font-weight:bold; font-size:0.85em; line-height:1.1; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${tStr}</div>
                      <div style="width:100%; font-weight:bold; font-size:0.9em; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${title}</div>
                      <div style="width:100%; font-weight:bold; font-size:0.9em; line-height:1.1; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${participantsStr}</div>
                `;
                bar.onclick = (e) => { e.stopPropagation(); openDetailModal(res); };
                slot.appendChild(bar);
            });
            colDiv.appendChild(slot);
        });
        if (container) container.appendChild(colDiv);
    }
    
    const scrollableParent = container ? container.closest('.calendar-scroll-area') : null;
    if (scrollableParent && headerContainer) {
        headerContainer.scrollLeft = scrollableParent.scrollLeft;
        scrollableParent.onscroll = () => { headerContainer.scrollLeft = scrollableParent.scrollLeft; };
    }
}
/* ==============================================
   ★ 新機能：月表示マトリックス生成関数 (トップヘッダー書き換え ＋ ドラッグスクロール対応版)
   ============================================== */
function renderMatrixMonthTimeline(mode, shouldScroll) {
    let isDown = false, startX, startY, startScrollLeftVal, startScrollTopVal, hasDragged = false, isTouch = false, rafId = null;

    let container = document.getElementById('rooms-container-map');
    let timeAxisId = 'time-axis-map';
    let dateInputId = 'map-date';
    let headerContainer = document.getElementById('map-room-headers');
    
    let targetRooms = [];
    // ▼▼▼ 修正：7階と6階の両方から部屋情報を取得する ▼▼▼
    const floors = ['7', '6'];
    floors.forEach(floor => {
        const config = (floor === '7' && mapConfig['hq']) ? mapConfig['hq'] : mapConfig[floor];
        if (config && config.areas) {
            config.areas.forEach(area => {
                const room = masterData.rooms.find(r => 
                    String(r.roomId).trim() === String(area.id).trim()
                );
                if (room && !targetRooms.includes(room)) targetRooms.push(room);
            });
        }
    });
    // ▲▲▲ 修正ここまで ▲▲▲
    if (!activeFilterIds.has('ALL')) {
        targetRooms = targetRooms.filter(r => activeFilterIds.has(String(r.roomId)));
    }

    // ▼▼▼ 追加：月表示の列を部屋名（数字）で並び替える ▼▼▼
    targetRooms.sort((a, b) => a.roomName.localeCompare(b.roomName, 'ja', { numeric: true }));

    if (!targetRooms || targetRooms.length === 0) {
        if (container) container.innerHTML = "<div style='padding:20px;'>部屋データが見つかりません。</div>";
        return;
    }

    const axisContainer = document.getElementById(timeAxisId);
    if (axisContainer) axisContainer.style.display = "none";

    const baseDate = new Date(document.getElementById(dateInputId).value);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(lastDayOfMonth);
    if (endDate.getDay() !== 6) {
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    }

    const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const totalWeeks = totalDays / 7;

    const safeDate = (str) => new Date(String(str).replace(/-/g, '/'));
    const MIN_SLOT_HEIGHT = 120; 

    const weekRoomHeights = [];
    for (let w = 0; w < totalWeeks; w++) {
        const roomHeights = {};
        targetRooms.forEach(room => {
            let maxCalculatedHeight = MIN_SLOT_HEIGHT;
            for (let i = 0; i < 7; i++) {
                const cur = new Date(startDate);
                cur.setDate(startDate.getDate() + (w * 7) + i);
                const dateNum = formatDateToNum(cur);

                const resList = masterData.reservations.filter(res => {
                    const rId = String(getVal(res, ['resourceId', 'roomId', 'room_id', 'resource_id']));
                    const rStart = safeDate(res._startTime || res.startTime);
                    return rId === String(room.roomId) && formatDateToNum(rStart) === dateNum;
                });

                if (resList.length > 0) {
                    let dayHeight = 70; 
                    resList.forEach(res => {
                        const title = getVal(res, ['title', 'subject', '件名', 'タイトル']) || '予約';
                        const lines = Math.ceil(title.length / 11) || 1; 
                        dayHeight += 14 + (lines * 16) + 25; 
                    });
                    if (dayHeight > maxCalculatedHeight) maxCalculatedHeight = dayHeight;
                }
            }
            roomHeights[room.roomId] = maxCalculatedHeight;
        });
        weekRoomHeights.push(roomHeights);
    }

    const updateTopStickyHeader = (weekIndex) => {
        if (!headerContainer) return;
        
        const prevScrollLeft = headerContainer.scrollLeft;
        headerContainer.style.display = 'flex';
        headerContainer.innerHTML = ""; 
        
        const wSpacer = document.createElement('div');

        // ▼▼▼ 修正：sticky-header-spacer を追加して左固定を復活させる ▼▼▼
        wSpacer.className = "sticky-header-spacer matrix-axis-width"; 
        // ▲▲▲ 修正ここまで ▲▲▲
        
        wSpacer.style.display = "flex";
        wSpacer.style.alignItems = "center";
        wSpacer.style.justifyContent = "center";
        wSpacer.style.fontSize = "0.85rem";
        wSpacer.style.fontWeight = "bold";
        wSpacer.style.color = "#1a73e8";
        wSpacer.style.borderRight = "1px solid #ccc";
        wSpacer.style.backgroundColor = "#fafafa";
        wSpacer.style.boxSizing = "border-box";
        
        wSpacer.innerText = `第${weekIndex + 1}週`;
        headerContainer.appendChild(wSpacer);

        const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
        for (let i = 0; i < 7; i++) {
            const cur = new Date(startDate);
            cur.setDate(startDate.getDate() + (weekIndex * 7) + i);
            const dateStr = `${cur.getMonth()+1}/${cur.getDate()}(${dayLabels[cur.getDay()]})`;
            const fullDateStr = `${cur.getFullYear()}-${('0'+(cur.getMonth()+1)).slice(-2)}-${('0'+cur.getDate()).slice(-2)}`;

            const sHead = document.createElement('div');
            // ▼▼▼ 修正3：余分なクラスを外し、下の行と完全に同じクラスにする ▼▼▼
            sHead.className = 'matrix-header-item month-matrix-slot';
            sHead.style.height = "40px";
            sHead.style.display = "flex";
            sHead.style.alignItems = "center";
            sHead.style.justifyContent = "center";
            sHead.style.fontWeight = "bold";
            sHead.style.fontSize = "0.85rem";
            sHead.style.borderRight = "1px solid #eee";
            sHead.style.boxSizing = "border-box";
            
            sHead.innerText = dateStr;
            
            if(cur.getDay() === 0 || (typeof holidaysCache !== 'undefined' && holidaysCache[fullDateStr])) sHead.style.color = '#d93025';
            else if(cur.getDay() === 6) sHead.style.color = '#1a73e8';
            else sHead.style.color = '#333';
            
            if(fullDateStr === document.getElementById(dateInputId).value) {
                sHead.style.backgroundColor = '#fff9c4';
            } else {
                sHead.style.backgroundColor = '#fafafa';
            }
            headerContainer.appendChild(sHead);
        }
        headerContainer.scrollLeft = prevScrollLeft;
    };

    if (container) {
        container.innerHTML = "";
        container.style.height = "auto"; 
        container.style.overflowY = "visible"; 
        // ★幅を画面いっぱいに広げる
        container.style.width = "100%"; 
        container.style.overflowX = "visible"; 
        container.style.display = "flex"; 
        container.style.flexDirection = "column";
        container.style.alignItems = "flex-start"; 
        container.style.position = "relative";
    }

    let targetScrollTop = 0; 

    for (let w = 0; w < totalWeeks; w++) {
        const weekGroup = document.createElement('div');
        weekGroup.className = "week-group-container";
        weekGroup.style.display = "flex";
        weekGroup.style.flexDirection = "column";
        weekGroup.style.width = "100%";

        const dateHeaderRow = document.createElement('div');
        dateHeaderRow.style.display = "flex";
        dateHeaderRow.style.backgroundColor = "#f1f3f4"; 
        dateHeaderRow.style.borderBottom = "1px solid #ccc";
        
        const wSpacer = document.createElement('div');
        wSpacer.className = "matrix-axis-width";
        wSpacer.style.height = "30px";
        wSpacer.style.display = "flex";
        wSpacer.style.alignItems = "center";
        wSpacer.style.justifyContent = "center";
        wSpacer.style.fontSize = "0.75rem";
        wSpacer.style.fontWeight = "bold";
        wSpacer.style.color = "#1a73e8";
        wSpacer.style.borderRight = "1px solid #ccc";
        
        // ★第X週のラベルを左に固定し、手前に出す
        wSpacer.style.backgroundColor = "#f1f3f4";
        wSpacer.style.position = "sticky";
        wSpacer.style.left = "0";
        wSpacer.style.zIndex = "85";

        wSpacer.innerText = `第${w+1}週`;
        dateHeaderRow.appendChild(wSpacer);

        for (let i = 0; i < 7; i++) {
            const cur = new Date(startDate);
            cur.setDate(startDate.getDate() + (w * 7) + i);
            const fullDateStr = `${cur.getFullYear()}-${('0'+(cur.getMonth()+1)).slice(-2)}-${('0'+cur.getDate()).slice(-2)}`;
            
            const dHeader = document.createElement('div');
            // ★横幅均等化のクラスを追加
            dHeader.className = "matrix-header-item month-matrix-slot";
            dHeader.style.height = "30px";
            dHeader.style.display = "flex";
            dHeader.style.alignItems = "center";
            dHeader.style.justifyContent = "center";
            dHeader.style.fontWeight = "bold";
            dHeader.style.fontSize = "0.9rem";
            dHeader.style.borderRight = "1px solid #eee";
            dHeader.innerText = `${cur.getMonth()+1}/${cur.getDate()}`;
            
            if (cur.getMonth() !== month) dHeader.style.opacity = "0.4"; 
            if(cur.getDay() === 0 || (typeof holidaysCache !== 'undefined' && holidaysCache[fullDateStr])) dHeader.style.color = '#d93025';
            else if(cur.getDay() === 6) dHeader.style.color = '#1a73e8';
            if(fullDateStr === document.getElementById(dateInputId).value) {
                targetScrollTop = weekGroup.offsetTop;
            }
            dateHeaderRow.appendChild(dHeader);
        }
        weekGroup.appendChild(dateHeaderRow);

        targetRooms.forEach(room => {
            const roomRow = document.createElement('div');
            roomRow.style.display = "flex";
            roomRow.style.width = "100%";
            
            const rowHeight = weekRoomHeights[w][room.roomId];

            const lbl = document.createElement('div');
            lbl.className = 'matrix-room-label matrix-axis-width';
            if (String(room.roomId) === String(currentMapRoomId)) {
                  lbl.classList.add('target-highlight');
                }
            lbl.style.setProperty('height', rowHeight + "px", "important");
            lbl.style.setProperty('min-height', rowHeight + "px", "important");
            lbl.style.position = "sticky";
            lbl.style.left = "0"; 

            // ★部屋名ラベルを手前に出す
            lbl.style.zIndex = "90";
            lbl.style.backgroundColor = "#fff";

            lbl.style.borderRight = "1px solid #ccc";
            lbl.innerText = room.roomName;
            // ★追加: ラベルをクリックした時の処理
            lbl.style.cursor = "pointer";
            lbl.onclick = () => {
                currentMapRoomId = String(room.roomId); // IDを更新
                saveFilterState();                      // 状態を保存
                renderMatrixMonthTimeline('map');       // 月表示を再描画
            };
            roomRow.appendChild(lbl);

            for (let i = 0; i < 7; i++) {
                const cur = new Date(startDate);
                cur.setDate(startDate.getDate() + (w * 7) + i);
                const dateNum = formatDateToNum(cur);
                const fullDateStr = `${cur.getFullYear()}-${('0'+(cur.getMonth()+1)).slice(-2)}-${('0'+cur.getDate()).slice(-2)}`;

                const slot = document.createElement('div');
                // ★横幅均等化のクラスを追加し、固定幅のスタイルを削除
                slot.className = 'matrix-room-slot month-matrix-slot';
                if (String(room.roomId) === String(currentMapRoomId)) slot.classList.add('target-highlight');
                slot.style.borderRight = "1px solid #eee";
                
                slot.style.setProperty('height', rowHeight + "px", "important");
                slot.style.setProperty('min-height', rowHeight + "px", "important");
                slot.dataset.roomId = room.roomId;
                slot.dataset.dateStr = fullDateStr; // ※月表示の場合はfullDateStrを使います
                slot.addEventListener('dragover', handleDragOver);
                slot.addEventListener('drop', handleDropOnMatrix);
                
                slot.onclick = (e) => {
                    if (!isTouch && hasDragged) return; 
                    if (e.target.closest('.v-booking-bar')) return;
                    openModal(null, room.roomId, 9, 0, fullDateStr);
                };

                const resList = masterData.reservations.filter(res => {
                    const rId = String(getVal(res, ['resourceId', 'roomId', 'room_id', 'resource_id']));
                    const rStart = safeDate(res._startTime || res.startTime);
                    return rId === String(room.roomId) && formatDateToNum(rStart) === dateNum;
                });

                resList.sort((a,b) => safeDate(a._startTime||a.startTime) - safeDate(b._startTime||b.startTime));

                resList.forEach(res => {
                    const start = safeDate(res._startTime || res.startTime);
                    const end = safeDate(res._endTime || res.endTime);
                    const tStr = `${pad(start.getHours())}:${pad(start.getMinutes())}-${pad(end.getHours())}:${pad(end.getMinutes())}`;
                    const title = getVal(res, ['title', 'subject', '件名', 'タイトル']) || '予約';

                    // ▼▼▼ ① ここから追加：参加者の名前を取得する処理 ▼▼▼
                    let participantsStr = "";
                    let pIdsRaw = getVal(res, ['participantIds', 'participant_ids', '参加者', 'メンバー']);
                    if (pIdsRaw) {
                         const cleanIds = String(pIdsRaw).replace(/['"]/g, "").split(/[,、\s]+/);
                         let names = [];
                         cleanIds.forEach(id => {
                             const trimId = id.trim();
                             if(!trimId) return;
                             const u = masterData.users.find(user => String(user.userId) === trimId);
                             names.push(u ? u.userName : trimId);
                         });
                         if (names.length > 0) {
                             if (names.length <= 4) participantsStr = names.join(', ');
                             else {
                                 const showNames = names.slice(0, 4).join(', ');
                                 const restCount = names.length - 4;
                                 participantsStr = `${showNames} (+${restCount}名)`;
                             }
                         }
                    }

                    const bar = document.createElement('div');
                    let cssType = room.type || 'meeting';
                    if (!room.type) {
                        if (room.roomName.indexOf("応接室") !== -1) cssType = "reception";
                        else if (room.roomName.indexOf("Z") !== -1 || room.roomName.indexOf("Ｚ") !== -1) cssType = "zoom";
                    }
                    if (!['meeting', 'reception', 'zoom'].includes(cssType)) cssType = 'meeting';
                    bar.className = `v-booking-bar type-${cssType} matrix-booking-bar`;
                    if (res.isTentative) bar.classList.add('tentative-booking'); // ★追加
                    bar.draggable = true;
                    bar.dataset.resId = res.id;
                    bar.addEventListener('dragstart', handleDragStart);
                    bar.addEventListener('dragend', handleDragEnd);

                    applyCustomTagColor(bar, title);
                    
                    bar.innerHTML = `
                          <div style="width:100%; font-weight:bold; font-size:0.85em; line-height:1.1; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${tStr}</div>
                          <div style="width:100%; font-weight:bold; font-size:0.9em; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${title}</div>
                          <div style="width:100%; font-weight:bold; font-size:0.9em; line-height:1.1; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${participantsStr}</div>
                    `;
                    bar.onclick = (e) => { 
                        if (!isTouch && hasDragged) return; 
                        e.stopPropagation(); 
                        openDetailModal(res); 
                    };
                    slot.appendChild(bar);
                });
                roomRow.appendChild(slot);
            }
            weekGroup.appendChild(roomRow);
        });
        
        if (container) container.appendChild(weekGroup);
    }
    
    const scrollableParent = container ? container.closest('.calendar-scroll-area') : null;
    const verticalScrollTarget = document.getElementById('view-map-view'); 

    if (scrollableParent) {
        if (headerContainer && verticalScrollTarget) {
            headerContainer.style.paddingRight = "0px";
            headerContainer.style.boxSizing = "border-box";
            headerContainer.scrollLeft = scrollableParent.scrollLeft;
            scrollableParent.onscroll = () => { 
                headerContainer.scrollLeft = scrollableParent.scrollLeft; 
            };
        }
        
        if (shouldScroll && targetScrollTop > 0 && verticalScrollTarget) {
            setTimeout(() => {
                verticalScrollTarget.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
            }, 300);
        }

        if (verticalScrollTarget) {
            const weekGroups = container.querySelectorAll('.week-group-container');
            let currentActiveWeek = -1;

            const handleVerticalScroll = () => {
                let stickyLine = headerContainer ? headerContainer.getBoundingClientRect().bottom + 30 : 150;

                let newActiveWeek = 0;
                weekGroups.forEach((group, index) => {
                    const groupTop = group.getBoundingClientRect().top;
                    if (groupTop < stickyLine) {
                        newActiveWeek = index;
                    }
                });

                if (newActiveWeek !== currentActiveWeek) {
                    currentActiveWeek = newActiveWeek;
                    updateTopStickyHeader(currentActiveWeek);
                }
            };

            if (verticalScrollTarget._monthScrollListener) {
                verticalScrollTarget.removeEventListener('scroll', verticalScrollTarget._monthScrollListener);
            }
            verticalScrollTarget._monthScrollListener = handleVerticalScroll;
            verticalScrollTarget.addEventListener('scroll', handleVerticalScroll, { passive: true });
            
            setTimeout(handleVerticalScroll, 50);
        }

        // ▼▼▼ ドラッグ処理のブロックを適切な位置に配置 ▼▼▼
        if (verticalScrollTarget) {
            scrollableParent.addEventListener('touchstart', () => { isTouch = true; }, { passive: true });
            scrollableParent.style.cursor = "default";
            
            scrollableParent.onwheel = (e) => { 
                if (e.ctrlKey) return; 
                if (e.deltaX !== 0 || e.shiftKey) { 
                    e.preventDefault(); 
                    scrollableParent.scrollLeft += (e.deltaX || e.deltaY); 
                } 
            };
            
            scrollableParent.onmousedown = (e) => {
                if (isTouch || e.target.closest('.v-booking-bar') || ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'].includes(e.target.tagName)) return;
                isDown = true; 
                hasDragged = false; 
                scrollableParent.style.cursor = "grabbing";
                startX = e.pageX; 
                startY = e.pageY; 
                startScrollLeftVal = scrollableParent.scrollLeft; 
                startScrollTopVal = verticalScrollTarget.scrollTop;
                document.addEventListener('mousemove', onMouseMove); 
                document.addEventListener('mouseup', onMouseUp);
            };
            
            const onMouseMove = (e) => {
                if (!isDown || isTouch) return; 
                e.preventDefault(); 
                if (rafId) return;
                rafId = requestAnimationFrame(() => {
                    const walkX = (e.pageX - startX) * 1.5; 
                    const walkY = (e.pageY - startY) * 1.5;
                    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) hasDragged = true;
                    scrollableParent.scrollLeft = startScrollLeftVal - walkX;
                    verticalScrollTarget.scrollTop = startScrollTopVal - walkY;
                    rafId = null;
                });
            };
            
            const onMouseUp = () => {
                isDown = false; 
                scrollableParent.style.cursor = "default";
                if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                document.removeEventListener('mousemove', onMouseMove); 
                document.removeEventListener('mouseup', onMouseUp);
                setTimeout(() => { hasDragged = false; }, 50);
            };
        }
    }
}
/* ==============================================
   ★ 修正: 帰社報告の通知機能（バナー型）
   ============================================== */
function checkReturnReports() {
    const container = document.getElementById('notification-container');
    if (!container) return;
    container.innerHTML = ''; 

    if (!masterData.returnReports || masterData.returnReports.length === 0) return;

    masterData.returnReports.forEach(report => {
        let userName = report.user_id;
        const userObj = masterData.users.find(u => String(u.userId) === String(report.user_id));
        if (userObj) userName = userObj.userName;

        const banner = document.createElement('div');
        banner.className = 'notification-banner';
        
        // ★修正: 第5引数に「帰社予定時刻 (report.return_time)」を追加して渡す
        banner.onclick = () => markReportAsRead(report.id, userName, report.adult_count, report.child_count, report.return_time);
        
        banner.innerHTML = `🔔 ${userName} さんから帰社報告が届いています！　（大人 ${report.adult_count}名 / 子供 ${report.child_count}名）　👉 クリックして予約画面を開く`;
        
        container.appendChild(banner);
    });
}

/* ==============================================
   ★ 修正：バナーをクリックしたら「空き状況」へ飛び、時間をセットして自動検索
   ============================================== */
async function markReportAsRead(reportId, userName, adult, child, returnTime) {
    activeReportId = reportId; 
    pendingTitle = `${userName}、大人${adult}名、子供${child}名、帰社`;

    const modal = document.getElementById('availabilityModal');
    if (!modal) return;

    // 1. モーダルを「非表示のまま」日付と時間をセット
    const now = new Date();
    const y = now.getFullYear();
    const m = ('0' + (now.getMonth() + 1)).slice(-2);
    const d = ('0' + now.getDate()).slice(-2);
    document.getElementById('avail-date').value = `${y}-${m}-${d}`;

    // 帰社予定時刻があればセット、なければ現在時刻
    if (returnTime) {
        const cleanTime = String(returnTime).replace(/[^0-9:]/g, ''); 
        if (cleanTime && cleanTime.includes(':')) {
            document.getElementById('avail-start').value = cleanTime;
        } else {
            let h = now.getHours();
            let min = now.getMinutes() < 30 ? 0 : 30;
            document.getElementById('avail-start').value = `${('0'+h).slice(-2)}:${('0'+min).slice(-2)}`;
        }
    } else {
        let h = now.getHours();
        let min = now.getMinutes() < 30 ? 0 : 30;
        document.getElementById('avail-start').value = `${('0'+h).slice(-2)}:${('0'+min).slice(-2)}`;
    }

    if (typeof autoSetAvailEndTime === 'function') {
        autoSetAvailEndTime();
    }

    // 2. モーダルを表示する「前」に検索処理を実行し、結果を描画する
    if (typeof execAvailabilitySearch === 'function') {
        execAvailabilitySearch();
    }

    // 3. 検索結果がセットされた状態でモーダルを表示する（チラつき防止！）
    modal.style.display = 'flex';
}
/* ==============================================
   ★ 追加: 受信履歴画面の処理
   ============================================== */
let currentReceiveLogPage = 1;
const RECEIVE_LOGS_PER_PAGE = 50;

function openReceiveHistoryFromMenu() {
    const dropdown = document.getElementById("settings-dropdown");
    if(dropdown) dropdown.classList.remove("show");
    switchTab('receive-logs');
}

function searchReceiveLogs() { currentReceiveLogPage = 1; renderReceiveLogs(); }
function changeReceiveLogPage(direction) { currentReceiveLogPage += direction; renderReceiveLogs(); }

function renderReceiveLogs() {
    const tbody = document.getElementById('receive-log-tbody');
    if (!tbody) return;
    tbody.innerHTML = "";
    
    // データが空でもエラーにならないように保護
    const reportsSource = masterData.allReturnReports || [];
    const paginationContainer = document.getElementById('receive-log-pagination');

    if (reportsSource.length === 0) {
        if (paginationContainer) paginationContainer.innerHTML = "受信データがありません";
        return;
    }

    const parseUtcDate = (str) => {
        if (!str) return new Date();
        let s = String(str).trim();
        s = s.replace(/\//g, '-').replace(' ', 'T');
        if (!s.endsWith('Z')) s += 'Z'; 
        return new Date(s);
    };

    let allReports = [...reportsSource].sort((a, b) => {
        return parseUtcDate(b.created_at) - parseUtcDate(a.created_at);
    });

    const filterText = document.getElementById('receive-log-search-input').value.toLowerCase().trim();
    if (filterText) {
        const searchKata = hiraToKata(filterText); 
        const searchHira = kataToHira(filterText);
        allReports = allReports.filter(report => {
            let userName = String(report.user_id || "");
            const userObj = masterData.users.find(u => String(u.userId) === String(report.user_id));
            if (userObj) userName = userObj.userName;
            const operatorKana = userObj ? (userObj.kana || "") : "";
            return (
                userName.toLowerCase().includes(filterText) ||
                operatorKana.includes(filterText) || 
                operatorKana.includes(searchKata) || 
                operatorKana.includes(searchHira)
            );
        });
    }

    const totalItems = allReports.length;
    const totalPages = Math.ceil(totalItems / RECEIVE_LOGS_PER_PAGE) || 1;
    if (currentReceiveLogPage < 1) currentReceiveLogPage = 1;
    if (currentReceiveLogPage > totalPages) currentReceiveLogPage = totalPages;

    const displayReports = allReports.slice((currentReceiveLogPage - 1) * RECEIVE_LOGS_PER_PAGE, currentReceiveLogPage * RECEIVE_LOGS_PER_PAGE);

    displayReports.forEach(report => {
        const tr = document.createElement('tr');
        let userName = report.user_id;
        const userObj = masterData.users.find(u => String(u.userId) === String(report.user_id));
        if (userObj) userName = userObj.userName;

        const dateStr = formatDate(parseUtcDate(report.created_at));
        const detailStr = `大人 ${report.adult_count}名 / 子供 ${report.child_count}名`;
        const statusHtml = report.is_read ? 
            `<span style="color:#666; font-size:0.85em; padding:4px 8px; background:#eee; border-radius:4px;">確認済</span>` : 
            `<span style="color:#fff; font-size:0.85em; padding:4px 8px; background:#e74c3c; border-radius:4px; font-weight:bold;">未確認</span>`;

        tr.innerHTML = `
            <td>${dateStr}</td>
            <td><strong>${userName}</strong></td>
            <td>${detailStr}</td>
            <td style="text-align:center;">${statusHtml}</td>
        `;
        tbody.appendChild(tr);
    });

    if (paginationContainer) {
        renderReceivePaginationControls(totalPages, totalItems, (currentReceiveLogPage - 1) * RECEIVE_LOGS_PER_PAGE + 1, Math.min(currentReceiveLogPage * RECEIVE_LOGS_PER_PAGE, totalItems));
    }
}

function renderReceivePaginationControls(totalPages, totalItems, startCount, endCount) {
    const container = document.getElementById('receive-log-pagination');
    container.innerHTML = "";
    if (totalItems === 0) { container.innerText = "一致する履歴はありません"; return; }

    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerText = "< 前へ";
    prevBtn.disabled = (currentReceiveLogPage === 1);
    if (currentReceiveLogPage === 1) prevBtn.classList.add('disabled');
    prevBtn.onclick = () => changeReceiveLogPage(-1);
    container.appendChild(prevBtn);

    const infoSpan = document.createElement('span');
    infoSpan.className = 'page-info';
    infoSpan.innerText = ` ${startCount} - ${endCount} / ${totalItems}件 `;
    container.appendChild(infoSpan);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerText = "次へ >";
    nextBtn.disabled = (currentReceiveLogPage === totalPages);
    if (currentReceiveLogPage === totalPages) nextBtn.classList.add('disabled');
    nextBtn.onclick = () => changeReceiveLogPage(1);
    container.appendChild(nextBtn);
}
/* ==============================================
   ★ 追加: 毎分00秒にマップの色を更新するタイマー
   ============================================== */
let mapUpdateTimer = null;
function startMapStatusUpdater() {
    if (mapUpdateTimer) return; // 既に起動済みなら何もしない
    
    const syncAndStart = () => {
        const now = new Date();
        // 次の00秒までのミリ秒を計算（例: 30秒なら残り30000ミリ秒）
        const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
        
        setTimeout(() => {
            // 00秒になった瞬間に一回マップを更新
            if (document.getElementById('view-map-view') && document.getElementById('view-map-view').classList.contains('active')) {
                renderHQMap();
            }
            // その後、60秒ごとにずっと実行し続ける
            mapUpdateTimer = setInterval(() => {
                if (document.getElementById('view-map-view') && document.getElementById('view-map-view').classList.contains('active')) {
                    renderHQMap();
                }
            }, 60000);
        }, delay);
    };
    syncAndStart();
}

// 画面読み込み時にタイマーを起動
document.addEventListener("DOMContentLoaded", () => {
    startMapStatusUpdater();
});
/* ==============================================
   追加: 用件の定型文タグ入力機能
   ============================================== */
function toggleTitleTag(btnElement) {
    const inputEl = document.getElementById('input-title');
    const tagText = btnElement.getAttribute('data-tag');
    let currentText = inputEl.value.trim();

    if (btnElement.classList.contains('active')) {
        // オフにする: スペース区切りで配列化し、該当するタグを除外して再結合
        btnElement.classList.remove('active');
        let textArray = currentText.split(/\s+/);
        textArray = textArray.filter(text => text !== tagText);
        inputEl.value = textArray.join(' ');
    } else {
        // オンにする: 文字列の末尾に追加 (順番通りに左から並ぶ)
        btnElement.classList.add('active');
        if (currentText.length > 0) {
            inputEl.value = currentText + ' ' + tagText;
        } else {
            inputEl.value = tagText;
        }
    }
}

// テキストボックスの内容とボタンの見た目を同期する関数
function syncTitleTags() {
    const currentText = document.getElementById('input-title').value;
    const buttons = document.querySelectorAll('.title-tag-btn');
    buttons.forEach(btn => {
        const tagText = btn.getAttribute('data-tag');
        if (currentText.includes(tagText)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}
/* ==============================================
   追加: 定型文タグの動的生成・作成・削除機能
   ============================================== */
let isTagDeleteMode = false;

function renderTitleTags() {
    const container = document.getElementById('title-tags-area');
    if (!container) return;
    container.innerHTML = "";

    // データベースから取得したタグをループで生成
    (masterData.titleTags || []).forEach(tag => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'title-tag-btn';
        btn.setAttribute('data-tag', tag.tag_name);
        btn.innerText = tag.tag_name;

        // 削除モード時の見た目
        if (isTagDeleteMode) {
            btn.style.border = "1px dashed #c0392b";
            btn.style.color = "#c0392b";
            btn.style.backgroundColor = "#fdeaea";
        }

        // ▼▼▼ 修正：正しい関数(deleteTitleTag)を呼び出す ▼▼▼
        btn.onclick = () => {
            if (isTagDeleteMode) {
                // ★修正：データベースのID (tag.id) も一緒に渡す
                deleteTitleTag(tag.id, tag.tag_name, btn);
            } else {
                toggleTitleTag(btn);
            }
        };
        container.appendChild(btn);
    });

    // 「＋新規作成」ボタン
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'title-tag-btn';
    addBtn.style.backgroundColor = '#4caf50';
    addBtn.style.color = 'white';
    addBtn.style.border = 'none';
    addBtn.innerText = '＋追加';
    addBtn.style.opacity = isTagDeleteMode ? "0.3" : "1.0";
    addBtn.onclick = () => addNewTitleTag();
    container.appendChild(addBtn);

    // 「×削除」モード切替ボタン
    if ((masterData.titleTags || []).length > 0) {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'title-tag-btn';
        delBtn.style.backgroundColor = isTagDeleteMode ? '#c0392b' : '#e74c3c';
        delBtn.style.color = 'white';
        delBtn.style.border = 'none';
        delBtn.innerText = isTagDeleteMode ? '完了' : '×削除';
        delBtn.onclick = () => {
            isTagDeleteMode = !isTagDeleteMode;
            renderTitleTags();
        };
        container.appendChild(delBtn);
    }

    // 描画が終わったら選択状態を同期
    if (!isTagDeleteMode) syncTitleTags();
}

function addNewTitleTag() {
    if (isTagDeleteMode) return;
    openTagColorSettingModal();
}

// ★修正：受け取る項目に tagId を追加
async function deleteTitleTag(tagId, tagName, btn) {
    if (!confirm(`定型文「${tagName}」を削除しますか？`)) return;

    document.getElementById('loading').style.display = 'flex';
    
    // ★修正：サーバーに送信するデータにIDを含める
    const params = {
        action: 'deleteTitleTag',
        id: tagId,       // APIの仕様に合わせて念のためidとして送信
        tagId: tagId,    // APIの仕様に合わせて念のためtagIdとしても送信
        tagName: tagName
    };
    
    try {
        const result = await callAPI(params);
        document.getElementById('loading').style.display = 'none';
        
        if (result.status === 'success') {
            // 見た目だけでなく、ブラウザが記憶している裏側のデータからも確実に消す
            if (masterData && masterData.titleTags) {
                // ★名前ではなく、確実なIDを使って一致するものを消去する
                masterData.titleTags = masterData.titleTags.filter(tag => tag.id !== tagId);
            }
            
            // 画面のボタンを消す
            if (btn) {
                btn.remove();
            }
            
            // 削除が終わったら、自動的に「削除モード」を解除する
            if (typeof isTagDeleteMode !== 'undefined' && isTagDeleteMode) {
                const tagsArea = document.getElementById('title-tags-area');
                if (tagsArea) {
                    const deleteBtn = Array.from(tagsArea.querySelectorAll('button')).find(b => b.innerText.includes('完了'));
                    if (deleteBtn) {
                        deleteBtn.click(); 
                    }
                }
            }
        } else {
            alert("削除に失敗しました: " + result.message);
        }
    } catch(e) {
        document.getElementById('loading').style.display = 'none';
        alert("通信エラーが発生しました");
    }
}
/* ==============================================
   追加: ドラッグ＆ドロップで予約を移動する機能
   ============================================== */
let draggedResId = null;
let dragOffsetY = 0; // ★追加：枠の一番上からマウスまでの「ズレ」を記憶する変数

function handleDragStart(e) {
    draggedResId = this.dataset.resId;
    
    // ▼▼▼ 追加：枠の一番上からマウスがどれくらい下にあるかを計算・記憶 ▼▼▼
    const rect = this.getBoundingClientRect();
    dragOffsetY = e.clientY - rect.top;
    // ▲▲▲ 追加ここまで ▲▲▲

    e.dataTransfer.effectAllowed = 'move';
    // ドラッグ中の要素を半透明にする
    setTimeout(() => this.style.opacity = '0.5', 0);
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    draggedResId = null;
}

function handleDragOver(e) {
    e.preventDefault(); // ここで許可しないとドロップできない
    e.dataTransfer.dropEffect = 'move';
}

// 縦軸（日表示）でのドロップ処理：座標から時間を計算
// 縦軸（日表示）でのドロップ処理：座標から時間を計算
async function handleDropOnTimeline(e) {
    e.preventDefault();
    if (!draggedResId) return;

    const targetBody = e.target.closest('.room-grid-body');
    if (!targetBody) return;

    const roomId = targetBody.dataset.roomId;
    const dateStr = targetBody.dataset.dateStr;

    // ドロップされたY座標から時間を計算
    const rect = targetBody.getBoundingClientRect();
    // ▼▼▼ 修正：マウスの座標から「ズレ」を引いて、枠の【一番上】の座標を計算する ▼▼▼
    let dropY = (e.clientY - rect.top) - dragOffsetY;
    if (dropY < 0) dropY = 0; // 枠外（上）にはみ出さないように保護
    // ▲▲▲ 修正ここまで ▲▲▲

    // 画面の高さ設定（hourRowHeights）から時間枠を再構築
    const tops = {};
    let currentTop = 0;
    for (let h = START_HOUR; h < END_HOUR; h++) {
        tops[h] = currentTop;
        currentTop += (hourRowHeights[h] || BASE_HOUR_HEIGHT);
    }
    tops[END_HOUR] = currentTop;

    let droppedHour = -1;
    let droppedMin = 0;

    for (let h = START_HOUR; h < END_HOUR; h++) {
        const top = tops[h];
        const bottom = tops[h + 1];
        if (dropY >= top && dropY < bottom) {
            droppedHour = h;
            const height = bottom - top;
            const relativeY = dropY - top;
            
            // 15分刻みでスナップ（吸着）させる
            const minRatio = relativeY / height;
            if (minRatio < 0.25) droppedMin = 0;
            else if (minRatio < 0.5) droppedMin = 15;
            else if (minRatio < 0.75) droppedMin = 30;
            else droppedMin = 45;
            break;
        }
    }

    if (droppedHour === -1) return;
    await execDragAndDropUpdate(draggedResId, roomId, dateStr, droppedHour, droppedMin);
}

// マトリックス（週・月表示）でのドロップ処理：時間は元のまま日付と部屋だけ移動
async function handleDropOnMatrix(e) {
    e.preventDefault();
    if (!draggedResId) return;

    const targetSlot = e.target.closest('.matrix-room-slot');
    if (!targetSlot) return;

    const roomId = targetSlot.dataset.roomId;
    const dateStr = targetSlot.dataset.dateStr;

    // 元の予約の時間をそのまま引き継ぐ
    const res = masterData.reservations.find(r => r.id === draggedResId);
    if (!res) return;
    const oldStart = new Date(res._startTime || res.startTime);
    
    await execDragAndDropUpdate(draggedResId, roomId, dateStr, oldStart.getHours(), oldStart.getMinutes());
}

// 共通：更新APIの実行
async function execDragAndDropUpdate(resId, newRoomId, newDateStr, newHour, newMin) {
    const res = masterData.reservations.find(r => r.id === resId);
    if (!res) return;

    const oldStart = new Date(res._startTime || res.startTime);
    const oldEnd = new Date(res._endTime || res.endTime);
    const durationMs = oldEnd.getTime() - oldStart.getTime();

    const newStart = new Date(`${newDateStr.replace(/-/g, '/')} ${pad(newHour)}:${pad(newMin)}:00`);
    const newEnd = new Date(newStart.getTime() + durationMs);

    const roomObj = masterData.rooms.find(r => String(r.roomId) === String(newRoomId));
    const roomName = roomObj ? roomObj.roomName : "不明な部屋";
    const timeStr = `${newStart.getMonth()+1}/${newStart.getDate()} ${pad(newStart.getHours())}:${pad(newStart.getMinutes())} - ${pad(newEnd.getHours())}:${pad(newEnd.getMinutes())}`;

    // 安全のため、移動の確認を行う
    const isSeries = !!(res.series_id || res.seriesId || res.group_id);
    let msg = `以下の内容に予約を移動しますか？\n\n【移動先】 ${roomName}\n【日　時】 ${timeStr}`;
    if (isSeries) {
        msg += `\n\n※これは繰り返し予約の一部です。今回移動するのは「この1回分」のみとなり、他の繰り返し予定からは切り離されます。`;
    }

    if (!confirm(msg)) return;

    document.getElementById('loading').style.display = 'flex';

    let pIds = res.participantIds || res.participant_ids || "";
    if (Array.isArray(pIds)) pIds = pIds.join(',');

    const oldStartStr = `${oldStart.getFullYear()}/${pad(oldStart.getMonth()+1)}/${pad(oldStart.getDate())} ${pad(oldStart.getHours())}:${pad(oldStart.getMinutes())}`;
    const oldEndStr = `${oldEnd.getFullYear()}/${pad(oldEnd.getMonth()+1)}/${pad(oldEnd.getDate())} ${pad(oldEnd.getHours())}:${pad(oldEnd.getMinutes())}`;
    const newStartStr = `${newStart.getFullYear()}/${pad(newStart.getMonth()+1)}/${pad(newStart.getDate())} ${pad(newStart.getHours())}:${pad(newStart.getMinutes())}`;
    const newEndStr = `${newEnd.getFullYear()}/${pad(newEnd.getMonth()+1)}/${pad(newEnd.getDate())} ${pad(newEnd.getHours())}:${pad(newEnd.getMinutes())}`;
    
    const logTimeRange = `${oldStartStr} - ${oldEndStr} → ${newStartStr} - ${newEndStr}`;

    let logResourceName = newRoomId;
    const oldRoomId = String(res._resourceId || res.resourceId);
    if (oldRoomId !== String(newRoomId)) {
        const oldRoomObj = masterData.rooms.find(r => String(r.roomId) === oldRoomId);
        const oldName = oldRoomObj ? oldRoomObj.roomName : "元の部屋";
        logResourceName = `${newRoomId}\n(元: ${oldName})`;
    }

    const params = {
        action: 'updateReservation',
        reservationId: res.id,
        resourceId: newRoomId,
        resourceName: logResourceName, 
        timeRangeStr: logTimeRange,
        actionType: 'ドラッグ移動',
        startTime: `${newStart.getFullYear()}/${pad(newStart.getMonth()+1)}/${pad(newStart.getDate())} ${pad(newStart.getHours())}:${pad(newStart.getMinutes())}`,
        endTime: `${newEnd.getFullYear()}/${pad(newEnd.getMonth()+1)}/${pad(newEnd.getDate())} ${pad(newEnd.getHours())}:${pad(newEnd.getMinutes())}`,
        participantIds: pIds,
        title: getVal(res, ['title', 'subject', '件名', 'タイトル']),
        note: getVal(res, ['note', 'description', '備考', 'メモ']),
        operatorName: currentUser ? currentUser.userName : 'Unknown',
        seriesId: null // ドラッグ移動時は単発扱いにする
    };

    try {
        const result = await callAPI(params);
        if (result.status === 'success') {
            loadAllData(true);
        } else {
            alert('移動に失敗しました: ' + result.message);
            loadAllData(true);
        }
    } catch (err) {
        console.error(err);
        alert('通信エラーが発生しました');
        loadAllData(true);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}
// ★追加: 拠点タブを切り替える関数
function setBranchFilter(branch, btnElement) {
    activeBranchFilter = branch;
    
    // ▼▼▼ 修正：クリックされたボタンと同じコンテナ内のタブだけを対象にする ▼▼▼
    const container = btnElement.closest('.branch-tabs-container');
    if (container) {
        const tabs = container.querySelectorAll('.branch-tab');
        tabs.forEach(t => t.classList.remove('active'));
    }
    btnElement.classList.add('active');
    
    // リストを再描画
    renderShuttleLists(); 
}
/* ==============================================
   追加：予約内容をコピーして新規作成する処理
   ============================================== */
function openCopyBookingModal() {
    const res = currentDetailRes; // 開いている詳細画面のデータを取得
    if (!res) return;

    // 1. まず詳細モーダルを閉じる
    closeDetailModal();

    // 2. 部屋IDと日付・時間を取得
    const rId = res._resourceId || res.resourceId || res.roomId;
    const startObj = new Date(res._startTime || res.startTime);
    const endObj = new Date(res._endTime || res.endTime);
    
    const y = startObj.getFullYear();
    const m = ('0' + (startObj.getMonth() + 1)).slice(-2);
    const d = ('0' + startObj.getDate()).slice(-2);
    const dateStr = `${y}-${m}-${d}`;

    // 3. 「新規予約」として予約モーダルを開く（時間と場所をセット）
    openModal(null, rId, startObj.getHours(), startObj.getMinutes(), dateStr);

    // 4. 終了時間・用件(タイトル)・備考を元のデータで上書きする
    document.getElementById('input-end').value = `${pad(endObj.getHours())}:${pad(endObj.getMinutes())}`;
    document.getElementById('input-title').value = getVal(res, ['title', 'subject', '件名', 'タイトル']) || "";
    document.getElementById('input-note').value = getVal(res, ['note', 'description', '備考', 'メモ']) || "";

    // 5. 参加者をコピーする
    selectedParticipantIds.clear();
    originalParticipantIds.clear();
    
    const pIds = getVal(res, ['participantIds', 'participant_ids', '参加者', 'メンバー']);
    if (pIds) {
        let idList = [];
        if (Array.isArray(pIds)) idList = pIds;
        else if (typeof pIds === 'string') idList = pIds.split(/[,、\s]+/);
        else if (typeof pIds === 'number') idList = [pIds];

        idList.forEach(rawId => { 
            if(rawId !== null && rawId !== undefined && String(rawId).trim() !== "") {
                const targetId = String(rawId).trim();
                const user = masterData.users.find(u => {
                    const uId = String(u.userId).trim();
                    return uId === targetId || (!isNaN(uId) && !isNaN(targetId) && Number(uId) === Number(targetId));
                });
                const finalId = user ? String(user.userId).trim() : targetId;
                selectedParticipantIds.add(finalId); 
                originalParticipantIds.add(finalId); 
            }
        });
    }

    // 6. 画面のリストやタグの見た目を更新
    renderShuttleLists(); 
    syncTitleTags();
}

/* ==============================================
   追加：用件キーワード色設定モーダルのプログラム（完成版）
   ============================================== */
let customTagColors = {}; // ユーザーが設定した色を記憶する変数
const TAG_COLORS_STORAGE_KEY = 'roompin_tag_colors_v1';

// 初期ロード時にブラウザから設定を読み込む
function loadCustomTagColors() {
    const saved = localStorage.getItem(TAG_COLORS_STORAGE_KEY);
    if (saved) {
        try { customTagColors = JSON.parse(saved); } 
        catch (e) { customTagColors = {}; }
    }
}
loadCustomTagColors(); // スクリプト読み込み時に即時実行

let selectedTagColor = ''; 

// 1. 画面を開く
function openTagColorSettingModal() {
    // 入力欄をクリア
    document.getElementById('input-new-color-tag-name').value = '';
    selectedTagColor = ''; // 色の選択をリセット

    // カラーパレットを作成して表示
    generateTagColorPalette();

    // モーダルを開く
    const modal = document.getElementById('tagColorSettingModal');
    if (modal) modal.style.display = 'flex'; // ★ 'flex' にすることで画面中央に表示されます
}
// ★追加：リストから選んだら、文字と設定済みの色を自動でセットする機能
function loadExistingTagColor() {
    const selectBox = document.getElementById('select-edit-tag');
    const inputName = document.getElementById('input-new-color-tag-name');
    const keyword = selectBox.value;

    if (keyword) {
        // 1. 入力欄に選んだ文字を自動で入れる
        inputName.value = keyword;
        
        // 2. すでに色が保存されていれば、カラーピッカーにセットして選択状態にする
        if (customTagColors[keyword]) {
            const savedColor = customTagColors[keyword];
            const customInput = document.getElementById('custom-color-picker');
            if (customInput) {
                customInput.value = savedColor;
                handleTagColorSelect(customInput, savedColor);
            }
        } else {
            // 色が設定されていなければリセット
            const allBtns = document.querySelectorAll('.color-choice-btn');
            allBtns.forEach(btn => btn.classList.remove('selected'));
            selectedTagColor = '';
        }
    }
}

function closeTagColorSettingModal() {
    const modal = document.getElementById('tagColorSettingModal');
    if (modal) modal.style.display = 'none';
}

// カラーパレット（エクセル風の基本色 ＋ その他の色）を生成
function generateTagColorPalette() {
    const paletteArea = document.getElementById('tag-color-palette');
    if (!paletteArea) return;
    paletteArea.innerHTML = ''; 

    // エクセルによくある基本色を多めに用意
    const PREDEFINED_TAG_COLORS = [
        '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60', '#1abc9c',
        '#3498db', '#2980b9', '#9b59b6', '#ef5585', '#34495e', '#95a5a6'
    ];

    PREDEFINED_TAG_COLORS.forEach(color => {
        const btn = document.createElement('div');
        btn.className = 'color-choice-btn';
        btn.style.backgroundColor = color;
        btn.onclick = () => handleTagColorSelect(btn, color);
        paletteArea.appendChild(btn);
    });

    // 「その他の色」ピッカー（自由選択）と文字入力欄を追加
    const customWrapper = document.createElement('div');
    customWrapper.style.display = 'flex';
    customWrapper.style.alignItems = 'center';
    customWrapper.style.gap = '5px';
    customWrapper.style.marginLeft = '10px';
    customWrapper.style.paddingLeft = '10px';
    customWrapper.style.borderLeft = '1px solid #ccc';

    const customInput = document.createElement('input');
    customInput.type = 'color'; // OS標準のカラーピッカー
    customInput.id = 'custom-color-picker';
    customInput.value = '#000000'; 
    customInput.style.width = '32px';
    customInput.style.height = '32px';
    customInput.style.padding = '0';
    customInput.style.border = 'none';
    customInput.style.cursor = 'pointer';
    customInput.style.background = 'transparent';
    
    // ▼▼▼ 追加：文字で色を入力できるボックス（ef5585のような入力に対応） ▼▼▼
    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.placeholder = '例: ef5585';
    hexInput.style.width = '75px';
    hexInput.style.padding = '4px 6px';
    hexInput.style.border = '1px solid #ccc';
    hexInput.style.borderRadius = '4px';
    hexInput.style.fontSize = '0.85rem';

    // カラーピッカーを触った時の動き（文字入力欄も連動させる）
    const syncFromPicker = (e) => {
        handleTagColorSelect(customInput, e.target.value);
        hexInput.value = e.target.value; // 文字欄にも反映
    };
    customInput.onclick = syncFromPicker;
    customInput.oninput = syncFromPicker;

    // 文字入力欄に「ef5585」などを打ち込んだ時の動き
    hexInput.oninput = (e) => {
        let val = e.target.value.trim();
        // #がなければ自動で付ける
        if (val.length > 0 && !val.startsWith('#')) {
            val = '#' + val; 
        }
        // 6桁の色コードとして正しければ反映（大文字小文字どちらでもOK）
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            customInput.value = val; // パレットの色を変える
            handleTagColorSelect(customInput, val); // 選択状態にする
        }
    };

    customWrapper.appendChild(customInput);
    customWrapper.appendChild(hexInput); // 今までの「その他の色...」という文字の代わりに入力欄を置く
    paletteArea.appendChild(customWrapper);
}
function handleTagColorSelect(clickedBtn, color) {
    const allBtns = document.querySelectorAll('.color-choice-btn');
    allBtns.forEach(btn => btn.classList.remove('selected'));
    const picker = document.getElementById('custom-color-picker');
    if(picker) picker.style.boxShadow = 'none';

    if (clickedBtn.tagName === 'INPUT') {
        clickedBtn.style.boxShadow = '0 0 0 2px #333';
    } else {
        clickedBtn.classList.add('selected');
        if(picker) picker.value = color; 
    }
    selectedTagColor = color; 
}

// 登録ボタンを押した時の処理（既存タグの更新 ＆ 新規タグの作成）
async function saveNewTagWithColor() {
    const keyword = document.getElementById('input-new-color-tag-name').value.trim();
    if (!keyword || !selectedTagColor) {
        alert('キーワードと色を両方選択してください。\n※「その他の色」を使う場合は、一度そのアイコンをクリックしてください。');
        return;
    }
    
    // 1. 色をブラウザに記憶させる
    customTagColors[keyword] = selectedTagColor;
    localStorage.setItem(TAG_COLORS_STORAGE_KEY, JSON.stringify(customTagColors));
    
    // ★追加：既存のキーワードかどうかをチェックする
    const tagsArea = document.getElementById('title-tags-area');
    let exists = false;
    if (tagsArea) {
        const btns = tagsArea.querySelectorAll('button');
        btns.forEach(btn => { 
            // ボタンの文字と完全一致するかチェック
            if (btn.innerText.trim() === keyword || btn.getAttribute('data-tag') === keyword) {
                exists = true; 
            }
        });
    }

    if (exists) {
        // ★既存のキーワードなら、サーバーに追加する必要はないので色だけ塗って完了！
        closeTagColorSettingModal();
        if (typeof refreshUI === 'function') refreshUI();
        return; 
    }
    
    // 2. 新しいキーワードの場合のみ、定型文タグ（ボタン）としてサーバーに保存する
    document.getElementById('loading').style.display = 'flex';
    const params = {
        action: 'createTitleTag',
        tagName: keyword
    };
    
    try {
        const result = await callAPI(params);
        document.getElementById('loading').style.display = 'none';
        
        if (result.status === 'success') {
            closeTagColorSettingModal(); 
            await loadAllData(true); 
            if (typeof refreshUI === 'function') refreshUI(); 
            
            if (tagsArea) {
                const newBtn = document.createElement('button');
                newBtn.type = 'button';
                newBtn.className = 'title-tag-btn'; 
                newBtn.setAttribute('data-tag', keyword); 
                newBtn.innerText = keyword;
                
                newBtn.onclick = () => {
                    if (typeof toggleTitleTag === 'function') {
                        toggleTitleTag(newBtn);
                    } else {
                        const titleInput = document.getElementById('input-title');
                        if (titleInput) titleInput.value = keyword;
                    }
                    if (typeof syncTitleTags === 'function') syncTitleTags();
                };
                
                const addBtn = Array.from(tagsArea.querySelectorAll('button')).find(b => b.innerText.includes('＋追加'));
                if (addBtn) {
                    tagsArea.insertBefore(newBtn, addBtn);
                } else {
                    tagsArea.appendChild(newBtn);
                }
            }
        } else {
            closeTagColorSettingModal(); 
            if (typeof refreshUI === 'function') refreshUI(); 
            alert(`色は保存されましたが、タグの追加に失敗しました: ${result.message}`);
        }
    } catch(e) {
        document.getElementById('loading').style.display = 'none';
        alert("通信エラーが発生しました");
    }
}

// ★色を背景色（透明度あり）に変換して塗るための補助機能
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function applyCustomTagColor(bar, titleText) {
    if (!titleText) return;
    
    let firstKeyword = null;
    let firstIndex = -1;

    // 登録されている全てのキーワードをチェックし、一番手前（左側）にあるものを探す
    for (const keyword in customTagColors) {
        const index = titleText.indexOf(keyword);
        if (index !== -1) {
            // まだ見つかっていないか、より手前で見つかった言葉を「一番手前」として記憶する
            if (firstIndex === -1 || index < firstIndex) {
                firstIndex = index;
                firstKeyword = keyword;
            }
        }
    }

    // 一番手前にあったキーワードの色を塗る
    if (firstKeyword) {
        const color = customTagColors[firstKeyword];
        bar.style.borderTop = `4px solid ${color}`;
        bar.style.backgroundColor = hexToRgba(color, 0.15);
    }
}
