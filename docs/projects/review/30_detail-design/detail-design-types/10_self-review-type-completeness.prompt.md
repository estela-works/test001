# Phase 2A｜型の網羅性チェック

## 問い

> 必要な型がすべて定義されているか？エンティティ・リクエスト・レスポンス・状態・Props/Emitsの網羅性は十分か？命名規則に準拠しているか？

## チェック対象

- テンプレートの全セクション（2〜10章）が充填されているか
- 上流設計書（basic-design-frontend.md、detail-design-frontend.md、detail-design-store.md）で言及されたすべてのデータ構造に対応する型が定義されているか
- 携帯電話プラン見積アプリのドメイン固有の型（プラン型、料金型、割引型、オプション型等）が漏れなく定義されているか

## 典型的ミス

1. 上流設計書で使われているデータ構造に対応するRequest/Response型が未定義
2. コンポーネント設計書に記載されたProps/Emitsの型定義が漏れている
3. ストア設計書のState型が型定義設計書に記載されていない
4. 命名規則（エンティティは接尾辞なし、リクエストはXxxRequest等）に違反している

## 実行手順

### Step 1｜テンプレートセクション充填チェック

テンプレート（detail-design-types-template.md）の全セクションについて、設計書で記載されているかを確認する。

```
| # | テンプレートセクション | 設計書での記載 | 状態 |
|----|----------------------|--------------|------|
| 1 | 1. 概要（目的・ファイル構成） | ... | 記載済み/未記載/該当なし |
| 2 | 2. 型定義（メインエンティティ） | ... | 記載済み/未記載/該当なし |
| 3 | 2.5 Props/Emits型定義 | ... | 記載済み/未記載/該当なし |
| 4 | 3. バリデーション仕様 | ... | 記載済み/未記載/該当なし |
| 5 | 4. 型ガード関数 | ... | 記載済み/未記載/該当なし |
| 6 | 5. ユーティリティ型 | ... | 記載済み/未記載/該当なし |
| 7 | 6. APIエラー型 | ... | 記載済み/未記載/該当なし |
| 8 | 7. 定数定義 | ... | 記載済み/未記載/該当なし |
| 9 | 8. index.tsエクスポート | ... | 記載済み/未記載/該当なし |
| 10 | 9. 使用例 | ... | 記載済み/未記載/該当なし |
| 11 | 10. 命名規則 | ... | 記載済み/未記載/該当なし |
```

「未記載」の項目について、意図的な省略かどうかを確認する。

### Step 2｜型カバレッジマトリクス

上流設計書から抽出した機能・画面ごとに、必要な型がすべて定義されているかをマトリクスで確認する。

```
| # | 機能/画面 | エンティティ型 | リクエスト型 | レスポンス型 | フォーム状態型 | ストア状態型 | Props型 | Emits型 | 過不足 |
|----|----------|--------------|------------|------------|-------------|------------|---------|---------|--------|
| 1 | プラン選択 | Plan | SelectPlanRequest | PlanListResponse | PlanFormState | PlanStoreState | PlanSelectorProps | PlanSelectorEmits | OK/不足 |
| 2 | 料金見積 | Estimate | CreateEstimateRequest | EstimateResponse | EstimateFormState | EstimateStoreState | EstimateViewProps | EstimateViewEmits | OK/不足 |
| 3 | オプション選択 | Option | ... | ... | ... | ... | ... | ... | OK/不足 |
| 4 | 割引適用 | Discount | ... | ... | ... | ... | ... | ... | OK/不足 |
| 5 | ユーザー情報 | User | ... | ... | ... | ... | ... | ... | OK/不足 |
| ... | | | | | | | | | |
```

「不足」の項目について、定義を追加するか意図的な省略かを判断する。

### Step 3｜命名規則チェック

設計書内のすべての型名を抽出し、命名規則テーブルに照合する。

```
| # | 型名 | 種別 | 期待される接尾辞 | 実際の接尾辞 | 準拠 |
|----|------|------|----------------|------------|------|
| 1 | Plan | エンティティ | なし | なし | OK |
| 2 | SelectPlanRequest | APIリクエスト | Request | Request | OK |
| 3 | PlanListResponse | APIレスポンス | Response | Response | OK |
| 4 | PlanFormState | フォーム状態 | State | State | OK |
| 5 | PlanDisplay | UI表示用 | Display | Display | OK |
| 6 | PlanApiError | エラー型 | Error | Error | OK |
| ... | | | | | |
```

命名規則:
- エンティティ: 接尾辞なし（Plan, Estimate, Option）
- APIリクエスト: XxxRequest（CreateEstimateRequest）
- APIレスポンス: XxxResponse（EstimateListResponse）
- 状態: XxxState（PlanFormState, PlanStoreState）
- UI表示用: XxxDisplay（PlanDisplay）
- エラー型: XxxError（PlanApiError）

## 判定基準

- Step 1: テンプレートの必須セクションがすべて「記載済み」または正当な理由で「該当なし」であればPass
- Step 2: 全機能・画面で必要な型がすべて定義されていればPass
- Step 3: 全型名が命名規則に準拠していればPass
- いずれかのStepでNGがあれば、設計書を修正してから次のPhaseへ進む
