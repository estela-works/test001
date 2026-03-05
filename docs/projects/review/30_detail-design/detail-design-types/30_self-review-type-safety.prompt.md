# Phase 2C｜型安全性チェック

## 問い

> 型安全性が確保されているか？nullable/optionalの扱いは適切か？union型の網羅性は十分か？バリデーション関数は完全か？エラー型は全パターンをカバーしているか？

## チェック対象

- nullable/optional フィールドの扱いが意図的かつ安全か
- union型（リテラル型含む）の列挙が網羅的か
- バリデーション関数がすべての制約をチェックしているか
- APIエラー型がすべてのエラーパターンをカバーしているか
- 携帯電話プラン見積アプリ固有の安全性（プラン種別のunion型が全プランを網羅しているか、料金計算の数値型精度は十分か等）

## 典型的ミス

1. APIレスポンスでnullが返る可能性があるフィールドを非nullableで定義し、ランタイムエラーが発生する
2. プラン種別のunion型に新プランが追加されたがunion型が更新されていない
3. バリデーション関数で境界値（0、最大値、空文字列）のチェックが漏れている
4. ネットワークエラーやタイムアウトに対応するエラー型が未定義

## 実行手順

### Step 1｜nullable/optionalフィールドチェック

設計書内の全型定義からnullable（`| null`）およびoptional（`?:`）フィールドを抽出し、その妥当性を確認する。

```
| # | 型名 | フィールド | nullable/optional | 理由 | APIスキーマとの一致 | 妥当性 |
|----|------|----------|-------------------|------|-------------------|--------|
| 1 | Plan | discountRate | number | null | ユーザー未選択の場合null | nullable | OK/NG |
| 2 | Estimate | appliedDiscountId | number | null | 割引未適用の場合null | nullable | OK/NG |
| 3 | UserInfo | email | string? | 任意入力項目 | optional | OK/NG |
| 4 | PlanFormState | selectedPlanId | number | null | 初期状態で未選択 | - (FE内部) | OK/NG |
| 5 | EstimateStoreState | error | string | null | エラーなし時null | - (FE内部) | OK/NG |
| ... | | | | | | |
```

確認観点:
- APIレスポンスでnullが返る可能性があるフィールドはnullableになっているか
- 初期状態で値がないフィールドはnullable/optionalになっているか
- 必須フィールドが誤ってoptionalになっていないか

### Step 2｜union型の網羅性チェック

設計書内のすべてのunion型（文字列リテラルunion、数値リテラルunion含む）を抽出し、列挙値が網羅的かを確認する。

```
| # | union型名 | 定義値 | サービス仕様での全値 | 網羅 | exhaustive check有無 | 備考 |
|----|----------|--------|-------------------|------|---------------------|------|
| 1 | PlanType | 'basic' | 'standard' | 'premium' | basic, standard, premium | OK | switch文にdefault有 | |
| 2 | ContractPeriod | '1year' | '2year' | 1year, 2year, none | NG | 'none'が未定義 | |
| 3 | PaymentMethod | 'credit' | 'bank' | 'carrier' | credit, bank, carrier | OK | 型ガードで検証 | |
| 4 | DiscountType | 'family' | 'student' | 'senior' | family, student, senior, corporate | NG | 'corporate'が未定義 | |
| ... | | | | | | |
```

確認観点:
- サービス仕様（プラン体系、支払方法等）の全値がunion型に含まれているか
- switch文やif-else文でunion型を使用する箇所にexhaustive check（never型チェック）があるか
- 将来の拡張（新プラン追加等）を考慮した設計になっているか

### Step 3｜バリデーション関数の完全性チェック

各バリデーション関数が、対応するバリデーションルール表のすべてのルールを実装しているかを確認する。

```
| # | バリデーション関数 | ルール表の制約数 | 実装済みチェック数 | 漏れ | 境界値テスト | 備考 |
|----|------------------|----------------|-----------------|------|------------|------|
| 1 | validatePlanSelection | 3 | 3 | なし | 0件選択、上限選択 | OK |
| 2 | validateUserInfo | 5 | 4 | あり | 空文字、最大長 | emailフォーマット未チェック |
| 3 | validateEstimateRequest | 4 | 4 | なし | 0円、上限金額 | OK |
| 4 | validateDiscountCode | 2 | 2 | なし | 空文字、不正形式 | OK |
| ... | | | | | | |
```

各バリデーション関数について追加で確認:
- 空文字列（`""`）のチェックがあるか
- 数値の境界値（0、負数、最大値+1）のチェックがあるか
- 配列の空配列、上限超過のチェックがあるか
- trim() 処理が適切に行われているか

### Step 4｜エラー型カバレッジチェック

APIエラー型とエラーメッセージ定数が、想定されるすべてのエラーパターンをカバーしているかを確認する。

```
| # | エラーパターン | HTTPステータス | エラー型で定義 | エラーメッセージ定義 | カバー |
|----|-------------|--------------|-------------|-----------------|--------|
| 1 | ネットワークエラー | - | ApiError | NETWORK_ERROR | OK |
| 2 | 認証エラー | 401 | ApiError | UNAUTHORIZED | OK/未定義 |
| 3 | プラン未存在 | 404 | ApiError | PLAN_NOT_FOUND | OK/未定義 |
| 4 | バリデーションエラー | 400 | ApiError | VALIDATION_ERROR | OK |
| 5 | サーバーエラー | 500 | ApiError | SERVER_ERROR | OK/未定義 |
| 6 | タイムアウト | - | ApiError | TIMEOUT_ERROR | OK/未定義 |
| 7 | 見積上限超過 | 422 | ApiError | ESTIMATE_LIMIT_EXCEEDED | OK/未定義 |
| 8 | 割引コード無効 | 400 | ApiError | INVALID_DISCOUNT_CODE | OK/未定義 |
| ... | | | | | |
```

確認観点:
- 全APIエンドポイントのエラーレスポンスに対応する型があるか
- ネットワーク系エラー（タイムアウト、接続断）が含まれているか
- ビジネスロジック系エラー（上限超過、無効コード等）が含まれているか

## 判定基準

- Step 1: 全nullable/optionalフィールドの設定が妥当であればPass
- Step 2: 全union型が網羅的で、exhaustive checkが存在すればPass
- Step 3: 全バリデーション関数がルール表の全制約を実装していればPass
- Step 4: 全エラーパターンがエラー型でカバーされていればPass
- いずれかのStepでNGがあれば、設計書を修正してから次のPhaseへ進む
