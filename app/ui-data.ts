export type Platform = "Web" | "macOS" | "Mobile";

export type ComponentEntry = {
  id: string;
  name: string;
  zh: string;
  category: string;
  platform: Platform[];
  definition: string;
  useCase: string;
  api: string;
  aliases: string[];
  popularity: number;
  added: number;
  type: string;
};

const entry = (
  id: string,
  name: string,
  zh: string,
  category: string,
  type: string,
  definition: string,
  useCase: string,
  api: string,
  aliases: string[],
  popularity: number,
  added: number,
  platform: Platform[] = ["Web", "macOS"],
): ComponentEntry => ({ id, name, zh, category, type, definition, useCase, api, aliases, popularity, added, platform });

const baseComponents: ComponentEntry[] = [
  entry("accordion", "Accordion", "手風琴", "Navigation", "accordion", "可展開或收合的內容區塊。", "FAQ、設定面板、文件目錄。", "aria-expanded", ["可收合內容", "展開收合", "faq"], 92, 2026),
  entry("alert", "Alert", "警示訊息", "Feedback", "alert", "直接告知使用者目前狀態或重要訊息。", "表單錯誤、系統狀態、操作結果。", "role=alert", ["警告", "訊息框", "提示"], 95, 2025),
  entry("alert-dialog", "Alert Dialog", "警示對話框", "Overlays", "modal", "需要使用者確認或處理的高優先級對話框。", "刪除資料、不可逆操作。", "aria-modal=true", ["確認視窗", "警告視窗"], 91, 2026),
  entry("avatar", "Avatar", "頭像", "Data Display", "avatar", "代表使用者、團隊或物件的圖片或縮寫。", "帳號選單、留言、協作者清單。", "alt", ["使用者圖片", "profile image"], 89, 2025),
  entry("badge", "Badge", "徽章", "Data Display", "badge", "以短文字標示狀態、數量或分類的小型標記。", "通知數、狀態、版本標籤。", "aria-label", ["狀態徽章", "小標籤", "counter"], 88, 2025),
  entry("banner", "Banner", "橫幅快訊", "Feedback", "banner", "橫跨容器或頁面寬度的高可見度訊息。", "維護公告、Cookie、服務中斷。", "role=banner", ["公告橫幅", "頂部提示", "announcement"], 78, 2026),
  entry("breadcrumbs", "Breadcrumbs", "麵包屑導覽", "Navigation", "breadcrumbs", "顯示目前頁面在資訊階層中的位置。", "文件、後台、電商分類。", "aria-current=page", ["路徑導覽", "階層導覽"], 86, 2025),
  entry("button", "Button", "按鈕", "Actions", "button", "觸發動作、提交資料或前往其他內容的控制項。", "提交、儲存、下一步、下載。", "<button>", ["操作按鈕", "CTA", "action"], 100, 2025),
  entry("button-group", "Button Group", "按鈕群組", "Actions", "buttons", "將相關操作放在同一組中，呈現選擇或工具關係。", "文字編輯工具列、檢視模式切換。", "aria-label", ["按鈕組", "actions group"], 81, 2026),
  entry("callout", "Callout", "重點提示框", "Feedback", "callout", "以視覺區塊補充上下文、教學或注意事項。", "文件提示、教學引導、產品亮點。", "role=note", ["提示區塊", "重點說明", "note"], 84, 2026),
  entry("card", "Card", "卡片", "Layout", "card", "將相關內容包在獨立容器中，方便掃讀與分組。", "商品、文章、儀表板資料、功能入口。", "<article>", ["內容卡", "資訊卡", "content block"], 98, 2025),
  entry("carousel", "Carousel", "輪播", "Navigation", "carousel", "在有限空間中循序呈現一組可切換內容。", "圖片展示、推薦內容、產品功能。", "aria-roledescription=carousel", ["圖片輪播", "橫向滑動圖片", "橫向滾動的圖片", "slider gallery"], 83, 2026),
  entry("checkbox", "Checkbox", "核取方塊", "Inputs", "checkbox", "允許使用者獨立選取一個或多個選項。", "同意條款、篩選、批次選取。", "role=checkbox", ["勾選框", "多選", "check box"], 97, 2025),
  entry("chip", "Chip", "選項膠囊", "Data Display", "chip", "代表輸入、篩選條件或可移除項目的小型控制項。", "標籤輸入、篩選條件、收件人。", "aria-label", ["膠囊標籤", "可移除標籤", "token"], 88, 2026),
  entry("command-palette", "Command Palette", "命令面板", "Navigation", "command", "用鍵盤快速搜尋並執行全站功能的浮動面板。", "⌘K 搜尋、快捷指令、AI 工具。", "role=dialog", ["快捷命令", "命令搜尋", "command menu"], 94, 2026),
  entry("context-menu", "Context Menu", "內容選單", "Navigation", "context", "依照使用者點擊位置或右鍵提供相關操作。", "檔案操作、表格列、編輯器。", "contextmenu", ["右鍵選單", "快速選單"], 79, 2026),
  entry("data-table", "Data Table", "資料表格", "Data Display", "table", "以列與欄呈現可比較、排序或操作的結構化資料。", "後台管理、報表、清單。", "aria-sort", ["資料表", "表格", "grid"], 96, 2025),
  entry("date-picker", "Date Picker", "日期選擇器", "Inputs", "calendar", "讓使用者從日曆中選擇單日或日期範圍。", "預約、報表期間、行程。", "input type=date", ["日期選擇", "日曆選擇", "date range"], 93, 2025),
  entry("dialog", "Dialog", "對話框", "Overlays", "modal", "暫時將注意力集中在一個任務或資訊上的浮層。", "編輯資料、檢視細節、確認操作。", "aria-modal=true", ["彈窗", "對話視窗", "dialog box"], 98, 2025),
  entry("divider", "Divider", "分隔線", "Layout", "divider", "視覺上分隔不同內容群組的線條或留白。", "表單、選單、設定頁。", "role=separator", ["分隔線", "水平線", "separator"], 87, 2025),
  entry("drawer", "Drawer", "抽屜式選單", "Overlays", "drawer", "從畫面邊緣滑入、承載次要內容或導覽的面板。", "手機選單、篩選器、購物車。", "aria-hidden", ["右側滑出", "右側滑出的選單", "點了之後會從右邊滑出來裝目錄的東西", "側邊欄", "side panel"], 95, 2026),
  entry("dropdown-menu", "Dropdown Menu", "下拉選單", "Navigation", "menu", "點擊控制項後向下展開的一組操作選項。", "帳號選單、更多操作、排序。", "aria-haspopup=menu", ["下拉選單", "選單", "more menu"], 99, 2025),
  entry("empty-state", "Empty State", "空狀態", "Feedback", "empty", "當沒有資料、尚未建立或搜尋無結果時的引導畫面。", "新帳號、空資料夾、零搜尋結果。", "aria-live", ["空白狀態", "沒有資料", "no results"], 89, 2026),
  entry("fab", "Floating Action Button", "浮動操作按鈕", "Mobile", "fab", "固定在畫面上的主要浮動操作按鈕。", "新增、撰寫、快速建立。", "aria-label", ["FAB", "浮動按鈕", "懸浮按鈕"], 86, 2026, ["Web", "Mobile"]),
  entry("file-upload", "File Upload", "檔案上傳", "Inputs", "upload", "讓使用者選取或拖放檔案至系統。", "附件、圖片、文件匯入。", "input type=file", ["上傳元件", "拖放上傳", "dropzone"], 91, 2025),
  entry("form-field", "Form Field", "表單欄位", "Inputs", "input", "由標籤、輸入控制項、說明與錯誤訊息組成的欄位單位。", "登入、註冊、資料編輯。", "for / id", ["欄位", "表單項目", "field"], 100, 2025),
  entry("hover-card", "Hover Card", "懸浮資訊卡", "Overlays", "popover", "滑入或聚焦觸發、提供補充資訊的卡片。", "人物預覽、連結預覽、說明。", "aria-describedby", ["懸停卡片", "預覽卡", "preview card"], 72, 2026),
  entry("icon-button", "Icon Button", "圖示按鈕", "Actions", "icon-button", "只用圖示表示功能的緊湊按鈕，需補充可存取名稱。", "搜尋、關閉、更多、播放。", "aria-label", ["圖示按鈕", "icon control"], 94, 2025),
  entry("inline-alert", "Inline Alert", "行內警示", "Feedback", "inline-alert", "緊鄰內容或表單欄位的局部訊息。", "欄位錯誤、局部成功、格式提醒。", "role=alert", ["行內提示", "欄位錯誤", "inline message"], 90, 2026),
  entry("input", "Text Input", "文字輸入框", "Inputs", "input", "讓使用者輸入單行文字、搜尋詞或短資料。", "搜尋、姓名、網址、關鍵字。", "input type=text", ["輸入框", "文字框", "文字欄位"], 100, 2025),
  entry("kbd", "Keyboard Hint", "快捷鍵提示", "Data Display", "kbd", "視覺化顯示可使用的鍵盤按鍵或快捷鍵。", "⌘K、儲存、編輯器快捷鍵。", "<kbd>", ["鍵盤提示", "快捷鍵", "key hint"], 76, 2026),
  entry("link", "Link", "連結", "Navigation", "link", "將使用者導向另一個位置、頁面或內容的文字控制項。", "頁面導覽、外部資源、內文引用。", "<a href>", ["超連結", "文字連結", "anchor"], 99, 2025),
  entry("list", "List", "清單", "Data Display", "list", "以垂直或水平順序呈現一組同質內容。", "通知、檔案、搜尋結果、設定。", "<ul> / <ol>", ["列表", "項目清單", "list view"], 93, 2025),
  entry("menu-bar", "Menu Bar", "選單列", "Navigation", "menu-bar", "集中放置全域功能與分層選單的水平導覽列。", "桌面 App、後台、編輯器。", "role=menubar", ["功能表列", "頂部選單", "navigation bar"], 82, 2026, ["Web", "macOS"]),
  entry("menubar-item", "Menu Item", "選單項目", "Navigation", "menu-item", "選單中可被選取、聚焦或展開的單一項目。", "檔案、編輯、檢視等操作。", "role=menuitem", ["選單列項目", "menu option"], 84, 2026),
  entry("modal-dialog", "Modal Dialog", "模態對話框", "Overlays", "modal", "開啟後會暫停背景內容互動的對話框。", "確認、編輯、登入、重要提示。", "aria-modal=true", ["模態視窗", "阻塞式彈窗"], 97, 2025),
  entry("pagination", "Pagination", "分頁", "Navigation", "pagination", "將大量內容拆成多頁，並提供頁面切換控制。", "搜尋結果、資料表、文章列表。", "aria-current=page", ["頁碼", "分頁器", "page navigation"], 92, 2025),
  entry("popover", "Popover", "浮動卡片", "Overlays", "popover", "錨定在觸發元素附近的暫時性浮動內容。", "格式選項、補充工具、日期或顏色選擇。", "aria-expanded", ["彈出卡片", "浮動面板", "anchored popup"], 94, 2025),
  entry("progress", "Progress Bar", "進度條", "Feedback", "progress", "顯示一項工作已完成的比例或進度。", "上傳、安裝、任務完成度。", "aria-valuenow", ["進度列", "進度指示", "loading progress"], 95, 2025),
  entry("radio-group", "Radio Group", "單選群組", "Inputs", "radio", "從互斥選項中選擇一個值的控制項群組。", "付款方式、顯示模式、設定選項。", "role=radio", ["單選按鈕", "互斥選項", "radio button"], 90, 2025),
  entry("rating", "Rating", "評分", "Inputs", "rating", "用星星或其他符號表達分數或喜好程度。", "商品評價、滿意度、內容喜好。", "aria-valuenow", ["星等", "星星評分", "star rating"], 83, 2026),
  entry("resizable-panels", "Resizable Panels", "可調整面板", "Layout", "split", "使用者可拖曳分隔線調整多個區域的尺寸。", "程式碼編輯器、設計工具、雙欄檢視。", "aria-valuenow", ["可調整欄位", "拖曳分隔", "split view"], 77, 2026),
  entry("scroll-area", "Scroll Area", "滾動區域", "Layout", "scroll", "在限定尺寸的容器中提供獨立滾動。", "側欄、長清單、文件預覽。", "tabindex=0", ["捲動區域", "獨立滾動", "scroll container"], 79, 2026),
  entry("scrollspy", "Scrollspy", "滾動偵測導覽", "Navigation", "scrollspy", "依照目前滾動位置同步標示內容章節。", "長文件、產品頁、說明中心。", "IntersectionObserver", ["滾動追蹤", "章節導覽", "active section"], 80, 2026),
  entry("select", "Select", "選取器", "Inputs", "select", "從預先定義的選項清單中選擇一個值。", "篩選、設定、表單。", "aria-haspopup=listbox", ["下拉選擇", "選擇框", "combobox"], 98, 2025),
  entry("segmented-control", "Segmented Control", "分段控制器", "Inputs", "segmented", "並排呈現互斥檢視或模式選擇的控制項。", "日／週／月、列表／網格、模式切換。", "role=tablist", ["分段選擇", "模式切換", "segmented button"], 86, 2026),
  entry("sheet", "Sheet", "底部或側邊工作表", "Overlays", "sheet", "從邊緣滑入、承載一段聚焦工作流程的面板。", "手機編輯、分享、篩選、操作流程。", "aria-modal=true", ["工作表", "側邊工作表", "bottom sheet"], 84, 2026, ["Web", "Mobile"]),
  entry("skeleton", "Skeleton", "骨架屏", "Feedback", "skeleton", "內容載入前，用輪廓佔位降低等待感的預覽。", "文章、卡片、資料表載入。", "aria-busy=true", ["骨架載入", "佔位動畫", "loading placeholder"], 93, 2025),
  entry("snackbar", "Snackbar", "短訊息列", "Feedback", "toast", "短暫顯示在畫面邊緣、通常可附帶一個動作的訊息。", "復原、儲存成功、離線提醒。", "aria-live=polite", ["訊息列", "短暫提示", "undo message"], 88, 2026),
  entry("spinner", "Spinner", "載入轉圈", "Feedback", "spinner", "表示系統正在處理、目前無法提供進度比例。", "按鈕等待、頁面載入、局部請求。", "role=status", ["載入動畫", "轉圈圈", "loading indicator"], 94, 2025),
  entry("split-button", "Split Button", "分割按鈕", "Actions", "split", "將主要動作與其他相關選項拆在同一個按鈕組。", "下載、建立、傳送等預設與替代操作。", "aria-haspopup=menu", ["分割按鈕", "主按鈕加選單"], 75, 2026),
  entry("stepper", "Stepper", "步驟器", "Navigation", "steps", "顯示多步驟流程目前位置與已完成狀態。", "結帳、申請、設定精靈。", "aria-current=step", ["流程步驟", "步驟導覽", "wizard steps"], 90, 2025),
  entry("switch", "Switch", "開關", "Inputs", "switch", "在兩個互斥狀態間切換，通常代表立即生效的設定。", "通知、深色模式、功能啟用。", "role=switch", ["切換開關", "toggle switch", "on off"], 99, 2025),
  entry("tabs", "Tabs", "分頁標籤", "Navigation", "tabs", "在同一內容區域中切換多個平行檢視。", "設定、產品細節、文件分類。", "aria-selected", ["頁籤", "分頁切換", "tab navigation"], 100, 2025),
  entry("tag", "Tag", "標籤", "Data Display", "tag", "以文字分類、描述或標記內容的非互動小元件。", "文章分類、狀態、資料屬性。", "aria-label", ["文字標籤", "分類標籤", "label"], 88, 2025),
  entry("textarea", "Textarea", "多行文字框", "Inputs", "textarea", "讓使用者輸入可換行的較長文字內容。", "留言、描述、備註、提示詞。", "textarea", ["多行輸入", "文字區域", "long text"], 95, 2025),
  entry("timeline", "Timeline", "時間軸", "Data Display", "timeline", "沿著時間或順序呈現一連串事件。", "歷史紀錄、專案進度、活動流程。", "aria-label", ["時間線", "事件時間軸", "history"], 82, 2026),
  entry("toast", "Toast", "吐司通知", "Feedback", "toast", "不打斷主要流程、短暫出現的狀態通知。", "儲存成功、背景同步、連線狀態。", "aria-live=polite", ["浮動通知", "暫時通知", "toast notification"], 96, 2025),
  entry("toggle-group", "Toggle Group", "切換群組", "Inputs", "segmented", "將多個可切換控制項集中成一組，可支援單選或多選。", "文字格式、篩選條件、工具模式。", "aria-pressed", ["切換按鈕組", "toggle buttons"], 79, 2026),
  entry("toolbar", "Toolbar", "工具列", "Actions", "toolbar", "把一組相關操作集中在水平或垂直工具列中。", "編輯器、資料表、媒體控制。", "role=toolbar", ["操作工具列", "功能列", "action bar"], 89, 2025),
  entry("tooltip", "Tooltip", "工具提示", "Overlays", "tooltip", "在使用者聚焦或懸停時提供簡短說明。", "圖示按鈕、縮寫、截斷文字。", "role=tooltip", ["提示文字", "滑入提示", "hover hint"], 98, 2025),
  entry("tree-view", "Tree View", "樹狀檢視", "Data Display", "tree", "以巢狀層級呈現檔案、分類或階層資料。", "檔案總管、分類、權限設定。", "role=tree", ["樹狀選單", "階層清單", "tree menu"], 80, 2026),
  entry("video-player", "Video Player", "影片播放器", "Media", "video", "提供播放、暫停、音量與進度控制的媒體介面。", "課程、影音內容、產品展示。", "<video controls>", ["播放器", "影片控制列", "media player"], 85, 2026),
  entry("window-chrome", "Window Chrome", "視窗框架", "Desktop", "window", "模擬或呈現桌面視窗的標題列、控制鈕與邊界。", "macOS App、瀏覽器預覽、桌面工具。", "NSWindow", ["視窗外框", "標題列", "window frame"], 73, 2026, ["Web", "macOS"]),
  entry("bottom-navigation", "Bottom Navigation", "底部導覽列", "Mobile", "bottomnav", "固定在行動裝置底部、用於切換主要目的地的導覽。", "手機 App 主畫面、主要分區。", "aria-label=primary", ["底部導覽", "手機導覽列", "tab bar"], 87, 2026, ["Web", "Mobile"]),
  entry("pull-to-refresh", "Pull to Refresh", "下拉更新", "Mobile", "refresh", "透過下拉手勢觸發內容重新整理。", "訊息流、清單、行動資料頁。", "touch-action", ["下拉刷新", "拉動更新", "refresh gesture"], 76, 2026, ["Web", "Mobile"]),
  entry("bottom-sheet", "Bottom Sheet", "底部抽屜", "Mobile", "sheet", "從螢幕底部滑出的暫時性面板。", "手機選單、分享面板、快速編輯。", "aria-modal=true", ["底部面板", "手機抽屜", "bottom drawer"], 86, 2026, ["Web", "Mobile"]),
  entry("color-picker", "Color Picker", "顏色選擇器", "Inputs", "color", "讓使用者選擇色彩值或調整色相、明度與透明度。", "設計工具、主題設定、標記顏色。", "input type=color", ["選色器", "色彩選擇", "color input"], 78, 2026),
  entry("number-input", "Number Input", "數字輸入框", "Inputs", "number", "限制輸入數值並可搭配遞增遞減控制。", "數量、價格、尺寸、參數。", "input type=number", ["數字欄位", "數值輸入", "stepper input"], 85, 2026),
  entry("range-slider", "Range Slider", "範圍滑桿", "Inputs", "slider", "讓使用者在連續數值範圍內選擇一個或兩個端點。", "音量、價格區間、影像時間。", "role=slider", ["雙端滑桿", "數值範圍", "range input"], 89, 2026),
  entry("search-field", "Search Field", "搜尋欄", "Inputs", "search", "專門用來輸入搜尋詞並觸發內容篩選的欄位。", "全站搜尋、清單篩選、指令搜尋。", "role=searchbox", ["搜尋框", "搜尋輸入", "search input"], 99, 2025),
  entry("stat-card", "Stat Card", "數據摘要卡", "Data Display", "stat", "以醒目數字、標籤與變化量摘要一項指標。", "儀表板、KPI、營運總覽。", "aria-label", ["統計卡", "指標卡", "metric card"], 90, 2026),
  entry("bento-grid", "Bento Grid", "便當盒網格", "Layout", "bento", "以不等尺寸卡片組成的模組化網格佈局。", "產品首頁、作品集、功能總覽。", "CSS Grid", ["Bento 佈局", "模組化卡片", "grid layout"], 92, 2026),
  entry("scrim", "Scrim", "遮罩層", "Overlays", "scrim", "覆蓋在背景上的半透明層，用來聚焦前景內容或降低背景干擾。", "Modal、Drawer、Bottom Sheet 開啟時的背景處理。", "backdrop-filter", ["背景變暗的遮罩層", "背景變黑", "遮罩層", "overlay backdrop"], 87, 2026),
  entry("meatballs-menu", "Meatballs Menu", "三點更多選單", "Navigation", "menu", "以三個水平圓點表示更多操作的緊湊選單入口。", "卡片、表格列、檔案清單的次要操作。", "aria-haspopup=menu", ["按鈕旁的三個點", "三個點", "更多操作", "overflow menu"], 85, 2026),
  entry("side-sheet", "Side Sheet", "側邊工作表", "Overlays", "sheet", "從左側或右側滑入、承載補充工作流程的面板。", "篩選器、詳細資料、編輯工作流程。", "aria-modal=true", ["側邊滑出面板", "右側面板", "side panel sheet"], 82, 2026),
];

