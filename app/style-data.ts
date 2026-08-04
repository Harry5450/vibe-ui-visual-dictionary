export type StyleEntry = {
  id: string;
  name: string;
  zh: string;
  group: "基礎美學" | "排版文化" | "材質空間" | "數位氛圍";
  tone: string;
  description: string;
  useCase: string;
  avoid: string;
  tags: string[];
  prompt: string;
};

export const styles: StyleEntry[] = [
  { id: "glassmorphism", name: "Glassmorphism", zh: "毛玻璃", group: "材質空間", tone: "透明、柔焦、背景模糊", description: "半透明面板讓背景色彩透出，利用模糊與細邊框建立前後層次。", useCase: "天氣、媒體、儀表板與浮動控制。", avoid: "背景太雜或文字對比不足的長篇內容。", tags: ["backdrop blur", "translucent"], prompt: "使用毛玻璃介面：半透明卡片、背景模糊、細亮邊框、清楚文字對比與柔和景深。" },
  { id: "neumorphism", name: "Neumorphism", zh: "新擬態", group: "材質空間", tone: "同色陰影、柔和浮雕", description: "控制項像從背景表面隆起或凹下，主要依靠成對的明暗陰影辨識。", useCase: "音樂控制、旋鈕與少量操作面板。", avoid: "高密度表單、低視力情境與大量按鈕。", tags: ["soft shadow", "embossed"], prompt: "使用新擬態介面：背景同色元件、雙向柔和陰影、浮雕按鈕與明確按壓狀態。" },
  { id: "bento-grid", name: "Bento Grid", zh: "便當盒網格", group: "基礎美學", tone: "模組化、不等尺寸卡片", description: "將功能與資訊拆成大小不同、但遵循同一網格的獨立卡片。", useCase: "產品首頁、作品集、功能總覽與個人儀表板。", avoid: "每個區塊同等重要或內容無法模組化時。", tags: ["grid", "modular"], prompt: "使用 Bento Grid：不等尺寸圓角卡片、清楚網格、每張卡片只表達一個重點。" },
  { id: "brutalism", name: "Brutalism", zh: "粗獷主義", group: "排版文化", tone: "高對比、硬邊框、反精緻", description: "刻意保留原始結構、粗邊框、硬陰影與直接的排版語氣。", useCase: "創意作品集、活動頁與文化品牌。", avoid: "政府服務、金融流程與需要高度信任的表單。", tags: ["raw", "hard shadow"], prompt: "使用粗獷主義介面：粗黑框、硬陰影、超大文字、高彩度撞色與直接的按鈕。" },
  { id: "editorial", name: "Editorial", zh: "編輯排版", group: "排版文化", tone: "大標題、留白、清楚層次", description: "像雜誌與專題報導，以字體比例、欄位、引言和圖片建立閱讀節奏。", useCase: "品牌故事、長文章、旅遊與文化內容。", avoid: "需要大量即時操作的後台工具。", tags: ["typography", "content first"], prompt: "使用高級編輯排版：大尺寸襯線標題、精準欄位、寬留白、細分隔線與雜誌節奏。" },
  { id: "cyberpunk", name: "Cyberpunk", zh: "賽博龐克", group: "數位氛圍", tone: "霓虹、暗底、科技感", description: "深色背景搭配霓虹光、掃描線、技術標記與 HUD 資訊層。", useCase: "遊戲、音樂、科技活動與概念展示。", avoid: "長時間閱讀、醫療、財務與兒童服務。", tags: ["neon", "HUD"], prompt: "使用賽博龐克 HUD：深黑底、青紫霓虹、掃描線、狀態碼與發光邊框。" },
  { id: "soft-ui", name: "Soft UI", zh: "柔和介面", group: "基礎美學", tone: "低對比、圓角、舒適親和", description: "運用柔和色彩、大圓角和輕陰影，讓任務感覺簡單且沒有壓力。", useCase: "健康、生活、教育與待辦工具。", avoid: "需要強烈警示、密集數據或專業控制的介面。", tags: ["friendly", "rounded"], prompt: "使用 Soft UI：柔和粉彩、大圓角、寬鬆間距、親和圖示與輕量陰影。" },
  { id: "skeuomorphism", name: "Skeuomorphism", zh: "擬真主義", group: "材質空間", tone: "模擬真實材質與操作方式", description: "用木材、金屬、旋鈕與實體按鍵暗示數位控制的操作方式。", useCase: "音樂、相機、儀器與復古體驗。", avoid: "需要高度縮放、跨平台一致和快速掃讀的產品。", tags: ["material", "familiar"], prompt: "使用擬真介面：真實金屬與木紋材質、物理旋鈕、刻度、按鍵高光與壓下陰影。" },
  { id: "minimalism", name: "Minimalism", zh: "極簡主義", group: "基礎美學", tone: "留白、克制、單一重點", description: "移除非必要裝飾，用留白、少量色彩與明確層級突出核心任務。", useCase: "SaaS、工具、作品集與高端品牌。", avoid: "功能關係複雜卻沒有足夠導覽提示時。", tags: ["white space", "clarity"], prompt: "使用極簡介面：大量留白、單一主色、精簡控制、明確字級層次與幾乎無裝飾。" },
  { id: "maximalism", name: "Maximalism", zh: "極繁主義", group: "排版文化", tone: "飽和、密集、視覺衝擊", description: "大量圖形、色彩與字體共同構成充滿能量的品牌體驗。", useCase: "活動、時尚、音樂與青年文化。", avoid: "流程工具、長表單與需要快速找資料的後台。", tags: ["layered", "bold color"], prompt: "使用極繁主義：飽和撞色、重疊圖形、巨型標題、貼紙元素與受控的視覺密度。" },
  { id: "swiss-style", name: "Swiss Style", zh: "瑞士國際風格", group: "排版文化", tone: "理性網格、無襯線字、資訊秩序", description: "以嚴謹網格、非對稱構圖和無襯線字體清楚組織資訊。", useCase: "公共資訊、展覽、設計機構與資料目錄。", avoid: "需要手作感、童趣或強烈材質情緒時。", tags: ["grid system", "sans serif"], prompt: "使用瑞士國際風格：嚴謹模組網格、無襯線字、非對稱排版、紅黑白配色與清楚編號。" },
  { id: "dark-ui", name: "Dark UI", zh: "深色介面", group: "數位氛圍", tone: "深色層級、低光舒適、高對比控制", description: "不是單純把背景變黑，而是用多層深灰與有限亮色維持閱讀層次。", useCase: "開發工具、影音、夜間使用與監控儀表板。", avoid: "陽光下閱讀、印刷導向與大量低對比灰字。", tags: ["dark mode", "layered gray"], prompt: "使用高品質 Dark UI：多層深灰表面、有限亮色、清楚焦點、避免純黑與低對比灰字。" },
  { id: "monochrome", name: "Monochrome", zh: "單色設計", group: "基礎美學", tone: "單一色相、明度層次、安靜一致", description: "以同一色相的不同明度與飽和度完成資訊層次。", useCase: "品牌頁、專注工具、攝影與高級產品。", avoid: "狀態必須靠多種顏色快速區分時。", tags: ["one hue", "tonal"], prompt: "使用單色介面：選一個主色相，以明度和飽和度建立所有層級，保留足夠文字對比。" },
  { id: "aurora-gradient", name: "Aurora Gradient", zh: "極光漸層", group: "數位氛圍", tone: "柔光、網格漸層、夢幻流動", description: "多個柔和色彩光團疊合成 Mesh Gradient，形成有深度的數位背景。", useCase: "AI 產品、創作者工具、登入頁與品牌首頁。", avoid: "資料表後方、長文章與需要印刷一致性時。", tags: ["mesh gradient", "glow"], prompt: "使用極光 Mesh Gradient：藍紫粉柔光團、自然混色、深度背景，前景保持乾淨可讀。" },
  { id: "claymorphism", name: "Claymorphism", zh: "黏土擬態", group: "材質空間", tone: "膨潤、柔軟、玩具感 3D", description: "元件像柔軟黏土模型，以厚圓角、內陰影與立體圖示呈現。", useCase: "教育、兒童、健康與友善 onboarding。", avoid: "嚴肅行政、財務與高密度專業工具。", tags: ["3D clay", "playful"], prompt: "使用 Claymorphism：柔軟立體卡片、厚圓角、彩色黏土圖示、內陰影與明亮親和氛圍。" },
  { id: "y2k", name: "Y2K / Retro Futurism", zh: "千禧復古未來", group: "數位氛圍", tone: "金屬、像素、透明彩色介面", description: "重新使用千禧年前後的數位符號、亮面金屬、像素字與透明彩色塑膠。", useCase: "時尚、音樂、潮流活動與實驗品牌。", avoid: "公共服務、無障礙優先和保守企業產品。", tags: ["chrome", "pixel"], prompt: "使用 Y2K 復古未來：液態金屬、像素文字、透明彩色塑膠、銀藍配色與早期網路符號。" },
  { id: "memphis", name: "Memphis", zh: "孟菲斯風格", group: "排版文化", tone: "幾何、撞色、活潑不規則", description: "以圓點、波浪、三角形與高彩度色塊打破規則感。", useCase: "創意活動、教育、社群與品牌宣傳。", avoid: "複雜操作、正式公務與長時間閱讀。", tags: ["geometry", "color clash"], prompt: "使用孟菲斯風格：不規則幾何、圓點波浪、黃藍粉撞色、黑色線條與活潑卡片。" },
  { id: "organic-ui", name: "Organic UI", zh: "有機自然風格", group: "材質空間", tone: "自然色、自由曲線、溫暖觸感", description: "用不規則圓潤輪廓、自然色與材質感降低科技產品的冰冷感。", useCase: "永續、飲食、旅遊、健康與生活品牌。", avoid: "需要精準對齊與密集數值比較的介面。", tags: ["natural", "freeform"], prompt: "使用有機自然 UI：大地色、自由曲線、不規則圓角、紙張或植物材質與溫暖留白。" },
  { id: "spatial-ui", name: "Spatial / 3D UI", zh: "空間立體介面", group: "材質空間", tone: "景深、懸浮層、空間操作", description: "透過透視、光影和前後層關係，讓控制項像存在於立體空間。", useCase: "XR、產品展示、地圖、3D 編輯與沉浸導覽。", avoid: "低效能裝置、長表單和必須快速掃讀的資料頁。", tags: ["depth", "3D layer"], prompt: "使用 Spatial UI：懸浮控制板、柔和景深、立體物件、真實光影與清楚的前中後層。" },
  { id: "liquid-glass", name: "Liquid Glass", zh: "液態玻璃", group: "材質空間", tone: "折射、高光、動態透明材質", description: "比一般毛玻璃更強調鏡面高光、光學折射與會隨背景改變的透明控制層。", useCase: "浮動工具列、Tab Bar、媒體控制與沉浸式內容。", avoid: "背景對比不可控、文字密集或舊裝置效能受限時。", tags: ["refraction", "specular"], prompt: "使用 Liquid Glass：透明折射材質、鏡面高光、背景色適應、浮動膠囊控制與清楚可讀性。" },
];
