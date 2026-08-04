"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { categories, ComponentEntry, components, styles } from "./ui-data";

type PageKey = "elements" | "styles";
type ThemeKey = "paper" | "dark" | "bento" | "neon" | "glass";
type SiteStats = { pageViews: number; uniqueVisitors: number };
type FeedbackCategory = "bug" | "suggestion" | "component" | "other";
type FeedbackState = "idle" | "submitting" | "success" | "error";

const navItems: { id: PageKey; label: string; zh: string; count?: string }[] = [
  { id: "elements", label: "Elements", zh: "元件字典", count: String(components.length) },
  { id: "styles", label: "Styles", zh: "視覺風格", count: String(styles.length).padStart(2, "0") },
];

const feedbackLabels: Record<FeedbackCategory, string> = {
  bug: "回報錯誤",
  suggestion: "功能建議",
  component: "建議新增元件",
  other: "其他聯絡",
};

const categoryLabels: Record<string, string> = {
  All: "全部分類",
  Navigation: "導覽",
  Actions: "操作",
  Inputs: "輸入",
  Feedback: "回饋",
  "Data Display": "資料呈現",
  Layout: "版面配置",
  Overlays: "浮層",
  Mobile: "手機介面",
  Desktop: "桌面介面",
  Media: "媒體",
  "AI Interface": "AI 介面",
};

const themes: { id: ThemeKey; label: string; dot: string }[] = [
  { id: "paper", label: "Paper", dot: "#e8e0d1" },
  { id: "dark", label: "Ink", dot: "#24221f" },
  { id: "bento", label: "Bento", dot: "#e7f2ff" },
  { id: "neon", label: "Neon", dot: "#c9ff3b" },
  { id: "glass", label: "Glass", dot: "#cbd7e8" },
];

const definitionMap: Record<string, string> = {
  "aria-current": "告訴輔助工具目前所在的頁面、步驟或選項。",
  IntersectionObserver: "瀏覽器用來偵測元素是否進入可視範圍的功能。",
  "backdrop-filter": "對元素背後的內容套用模糊或色彩處理，常見於毛玻璃效果。",
  "role=dialog": "告訴輔助工具這是一個需要集中注意力的對話區域。",
  "aria-expanded": "表示某個可展開控制項目前是開啟還是收合。",
};

const getSnippet = (item: ComponentEntry, framework: string) => {
  if (framework === "React / shadcn") {
    return `import { ${item.name.replaceAll(" ", "")} } from "@/components/ui/${item.id}";\n\n<${item.name.replaceAll(" ", "")} aria-label="${item.zh}" />`;
  }
  if (framework === "SwiftUI") {
    return `struct ${item.name.replaceAll(" ", "")}View: View {\n  var body: some View {\n    // ${item.zh}\n    ${item.name === "Button" ? "Button(\"執行\") { }" : "Text(\"${item.zh}\")"}\n  }\n}`;
  }
  return `<!-- ${item.zh} / ${item.name} -->\n<div class="${item.id}" role="${item.api.split("=")[0]}">\n  ${item.zh}\n</div>`;
};

