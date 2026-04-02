# スライド画像生成プロンプト集 v1（28枚）

対象設計:
- `slide-design-from-plot-detail-v3-detailed.md`
- `slide-visual-design-base-v1.md`

出力想定:
- 16:9, 1920x1080
- 明るい背景
- ロゴ準拠カラー `#28AA3C`

---

## 0. 共通設定（全スライドに付与）

### 共通プロンプト

```text
Create a clean, bright, professional 16:9 slide (1920x1080).
Visual style: modern Japanese business presentation, minimal and structured.
Use a light background (#FFFFFF to #F6FBF7), dark readable text color (#1D2A20), and accent green (#28AA3C).
Use subtle separators and soft rounded cards, thin line icons, no heavy shadows.
Keep generous margins (left/right 96px, top/bottom 64px).
Reserve bottom-right area for small company logo placement.
High clarity, high contrast, not flashy, no dark theme.
```

### 共通ネガティブプロンプト

```text
No dark background, no neon colors, no clutter, no photo collage, no 3D glossy UI, no excessive gradients, no tiny unreadable text, no watermark.
```

### 使い方

1. 各スライドの「個別プロンプト」に共通プロンプトを前置する。  
2. 文字崩れ回避のため、画像生成では「背景・図形・構図中心」にして、本文テキストは後から配置する。  
3. テキスト込み生成を行う場合でも、短文のみ（タイトル/1行結論）に留める。  

---

## 1. スライド別プロンプト

### 0-01 タイトルスライド

- レイアウト: Pattern-A
- 個別プロンプト:
```text
Centered hero title slide with lots of white space.
Add one bold horizontal green separator line in the middle area.
Place subtitle below the separator.
Place date and speaker placeholder at bottom-right.
Keep elegant, simple, confident tone.
```

### 0-02 ○○ネイティブの本質

- レイアウト: Pattern-B
- 個別プロンプト:
```text
Question-driven slide with a strong central question area and a short answer area below.
Top area should feel like a prompt to audience.
Use two small supporting question blocks and one clear conclusion block highlighted in green.
```

### 0-03 共通構造と講義の地図

- レイアウト: Pattern-D
- 個別プロンプト:
```text
Build a left-to-right causal flow diagram with 4-5 connected nodes.
Below it, add a compact timeline-like chapter map.
Use green arrows and soft green node backgrounds.
```

### 1-01 LLMの本質: 次トークン予測

- レイアウト: Pattern-D
- 個別プロンプト:
```text
Create a sequential prediction diagram: input phrase -> token prediction -> next token.
Visual should look educational and precise, with clean arrows and simple blocks.
Include a small side note zone for "same mechanism for chat/summarization/code".
```

### 1-02 原理から見た特性

- レイアウト: Pattern-D
- 個別プロンプト:
```text
Three-step vertical causal layout:
principle -> characteristic -> operational countermeasure.
Use warm accent only for the risk step, green for the countermeasure step.
```

### 1-03 コンテキスト品質の3条件

- レイアウト: Pattern-C（3カード）
- 個別プロンプト:
```text
Three equal cards horizontally: accuracy, consistency, recency.
Each card has icon + short label area.
Add one strong takeaway line beneath the cards.
```

### 1-04 運用原則とブリッジ

- レイアウト: Pattern-C（NG/OK）
- 個別プロンプト:
```text
Split screen into NG vs OK operation.
NG side neutral gray tint, OK side soft green tint.
Bottom line should pose the bridge question to next chapter.
```

### 2-01 現場実態: 散在・矛盾・ノイズ

- レイアウト: Pattern-C（マップ型）
- 個別プロンプト:
```text
Create an information-source map with multiple nodes (docs, code, chat, tickets) converging to conflicting specs.
Highlight conflict points with subtle warm accent marks.
```

### 2-02 問題の再定義

- レイアウト: Pattern-C（Before/After）
- 個別プロンプト:
```text
Two-column comparison:
left bad-input to bad-output chain, right good-input to good-output chain.
Right side should feel cleaner and more reliable.
```

### 2-03 根本原因: SSOT欠如

- レイアウト: Pattern-D
- 個別プロンプト:
```text
Central definition block for SSOT and two branches:
non-SSOT failure loop vs SSOT benefits.
Use one authoritative center node style.
```

### 2-04 分離方針とブリッジ