export const components: ComponentEntry[] = [...baseComponents, ...extraComponents];

export const confusedPairs = [
  { a: "Inline Alert", az: "行內警示", b: "Callout", bz: "重點提示框", difference: "Inline Alert 緊鄰欄位或內容、通常回應當下狀態；Callout 偏向補充背景、教學或注意事項。" },
  { a: "Popover", az: "浮動卡片", b: "Tooltip", bz: "工具提示", difference: "Popover 可包含互動內容並由點擊開啟；Tooltip 只提供短說明，通常由懸停或聚焦觸發。" },
  { a: "Badge", az: "徽章", b: "Chip / Tag", bz: "膠囊／標籤", difference: "Badge 強調狀態或數量；Chip 通常可互動或移除；Tag 多半只是內容分類。" },
  { a: "Modal Dialog", az: "模態對話框", b: "Drawer / Sheet", bz: "抽屜／工作表", difference: "Modal 會阻擋背景互動；Drawer 或 Sheet 從邊緣進入，更適合承載次要流程。" },
  { a: "Skeleton", az: "骨架屏", b: "Spinner / Progress", bz: "轉圈／進度條", difference: "Skeleton 預告內容結構；Spinner 表示正在等待；Progress 能表達可量化的完成比例。" },
  { a: "Dropdown Menu", az: "下拉選單", b: "Select", bz: "選取器", difference: "Dropdown Menu 是一組動作；Select 是表單欄位，用來選擇並儲存一個值。" },
];