function ComponentPreview({ item }: { item: ComponentEntry }) {
  const [on, setOn] = useState(false);
  const [value, setValue] = useState(62);
  const [expanded, setExpanded] = useState(false);
  const { id, type } = item;

  if (type === "accordion") return <button className="real-accordion" onClick={() => setExpanded(!expanded)}><span><b>常見問題</b><small>點擊展開內容</small></span><i>{expanded ? "−" : "+"}</i>{expanded && <p>這裡顯示展開後的說明內容。</p>}</button>;
  if (type === "alert") return <div className="real-alert"><b>!</b><span><strong>請注意</strong><small>這是一則重要的系統訊息。</small></span></div>;
  if (type === "modal") return <div className={`real-modal ${id === "alert-dialog" ? "is-danger" : ""}`}><b>{id === "alert-dialog" ? "刪除這筆資料？" : "編輯資料"}</b><small>{id === "alert-dialog" ? "此操作無法復原。" : "內容會顯示在對話框中。"}</small><span><i>取消</i><em>{id === "alert-dialog" ? "刪除" : "儲存"}</em></span></div>;
  if (type === "avatar") return <div className="real-avatar"><span>哈<i /></span><b>Harry</b><small>線上</small></div>;
  if (type === "badge") return <div className="real-badges"><span><i />已上線</span><b>12</b><em>NEW</em></div>;
  if (type === "banner") return <div className="real-banner"><b>ⓘ</b><span>系統將於今晚更新</span><i>查看詳情</i><em>×</em></div>;
  if (type === "breadcrumbs") return <div className="real-breadcrumbs"><span>首頁</span><i>›</i><span>元件</span><i>›</i><b>按鈕</b></div>;
  if (id === "button") return <div className="real-actions"><button className="mini-primary" onClick={() => setOn(!on)}>{on ? "已儲存 ✓" : "儲存變更"}</button><button className="mini-secondary">取消</button></div>;
  if (id === "button-group") return <div className="real-button-group"><button>靠左</button><button className="is-selected">置中</button><button>靠右</button></div>;
  if (type === "callout") return <div className="real-callout"><b>💡</b><span><strong>小提示</strong><small>Callout 用來補充背景或教學資訊。</small></span></div>;
  if (type === "card") return <div className="real-card"><span className="real-card-image">UI</span><div><b>元件設計指南</b><small>8 分鐘閱讀 · 2026</small></div></div>;
  if (type === "carousel") return <div className="real-carousel"><button>‹</button><div><b>03</b><small>介面設計靈感</small></div><button>›</button><span><i /><i className="is-active" /><i /></span></div>;
  if (type === "checkbox") return <div className="real-choices"><label><i className="checked">✓</i>寄送通知</label><label><i />訂閱電子報</label></div>;
  if (type === "chip") return <div className="real-chips"><span>設計系統 <b>×</b></span><span>React <b>×</b></span><button>＋ 新增</button></div>;
  if (type === "command") return <div className="real-command"><div>⌕ <span>搜尋指令…</span><kbd>⌘K</kbd></div><p><b>↗</b> 開啟元件字典 <small>Enter</small></p><p><b>◐</b> 切換深色模式</p></div>;
  if (type === "context") return <div className="real-context"><span>複製 <kbd>⌘C</kbd></span><span>重新命名 <kbd>↵</kbd></span><i /><span className="danger">刪除</span></div>;
  if (type === "table") return <div className="real-table"><div><b>名稱</b><b>狀態</b><b>更新</b></div><div><span>Button</span><em>啟用</em><small>今天</small></div><div><span>Drawer</span><em>草稿</em><small>昨天</small></div></div>;
  if (type === "calendar") return <div className="real-calendar"><header><button>‹</button><b>2026 年 8 月</b><button>›</button></header><div className="week">日 一 二 三 四 五 六</div><div className="days">27 28 29 30 31 <b>1</b> 2<br />3 4 5 6 7 <i>8</i> 9</div></div>;
  if (type === "divider") return <div className="real-divider"><span /><b>或</b><span /></div>;
  if (type === "drawer") return <div className="real-drawer"><div className="drawer-scrim" /><aside><b>篩選條件</b><button>×</button><span /><span /><em>套用篩選</em></aside></div>;
  if (type === "menu") return <div className="real-dropdown"><button>{id === "meatballs-menu" ? "•••" : "更多操作⌄"}</button><div><span>編輯</span><span>建立副本</span><i /><span>封存</span></div></div>;
  if (type === "empty") return <div className="real-empty"><b>□</b><strong>目前沒有資料</strong><small>建立第一個項目開始使用。</small><button>＋ 新增項目</button></div>;
  if (type === "fab") return <div className="real-fab"><div>⌂　搜尋　收藏　設定</div><button>＋</button></div>;
  if (type === "upload") return <div className="real-upload"><b>⇧</b><strong>拖放檔案到這裡</strong><small>或點擊選擇檔案 · 最大 10MB</small></div>;
  if (type === "input") return <label className="real-field"><b>{id === "form-field" ? "電子郵件" : "名稱"}</b><span>{id === "form-field" ? "name@example.com" : "請輸入文字"}</span><small>{id === "form-field" ? "我們不會公開你的信箱" : "最多 50 個字"}</small></label>;
  if (type === "popover") return <div className="real-popover"><button>Harry ▾</button><div><b>{id === "hover-card" ? "Harry Ting" : "文字格式"}</b><small>{id === "hover-card" ? "產品設計 · Taiwan" : "粗體　斜體　底線"}</small><i /></div></div>;
  if (type === "icon-button") return <div className="real-icon-buttons"><button aria-label="搜尋">⌕</button><button aria-label="收藏">♡</button><button aria-label="更多">•••</button></div>;
  if (type === "inline-alert") return <div className="real-inline-alert"><b>!</b><span>密碼至少需要 8 個字元</span></div>;
  if (type === "kbd") return <div className="real-kbd"><span><kbd>⌘</kbd><b>＋</b><kbd>K</kbd></span><small>開啟搜尋</small></div>;
  if (type === "link") return <div className="real-link"><span>進一步瞭解設計系統</span><b>↗</b></div>;
  if (type === "list") return <div className="real-list"><div><i>H</i><span><b>Harry</b><small>已更新 Button</small></span><em>2m</em></div><div><i>Y</i><span><b>Yuki</b><small>新增一則留言</small></span><em>1h</em></div></div>;
  if (["menu-bar", "menu-item"].includes(type)) return <div className="real-menubar"><span>● ● ●</span><b>檔案</b><b>編輯</b><b>檢視</b><em>Vibe UI</em></div>;
  if (type === "pagination") return <div className="mini-pagination"><span>‹</span><b>1</b><span>2</span><span>3</span><span>…</span><span>8</span><span>›</span></div>;
  if (type === "progress") return <div className="real-progress"><div><b>檔案上傳中</b><small>{value}%</small></div><span><i style={{ width: `${value}%` }} /></span><em>剩餘約 12 秒</em></div>;
  if (type === "radio") return <div className="real-radios"><label><i className="selected" />信用卡</label><label><i />Apple Pay</label><label><i />轉帳</label></div>;
  if (type === "rating") return <div className="real-rating"><span>★ ★ ★ ★ <i>★</i></span><b>4.0</b><small>128 則評價</small></div>;
  if (type === "split") return <div className="real-split"><div>編輯區</div><i><span /></i><div>預覽區</div></div>;
  if (type === "scroll") return <div className="real-scroll"><div><b>更新紀錄</b><span /><span /><span /><span /></div><i><b /></i></div>;
  if (type === "scrollspy") return <div className="real-scrollspy"><nav><b>開始使用</b><span>安裝</span><span>設定</span></nav><article><b>開始使用</b><span /><span /><span /></article></div>;
  if (type === "select") return <label className="real-select"><b>選擇框架</b><span>React <i>⌄</i></span></label>;
  if (type === "segmented") return <div className="real-segmented"><button className="selected">日</button><button>週</button><button>月</button></div>;
  if (type === "sheet") return <div className={`real-sheet ${id === "side-sheet" ? "side" : "bottom"}`}><div className="sheet-screen" /><aside><i /><b>{id === "bottom-sheet" ? "分享至…" : "詳細資料"}</b><span /><span /><button>完成</button></aside></div>;
  if (type === "skeleton") return <div className="real-skeleton"><i /><div><span /><span /><span /></div></div>;
  if (type === "toast") return <div className="real-toast"><b>✓</b><span><strong>{id === "snackbar" ? "項目已刪除" : "儲存成功"}</strong><small>{id === "snackbar" ? "可以在 5 秒內復原" : "變更已同步"}</small></span><button>{id === "snackbar" ? "復原" : "×"}</button></div>;
  if (type === "spinner") return <div className="mini-spinner"><span /> <b>正在載入…</b></div>;
  if (type === "steps") return <div className="real-steps"><div><b>✓</b><span>帳號</span></div><i /><div><b>2</b><span>資料</span></div><i /><div><em>3</em><span>完成</span></div></div>;
  if (type === "switch") return <div className="real-switch-row"><span><b>電子郵件通知</b><small>接收重要更新</small></span><button className={on ? "is-on" : ""} onClick={() => setOn(!on)}><i /></button></div>;
  if (type === "tabs") return <div className="real-tabs"><nav><b>基本資料</b><span>權限</span><span>通知</span></nav><div><strong>帳號設定</strong><i /><i /></div></div>;
  if (type === "tag") return <div className="real-tags"><span>設計</span><span>前端</span><span>初學者</span></div>;
  if (type === "textarea") return <label className="real-textarea"><b>備註</b><span>請輸入詳細說明…</span><small>0 / 200</small></label>;
  if (type === "timeline") return <div className="real-timeline"><div><i /><span><b>專案已建立</b><small>09:30</small></span></div><div><i /><span><b>完成第一次部署</b><small>10:15</small></span></div></div>;
  if (type === "toolbar") return <div className="real-toolbar"><button>B</button><button><i>I</i></button><button><u>U</u></button><span /><button>≡</button><button>↗</button></div>;
  if (type === "tooltip") return <div className="real-tooltip"><button>♡</button><span>加入收藏<i /></span></div>;
  if (type === "tree") return <div className="real-tree"><b>⌄　▣ components</b><span>　├─ Button.tsx</span><span>　├─ Drawer.tsx</span><span>　└─ Tabs.tsx</span></div>;
  if (type === "video") return <div className="real-video"><div>▶</div><footer><button>▶</button><span><i /></span><small>01:24 / 03:50</small><b>▣</b></footer></div>;
  if (type === "window") return <div className="real-window"><header><span>● ● ●</span><b>Vibe UI</b></header><div><aside /><main><i /><i /><i /></main></div></div>;
  if (type === "bottomnav") return <div className="real-bottomnav"><span><b>⌂</b><small>首頁</small></span><span><b>⌕</b><small>搜尋</small></span><span className="active"><b>♡</b><small>收藏</small></span><span><b>☻</b><small>我的</small></span></div>;
  if (type === "refresh") return <div className="real-refresh"><b>↓</b><small>放開即可重新整理</small><div><span /><span /><span /></div></div>;
  if (type === "color") return <div className="real-color"><div><span /><i /></div><aside><b style={{ background: "#3167e8" }} /><b style={{ background: "#df5e80" }} /><b style={{ background: "#f3b72d" }} /><b style={{ background: "#252525" }} /></aside><code>#3167E8</code></div>;
  if (type === "number") return <label className="real-number"><b>數量</b><span><button>−</button><strong>{Math.round(value / 20)}</strong><button>＋</button></span></label>;
  if (type === "slider") return <div className="mini-slider"><span className="mini-slider-line"><i style={{ width: `${value}%` }} /></span><input aria-label="調整數值" type="range" min="0" max="100" value={value} onChange={(e) => setValue(Number(e.target.value))} /><b>{value}</b></div>;
  if (type === "search") return <div className="real-search"><span>⌕</span><b>搜尋元件、風格或術語</b><kbd>⌘K</kbd></div>;
  if (type === "stat") return <div className="real-stat"><span><small>本月使用者</small><b>12,480</b><em>↑ 12.4%</em></span><i><b /><b /><b /><b /></i></div>;
  if (type === "bento") return <div className="real-bento"><div className="wide"><b>{components.length}</b><small>UI 元件</small></div><div><b>{styles.length}</b><small>風格</small></div><div><span>⌕</span><small>快速搜尋</small></div></div>;
  if (type === "scrim") return <div className="real-scrim"><div /><aside><b>確認操作</b><small>背景已套用半透明遮罩。</small><button>確定</button></aside></div>;
  if (type === "sidebar") return <div className="new-sidebar"><aside><b>V</b><span className="active">⌂　總覽</span><span>▦　專案</span><span>⚙　設定</span><small>Harry</small></aside><main><i /><i /><i /></main></div>;
  if (type === "mega-menu") return <div className="new-mega"><header>產品　資源　範例　<b>探索⌄</b></header><section><div><b>開始使用</b><span>快速入門</span><span>範本中心</span></div><div><b>熱門功能</b><span>AI 生成</span><span>自動化</span></div><aside>本週精選　→</aside></section></div>;
  if (type === "navigation-rail") return <div className="new-rail"><nav><b>＋</b><span className="active">⌂<small>首頁</small></span><span>⌕<small>搜尋</small></span><span>♡<small>收藏</small></span></nav><main><i /><i /><i /></main></div>;
  if (type === "dock") return <div className="new-dock"><main /><nav><span>⌕</span><span>▣</span><span className="active">✦</span><span>♫</span><span>⚙</span></nav></div>;
  if (type === "sticky-header") return <div className="new-sticky"><header><b>Vibe UI</b><span>字典　風格　指南</span><button>開始使用</button></header><main><i /><i /><i /><i /></main></div>;
  if (type === "skip-link") return <div className="new-skip"><button>跳到主要內容</button><header>LOGO　　導覽一　導覽二</header><main><b>主要內容</b><i /><i /></main></div>;
  if (type === "combobox") return <div className="new-combobox"><label>選擇城市</label><div>台北 <b>⌄</b></div><section><span>⌕　搜尋城市…</span><b>✓　台北市</b><span>　　臺中市</span><span>　　高雄市</span></section></div>;
  if (type === "autocomplete") return <div className="new-combobox autocomplete"><label>搜尋元件</label><div>dra<i>|</i></div><section><b>Drawer <small>抽屜式選單</small></b><span>Drag and Drop</span><span>Dropdown Menu</span></section></div>;
  if (type === "otp") return <div className="new-otp"><b>輸入驗證碼</b><small>已傳送至 •••• 2468</small><div><span>4</span><span>8</span><span>2</span><span>6</span><span /><span /></div></div>;
  if (type === "password") return <div className="new-password"><label>密碼</label><div>•••••••• <b>◉</b></div><span><i /><i /><i /></span><small>密碼強度：良好</small></div>;
  if (type === "date-range") return <div className="new-date-range"><header><button>‹</button><b>2026 年 8 月</b><button>›</button></header><p>日　一　二　三　四　五　六</p><div>2　3　4　5　6　7　8<br />9　<i>10　11　12　13　14　15</i><br />16　17　18　19　20　21　22</div><footer>8/10 — 8/15</footer></div>;
  if (type === "time-picker") return <div className="new-time"><b>選擇時間</b><div><span>09<br /><i>10</i><br />11</span><em>:</em><span>15<br /><i>30</i><br />45</span><aside>AM<br /><b>PM</b></aside></div><button>完成</button></div>;
  if (type === "chart") return <div className="new-chart"><header><span>每月使用量</span><b>12,480</b><em>↑ 12%</em></header><div><i /><i /><i /><i /><i /><i /></div><footer>3月　4月　5月　6月　7月　8月</footer></div>;
  if (type === "kanban") return <div className="new-kanban"><section><b>待處理　2</b><span>首頁手機版</span><span>新增搜尋詞</span></section><section><b>進行中　1</b><span className="active">風格樣板</span></section><section><b>完成　3</b><span>元件字典</span></section></div>;
  if (type === "code-block") return <div className="new-code"><header>tsx <button>複製</button></header><pre><i>const</i> Button = () =&gt; &#123;{`\n`}　<b>return</b> &lt;button&gt;儲存&lt;/button&gt;{`\n`}&#125;</pre></div>;
  if (type === "diff") return <div className="new-diff"><header>修改內容 <span>− 2　＋ 3</span></header><p className="minus">−　background: #fff;</p><p className="plus">＋　background: var(--surface);</p><p className="plus">＋　color: var(--ink);</p><p>　　border-radius: 12px;</p></div>;
  if (type === "coachmark") return <div className="new-coach"><main><button>✦</button></main><aside><small>新功能</small><b>試試 AI 搜尋</b><p>用中文描述外觀，也能找到正確元件。</p><footer>1 / 1　 <button>知道了</button></footer><i /></aside></div>;
  if (type === "product-tour") return <div className="new-tour"><div /><span className="spot">＋ 新增專案</span><aside><b>建立第一個專案</b><p>點這裡開始整理你的工作。</p><footer>1 / 3 <button>下一步</button></footer></aside></div>;
  if (type === "error-summary") return <div className="new-errors"><b>請修正 2 個問題</b><span>• 電子郵件格式不正確</span><span>• 尚未選擇同意條款</span><button>前往第一個錯誤 ↓</button></div>;
  if (type === "notifications") return <div className="new-notifications"><header><b>通知</b><button>全部已讀</button></header><div><i>H</i><span><b>Harry 提到你</b><small>請確認新版風格 · 2 分鐘</small></span></div><div><i>✓</i><span><b>部署完成</b><small>網站已成功更新 · 1 小時</small></span></div></div>;
  if (type === "loading-button") return <button className="new-loading"><i /> 正在儲存…</button>;
  if (type === "chat-composer") return <div className="new-composer"><p>描述你想製作的介面…</p><footer><span>＋　⌘</span><small>GPT-5 ▾</small><button>↑</button></footer></div>;
  if (type === "model-selector") return <div className="new-model"><button>GPT-5 <span>適合複雜任務</span>⌄</button><section><b>選擇模型</b><span className="active">✓　GPT-5 <small>深度推理</small></span><span>　　快速模型 <small>速度優先</small></span></section></div>;
  if (type === "streaming") return <div className="new-stream"><header><i>✦</i><b>AI 助理</b><span>生成中</span></header><p>我會先整理需求，再建立元件結構與手機版面<span className="cursor" /></p><button>■　停止生成</button></div>;
  return <div className="mini-generic"><span /><span /><span /></div>;
}

