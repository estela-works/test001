# 実装

実装ガイドと詳細設計書を参照して実装を行ってください。

## 参照ファイル
- 実装ガイド: docs/implementation/IMPLEMENTATION_GUIDE.md
- 詳細設計書: docs/projects/{{PROJECT_NAME}}/detail-design-*.md
- 実装テンプレート: src/main/java/com/example/demo/template/

## 出力先
- src/main/java/com/example/demo/
- src/main/resources/static/
- src/main/resources/schema.sql

## 実装完了時の作業

実装が完了したら、以下の作業を行ってください。

### 1. ビルド確認

```powershell
.\mvnw.cmd clean compile
```

### 2. 実装作業報告書の作成

以下のテンプレートを使用して、実装作業報告書を作成してください。

- テンプレート: docs/projects/template/implementation-report-template.md
- 出力先: docs/projects/{{PROJECT_NAME}}/implementation-report.md

**報告書に含める内容**:
1. 成果物一覧（作成・変更したファイルのリスト）
2. 変更内容詳細（各ファイルの主要な変更点）
3. 動作確認結果（ビルド・起動確認）
4. 課題・残件（発見した課題、未対応の作業、次フェーズへの引き継ぎ）
