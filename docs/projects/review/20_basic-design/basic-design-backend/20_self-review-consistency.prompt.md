# Phase 2B｜内部整合性チェック

## 問い

> エンティティ・API・エラー定義が設計書内部で一貫しているか？

## 参照ノウハウ

- [02_design-consistency.md](../../knowhow/02_design-consistency.md) — 設計の一貫性・整合性
- [03_interface-design.md](../../knowhow/03_interface-design.md) — インターフェース設計
- [06_error-handling.md](../../knowhow/06_error-handling.md) — エラーハンドリング・異常系
- [09_maintainability-readability.md](../../knowhow/09_maintainability-readability.md) — 保守性・可読性・命名規則

## チェック対象

- エンティティの属性名・型と、APIレスポンスのフィールド名・型が一致しているか
- 全APIエンドポイントでデータ型の表記が統一されているか
- エラーレスポンスの形式・ステータスコードが全エンドポイントで統一されているか
- 命名規則がレイヤーごとに適切に使い分けられているか
- HTTPステータスコードが正しく使い分けられているか

## 典型的ミス

- エンティティでは `discountRate`（Integer）だが、APIレスポンスでは `discount_rate`（String）になっている
- あるエンドポイントでは金額を `int`（税抜）で返し、別のエンドポイントでは `int`（税込）で返している
- 400エラーのレスポンス形式がエンドポイントごとに異なる

## アンチパターン

| ID | アンチパターン | 説明 |
|----|-------------|------|
| AP-1 | エンティティとAPIレスポンスの命名規則不統一 | エンティティはcamelCase、APIレスポンスもcamelCaseで統一する（またはsnake_caseで統一する） |
| AP-2 | 税込/税抜の暗黙的混在 | 金額フィールドに税込/税抜の区別が明示されず、利用側で誤解が生じる |
| AP-3 | 割引適用順序の未定義 | 複数割引が同時適用される場合の計算順序が定義されていない |
| AP-4 | エラーレスポンスの場当たり設計 | エンドポイントごとにエラー形式が異なり、クライアント側のハンドリングが複雑化する |
| AP-5 | HTTPステータスコードの誤用 | 全エラーを400で返す、200でエラー内容を返す等。RFC準拠のステータスコード使い分けが必要 |
| AP-6 | エラーコード体系の欠如 | エラーメッセージのみでコードがなく、クライアントのハンドリング分岐が困難 |
| AP-7 | レイヤー間の命名規則混在 | Javaクラスでsnake_case、JSONレスポンスでcamelCase等、レイヤーごとの規則が未定義 |

## 実行手順

### Step 1｜エンティティ-APIフィールド照合表

全エンティティの属性と、対応するAPIレスポンスのフィールドを突合する。

```
| # | エンティティ | 属性名 | エンティティ型 | APIフィールド名 | APIレスポンス型 | 命名一致 | 型一致 |
|---|------------|--------|-------------|---------------|---------------|---------|--------|
| 1 | Plan | planName | String | planName | string | OK | OK |
| 2 | Plan | monthlyPrice | Integer | monthly_price | number | NG | OK |
| 3 | Estimate | taxIncluded | BigDecimal | taxIncluded | number | OK | 要確認 |
```

### Step 2｜金額フィールドの税込/税抜一貫性チェック

金額を扱う全フィールドについて、税込/税抜の定義が一貫しているか確認する。

```
| # | エンティティ/API | フィールド名 | 税込/税抜 | 明示されているか | 備考 |
|---|----------------|------------|---------|----------------|------|
| 1 | Plan.monthlyPrice | monthlyPrice | 税抜 | はい | ... |
| 2 | Estimate.totalAmount | totalAmount | 税込 | はい | ... |
| 3 | Discount.amount | amount | 不明 | いいえ | 要修正 |
```

### Step 3｜命名規則の一貫性チェック

設計書全体で、レイヤーごとの命名規則が統一されているか確認する。