function StylePreview({ name }: { name: string }) {
  if (name === "Glassmorphism") return <div className="vibe-art glass-vibe"><i className="blob one" /><i className="blob two" /><section><span>WEATHER</span><b>24°</b><small>Taipei · Cloudy</small><button>View details</button></section></div>;
  if (name === "Neumorphism") return <div className="vibe-art neu-vibe"><section><b>Music</b><i>▶</i><span><em /></span><small>02:14　—　04:05</small></section></div>;
  if (name === "Bento Grid") return <div className="vibe-art bento-vibe"><section className="large"><b>Design<br />system</b><span>48 components</span></section><section><b>08</b><small>Styles</small></section><section><i>↗</i><small>Explore</small></section></div>;
  if (name === "Brutalism") return <div className="vibe-art brutal-vibe"><b>RAW<br />IDEAS</b><span>NO. 08</span><button>EXPLORE →</button></div>;
  if (name === "Editorial") return <div className="vibe-art editorial-vibe"><span>ISSUE 08 — DIGITAL CULTURE</span><b>Form<br />follows<br /><i>feeling.</i></b><small>Design notes for clearer interfaces.</small></div>;
  if (name === "Cyberpunk") return <div className="vibe-art cyber-vibe"><header>SYS / UI-{components.length} <span>ONLINE</span></header><b>NEON<br />INTERFACE</b><i /><footer>ACCESS GRANTED　[ ENTER ]</footer></div>;
  if (name === "Soft UI") return <div className="vibe-art soft-vibe"><section><i>♥</i><b>Daily focus</b><small>3 tasks remaining</small><span><em /></span></section></div>;
  if (name === "Skeuomorphism") return <div className="vibe-art skeuo-vibe"><section><span>VOLUME</span><i><b /></i><small>MIN　　　　　　MAX</small><button>POWER</button></section></div>;
  if (name === "Minimalism") return <div className="vibe-art minimal-vibe"><header>FORMA</header><main><small>ESSENTIAL OBJECTS</small><b>Less,<br />but better.</b><button>Explore collection　→</button></main></div>;
  if (name === "Maximalism") return <div className="vibe-art maximal-vibe"><i>NEW!</i><b>MORE<br />IS<br /><em>MORE</em></b><span>✦ COLOR　✦ TYPE　✦ ENERGY</span><button>ENTER →</button></div>;
  if (name === "Swiss Style") return <div className="vibe-art swiss-vibe"><header>INTERNATIONAL<br />DESIGN FORUM</header><b>08</b><main><strong>systems<br />create<br />clarity</strong><span>TAIPEI<br />2026.08.01</span></main></div>;
  if (name === "Dark UI") return <div className="vibe-art dark-vibe"><aside><b>V</b><span>⌂</span><span>▦</span><span>⚙</span></aside><main><header><small>ACTIVE USERS</small><b>12.4K</b><em>+18%</em></header><section><i /><i /><i /><i /><i /></section></main></div>;
  if (name === "Monochrome") return <div className="vibe-art mono-vibe"><header>MONO / 01</header><main><b>One hue.<br />Every layer.</b><span /><span /><span /></main></div>;
  if (name === "Aurora Gradient") return <div className="vibe-art aurora-vibe"><i className="a" /><i className="b" /><section><small>CREATE WITH AI</small><b>Imagine<br />anything.</b><button>Start creating ✦</button></section></div>;
  if (name === "Claymorphism") return <div className="vibe-art clay-vibe"><i>☀</i><section><b>Good morning!</b><small>3 healthy habits today</small><div><span>💧</span><span>☻</span><span>♥</span></div></section></div>;
  if (name === "Y2K / Retro Futurism") return <div className="vibe-art y2k-vibe"><header>CYBER_DIARY.exe</header><b>WELCOME<br />2 MY<br /><i>WORLD</i></b><span>★ ONLINE NOW ★</span><button>ENTER_2000</button></div>;
  if (name === "Memphis") return <div className="vibe-art memphis-vibe"><i className="circle" /><i className="triangle" /><i className="dots" /><b>PLAY<br />WITH<br />IDEAS!</b><button>JOIN US →</button></div>;
  if (name === "Organic UI") return <div className="vibe-art organic-vibe"><i /><header>ROOTS</header><section><small>NATURAL WELLNESS</small><b>Slow down.<br />Feel better.</b><button>Begin your ritual</button></section></div>;
  if (name === "Spatial / 3D UI") return <div className="vibe-art spatial-vibe"><i className="orb" /><section><span>SPATIAL OBJECT 04</span><b>Explore<br />in depth.</b><button>Rotate　↻</button></section><aside>＋<br />−</aside></div>;
  return <div className="vibe-art liquid-vibe"><div className="liquid-scene"><i /><i /><i /></div><nav><span>⌂</span><span>⌕</span><b>＋</b><span>♡</span><span>☻</span></nav><section><small>NOW PLAYING</small><b>Liquid Light</b><i /></section></div>;
}

