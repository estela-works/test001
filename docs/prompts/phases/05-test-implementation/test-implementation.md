# テスト実装

テンプレートとテスト方針書を参照してテストを作成してください。

## 参照ファイル
- テンプレート: docs/projects/template/test-spec-frontend-template.md
- テンプレート: docs/projects/template/test-spec-backend-template.md
- テストガイド: docs/reference/best-practices/backend-testing-guide.md
- テストテンプレート: src/test/java/com/example/demo/template/
- 詳細設計書: docs/projects/{{PROJECT_NAME}}/detail-design-*.md

## 出力先
- docs/projects/{{PROJECT_NAME}}/test-spec-frontend.md
- docs/projects/{{PROJECT_NAME}}/test-spec-backend.md
- src/test/java/com/example/demo/
- src/test/e2e/tests/

## テスト実装完了時の作業

テスト実装が完了したら、以下の作業を行ってください。

### 1. テスト実行確認

```powershell
# バックエンドテスト
.\mvnw.cmd test

# フロントエンドテスト
cd src/frontend
npm test
```

### 2. テスト実装報告書の作成

以下のテンプレートを使用して、テスト実装報告書を作成してください。

- テンプレート: docs/projects/template/test-implementation-report-template.md
- 出力先: docs/projects/{{PROJECT_NAME}}/test-implementation-report.md

**報告書に含める内容**:
1. 成果物一覧（作成したテストファイルのリスト）
2. テストケース詳細（各テストの内容と結果）
3. テスト実行結果（総テスト数、成功/失敗件数）
4. 課題・残件（発見した課題、未実装のテスト、改善提案）
