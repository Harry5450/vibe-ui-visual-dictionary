import type { ComponentEntry } from "./ui-data";

// The aliases are intentionally plain pinyin without tone marks so beginners
// can search with the spelling they already know.
const PINYIN_ALIASES: Record<string, string[]> = {
  accordion: ["zhediejia", "shoufengqin"],
  alert: ["tishi", "jinggao", "xiaoxi"],
  "alert-dialog": ["jinggaoduihua", "tishidanchuang"],
  avatar: ["touxiang", "yonghuxiang", "touxiangtu"],
  badge: ["biaoqian", "shuzi", "biaoshi"],
  banner: ["hengfu", "guanggao", "tishitia"],
  breadcrumbs: ["mianbaoxie", "daohangludao"],
  button: ["anniu", "caozuoanniu"],
  "button-group": ["anniuzu", "caozuozu"],
  callout: ["tishi", "shuomingkuai"],
  card: ["ka pian", "kapian", "xinxiqia"],
  carousel: ["lunbo", "lunbotu", "tupianlunbo"],
  checkbox: ["fuxuanku", "duoxuan"],
  chip: ["pian", "biaoqianpian", "xiaobiaoqian"],
  "command-palette": ["minglingmianban", "minglingcaidan"],
  "context-menu": ["shangxiawen caidan", "shangxiawencaidan"],
  "data-table": ["shujubiao", "shujubiaoge"],
  "date-picker": ["riqixuanze", "riqixuanzeqi"],
  dialog: ["duihuakuang", "danchuang"],
  divider: ["fen ge xian", "fengexian"],
  drawer: ["chouti", "cebianlan", "cebianmianban", "hua chu caidan"],
  "dropdown-menu": ["xialacaidan", "caidan", "xuanze caidan"],
  "empty-state": ["kongzhuangtai", "meiyou shuju", "wujieguo"],
  fab: ["fudonganniu", "fudongcaozuoanniu"],
  "file-upload": ["shangchuanwenjian", "wenjianshangchuan"],
  "form-field": ["biaodanziduan", "biaodankuang"],
  "hover-card": ["xu ting qia", "xuantingqia", "yufukapian"],
  "icon-button": ["tubiaoanniu", "tubiaoanniu"],
  "inline-alert": ["hangneitishi", "neiqianshitishi"],
  input: ["shurukuang", "wenbenshuru", "shuruziduan"],
  kbd: ["jianpan tishi", "jianpantishi", "kuaijiejian"],
  link: ["lianjie", "chaolianjie"],
  list: ["liebiao", "shujuliebiao"],
  "menu-bar": ["caidulan", "caidulangan"],
  "menubar-item": ["caidanxiang", "caidanziduan"],
  "modal-dialog": ["motaikuang", "motaidu ihuakuang", "motaidialog"],
  pagination: ["fenyes", "fenye", "yemian daohang"],
  popover: ["tan ch u kuang", "tanchukuang", "fu ceng"],
  progress: ["jindutiao", "jindu"],
  "radio-group": ["danxuanzu", "danxuan"],
  rating: ["pingfen", "xingjipingfen"],
  "resizable-panels": ["ke tiaozheng mianban", "ketiaozhengmianban", "fenlie mianban"],
  "scroll-area": ["gundongquyu", "gundongrongqi"],
  scrollspy: ["gundongjianting", "gundongdaohang"],
  select: ["xuanzeqi", "xialaxuanze"],
  "segmented-control": ["duanliekongzhi", "duanlieanniu"],
  sheet: ["mianban", "dancengmianban"],
  skeleton: ["guzhuangjiazai", "guzhuang", "jiazai zhuangtai"],
  snackbar: ["tishi tia", "caozuo tishi", "xiaoxitia"],
  spinner: ["jiazaiquan", "jiazaitubiao"],
  "split-button": ["fenlianniu", "fenlieanniu"],
  stepper: ["buzhouqi", "buzhou", "xiangdao"],
  switch: ["kaiguan", "qiehuan kaiguan", "qiehuan"],
  tabs: ["biaoqianye", "qiehuan biaoqian", "tab"],
  tag: ["biaoqian", "biaoqianleixing"],
  textarea: ["duowenbenshuru", "wenbenshuruqu"],
  timeline: ["shijianxian", "shijianzhou", "shijianzhouqi"],
  toast: ["tanxing tishi", "tanxingtishi", "xiaoxitishi"],
  "toggle-group": ["qiehuanzu", "qiehuananniu"],
  toolbar: ["gongjulan", "caozuolan"],
  tooltip: ["tishi", "fudongtishi", "xuantingtishi"],
  "tree-view": ["shuzhuangtu", "shuzhuangliebiao"],
  "video-player": ["shipinbofangqi", "bofangqi"],
  "window-chrome": ["chuangkoukuang", "chuangkou"],
  "bottom-navigation": ["dibu daohang", "dibudaohang", "shoujidaohang"],
  "pull-to-refresh": ["xia la shua xin", "xialashuaxin"],
  "bottom-sheet": ["dibumianban", "dibutan chuang", "dibutanchuang"],
  "color-picker": ["yansexuanze", "yansepan"],
  "number-input": ["shuzishuru", "shuzishurukuang"],
  "range-slider": ["fanweihuadongtiao", "huadongtiao"],
  "search-field": ["sousuukuang", "sousuushuru"],
  "stat-card": ["shujutongjiqia", "tongjiqia"],
  "bento-grid": ["bentebu ju", "bentebu ju", "wanggebu ju"],
  scrim: ["zhezhao", "beijingzhezhao"],
  "meatballs-menu": ["san dian caidan", "sandian", "gengduocaidan"],
  "side-sheet": ["cebianmianban", "cebian tan chuang", "cebiantanchuang"],
};

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function isSubsequence(query: string, value: string) {
  let cursor = 0;
  for (const character of query) {
    cursor = value.indexOf(character, cursor);
    if (cursor < 0) return false;
    cursor += 1;
  }
  return true;
}

function fuzzyMatch(field: string, query: string) {
  const normalizedField = normalize(field);
  if (!normalizedField || !query) return false;
  if (normalizedField.includes(query)) return true;
  return query.length >= 3 && isSubsequence(query, normalizedField);
}

export function getComponentSearchTerms(item: ComponentEntry) {
  return [
    item.name,
    item.zh,
    item.category,
    item.definition,
    item.useCase,
    item.api,
    ...item.aliases,
    ...(PINYIN_ALIASES[item.id] ?? []),
  ];
}

export function componentSearchScore(item: ComponentEntry, query: string) {
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) return 1;

  const terms = getComponentSearchTerms(item);
  const normalizedTerms = terms.map(normalize);
  if (normalizedTerms.some((term) => term === normalizedQuery)) return 100;
  if (normalizedTerms.some((term) => term.includes(normalizedQuery))) return 80;

  const tokens = query.trim().split(/\s+/u).filter(Boolean).map(normalize);
  if (tokens.length > 1 && tokens.every((token) => normalizedTerms.some((term) => fuzzyMatch(term, token)))) return 70;
  if (normalizedTerms.some((term) => fuzzyMatch(term, normalizedQuery))) return 50;
  return 0;
}

export function matchesComponentQuery(item: ComponentEntry, query: string) {
  return componentSearchScore(item, query) > 0;
}


