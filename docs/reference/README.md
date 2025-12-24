# リファレンスドキュメント

プロジェクト横断で参照できる技術ノウハウ・ベストプラクティス集。

## フォルダ構成

```
reference/
├── best-practices/     # ベストプラクティス・設計指針
├── tips/               # 実装Tips・小技集
├── troubleshooting/    # トラブルシューティング・問題解決
└── README.md           # このファイル
```

## 各フォルダの役割

### best-practices/

設計・実装における推奨パターンやガイドライン。

**配置するもの:**
- テスト戦略ガイド
- コーディング規約
- アーキテクチャパターン
- セキュリティガイドライン
- パフォーマンス最適化指針

**例:**
- `frontend-testing-strategies/` - フロントエンド単体テスト戦略
- `backend-testing-guide.md` - バックエンドテストガイド（Spring Boot + MyBatis）
- `api-design-guidelines.md` - REST API 設計ガイドライン
- `error-handling-patterns.md` - エラーハンドリングパターン

### tips/

具体的な実装の小技やスニペット集。

**配置するもの:**
- よく使うコードパターン
- ライブラリの便利な使い方
- IDE/ツールの活用法
- デバッグテクニック

**例:**
- `vue-composition-api-tips.md` - Vue Composition API の便利な書き方
- `mybatis-dynamic-sql.md` - MyBatis 動的 SQL パターン
- `git-useful-commands.md` - Git 便利コマンド集

### troubleshooting/

遭遇した問題とその解決策の記録。

**配置するもの:**
- エラーと対処法
- 環境構築トラブル
- パフォーマンス問題の調査結果
- 互換性問題の回避策

**例:**
- `cors-issues.md` - CORS エラーの対処法
- `memory-leak-investigation.md` - メモリリーク調査手順
- `build-errors.md` - ビルドエラー対応集

## ドキュメント作成ガイドライン

### 命名規則

- ケバブケース（小文字、ハイフン区切り）
- 内容を端的に表す名前
- 拡張子は `.md`

```
good: frontend-testing-strategies.md
bad:  FrontendTestingStrategies.md
bad:  frontend_testing_strategies.md
```

### 構成テンプレート

```markdown
# タイトル

概要（1-2文）

## 目次（長い場合）

## 背景・課題

なぜこのドキュメントが必要か

## 本文

具体的な内容

## 関連ドキュメント

- [リンク](パス)
```

### 更新ルール

- 新しい知見を得たら追記
- 古くなった情報は削除または更新
- 大きな変更はプルリクエストで

## 関連ドキュメント

- [実装ガイド](../implementation/IMPLEMENTATION_GUIDE.md) - 実装手順
- [ドキュメント体系ガイド](../document-guide.md) - ドキュメント全体の構成