function ComponentCard({ item, index, onOpen, onDefinition, onCopy }: { item: ComponentEntry; index: number; onOpen: (item: ComponentEntry) => void; onDefinition: (word: string) => void; onCopy: (text: string, key: string) => void }) {
  const [tilt, setTilt] = useState("perspective(900px)");
  const prompt = `Create an accessible ${item.name} (${item.zh}) component. Use ${item.api}, support keyboard navigation, and match a clean modern visual system.`;
  return (
    <article className="component-card" style={{ transform: tilt }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; setTilt(`perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-3px)`); }} onMouseLeave={() => setTilt("perspective(900px)")}>
      <div className="card-meta"><span className="card-number">{String(index + 1).padStart(2, "0")}</span><span className="card-category"><b>{categoryLabels[item.category] ?? item.category}</b><small>{item.category}</small></span><span className="card-platform">{item.platform.join(" · ")}</span></div>
      <div className="mini-stage"><ComponentPreview item={item} /></div>
      <div className="card-copy">
        <h3 onDoubleClick={() => onDefinition(`${item.zh} / ${item.name}`)}>{item.zh} <em>{item.name}</em></h3>
        <p onDoubleClick={() => onDefinition(item.definition)}>{item.definition}</p>
      </div>
      <div className="card-api"><span className="api-label">開發標記</span><code>{item.api}</code></div>
      <div className="card-footer"><button onClick={() => onOpen(item)}>查看元件拆解 <span>↗</span></button><button className="copy-button" onClick={() => onCopy(prompt, item.id)}>複製提示詞</button></div>
    </article>
  );
}

