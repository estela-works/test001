# 第2章 イラスト生成プロンプト: LLMによる開発の課題

## main-2-01: 章タイトル

### 生成プロンプト
**スタイル**: Professional presentation slide, clean Japanese infographic
**配色**:
- Background: white
- Primary text: #1B2A4A navy
- Accent: #C45C3E red-orange
**プロンプト**:
```
A clean chapter title slide. Large text "第2章" in red-orange (#C45C3E) at the top. Below it, the chapter title "LLMによる開発の課題" in large bold navy (#1B2A4A) font. Subtitle "情報の一元化問題を認識する" in smaller navy text below. A thin red-orange horizontal line separates the chapter number from the title. A subtle abstract warning/alert icon in light red-orange in the bottom-right corner. White background, minimal corporate design.
```

---

## main-2-02: 導入 — AI活用の原則（第1章からの導出）

### 生成プロンプト
**スタイル**: Professional presentation slide, clean Japanese infographic
**配色**:
- Background: white
- Primary text: #1B2A4A navy
- Accent: #C45C3E red-orange
**プロンプト**:
```
A slide recapping the three conditions from Chapter 1 and posing a challenge. Header: "AI活用の大原則（第1章より）" in navy. Three horizontal badges in red-orange (#C45C3E) outline: "正確", "一貫", "必要最小限". An arrow pointing down from the badges to a large provocative question in navy bold: "開発現場でこの原則は守れているか？". A subtle question mark icon in light red-orange. White background, clean and direct layout.
```

---

## main-2-03: 開発現場の情報はどうなっているか

### 生成プロンプト
**スタイル**: Professional presentation slide, clean Japanese infographic
**配色**:
- Background: white
- Primary text: #1B2A4A navy
- Accent: #C45C3E red-orange
**プロンプト**:
```
A diagram slide showing information chaos. Header: "開発現場の情報の現状" in navy. Center: a radial layout with scattered document icons labeled in Japanese: "設計書", "コード", "Slack", "議事録", "個人メモ" spread around randomly. Red (#C45C3E) zigzag lines between some items indicating contradictions. Three problem callouts numbered: "① 情報が散在", "② 情報が矛盾", "③ 余分な情報が残存". Each callout has a small red-orange warning icon. The overall impression is disorganized and problematic. Flat design, white background.
```

---

## main-2-04: この状態でAIに渡すと何が起きるか

### 生成プロンプト
**スタイル**: Professional presentation slide, clean Japanese infographic
**配色**:
- Background: white
- Primary text: #1B2A4A navy
- Accent: #C45C3E red-orange
**プロンプト**:
```
A two-column comparison slide. Header: "AIに渡す情報の質が結果を決める" in navy. Left column "現状" with light red (#C45C3E) tinted background: scattered messy documents flowing into an AI icon, producing output marked with red X icons and "矛盾・不正確" label. Right column "理想" with light green tinted background: organized clean documents flowing into the same AI icon, producing output marked with green checkmarks and "精度の高い回答" label. Bottom callout: "「AIが使えない」のではなく「情報が用意できていない」" in navy bold. Flat design, white background.
```

---

## main-2-05: 根本原因 — SSOTの欠如

### 生成プロンプト
**スタイル**: Professional presentation slide, clean Japanese infographic
**配色**:
- Background: white
- Primary text: #1B2A4A navy
- Accent: #C45C3E red-orange
**プロンプト**:
```
A concept introduction slide. Header: "SSOT — Single Source of Truth" in navy (#1B2A4A) bold, with Japanese subtitle "信頼できる唯一の情報源" in red-orange (#C45C3E). Center: a diagram showing one central document icon (highlighted in red-orange) with clean arrows radiating outward to multiple reference points (code, design doc, test spec, etc.). A timeline below showing the concept history: "Codd 1970 正規化" → "Inmon 1992 DWH" → "DAMA-DMBOK" in small text. Bottom provocative text: "DBでは当たり前 → なぜプロジェクト情報には未適用？". Flat design, white background.
```

---

## main-2-06: SSOTが守られていれば

### 生成プロンプト
**スタイル**: Professional presentation slide, clean Japanese infographic
**配色**:
- Background: white
- Primary text: #1B2A4A navy
- Accent: #C45C3E red-orange
**プロンプト**:
```
A slide showing SSOT satisfying the three conditions. Header: "SSOTが守られていれば" in navy. Three rows, each connecting an SSOT property to a Chapter 1 condition with red-orange (#C45C3E) arrows: "1つしかない → 正確（絞れる）", "矛盾しない → 一貫", "重複がない → 最新・最小限". Each row has a simple flat icon on the left and a green checkmark on the right. A bottom summary box: "SSOTが守られれば、第1章の3条件が自然に満たされる" in navy bold with a red-orange border. Clean, logical layout, white background.
```

---

## main-2-07: なぜSSOTが成立しないのか — 2つの目的の対立

### 生成プロンプト
**スタイル**: Professional presentation slide, clean Japanese infographic
**配色**:
- Background: white
- Primary text: #1B2A4A navy
- Accent: #C45C3E red-orange
**プロンプト**:
```
A two-column opposition slide. Header: "2つの目的は原理的に両立しない" in navy. Left column "コミュニケーション最適化" with a speech bubble icon: bullet points "相手に合わせて取捨選択", "不完全でよい", "場面依存". Right column "情報管理最適化" with a database icon: bullet points "完全・正確・構造化", "相手に関係なく網羅的". Between the columns, a large red-orange (#C45C3E) "VS" or clash symbol. Below: a result box stating "結果: どちらにも使えない文書が量産される" in navy with red-orange underline. Flat design, white background.
```

---

## main-2-08: 解法の方向性 — 保管と伝達の分離

### 生成プロンプト
**スタイル**: Professional presentation slide, clean Japanese infographic
**配色**:
- Background: white
- Primary text: #1B2A4A navy
- Accent: #C45C3E red-orange
**プロンプト**:
```
A conceptual architecture slide. Header: "解法の方向性: 保管と伝達の分離" in navy. A two-layer diagram: top layer labeled "伝達層" in red-orange (#C45C3E) with icons of presentations, reports, and chat messages. Bottom layer labeled "保管層" in navy with icons of a structured database, version-controlled repository, and single-source documents. Clean red-orange arrows flow upward from the storage layer to the communication layer, indicating that communication artifacts are generated from the single source. A hint label: "具体策は第5章以降で" in small text. Flat design, white background.
```

---

## main-2-09: ブリッジ → 第3章

### 生成プロンプト
**スタイル**: Professional presentation slide, clean Japanese infographic
**配色**:
- Background: white
- Primary text: #1B2A4A navy
- Accent: #C45C3E red-orange
**プロンプト**:
```
A bridge slide transitioning to the next chapter. Large centered Japanese text: "なぜこんな状態が続いているのか？" in navy (#1B2A4A) bold. Below it: "これは今に始まったことではない" in red-orange (#C45C3E). A subtle background illustration of a faded timeline stretching into the past, with old document and computer icons. A red-orange arrow at the bottom right pointing toward "第3章へ". The mood is reflective and curiosity-inducing. Clean flat design, white background.
```

---