基準となる命名規則:
- **Javaクラス名**: PascalCase（例: `PlanService`, `EstimateRequest`）
- **Javaフィールド/メソッド名**: camelCase（例: `monthlyPrice`, `calculateTotal()`）
- **DBテーブル/カラム名**: snake_case（例: `monthly_price`, `plan_id`）
- **APIパス**: kebab-case・複数形名詞（例: `/api/plans`, `/api/discount-rules`）
- **JSONフィールド名**: snake_case または camelCase（プロジェクト内で統一）
- **定数**: UPPER_SNAKE_CASE（例: `MAX_DISCOUNT_COUNT`, `TAX_RATE`）

```
| # | 対象 | 現在の命名 | 期待される規則 | 準拠 | 備考 |
|---|------|-----------|-------------|------|------|
| 1 | APIパス | /api/check-discount | kebab-case名詞 | NG | 動詞を含む |
| 2 | JSONフィールド | monthly_price / monthlyPrice | 統一規則 | NG | 混在 |
| 3 | Javaクラス | PlanService | PascalCase | OK | - |
| 4 | DBカラム | monthlyPrice | snake_case | NG | camelCaseになっている |
```

### Step 4｜エラーレスポンス統一性チェック

全エンドポイントのエラーレスポンス定義を比較し、形式が統一されているか確認する。
エラーレスポンスはRFC 9457 Problem Details形式を推奨。

推奨エラーレスポンス形式:
```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Plan with id 999 not found",
  "code": "ERR-B-001"
}
```

エラーコード体系: `ERR-{カテゴリ}-{番号}`
- V: バリデーション（例: ERR-V-001）
- B: ビジネスロジック（例: ERR-B-001）
- A: 認証・認可（例: ERR-A-001）
- S: システム（例: ERR-S-001）

```
| # | エンドポイント | ステータスコード | レスポンス形式 | エラーコード | 統一性 |
|---|-------------|---------------|-------------|-----------|--------|
| 1 | GET /api/plans | 404 | Problem Details | ERR-B-001 | 基準 |
| 2 | POST /api/estimates | 400 | Problem Details | ERR-V-001 | OK |
| 3 | GET /api/discounts | 500 | {"msg": "..."} | なし | NG |
```

### Step 5｜HTTPステータスコード適正使用チェック

全エンドポイントで、HTTPステータスコードが正しく使い分けられているか確認する。

主要ステータスコードの使い分け:
- **200**: 成功（GET, PUT, PATCH）
- **201**: リソース作成成功（POST）
- **204**: 成功・レスポンスボディなし（DELETE）
- **400**: リクエスト形式不正（バリデーションエラー）
- **401**: 未認証
- **403**: 権限不足
- **404**: リソース未存在
- **409**: 競合（楽観ロック失敗等）
- **422**: バリデーションは通るがビジネスルール違反

```
| # | エンドポイント | メソッド | 成功時コード | エラー時コード | 適正 | 備考 |
|---|-------------|---------|------------|-------------|------|------|
| 1 | GET /api/plans | GET | 200 | 404 | OK | - |
| 2 | POST /api/estimates | POST | 200 | 400 | NG | 作成なら201 |
| 3 | DELETE /api/xxx | DELETE | 200 | 404 | NG | 204が適切 |
```

### Step 6｜割引ルール組み合わせの整合性チェック

割引関連のエンティティ・APIにおいて、組み合わせルールの扱いが一貫しているか確認する。

```
| # | 割引種別 | エンティティでの定義 | APIでの受付方法 | 排他/併用の定義 | 整合性 |
|---|---------|-------------------|---------------|---------------|--------|
| 1 | 家族割 | FamilyDiscount | groupId必須 | 他割引と併用可 | OK/NG |
| 2 | キャンペーン割 | CampaignDiscount | campaignId必須 | 期間チェック要 | OK/NG |
| 3 | 長期利用割 | LongTermDiscount | contractMonths参照 | 家族割と排他 | OK/NG |
```

## 判定基準

- エンティティとAPIの全フィールドで命名規則・型が一致していること
- 金額フィールドの税込/税抜が全箇所で明示・統一されていること
- エラーレスポンスの形式・エラーコード体系が全エンドポイントで統一されていること
- 命名規則がレイヤーごとに適切に使い分けられ統一されていること
- HTTPステータスコードが正しく使い分けられていること
- 割引ルールの組み合わせ定義に矛盾がないこと
- 上記すべてを満たせばPass。1つでもNGがあれば設計書を修正してから次のPhaseへ進む
