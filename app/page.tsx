"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { categories, ComponentEntry, components, styles } from "./ui-data";
import { componentSearchScore, matchesComponentQuery } from "./component-search";

type PageKey = "elements" | "styles";
type ThemeKey = "paper" | "dark" | "bento" | "neon" | "glass";
type SiteStats = { pageViews: number; uniqueVisitors: number };
type FeedbackCategory = "bug" | "suggestion" | "component" | "other";
type FeedbackState = "idle" | "submitting" | "success" | "error";

const FAVORITES_STORAGE_KEY = "vibe-ui-favorite-components";

const navItems: { id: PageKey; label: string; zh: string; count?: string }[] = [
  { id: "elements", label: "Elements", zh: "?辣摮", count: String(components.length) },
  { id: "styles", label: "Styles", zh: "閬死憸冽", count: String(styles.length).padStart(2, "0") },
];

const feedbackLabels: Record<FeedbackCategory, string> = {
  bug: "??航炊",
  suggestion: "?撱箄降",
  component: "撱箄降?啣??辣",
  other: "?嗡??舐窗",
};

const categoryLabels: Record<string, string> = {
  All: "?券??",
  Navigation: "撠汗",
  Actions: "??",
  Inputs: "頛詨",
  Feedback: "??",
  "Data Display": "鞈??",
  Layout: "??蔭",
  Overlays: "瘚桀惜",
  Mobile: "??隞",
  Desktop: "獢隞",
  Media: "慦?",
  "AI Interface": "AI 隞",
};

const themes: { id: ThemeKey; label: string; dot: string }[] = [
  { id: "paper", label: "Paper", dot: "#e8e0d1" },
  { id: "dark", label: "Ink", dot: "#24221f" },
  { id: "bento", label: "Bento", dot: "#e7f2ff" },
  { id: "neon", label: "Neon", dot: "#c9ff3b" },
  { id: "glass", label: "Glass", dot: "#cbd7e8" },
];

const definitionMap: Record<string, string> = {
  "aria-current": "?迄頛撌亙?桀???函???郊撽??賊???,
  IntersectionObserver: "?汗?函靘皜砍?蝝?阡脣?航?蝭????賬?,
  "backdrop-filter": "撠?蝝?敺??批捆憟璅∠??敶抵???撣貉??潭??餌?????,
  "role=dialog": "?迄頛撌亙?銝??閬?銝剜釣????閰勗???,
  "aria-expanded": "銵函內?撅??批??????嗅???,
};

const getSnippet = (item: ComponentEntry, framework: string) => {
  if (framework === "React / shadcn") {
    return `import { ${item.name.replaceAll(" ", "")} } from "@/components/ui/${item.id}";\n\n<${item.name.replaceAll(" ", "")} aria-label="${item.zh}" />`;
  }
  if (framework === "SwiftUI") {
    return `struct ${item.name.replaceAll(" ", "")}View: View {\n  var body: some View {\n    // ${item.zh}\n    ${item.name === "Button" ? "Button(\"?瑁?\") { }" : "Text(\"${item.zh}\")"}\n  }\n}`;
  }
  return `<!-- ${item.zh} / ${item.name} -->\n<div class="${item.id}" role="${item.api.split("=")[0]}">\n  ${item.zh}\n</div>`;
};