export const translations = [
  ["按鈕", "Button", "<button>", "NSButton", "Button"],
  ["對話框", "Dialog / Modal", "<dialog>", "NSWindow", "sheet / fullScreenCover"],
  ["抽屜式選單", "Drawer", "aside + transform", "NSPanel", "presentationDetents"],
  ["分頁標籤", "Tabs", "role=tablist", "NSTabView", "TabView"],
  ["選取器", "Select", "<select> / combobox", "NSPopUpButton", "Picker"],
  ["滑桿", "Slider", "<input type=range>", "NSSlider", "Slider"],
  ["提示", "Tooltip", "role=tooltip", "helpTag", "popover"],
  ["進度條", "Progress Bar", "aria-valuenow", "NSProgressIndicator", "ProgressView"],
  ["命令面板", "Command Palette", "⌘K + dialog", "NSMenu / NSWindow", "Commands"],
  ["視窗框架", "Window Chrome", "CSS window shell", "NSWindow", "WindowGroup"],
];

export const guides = [
  { title: "AppKit vs SwiftUI", zh: "原生平台術語怎麼對照？", desc: "從 NSWindow、NSButton 到 View、Scene，理解 macOS 原生元件與宣告式 UI 的命名差異。", tag: "Platform" },
  { title: "Swift vs Electron", zh: "原生 App 與 Web Shell", desc: "同一個 UI 概念在 AppKit、SwiftUI 與 Web 技術中，為什麼會有不同的 API 與互動模型？", tag: "Architecture" },
  { title: "Popover, Menu, Tooltip", zh: "三種浮動內容的判斷法", desc: "用觸發方式、內容複雜度與互動時間，快速選出正確的 overlay 元件。", tag: "Patterns" },
  { title: "Design for Keyboard", zh: "讓 UI 不只靠滑鼠", desc: "從 focus ring、tab order 到 aria-current，建立可被鍵盤與輔助工具理解的介面。", tag: "Accessibility" },
  { title: "Name the Interface", zh: "命名是溝通的壓縮格式", desc: "當團隊都說『那個右邊滑出來的東西』，標準元件名稱如何讓設計與開發快速對齊？", tag: "Thinking" },
];

export const categories = ["All", "Navigation", "Actions", "Inputs", "Feedback", "Data Display", "Layout", "Overlays", "Mobile", "Desktop", "Media", "AI Interface"];
import { extraComponents } from "./component-extras";
export { styles } from "./style-data";