function ThemeMenu({ theme, setTheme }: { theme: ThemeKey; setTheme: (theme: ThemeKey) => void }) {
  return <div className="theme-menu" aria-label="Theme selector">{themes.map((item) => <button key={item.id} className={theme === item.id ? "is-active" : ""} onClick={() => setTheme(item.id)} title={item.label}><i style={{ background: item.dot }} />{item.label}</button>)}</div>;
}

function StyleChoiceHint() {
  const choices = [
    ["想要清楚穩重", "Swiss Style / Minimalism", "適合工具型產品、後台與需要快速閱讀的介面。"],
    ["想要親和輕鬆", "Soft UI / Claymorphism", "適合生活服務、教育與希望降低距離感的產品。"],
    ["想要有個性", "Editorial / Brutalism", "適合品牌頁、作品集與需要強烈記憶點的場景。"],
  ];
  return <section className="style-choice-hint" aria-label="風格選擇提示"><div className="style-choice-heading"><span className="eyebrow">Not sure where to start / 選擇提示</span><h2>不知道怎麼選？先看產品感覺。</h2></div><div className="style-choice-grid">{choices.map(([title, styles, description]) => <article key={title}><span>{title}</span><h3>{styles}</h3><p>{description}</p></article>)}</div></section>;
}

function StartGuide() {
  const steps = [
    ["01", "描述你看到的樣子", "用中文說明位置、外觀和互動方式，不用先知道專有名詞。"],
    ["02", "找到標準英文名稱", "從元件卡片確認正式名稱、用途與平台，避免和相似元件混淆。"],
    ["03", "複製給 AI 或設計師", "把名稱、開發標記和提示詞帶進下一步，讓溝通更精準。"],
  ];
  return <section className="start-guide" aria-label="新手使用方式"><div className="start-guide-head"><div><span className="eyebrow">How it works / 新手開始</span><h2>三步找到可以交給 AI 的說法</h2></div><p>不用背術語，從你看見的介面開始。</p></div><div className="start-guide-grid">{steps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>;
}

export default function Home() {
  const [activePage, setActivePage] = useState<PageKey>("elements");
  const [theme, setTheme] = useState<ThemeKey>("paper");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selected, setSelected] = useState<ComponentEntry | null>(null);
  const [definition, setDefinition] = useState<string | null>(null);
  const [detailState, setDetailState] = useState("Default");
  const [framework, setFramework] = useState("HTML / Tailwind");
  const [copied, setCopied] = useState<string | null>(null);
  const [surpriseSeed, setSurpriseSeed] = useState(0);
  const [styleGroup, setStyleGroup] = useState("全部風格");
  const [stats, setStats] = useState<SiteStats | null>(null);
  const analyticsTracked = useRef(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>("suggestion");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle");
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    if (analyticsTracked.current) return;
    analyticsTracked.current = true;

    const trackVisit = async () => {
      try {
        const response = await fetch("/api/analytics", { method: "POST", cache: "no-store" });
        if (!response.ok) throw new Error("analytics request failed");
        const data = await response.json() as Partial<SiteStats>;
        setStats({ pageViews: Number(data.pageViews ?? 0), uniqueVisitors: Number(data.uniqueVisitors ?? 0) });
      } catch {
        try {
          const response = await fetch("/api/analytics", { cache: "no-store" });
          if (!response.ok) return;
          const data = await response.json() as Partial<SiteStats>;
          setStats({ pageViews: Number(data.pageViews ?? 0), uniqueVisitors: Number(data.uniqueVisitors ?? 0) });
        } catch {
          // The dictionary remains usable when analytics is temporarily unavailable.
        }
      }
    };

    void trackVisit();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPaletteOpen(true); }
      if (event.key === "Escape") { setPaletteOpen(false); setSelected(null); setDefinition(null); if (feedbackState !== "submitting") setContactOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedbackState]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return components.filter((item) => {
      const haystack = [item.name, item.zh, item.category, item.definition, item.useCase, item.api, ...item.aliases].join(" ").toLowerCase();
      const matchesQuery = !q || q.split(/\s+/).every((token) => haystack.includes(token)) || haystack.includes(q);
      const matchesPlatform = platform === "All" || item.platform.includes(platform as "Web" | "macOS" | "Mobile");
      const matchesCategory = category === "All" || item.category === category;
      return matchesQuery && matchesPlatform && matchesCategory;
    });
  }, [query, platform, category]);

  const sorted = useMemo(() => {
    const result = [...filtered];
    if (sort === "newest") result.sort((a, b) => b.added - a.added || b.popularity - a.popularity);
    else if (sort === "popular") result.sort((a, b) => b.popularity - a.popularity);
    else result.sort((a, b) => {
      const score = (value: string) => value.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0) + surpriseSeed) % 997, 7);
      return score(a.id) - score(b.id);
    });
    return result;
  }, [filtered, sort, surpriseSeed]);

  const filteredStyles = useMemo(() => styleGroup === "全部風格" ? styles : styles.filter((item) => item.group === styleGroup), [styleGroup]);

  const copyText = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard may be unavailable in preview */ }
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const choosePage = (page: PageKey) => { setActivePage(page); setPaletteOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const openContact = () => { setContactOpen(true); setFeedbackState("idle"); setFeedbackError(""); };
  const closeContact = () => { if (feedbackState !== "submitting") { setContactOpen(false); setFeedbackState("idle"); setFeedbackError(""); } };
  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = feedbackMessage.trim();
    if (message.length < 10) { setFeedbackState("error"); setFeedbackError("請至少寫 10 個字，讓我知道要如何改善。"); return; }

    setFeedbackState("submitting");
    setFeedbackError("");
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ category: feedbackCategory, message, email: feedbackEmail.trim() }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "送出失敗，請稍後再試。");
      setFeedbackState("success");
      setFeedbackMessage("");
      setFeedbackEmail("");
    } catch (error) {
      setFeedbackState("error");
      setFeedbackError(error instanceof Error ? error.message : "送出失敗，請稍後再試。");
    }
  };

  return (
    <main className={`site-shell theme-${theme}`}>
      <header className="topbar">
        <button className="brand" onClick={() => choosePage("elements")} aria-label="Vibe UI home"><span className="brand-mark">V</span><span><b>Vibe UI</b><small>Visual Dictionary / 視覺字典</small></span></button>
        <nav className="primary-nav" aria-label="主要分頁">{navItems.map((item) => <button key={item.id} className={activePage === item.id ? "is-active" : ""} onClick={() => choosePage(item.id)}><span className="nav-en">{item.label}</span><small><b>{item.zh}</b>{item.count && <i className="nav-count"> · {item.count}</i>}</small></button>)}</nav>
        <div className="top-actions"><button className="palette-trigger" onClick={() => setPaletteOpen(true)}><span>Search</span><kbd>⌘ K</kbd></button><button className="theme-trigger" onClick={() => setTheme(theme === "paper" ? "dark" : "paper")} aria-label="Toggle light and dark theme">◐</button></div>
      </header>

      {activePage === "elements" && <>
        <section className="hero-section"><div className="hero-kicker"><span className="live-dot" /> {components.length} 個元件 · 中英對照設計</div><h1>看得懂介面，<br /><i>也叫得出名字。</i></h1><p className="hero-lede">給 Vibe Coding 中文初學者的 UI 視覺字典。用白話描述找元件，再用標準英文名稱交給 AI 或開發者。</p><div className="hero-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setPaletteOpen(true)} placeholder="試試：右側滑出的選單、按鈕旁的三個點..." aria-label="搜尋元件" /><kbd>⌘ K</kbd></div><div className="hero-suggestions"><span>試試這些說法</span><button onClick={() => setQuery("右側滑出的選單")}>右側滑出的選單</button><button onClick={() => setQuery("背景變暗的遮罩層")}>背景變暗的遮罩層</button><button onClick={() => setQuery("三個點")}>按鈕旁的三個點</button></div></section>
        <section className="dictionary-section"><div className="section-heading"><div><span className="eyebrow">01 / 元件字典 / The dictionary</span><h2>找到正確名稱 <em>Find the right name</em></h2></div><span className="result-count">目前顯示 <b>{sorted.length}</b> / {components.length} 個</span></div><div className="filter-row"><div className="filter-group platform-group">{["All", "Web", "macOS", "Mobile"].map((item) => <button key={item} className={platform === item ? "is-active" : ""} onClick={() => setPlatform(item)}><span>{item === "All" ? "全部平台" : item === "Web" ? "網頁" : item === "macOS" ? "macOS 原生" : "手機"}</span><small>{item}</small></button>)}</div><div className="filter-group category-scroll">{categories.slice(0, 8).map((item) => <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}><span>{categoryLabels[item] ?? item}</span><small>{item}</small></button>)}</div><div className="sort-group"><button className={sort === "newest" ? "is-active" : ""} onClick={() => setSort("newest")}>最新 <small>Newest</small></button><button className={sort === "popular" ? "is-active" : ""} onClick={() => setSort("popular")}>熱門 <small>Popular</small></button><button className={sort === "surprise" ? "is-active" : ""} onClick={() => { setSort("surprise"); setSurpriseSeed((seed) => seed + 1); }}>✦ 隨機探索 <small>Surprise</small></button></div></div>{sorted.length ? <div className="component-grid">{sorted.map((item, index) => <ComponentCard key={item.id} item={item} index={index} onOpen={setSelected} onDefinition={setDefinition} onCopy={copyText} />)}</div> : <div className="no-results"><span>⌕</span><h3>找不到這個說法</h3><p>試試「右邊滑出來的面板」、「可收合的內容」或英文元件名稱。</p><button onClick={() => { setQuery(""); setCategory("All"); setPlatform("All"); }}>清除篩選</button></div>}</section>
        <section className="dictionary-note"><div><span className="eyebrow">Search locally, think globally</span><h2>每個元件，都有一個<br /><em>可被複製的標準說法。</em></h2></div><div className="note-points"><p><b>01</b> 中文白話描述 → 英文正名</p><p><b>02</b> 開發標記 → 可交付給 AI 的提示</p><p><b>03</b> Web / macOS / Mobile 對照</p></div></section>
      </>}

      {activePage === "styles" && <section className="content-page styles-page"><div className="page-intro"><span className="eyebrow">02 / Name that vibe</span><h1>先感覺，<em>再命名。</em></h1><p>20 種可直接辨識的 UI 視覺語彙。每個樣板都說明特徵、適用情境與不建議使用的場合。</p></div><div className="style-filter" aria-label="視覺風格分類">{["全部風格", "基礎美學", "排版文化", "材質空間", "數位氛圍"].map((group) => <button key={group} className={styleGroup === group ? "is-active" : ""} onClick={() => setStyleGroup(group)}>{group}<small>{group === "全部風格" ? styles.length : styles.filter((item) => item.group === group).length}</small></button>)}</div><div className="style-grid">{filteredStyles.map((item) => { const index = styles.findIndex((style) => style.id === item.id); return <article className={`style-card style-${index}`} key={item.name}><div className="style-art"><StylePreview name={item.name} /></div><div className="style-card-copy"><div className="style-card-meta"><span className="card-number">{String(index + 1).padStart(2, "0")}</span><span>{item.group}</span></div><h2>{item.zh} <em>{item.name}</em></h2><p className="style-tone">{item.tone}</p><p className="style-description">{item.description}</p><dl><div><dt>適合</dt><dd>{item.useCase}</dd></div><div><dt>避免</dt><dd>{item.avoid}</dd></div></dl><div className="style-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="style-prompt" onClick={() => copyText(item.prompt, `style-${item.id}`)}>{copied === `style-${item.id}` ? "提示詞已複製 ✓" : "複製這個風格提示詞"}</button></div></article>; })}</div></section>}

      {activePage === "elements" && <StartGuide />}
      {activePage === "styles" && <StyleChoiceHint />}

      <footer className="site-footer"><div><span className="brand-mark">V</span><b>Vibe UI</b><p>Visual Dictionary / 視覺字典</p></div><div className="site-stats" aria-label="網站統計"><span><b>{stats ? stats.uniqueVisitors.toLocaleString("zh-TW") : "—"}</b> 不重複訪客</span><span><b>{stats ? stats.pageViews.toLocaleString("zh-TW") : "—"}</b> 累積瀏覽</span><span>{components.length} components</span><span>Local search</span><button className="footer-contact" type="button" onClick={openContact}>回報錯誤／建議 ↗</button></div><small>© 2026 Vibe UI. 說出正確的名字，做出更好的介面。</small></footer>

      <div className="theme-dock"><span>Vibe</span><ThemeMenu theme={theme} setTheme={setTheme} /></div>

      {paletteOpen && <div className="overlay-backdrop" onClick={() => setPaletteOpen(false)}><section className="command-palette" role="dialog" aria-modal="true" aria-label="Search command palette" onClick={(e) => e.stopPropagation()}><div className="command-head"><span>⌕</span><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search in Chinese or English..." /><kbd>ESC</kbd></div><div className="command-results"><p>QUICK JUMP / 快速前往</p>{navItems.map((item) => <button key={item.id} onClick={() => choosePage(item.id)}><span>{item.label}</span><small>{item.zh}</small><b>↵</b></button>)}<p>TOP MATCHES / 最相關元件</p>{components.filter((item) => !query || `${item.name} ${item.zh} ${item.aliases.join(" ")}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5).map((item) => <button key={item.id} onClick={() => { setPaletteOpen(false); setSelected(item); }}><span>{item.zh}</span><small>{item.name} · {item.category}</small><b>↵</b></button>)}</div><div className="command-foot"><span>↵ Open</span><span>↑↓ Navigate</span><span>ESC Close</span></div></section></div>}

      {selected && <div className="overlay-backdrop detail-backdrop" onClick={() => setSelected(null)}><aside className="detail-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}><div className="detail-top"><span className="eyebrow">元件拆解 / Component anatomy</span><button onClick={() => setSelected(null)} aria-label="關閉">×</button></div><div className="detail-heading"><span className="detail-index">{categoryLabels[selected.category] ?? selected.category} / {selected.category}</span><h2>{selected.zh} <em>{selected.name}</em></h2><p>{selected.definition}</p></div><div className="detail-preview"><div className="detail-preview-head"><span>狀態實驗室 / STATE PLAYGROUND</span><div>{["Default", "Hover", "Focus", "Active", "Disabled", "Error"].map((state) => <button key={state} className={detailState === state ? "is-active" : ""} onClick={() => setDetailState(state)}>{state}</button>)}</div></div><div className={`detail-preview-stage state-${detailState.toLowerCase()}`}><ComponentPreview item={selected} /></div></div><div className="detail-grid"><div><span className="eyebrow">白話用途 / Use case</span><p>{selected.useCase}</p></div><div><span className="eyebrow">開發標記</span><code>{selected.api}</code></div><div><span className="eyebrow">平台 / Platform</span><p>{selected.platform.join(" · ")}</p></div><div><span className="eyebrow">無障礙 / Accessibility</span><p>Keyboard focus · visible label · semantic role</p></div></div><div className="snippet-section"><div className="snippet-head"><div><span className="eyebrow">可貼上提示 / Paste-ready</span><h3>請 AI 產生這個元件</h3></div><button onClick={() => copyText(`Create an accessible ${selected.name} (${selected.zh}) component. Use ${selected.api}, support keyboard navigation, and include a visible focus state.`, "detail-prompt")}>{copied === "detail-prompt" ? "已複製 ✓" : "複製提示詞"}</button></div><div className="framework-tabs">{["HTML / Tailwind", "React / shadcn", "SwiftUI"].map((item) => <button key={item} className={framework === item ? "is-active" : ""} onClick={() => setFramework(item)}>{item}</button>)}</div><pre><code>{getSnippet(selected, framework)}</code><button onClick={() => copyText(getSnippet(selected, framework), "snippet")}>{copied === "snippet" ? "已複製" : "複製程式碼"}</button></pre></div></aside></div>}

      {definition && <div className="definition-popover" onDoubleClick={() => setDefinition(null)}><span className="eyebrow">Plain definition / 白話解釋</span><p>{definitionMap[definition] ?? definition}</p><small>Double-click again to close</small></div>}
      {copied && <div className="copy-toast">Copied to clipboard ✓</div>}

      {contactOpen && <div className="overlay-backdrop contact-backdrop" role="presentation" onMouseDown={closeContact}><section className="contact-panel" role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={(event) => event.stopPropagation()}><div className="contact-head"><div><span className="eyebrow">Feedback / Contact</span><h2 id="contact-title">一起把字典變得更好。</h2><p>發現錯誤、想建議新增元件，或想告訴我哪裡最有幫助，都可以寫在這裡。</p></div><button className="modal-close" type="button" onClick={closeContact} aria-label="關閉回報表單">×</button></div>{feedbackState === "success" ? <div className="feedback-success"><span className="feedback-success-mark">✓</span><h3>收到你的訊息了。</h3><p>謝謝你的回饋。若你留下 Email，管理者可用來回覆你的問題。</p><button className="primary" type="button" onClick={closeContact}>完成</button></div> : <form className="feedback-form" onSubmit={submitFeedback}><label>回饋類型<select value={feedbackCategory} onChange={(event) => setFeedbackCategory(event.target.value as FeedbackCategory)}>{(Object.keys(feedbackLabels) as FeedbackCategory[]).map((category) => <option key={category} value={category}>{feedbackLabels[category]}</option>)}</select></label><label>想說什麼？<textarea required minLength={10} maxLength={2000} value={feedbackMessage} onChange={(event) => setFeedbackMessage(event.target.value)} placeholder="例如：我找不到「右側滑出的選單」對應的元件名稱。" autoFocus /></label><div className="feedback-meta"><label>Email <small>選填</small><input type="email" maxLength={254} value={feedbackEmail} onChange={(event) => setFeedbackEmail(event.target.value)} placeholder="you@example.com" /></label><span>{feedbackMessage.length} / 2000</span></div><p className="feedback-note">Email 只會用來回覆你的問題，不會公開顯示。</p>{feedbackState === "error" && <p className="feedback-error" role="alert">{feedbackError}</p>}<div className="contact-actions"><button type="button" onClick={closeContact}>先關閉</button><button className="primary" type="submit" disabled={feedbackState === "submitting"}>{feedbackState === "submitting" ? "送出中…" : "送出回饋"}</button></div></form>}</section></div>}
    </main>
  );
}