function ComponentPreview({ item }: { item: ComponentEntry }) {
  const [on, setOn] = useState(false);
  const [value, setValue] = useState(62);
  const [expanded, setExpanded] = useState(false);
  const { id, type } = item;

  if (type === "accordion") return <button className="real-accordion" onClick={() => setExpanded(!expanded)}><span><b>撣貉???</b><small>暺?撅??批捆</small></span><i>{expanded ? "?? : "+"}</i>{expanded && <p>?ㄐ憿舐內撅?敺?隤芣??批捆??/p>}</button>;
  if (type === "alert") return <div className="real-alert"><b>!</b><span><strong>隢釣??/strong><small>?銝??閬?蝟餌絞閮??/small></span></div>;
  if (type === "modal") return <div className={`real-modal ${id === "alert-dialog" ? "is-danger" : ""}`}><b>{id === "alert-dialog" ? "?芷??鞈?嚗? : "蝺刻摩鞈?"}</b><small>{id === "alert-dialog" ? "甇斗?雿瘜儔?? : "?批捆?＊蝷箏撠店獢葉??}</small><span><i>??</i><em>{id === "alert-dialog" ? "?芷" : "?脣?"}</em></span></div>;
  if (type === "avatar") return <div className="real-avatar"><span>??i /></span><b>Harry</b><small>蝺?</small></div>;
  if (type === "badge") return <div className="real-badges"><span><i />撌脖?蝺?/span><b>12</b><em>NEW</em></div>;
  if (type === "banner") return <div className="real-banner"><b>??/b><span>蝟餌絞撠隞??湔</span><i>?亦?閰單?</i><em>?</em></div>;
  if (type === "breadcrumbs") return <div className="real-breadcrumbs"><span>擐?</span><i>??/i><span>?辣</span><i>??/i><b>??</b></div>;
  if (id === "button") return <div className="real-actions"><button className="mini-primary" onClick={() => setOn(!on)}>{on ? "撌脣摮??? : "?脣?霈"}</button><button className="mini-secondary">??</button></div>;
  if (id === "button-group") return <div className="real-button-group"><button>?椰</button><button className="is-selected">蝵桐葉</button><button>?</button></div>;
  if (type === "callout") return <div className="real-callout"><b>?</b><span><strong>撠?蝷?/strong><small>Callout ?其?鋆????摮貉?閮?/small></span></div>;
  if (type === "card") return <div className="real-card"><span className="real-card-image">UI</span><div><b>?辣閮剛???</b><small>8 ???梯? 繚 2026</small></div></div>;
  if (type === "carousel") return <div className="real-carousel"><button>??/button><div><b>03</b><small>隞閮剛???</small></div><button>??/button><span><i /><i className="is-active" /><i /></span></div>;
  if (type === "checkbox") return <div className="real-choices"><label><i className="checked">??/i>撖</label><label><i />閮?餃???/label></div>;
  if (type === "chip") return <div className="real-chips"><span>閮剛?蝟餌絞 <b>?</b></span><span>React <b>?</b></span><button>嚗??啣?</button></div>;
  if (type === "command") return <div className="real-command"><div>??<span>???誘??/span><kbd>?</kbd></div><p><b>??/b> ???辣摮 <small>Enter</small></p><p><b>??/b> ??瘛梯璅∪?</p></div>;
  if (type === "context") return <div className="real-context"><span>銴ˊ <kbd>?</kbd></span><span>??賢? <kbd>??/kbd></span><i /><span className="danger">?芷</span></div>;
  if (type === "table") return <div className="real-table"><div><b>?迂</b><b>???/b><b>?湔</b></div><div><span>Button</span><em>?</em><small>隞予</small></div><div><span>Drawer</span><em>?阮</em><small>?典予</small></div></div>;
  if (type === "calendar") return <div className="real-calendar"><header><button>??/button><b>2026 撟?8 ??/b><button>??/button></header><div className="week">??銝 鈭?銝???鈭???/div><div className="days">27 28 29 30 31 <b>1</b> 2<br />3 4 5 6 7 <i>8</i> 9</div></div>;
  if (type === "divider") return <div className="real-divider"><span /><b>??/b><span /></div>;
  if (type === "drawer") return <div className="real-drawer"><div className="drawer-scrim" /><aside><b>蝭拚璇辣</b><button>?</button><span /><span /><em>憟蝭拚</em></aside></div>;
  if (type === "menu") return <div className="real-dropdown"><button>{id === "meatballs-menu" ? "?ＴＴ? : "?游?????}</button><div><span>蝺刻摩</span><span>撱箇??舀</span><i /><span>撠?</span></div></div>;
  if (type === "empty") return <div className="real-empty"><b>??/b><strong>?桀?瘝?鞈?</strong><small>撱箇?蝚砌????桅?憪蝙?具?/small><button>嚗??啣??</button></div>;
  if (type === "fab") return <div className="real-fab"><div>?????嗉??閮剖?</div><button>嚗?/button></div>;
  if (type === "upload") return <div className="real-upload"><b>??/b><strong>?瑼??圈ㄐ</strong><small>?????獢?繚 ?憭?10MB</small></div>;
  if (type === "input") return <label className="real-field"><b>{id === "form-field" ? "?餃??萎辣" : "?迂"}</b><span>{id === "form-field" ? "name@example.com" : "隢撓?交?摮?}</span><small>{id === "form-field" ? "??????縑蝞? : "?憭?50 ??"}</small></label>;
  if (type === "popover") return <div className="real-popover"><button>Harry ??/button><div><b>{id === "hover-card" ? "Harry Ting" : "???澆?"}</b><small>{id === "hover-card" ? "?Ｗ?閮剛? 繚 Taiwan" : "蝎?????摨?"}</small><i /></div></div>;
  if (type === "icon-button") return <div className="real-icon-buttons"><button aria-label="??">??/button><button aria-label="?嗉?">??/button><button aria-label="?游?">?ＴＴ?/button></div>;
  if (type === "inline-alert") return <div className="real-inline-alert"><b>!</b><span>撖Ⅳ?喳??閬?8 ????/span></div>;
  if (type === "kbd") return <div className="real-kbd"><span><kbd>??/kbd><b>嚗?/b><kbd>K</kbd></span><small>????</small></div>;
  if (type === "link") return <div className="real-link"><span>?脖?甇亦閫?身閮頂蝯?/span><b>??/b></div>;
  if (type === "list") return <div className="real-list"><div><i>H</i><span><b>Harry</b><small>撌脫??Button</small></span><em>2m</em></div><div><i>Y</i><span><b>Yuki</b><small>?啣?銝??閮</small></span><em>1h</em></div></div>;
  if (["menu-bar", "menu-item"].includes(type)) return <div className="real-menubar"><span>??????/span><b>瑼?</b><b>蝺刻摩</b><b>瑼Ｚ?</b><em>Vibe UI</em></div>;
  if (type === "pagination") return <div className="mini-pagination"><span>??/span><b>1</b><span>2</span><span>3</span><span>??/span><span>8</span><span>??/span></div>;
  if (type === "progress") return <div className="real-progress"><div><b>瑼?銝銝?/b><small>{value}%</small></div><span><i style={{ width: `${value}%` }} /></span><em>?拚?蝝?12 蝘?/em></div>;
  if (type === "radio") return <div className="real-radios"><label><i className="selected" />靽∠??/label><label><i />Apple Pay</label><label><i />頧董</label></div>;
  if (type === "rating") return <div className="real-rating"><span>????????<i>??/i></span><b>4.0</b><small>128 ????/small></div>;
  if (type === "split") return <div className="real-split"><div>蝺刻摩?</div><i><span /></i><div>?汗?</div></div>;
  if (type === "scroll") return <div className="real-scroll"><div><b>?湔蝝??/b><span /><span /><span /><span /></div><i><b /></i></div>;
  if (type === "scrollspy") return <div className="real-scrollspy"><nav><b>??雿輻</b><span>摰?</span><span>閮剖?</span></nav><article><b>??雿輻</b><span /><span /><span /></article></div>;
  if (type === "select") return <label className="real-select"><b>?豢?獢</b><span>React <i>??/i></span></label>;
  if (type === "segmented") return <div className="real-segmented"><button className="selected">??/button><button>??/button><button>??/button></div>;
  if (type === "sheet") return <div className={`real-sheet ${id === "side-sheet" ? "side" : "bottom"}`}><div className="sheet-screen" /><aside><i /><b>{id === "bottom-sheet" ? "?澈?喇? : "閰喟敦鞈?"}</b><span /><span /><button>摰?</button></aside></div>;
  if (type === "skeleton") return <div className="real-skeleton"><i /><div><span /><span /><span /></div></div>;
  if (type === "toast") return <div className="real-toast"><b>??/b><span><strong>{id === "snackbar" ? "?撌脣?? : "?脣???"}</strong><small>{id === "snackbar" ? "?臭誑??5 蝘敺拙?" : "霈撌脣?甇?}</small></span><button>{id === "snackbar" ? "敺拙?" : "?"}</button></div>;
  if (type === "spinner") return <div className="mini-spinner"><span /> <b>甇?頛??/b></div>;
  if (type === "steps") return <div className="real-steps"><div><b>??/b><span>撣唾?</span></div><i /><div><b>2</b><span>鞈?</span></div><i /><div><em>3</em><span>摰?</span></div></div>;
  if (type === "switch") return <div className="real-switch-row"><span><b>?餃??萎辣?</b><small>?交???湔</small></span><button className={on ? "is-on" : ""} onClick={() => setOn(!on)}><i /></button></div>;
  if (type === "tabs") return <div className="real-tabs"><nav><b>?箸鞈?</b><span>甈?</span><span>?</span></nav><div><strong>撣唾?閮剖?</strong><i /><i /></div></div>;
  if (type === "tag") return <div className="real-tags"><span>閮剛?</span><span>?垢</span><span>?飛??/span></div>;
  if (type === "textarea") return <label className="real-textarea"><b>?酉</b><span>隢撓?亥底蝝啗牧??/span><small>0 / 200</small></label>;
  if (type === "timeline") return <div className="real-timeline"><div><i /><span><b>撠?撌脣遣蝡?/b><small>09:30</small></span></div><div><i /><span><b>摰?蝚砌?甈⊿蝵?/b><small>10:15</small></span></div></div>;
  if (type === "toolbar") return <div className="real-toolbar"><button>B</button><button><i>I</i></button><button><u>U</u></button><span /><button>??/button><button>??/button></div>;
  if (type === "tooltip") return <div className="real-tooltip"><button>??/button><span>??嗉?<i /></span></div>;
  if (type === "tree") return <div className="real-tree"><b>???components</b><span>??? Button.tsx</span><span>??? Drawer.tsx</span><span>??? Tabs.tsx</span></div>;
  if (type === "video") return <div className="real-video"><div>??/div><footer><button>??/button><span><i /></span><small>01:24 / 03:50</small><b>??/b></footer></div>;
  if (type === "window") return <div className="real-window"><header><span>??????/span><b>Vibe UI</b></header><div><aside /><main><i /><i /><i /></main></div></div>;
  if (type === "bottomnav") return <div className="real-bottomnav"><span><b>??/b><small>擐?</small></span><span><b>??/b><small>??</small></span><span className="active"><b>??/b><small>?嗉?</small></span><span><b>??/b><small>??</small></span></div>;
  if (type === "refresh") return <div className="real-refresh"><b>??/b><small>?暸??喳??渡?</small><div><span /><span /><span /></div></div>;
  if (type === "color") return <div className="real-color"><div><span /><i /></div><aside><b style={{ background: "#3167e8" }} /><b style={{ background: "#df5e80" }} /><b style={{ background: "#f3b72d" }} /><b style={{ background: "#252525" }} /></aside><code>#3167E8</code></div>;
  if (type === "number") return <label className="real-number"><b>?賊?</b><span><button>??/button><strong>{Math.round(value / 20)}</strong><button>嚗?/button></span></label>;
  if (type === "slider") return <div className="mini-slider"><span className="mini-slider-line"><i style={{ width: `${value}%` }} /></span><input aria-label="隤踵?詨? type="range" min="0" max="100" value={value} onChange={(e) => setValue(Number(e.target.value))} /><b>{value}</b></div>;
  if (type === "search") return <div className="real-search"><span>??/span><b>???辣?◢?潭?銵?</b><kbd>?</kbd></div>;
  if (type === "stat") return <div className="real-stat"><span><small>?祆?雿輻??/small><b>12,480</b><em>??12.4%</em></span><i><b /><b /><b /><b /></i></div>;
  if (type === "bento") return <div className="real-bento"><div className="wide"><b>{components.length}</b><small>UI ?辣</small></div><div><b>{styles.length}</b><small>憸冽</small></div><div><span>??/span><small>敹恍?撠?/small></div></div>;
  if (type === "scrim") return <div className="real-scrim"><div /><aside><b>蝣箄???</b><small>?撌脣??典????桃蔗??/small><button>蝣箏?</button></aside></div>;
  if (type === "sidebar") return <div className="new-sidebar"><aside><b>V</b><span className="active">?蝮質汗</span><span>?艾撠?</span><span>?閮剖?</span><small>Harry</small></aside><main><i /><i /><i /></main></div>;
  if (type === "mega-menu") return <div className="new-mega"><header>?Ｗ??鞈??蝭??<b>?Ｙ揣??/b></header><section><div><b>??雿輻</b><span>敹恍?</span><span>蝭銝剖?</span></div><div><b>?梢??</b><span>AI ??</span><span>?芸???/span></div><aside>?祇梁移?詻??/aside></section></div>;
  if (type === "navigation-rail") return <div className="new-rail"><nav><b>嚗?/b><span className="active">??small>擐?</small></span><span>??small>??</small></span><span>??small>?嗉?</small></span></nav><main><i /><i /><i /></main></div>;
  if (type === "dock") return <div className="new-dock"><main /><nav><span>??/span><span>??/span><span className="active">??/span><span>??/span><span>??/span></nav></div>;
  if (type === "sticky-header") return <div className="new-sticky"><header><b>Vibe UI</b><span>摮?憸冽???</span><button>??雿輻</button></header><main><i /><i /><i /><i /></main></div>;
  if (type === "skip-link") return <div className="new-skip"><button>頝喳銝餉??批捆</button><header>LOGO??撠汗銝?撠汗鈭?/header><main><b>銝餉??批捆</b><i /><i /></main></div>;
  if (type === "combobox") return <div className="new-combobox"><label>?豢???</label><div>?啣? <b>??/b></div><section><span>???????/span><b>??啣?撣?/b><span>???箔葉撣?/span><span>??擃?撣?/span></section></div>;
  if (type === "autocomplete") return <div className="new-combobox autocomplete"><label>???辣</label><div>dra<i>|</i></div><section><b>Drawer <small>?賢?撘??/small></b><span>Drag and Drop</span><span>Dropdown Menu</span></section></div>;
  if (type === "otp") return <div className="new-otp"><b>頛詨撽?蝣?/b><small>撌脣? ?ＴＴＴ?2468</small><div><span>4</span><span>8</span><span>2</span><span>6</span><span /><span /></div></div>;
  if (type === "password") return <div className="new-password"><label>撖Ⅳ</label><div>?ＴＴＴＴＴＴＴ?<b>??/b></div><span><i /><i /><i /></span><small>撖Ⅳ撘瑕漲嚗憟?/small></div>;
  if (type === "date-range") return <div className="new-date-range"><header><button>??/button><b>2026 撟?8 ??/b><button>??/button></header><p>?乓銝?鈭銝?鈭??/p><div>2?3?4?5?6?7?8<br />9?<i>10?11?12?13?14?15</i><br />16?17?18?19?20?21?22</div><footer>8/10 ??8/15</footer></div>;
  if (type === "time-picker") return <div className="new-time"><b>?豢???</b><div><span>09<br /><i>10</i><br />11</span><em>:</em><span>15<br /><i>30</i><br />45</span><aside>AM<br /><b>PM</b></aside></div><button>摰?</button></div>;
  if (type === "chart") return <div className="new-chart"><header><span>瘥?雿輻??/span><b>12,480</b><em>??12%</em></header><div><i /><i /><i /><i /><i /><i /></div><footer>3?4?5?6?7?8??/footer></div>;
  if (type === "kanban") return <div className="new-kanban"><section><b>敺??2</b><span>擐?????/span><span>?啣???閰?/span></section><section><b>?脰?銝准1</b><span className="active">憸冽璅?</span></section><section><b>摰??3</b><span>?辣摮</span></section></div>;
  if (type === "code-block") return <div className="new-code"><header>tsx <button>銴ˊ</button></header><pre><i>const</i> Button = () =&gt; &#123;{`\n`}?<b>return</b> &lt;button&gt;?脣?&lt;/button&gt;{`\n`}&#125;</pre></div>;
  if (type === "diff") return <div className="new-diff"><header>靽格?批捆 <span>??2?嚗?3</span></header><p className="minus">?background: #fff;</p><p className="plus">嚗background: var(--surface);</p><p className="plus">嚗color: var(--ink);</p><p>??border-radius: 12px;</p></div>;
  if (type === "coachmark") return <div className="new-coach"><main><button>??/button></main><aside><small>?啣???/small><b>閰西岫 AI ??</b><p>?其葉??餈啣?閫嚗??賣?唳迤蝣箏?隞嗚?/p><footer>1 / 1? <button>?仿?鈭?/button></footer><i /></aside></div>;
…2930 tokens truncated…ats | null>(null);
  const analyticsTracked = useRef(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>("suggestion");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle");
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed.filter((id): id is string => typeof id === "string" && components.some((item) => item.id === id)));
        }
      } catch {
        // Local storage may be unavailable in private browsing or embedded previews.
      } finally {
        setFavoritesHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!favoritesHydrated) return;
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Favorites still work for the current session when persistence is blocked.
    }
  }, [favoriteIds, favoritesHydrated]);

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
    return components.filter((item) => {
      const matchesQuery = matchesComponentQuery(item, query);
      const matchesPlatform = platform === "All" || item.platform.includes(platform as "Web" | "macOS" | "Mobile");
      const matchesCategory = category === "All" || item.category === category;
      const matchesFavorites = !favoritesOnly || favoriteIds.includes(item.id);
      return matchesQuery && matchesPlatform && matchesCategory && matchesFavorites;
    });
  }, [query, platform, category, favoritesOnly, favoriteIds]);

  const sorted = useMemo(() => {
    const result = [...filtered];
    if (query.trim()) result.sort((a, b) => componentSearchScore(b, query) - componentSearchScore(a, query) || b.popularity - a.popularity);
    else if (sort === "newest") result.sort((a, b) => b.added - a.added || b.popularity - a.popularity);
    else if (sort === "popular") result.sort((a, b) => b.popularity - a.popularity);
    else result.sort((a, b) => {
      const score = (value: string) => value.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0) + surpriseSeed) % 997, 7);
      return score(a.id) - score(b.id);
    });
    return result;
  }, [filtered, sort, surpriseSeed, query]);

  const filteredStyles = useMemo(() => styleGroup === "?券憸冽" ? styles : styles.filter((item) => item.group === styleGroup), [styleGroup]);

  const copyText = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard may be unavailable in preview */ }
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const choosePage = (page: PageKey) => { setActivePage(page); setPaletteOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
  };

  const openContact = () => { setContactOpen(true); setFeedbackState("idle"); setFeedbackError(""); };
  const closeContact = () => { if (feedbackState !== "submitting") { setContactOpen(false); setFeedbackState("idle"); setFeedbackError(""); } };
  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = feedbackMessage.trim();
    if (message.length < 10) { setFeedbackState("error"); setFeedbackError("隢撠神 10 ??嚗????憒??孵???); return; }

    setFeedbackState("submitting");
    setFeedbackError("");
    try {
      const response = await fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ category: feedbackCategory, message, email: feedbackEmail.trim() }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "?憭望?嚗?蝔??岫??);
      setFeedbackState("success");
      setFeedbackMessage("");
      setFeedbackEmail("");
    } catch (error) {
      setFeedbackState("error");
      setFeedbackError(error instanceof Error ? error.message : "?憭望?嚗?蝔??岫??);
    }
  };

  return (
    <main className={`site-shell theme-${theme}`}>
      <header className="topbar">
        <button className="brand" onClick={() => choosePage("elements")} aria-label="Vibe UI home"><span className="brand-mark">V</span><span><b>Vibe UI</b><small>Visual Dictionary / 閬死摮</small></span></button>
        <nav className="primary-nav" aria-label="銝餉???">{navItems.map((item) => <button key={item.id} className={activePage === item.id ? "is-active" : ""} onClick={() => choosePage(item.id)}><span className="nav-en">{item.label}</span><small><b>{item.zh}</b>{item.count && <i className="nav-count"> 繚 {item.count}</i>}</small></button>)}</nav>
        <div className="top-actions"><button className="palette-trigger" onClick={() => setPaletteOpen(true)}><span>Search</span><kbd>??K</kbd></button><button className="theme-trigger" onClick={() => setTheme(theme === "paper" ? "dark" : "paper")} aria-label="Toggle light and dark theme">??/button></div>
      </header>

      {activePage === "elements" && <>
        <section className="hero-section"><div className="hero-kicker"><span className="live-dot" /> {components.length} ??隞?繚 銝剛撠閮剛?</div><h1>?????ｇ?<br /><i>銋敺????/i></h1><p className="hero-lede">蝯?Vibe Coding 銝剜??飛?? UI 閬死摮??質店?膩?曉?隞塚??璅??望??迂鈭斤策 AI ???潸?/p><div className="hero-search"><span>??/span><input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setPaletteOpen(true)} placeholder="閰西岫嚗?湔??箇??詨????????..." aria-label="???辣" /><kbd>??K</kbd></div><div className="hero-suggestions"><span>閰西岫??隤芣?</span><button onClick={() => setQuery("?喳皛???)}>?喳皛???/button><button onClick={() => setQuery("?霈??蝵拙惜")}>?霈??蝵拙惜</button><button onClick={() => setQuery("銝?")}>????銝?</button></div></section>
        <section className="dictionary-section"><div className="section-heading"><div><span className="eyebrow">01 / ?辣摮 / The dictionary</span><h2>?曉甇?Ⅱ?迂 <em>Find the right name</em></h2></div><span className="result-count">?桀?憿舐內 <b>{sorted.length}</b> / {components.length} ??/span></div><div className="filter-row"><div className="filter-group platform-group">{["All", "Web", "macOS", "Mobile"].map((item) => <button key={item} className={platform === item ? "is-active" : ""} onClick={() => setPlatform(item)}><span>{item === "All" ? "?券撟喳" : item === "Web" ? "蝬脤?" : item === "macOS" ? "macOS ??" : "??"}</span><small>{item}</small></button>)}</div><div className="filter-group category-scroll">{categories.slice(0, 8).map((item) => <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}><span>{categoryLabels[item] ?? item}</span><small>{item}</small></button>)}</div><button className={`favorite-filter ${favoritesOnly ? "is-active" : ""}`} aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly((value) => !value)}>???嗉? <small>{favoriteIds.length}</small></button><div className="sort-group"><button className={sort === "newest" ? "is-active" : ""} onClick={() => setSort("newest")}>???<small>Newest</small></button><button className={sort === "popular" ? "is-active" : ""} onClick={() => setSort("popular")}>?梢? <small>Popular</small></button><button className={sort === "surprise" ? "is-active" : ""} onClick={() => { setSort("surprise"); setSurpriseSeed((seed) => seed + 1); }}>???冽??Ｙ揣 <small>Surprise</small></button></div></div>{sorted.length ? <div className="component-grid">{sorted.map((item, index) => <ComponentCard key={item.id} item={item} index={index} isFavorite={favoriteIds.includes(item.id)} onOpen={setSelected} onToggleFavorite={toggleFavorite} onDefinition={setDefinition} onCopy={copyText} />)}</div> : <div className="no-results"><span>??/span><h3>{favoritesOnly ? "?????隞? : "?曆??圈牧瘜?}</h3><p>{favoritesOnly ? "???辣?∠?銝? ???嗉?嚗停?賢?ㄐ敹恍?啜? : "閰西岫????箔???踴?嗅??摰嫘??望??辣?迂??}</p><button onClick={() => { setQuery(""); setCategory("All"); setPlatform("All"); setFavoritesOnly(false); }}>皜蝭拚</button></div>}</section>
        <section className="dictionary-note"><div><span className="eyebrow">Search locally, think globally</span><h2>瘥?隞塚??賣?銝??br /><em>?航◤銴ˊ??皞牧瘜?/em></h2></div><div className="note-points"><p><b>01</b> 銝剜??質店?膩 ???望?甇??</p><p><b>02</b> ?璅? ???臭漱隞策 AI ??蝷?/p><p><b>03</b> Web / macOS / Mobile 撠</p></div></section>
      </>}

      {activePage === "styles" && <section className="content-page styles-page"><div className="page-intro"><span className="eyebrow">02 / Name that vibe</span><h1>??閬綽?<em>???/em></h1><p>20 蝔桀?湔颲刻???UI 閬死隤????見?輸隤芣??孵噩??冽?憓?銝遣霅唬蝙?函??游???/p></div><div className="style-filter" aria-label="閬死憸冽??">{["?券憸冽", "?箇?蝢飛", "????", "?釭蝛粹?", "?訾?瘞?"].map((group) => <button key={group} className={styleGroup === group ? "is-active" : ""} onClick={() => setStyleGroup(group)}>{group}<small>{group === "?券憸冽" ? styles.length : styles.filter((item) => item.group === group).length}</small></button>)}</div><div className="style-grid">{filteredStyles.map((item) => { const index = styles.findIndex((style) => style.id === item.id); return <article className={`style-card style-${index}`} key={item.name}><div className="style-art"><StylePreview name={item.name} /></div><div className="style-card-copy"><div className="style-card-meta"><span className="card-number">{String(index + 1).padStart(2, "0")}</span><span>{item.group}</span></div><h2>{item.zh} <em>{item.name}</em></h2><p className="style-tone">{item.tone}</p><p className="style-description">{item.description}</p><dl><div><dt>?拙?</dt><dd>{item.useCase}</dd></div><div><dt>?踹?</dt><dd>{item.avoid}</dd></div></dl><div className="style-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="style-prompt" onClick={() => copyText(item.prompt, `style-${item.id}`)}>{copied === `style-${item.id}` ? "?內閰歇銴ˊ ?? : "銴ˊ?◢?潭?蝷箄?"}</button></div></article>; })}</div></section>}

      {activePage === "elements" && <StartGuide />}
      {activePage === "styles" && <StyleChoiceHint />}

      <footer className="site-footer"><div><span className="brand-mark">V</span><b>Vibe UI</b><p>Visual Dictionary / 閬死摮</p></div><div className="site-stats" aria-label="蝬脩?蝯梯?"><span><b>{stats ? stats.uniqueVisitors.toLocaleString("zh-TW") : "??}</b> 銝?銴赤摰?/span><span><b>{stats ? stats.pageViews.toLocaleString("zh-TW") : "??}</b> 蝝舐??汗</span><span>{components.length} components</span><span>Local search</span><button className="footer-contact" type="button" onClick={openContact}>??航炊嚗遣霅???/button></div><small>穢 2026 Vibe UI. 隤芸甇?Ⅱ??摮???游末???Ｕ?/small></footer>

      <div className="theme-dock"><span>Vibe</span><ThemeMenu theme={theme} setTheme={setTheme} /></div>

      {paletteOpen && <div className="overlay-backdrop" onClick={() => setPaletteOpen(false)}><section className="command-palette" role="dialog" aria-modal="true" aria-label="Search command palette" onClick={(e) => e.stopPropagation()}><div className="command-head"><span>??/span><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search in Chinese, pinyin or English..." /><kbd>ESC</kbd></div><div className="command-results"><p>QUICK JUMP / 敹恍?敺</p>{navItems.map((item) => <button key={item.id} onClick={() => choosePage(item.id)}><span>{item.label}</span><small>{item.zh}</small><b>??/b></button>)}<p>TOP MATCHES / ??賊??辣</p>{components.filter((item) => matchesComponentQuery(item, query)).sort((a, b) => componentSearchScore(b, query) - componentSearchScore(a, query)).slice(0, 5).map((item) => <button key={item.id} onClick={() => { setPaletteOpen(false); setSelected(item); }}><span>{item.zh}</span><small>{item.name} 繚 {item.category}</small><b>??/b></button>)}</div><div className="command-foot"><span>??Open</span><span>?? Navigate</span><span>ESC Close</span></div></section></div>}

      {selected && <div className="overlay-backdrop detail-backdrop" onClick={() => setSelected(null)}><aside className="detail-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}><div className="detail-top"><span className="eyebrow">?辣?圾 / Component anatomy</span><button onClick={() => setSelected(null)} aria-label="??">?</button></div><div className="detail-heading"><span className="detail-index">{categoryLabels[selected.category] ?? selected.category} / {selected.category}</span><h2>{selected.zh} <em>{selected.name}</em></h2><p>{selected.definition}</p></div><div className="detail-preview"><div className="detail-preview-head"><span>??祕撽恕 / STATE PLAYGROUND</span><div>{["Default", "Hover", "Focus", "Active", "Disabled", "Error"].map((state) => <button key={state} className={detailState === state ? "is-active" : ""} onClick={() => setDetailState(state)}>{state}</button>)}</div></div><div className={`detail-preview-stage state-${detailState.toLowerCase()}`}><ComponentPreview item={selected} /></div></div><div className="detail-grid"><div><span className="eyebrow">?質店?券?/ Use case</span><p>{selected.useCase}</p></div><div><span className="eyebrow">?璅?</span><code>{selected.api}</code></div><div><span className="eyebrow">撟喳 / Platform</span><p>{selected.platform.join(" 繚 ")}</p></div><div><span className="eyebrow">?⊿?蝷?/ Accessibility</span><p>Keyboard focus 繚 visible label 繚 semantic role</p></div></div><div className="snippet-section"><div className="snippet-head"><div><span className="eyebrow">?航票銝?蝷?/ Paste-ready</span><h3>隢?AI ?Ｙ???隞?/h3></div><button onClick={() => copyText(`Create an accessible ${selected.name} (${selected.zh}) component. Use ${selected.api}, support keyboard navigation, and include a visible focus state.`, "detail-prompt")}>{copied === "detail-prompt" ? "撌脰?鋆??? : "銴ˊ?內閰?}</button></div><div className="framework-tabs">{["HTML / Tailwind", "React / shadcn", "SwiftUI"].map((item) => <button key={item} className={framework === item ? "is-active" : ""} onClick={() => setFramework(item)}>{item}</button>)}</div><pre><code>{getSnippet(selected, framework)}</code><button onClick={() => copyText(getSnippet(selected, framework), "snippet")}>{copied === "snippet" ? "撌脰?鋆? : "銴ˊ蝔?蝣?}</button></pre></div></aside></div>}

      {definition && <div className="definition-popover" onDoubleClick={() => setDefinition(null)}><span className="eyebrow">Plain definition / ?質店閫??</span><p>{definitionMap[definition] ?? definition}</p><small>Double-click again to close</small></div>}
      {copied && <div className="copy-toast">Copied to clipboard ??/div>}

      {contactOpen && <div className="overlay-backdrop contact-backdrop" role="presentation" onMouseDown={closeContact}><section className="contact-panel" role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={(event) => event.stopPropagation()}><div className="contact-head"><div><span className="eyebrow">Feedback / Contact</span><h2 id="contact-title">銝韏瑟?摮霈??游末??/h2><p>?潛?航炊?撱箄降?啣??辣嚗??喳?閮湔??芾ㄐ??鼠?抬??賢隞亙神?券ㄐ??/p></div><button className="modal-close" type="button" onClick={closeContact} aria-label="???銵典">?</button></div>{feedbackState === "success" ? <div className="feedback-success"><span className="feedback-success-mark">??/span><h3>?嗅雿?閮鈭?/h3><p>雓?雿????雿?銝?Email嚗恣??其???雿?????/p><button className="primary" type="button" onClick={closeContact}>摰?</button></div> : <form className="feedback-form" onSubmit={submitFeedback}><label>??憿?<select value={feedbackCategory} onChange={(event) => setFeedbackCategory(event.target.value as FeedbackCategory)}>{(Object.keys(feedbackLabels) as FeedbackCategory[]).map((category) => <option key={category} value={category}>{feedbackLabels[category]}</option>)}</select></label><label>?唾牧隞暻潘?<textarea required minLength={10} maxLength={2000} value={feedbackMessage} onChange={(event) => setFeedbackMessage(event.target.value)} placeholder="靘?嚗??曆??啜?湔??箇??詨?????辣?迂?? autoFocus /></label><div className="feedback-meta"><label>Email <small>?詨‵</small><input type="email" maxLength={254} value={feedbackEmail} onChange={(event) => setFeedbackEmail(event.target.value)} placeholder="you@example.com" /></label><span>{feedbackMessage.length} / 2000</span></div><p className="feedback-note">Email ?芣??其???雿???嚗???＊蝷箝?/p>{feedbackState === "error" && <p className="feedback-error" role="alert">{feedbackError}</p>}<div className="contact-actions"><button type="button" onClick={closeContact}>????/button><button className="primary" type="submit" disabled={feedbackState === "submitting"}>{feedbackState === "submitting" ? "?銝凌? : "???"}</button></div></form>}</section></div>}
    </main>
  );
}

