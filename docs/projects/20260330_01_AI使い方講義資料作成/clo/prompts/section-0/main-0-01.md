# main-0-01 生成プロンプト

# スライド背景画像生成 共通仕様

## 利用目的
- 3キャラクター会話劇の解説動画で使用する**背景画像**を生成する
- テキスト（見出し・ラベル・字幕）は Remotion のオーバーレイが描画するため、画像内にテキストを焼き込まない

## デザイン方針
- 1枚の画像には1つの概念・事象のみを描く（1画像1概念ルール）
- 写真風・イラスト風・地図風など、コンテンツに最適なスタイルを選択する
- テキストやラベルを画像内で出来るだけ書かない。固有名詞・国際的略語も最小量とする。
- 人物の肖像は必ずイラスト・似顔絵・アイコンスタイルで描くこと（写真風・フォトリアリスティックな描写は厳禁）
- 実在の人物の顔写真を使用しないこと。シルエット、アバター、シンプルなイラストで代替すること

## プロンプト構造のルール
- 「## 生成指示」セクション: AI への指示。画像内にテキストとして描画しないこと
- 「## コンセプトと文脈」セクション: 演出意図と文脈。画像内にテキストとして描画しないこと。画像の雰囲気・トーンの参考にすること
- 「## 画像と字幕の役割分離」セクション: 画像で示す要素と字幕で示す要素の分離ルール。厳守すること
- 「## 参考データ」セクション: 内容設計データ。テキストをそのまま描画せず、視覚的に表現すること
- 「## 画像の説明」セクション: この指示に従って画像を生成すること


## 生成指示（この内容を画像内にテキストとして描画しないこと）
スタイル: Professional lecture slide, clean and modern Japanese typography, flat design
配色:
- Background: #FFFFFF (white)
- Main title text: #1E352A (dark green-tinted charcoal)
- Subtitle text: #28AA3C (brand green)
- Separator line: #28AA3C (brand green, thick)
- Footer text: #6B7E74 (medium gray)

## コンセプトと文脈（この内容を画像内にテキストとして描画しないこと）
講義全体の第一印象を決めるスライド。プロフェッショナルで信頼感があり、かつ「何か新しいことを学べそうだ」という期待感を与える。企業ロゴカラー（#28AA3C）をアクセントに使い、ブランドの一貫性を示す。余白を十分に取り、格式と親しみやすさのバランスを取る。
- 講義全体の目的: エージェントAIを活用したシステム開発への転換を提案する講義。「AIネイティブ開発」をフレーム化し、歴史的課題を解きほぐし、SPEC&Projectという具体手法を提案する。全6章＋クロージング59枚
- 章の目的: 「○○ネイティブ」の共通構造（制約→最適化対象→合理的戦略）を発見させ、講義全体への期待を作る
- 前スライド: なし（講義の開始）
- 次スライド: 0-02「AIネイティブ開発って何だと思いますか？」という問いかけで聴衆の参加を誘う
- このスライドの役割: 講義の格を示しつつ、堅すぎない雰囲気で「聴いてみよう」と思わせる導入

## 内容説明（この内容を画像内にテキストとして描画しないこと。スライドの背景知識として理解に使うこと）
本講義「エージェントAIを利用したシステム開発 — AIネイティブ開発への転換」は、AIを単なるコーディング補助ツールとして使うのではなく、システム開発の手法そのものをAIがある前提で再設計する「AIネイティブ開発」という概念を提案する。講義は全6章構成で、まずAI（LLM）の仕組みを理解し（第1章）、現状の課題を特定し（第2章）、なぜその課題が生まれたかの歴史を辿り（第3章）、AIによるコスト構造の変化を示し（第4章）、具体的手法SPEC&Projectを提案し（第5章）、その有効性を論証する（第6章）。聴衆は技術情報に明るい若手エンジニアと、20年以上の経験を持つベテランSE・プロマネが想定される。

## 画像と字幕の役割分離（厳守）
これは講義用スライド画像であり、動画の背景画像ではない。テキストはスライドの主要コンテンツであるため、指示されたテキストは全て画像内にレンダリングすること。system.txtの「テキストを焼き込まない」指示は本プロジェクトには適用しない。

画像内に描画するテキスト:
- メインタイトル「エージェントAIを利用したシステム開発」
- サブタイトル「AIネイティブ開発への転換」
- 日付・講演者名エリア（右下、小さく）

## 参考データ（テキストをそのまま描画せず、視覚的に表現すること）
```
+================================================================+
|                                                                  |
|                                                                  |
|                                                                  |
|         エージェントAIを利用した                                  |
|             システム開発                                          |
|                                                                  |
|         ━━━━━━━━━━━━━━━━━━━━━                                  |
|                                                                  |
|         AIネイティブ開発への転換                                  |
|                                                                  |
|                                                                  |
|                                                                  |
|                                          2026.XX.XX  講演者名    |
+================================================================+
```

## 画像の説明
A clean, professional title slide for a tech lecture presentation about AI-native software development. White (#FFFFFF) background with generous whitespace — the slide should feel open and inviting. Center-aligned large Japanese title "エージェントAIを利用したシステム開発" in dark charcoal (#1E352A) bold sans-serif font, taking up the visual center of the slide. Below the title, a thick horizontal line in green (#28AA3C) spanning about 40% of the width as a separator. Below the separator, subtitle "AIネイティブ開発への転換" in green (#28AA3C) medium-weight font, slightly smaller than the main title. Bottom-right corner shows "2026.XX.XX  講演者名" in small gray (#6B7E74) text. No photographs, no illustrations, no decorative elements — purely typographic with clean spacing. The overall impression should be: modern, trustworthy, intellectually stimulating — a lecture by a working professional, not an academic. Aspect ratio 16:9.

画像サイズ: 1024x576px