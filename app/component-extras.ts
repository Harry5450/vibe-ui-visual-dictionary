import type { ComponentEntry } from "./ui-data";

const item = (id: string, name: string, zh: string, category: string, type: string, definition: string, useCase: string, api: string, aliases: string[], popularity = 82, platform: ComponentEntry["platform"] = ["Web", "macOS"]): ComponentEntry => ({ id, name, zh, category, type, definition, useCase, api, aliases, popularity, added: 2026, platform });

export const extraComponents: ComponentEntry[] = [
  item("sidebar", "Sidebar", "側邊導覽列", "Navigation", "sidebar", "固定在內容側邊、承載主要導覽與功能入口的垂直區域。", "後台、文件、工作區與桌面工具。", "<aside>", ["側欄", "左側選單", "側邊選單"], 95),
  item("mega-menu", "Mega Menu", "大型展開選單", "Navigation", "mega-menu", "展開後以多欄方式呈現大量分類與推薦內容的導覽選單。", "電商、政府入口網與大型內容網站。", "aria-expanded", ["大型下拉選單", "多欄選單", "網站大選單"], 83),
  item("navigation-rail", "Navigation Rail", "側邊圖示導覽", "Navigation", "navigation-rail", "窄版垂直導覽列，以圖示切換幾個主要目的地。", "平板、桌面 App 與響應式介面。", "aria-label=primary", ["側邊圖示列", "窄側欄", "rail"], 80, ["Web", "Mobile"]),
  item("dock", "Dock", "程式塢", "Navigation", "dock", "將常用應用程式或功能以圖示集中在畫面邊緣。", "桌面系統、創作工具與快捷入口。", "role=toolbar", ["程式列", "底部應用程式列", "app dock"], 76),
  item("sticky-header", "Sticky Header", "黏性頂部列", "Navigation", "sticky-header", "頁面滾動時仍固定在頂部的導覽或工具列。", "長頁面、電商與文件網站。", "position:sticky", ["固定標題列", "吸頂導覽", "浮動頂部"], 91),
  item("skip-link", "Skip Link", "跳過導覽連結", "Navigation", "skip-link", "鍵盤聚焦時出現，讓使用者直接跳到主要內容。", "所有具有重複導覽的網站。", "href=#main", ["跳到內容", "略過選單", "無障礙跳轉"], 72),
  item("combobox", "Combobox", "可輸入選取器", "Inputs", "combobox", "結合文字輸入與選項清單，可輸入搜尋也可選擇既有值。", "城市、人物、產品與大量選項。", "role=combobox", ["可搜尋下拉", "輸入加選單", "搜尋選取"], 96),
  item("autocomplete", "Autocomplete", "自動完成", "Inputs", "autocomplete", "根據目前輸入即時提供可能完成結果。", "搜尋、地址、標籤與指令。", "aria-autocomplete=list", ["輸入建議", "自動補字", "搜尋建議"], 95),
  item("otp-input", "OTP Input", "驗證碼輸入框", "Inputs", "otp", "將一次性驗證碼拆成多個連續輸入格。", "簡訊驗證、登入與交易確認。", "autocomplete=one-time-code", ["六位數驗證碼", "簡訊碼", "驗證碼格子"], 89, ["Web", "Mobile"]),
  item("password-field", "Password Field", "密碼輸入欄", "Inputs", "password", "隱藏輸入內容並提供顯示、規則與錯誤狀態的欄位。", "登入、註冊與變更密碼。", "input type=password", ["密碼框", "顯示密碼", "password input"], 98),
  item("date-range-picker", "Date Range Picker", "日期範圍選擇器", "Inputs", "date-range", "在日曆中選擇開始與結束日期。", "訂房、報表期間、請假與活動查詢。", "aria-label", ["起訖日期", "日期區間", "兩個日期"], 90),
  item("time-picker", "Time Picker", "時間選擇器", "Inputs", "time-picker", "選擇小時、分鐘與時段的專用控制項。", "預約、行程、提醒與營業時間。", "input type=time", ["選時間", "時分選擇", "時間欄位"], 87),
  item("chart", "Chart", "圖表", "Data Display", "chart", "把數值轉成折線、長條或區域圖，呈現比較與趨勢。", "儀表板、報表與分析頁。", "aria-label", ["折線圖", "長條圖", "數據圖"], 97),
  item("kanban-board", "Kanban Board", "看板", "Data Display", "kanban", "以狀態欄位排列可移動的任務卡片。", "專案管理、案件流程與內容製作。", "aria-grabbed", ["任務看板", "拖拉卡片", "待辦欄位"], 92),
  item("code-block", "Code Block", "程式碼區塊", "Data Display", "code-block", "以等寬字、語法色彩與複製控制呈現程式碼。", "文件、教學、AI 回覆與錯誤紀錄。", "<pre><code>", ["程式碼框", "代碼區塊", "可複製程式碼"], 93),
  item("diff-viewer", "Diff Viewer", "差異檢視器", "Data Display", "diff", "並排或逐行標示內容增加、刪除與修改。", "程式碼審查、文件版本與 AI 修改確認。", "role=region", ["版本比較", "紅綠差異", "修改前後"], 78),
  item("coachmark", "Coachmark", "功能指引標記", "Feedback", "coachmark", "附著在特定元件旁，短暫說明新功能或下一步。", "新功能介紹與首次使用引導。", "aria-describedby", ["新功能提示", "操作教學泡泡", "指引標記"], 79),
  item("product-tour", "Product Tour", "產品導覽", "Feedback", "product-tour", "用多個步驟與聚光遮罩帶領使用者認識介面。", "首次登入、重大改版與複雜工作流程。", "aria-modal=true", ["新手導覽", "步驟教學", "介面巡覽"], 85),
  item("error-summary", "Error Summary", "錯誤摘要", "Feedback", "error-summary", "集中列出表單錯誤並提供跳到問題欄位的連結。", "長表單、政府申請與無障礙流程。", "role=alert", ["錯誤清單", "表單哪裡錯", "送出失敗摘要"], 88),
  item("notification-center", "Notification Center", "通知中心", "Feedback", "notifications", "集中顯示系統、協作與任務更新的訊息面板。", "SaaS、社群、專案與後台。", "aria-live=polite", ["通知面板", "鈴鐺清單", "訊息中心"], 94),
  item("loading-button", "Loading Button", "處理中按鈕", "Feedback", "loading-button", "動作執行期間在原按鈕中顯示等待狀態並避免重複提交。", "登入、付款、儲存與上傳。", "aria-busy=true", ["按鈕轉圈", "送出中", "處理中"], 95),
  item("chat-composer", "Chat Composer", "對話輸入器", "AI Interface", "chat-composer", "結合多行輸入、附件、模型工具與送出控制的 AI 對話輸入區。", "聊天機器人、AI 助理與 Vibe Coding。", "role=textbox", ["AI 輸入框", "聊天輸入區", "提示詞輸入"], 100),
  item("model-selector", "Model Selector", "模型選擇器", "AI Interface", "model-selector", "選擇 AI 模型、速度或推理模式的控制項。", "AI 聊天、圖片生成與程式代理。", "role=combobox", ["選模型", "GPT 選擇", "推理模式"], 96),
  item("streaming-response", "Streaming Response", "串流回覆", "AI Interface", "streaming", "內容產生時逐段顯示文字，並提供停止生成控制。", "AI 回覆、逐字稿與長內容生成。", "aria-live=polite", ["AI 正在回答", "逐字出現", "停止生成"], 98),
];