- レイアウト: Pattern-E
- 個別プロンプト:
```text
Two-layer architecture slide:
top strict storage layer, bottom purpose-specific output layer.
Show downward transformation arrows.
Bottom bridge line to historical reason question.
```

### 3-01 手法差と共通盲点

- レイアウト: Pattern-C
- 個別プロンプト:
```text
Compare waterfall and agile in two clean columns.
Add a shared blind spot strip at the bottom spanning both columns.
```

### 3-02 なぜ放置されたか

- レイアウト: Pattern-C
- 個別プロンプト:
```text
Historical tradeoff slide:
left shows old high documentation cost context, right shows rational resource concentration.
Use timeline cue (past -> now).
```

### 3-03 章まとめとブリッジ

- レイアウト: Pattern-G
- 個別プロンプト:
```text
Minimal summary slide with one strong conclusion line and one transition question line.
Keep visual calm and clean.
```

### 4-01 コスト構造の逆転

- レイアウト: Pattern-C
- 個別プロンプト:
```text
Before/Now comparison on cost structure.
Explicitly separate AI drafting area and human assurance area.
```

### 4-02 分岐点: 好循環か停滞か

- レイアウト: Pattern-C（ループ対比）
- 個別プロンプト:
```text
Two loop diagrams side by side:
virtuous cycle and stagnation cycle.
Use green for virtuous loop, neutral muted tones for stagnation loop.
```

### 4-03 解ける問題になった

- レイアウト: Pattern-G
- 個別プロンプト:
```text
Three-row mapping from problem to solvable direction.
Add a strong transition line to SPEC&Project.
```

### 5-01 SPECとProjectの役割分離

- レイアウト: Pattern-E
- 個別プロンプト:
```text
Two stacked core blocks:
SPEC (current truth) and Project (change context).
Clear border and role labels, balanced visual hierarchy.
```

### 5-02 運用サイクル

- レイアウト: Pattern-F
- 個別プロンプト:
```text
Circular process with 5 steps.
Step 4 (SPEC update gate) must be visually emphasized in strong green.
```

### 5-03 品質担保の設計

- レイアウト: Pattern-C
- 個別プロンプト:
```text
Responsibility split slide:
AI responsibilities (drafting tasks) vs Human responsibilities (verification and approval).
Bottom quality gate strip with 3 criteria.
```

### 5-04 効果整理とブリッジ

- レイアウト: Pattern-C
- 個別プロンプト:
```text
Four-row effect mapping table.
Right side should indicate expected practical outcomes.
Final line: transition to validation chapter.
```

### 6-01 検証方針

- レイアウト: Pattern-G
- 個別プロンプト:
```text
Evaluation framework slide with 3 criteria cards.
Add a bottom statement: evaluate by problem-solving power, not slogans.
```

### 6-02 核心: コンテキスト密度

- レイアウト: Pattern-C
- 個別プロンプト:
```text
Side-by-side input quality comparison:
legacy mixed input vs structured focused input.
Include a clear central metric concept area (effective information ratio).
```

### 6-03 課題別アンサー統合

- レイアウト: Pattern-C
- 個別プロンプト:
```text
Integrated matrix: major problem groups mapped to solution groups.
Emphasize one common solution line at bottom.
```

### 6-04 章まとめとブリッジ

- レイアウト: Pattern-G
- 個別プロンプト:
```text
Simple chapter close:
one central conclusion sentence and one action-oriented bridge sentence.
```

### C-01 論理の流れを再確認

- レイアウト: Pattern-G
- 個別プロンプト:
```text
Single-line end-to-end journey map:
principle -> problem -> history -> shift -> method -> validation -> action.
Add compact one-line chapter summaries.
```

### C-02 核心メッセージ

- レイアウト: Pattern-B
- 個別プロンプト:
```text
Large centered core message slide.
Add a small NG vs OK contrast line near the bottom.
Keep strong clarity and emotional closure.
```

### C-03 最初の一歩

- レイアウト: Pattern-H
- 個別プロンプト:
```text
Action checklist slide with 4 checkboxes and a deadline area.
Design should feel practical and immediately executable.
```

---

## 2. テキスト後入れ時の推奨

- タイトルは `Noto Sans JP Bold` / 本文は `Noto Sans JP Regular`
- 文字サイズ目安:
  - タイトル 56-64px
  - 見出し 40-48px
  - 本文 28-34px
- 行間: 1.35〜1.5
- 1スライド最大5行（本文）

