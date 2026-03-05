# Phase 2B｜型の整合性チェック

## 問い

> 型定義がAPIスキーマと一致しているか？Props/Emitsがコンポーネント設計と整合しているか？バリデーションルールがバックエンド制約と一致しているか？

## チェック対象

- detail-design-api.md のAPIスキーマとFE型定義の一致
- detail-design-frontend.md のコンポーネント設計とProps/Emits型の整合
- バリデーションルールとバックエンド制約の一致
- 携帯電話プラン見積アプリ固有の整合性（プラン種別定義、割引ルール型、料金計算型がサービス仕様と一致しているか）

## 典型的ミス

1. APIレスポンスのフィールド名がキャメルケース/スネークケースで不一致（例: `plan_type` vs `planType`）
2. APIスキーマでnullableなフィールドがFE型でnon-nullableになっている
3. コンポーネント設計書のEmitsイベント名と型定義のEmits型のイベント名が異なる
4. バックエンドで最大100文字制限のフィールドがFEバリデーションで200文字まで許可されている

## 実行手順

### Step 1｜APIスキーマ ↔ FE型 整合表

detail-design-api.md の各エンドポイントのリクエスト/レスポンススキーマと、型定義設計書の対応する型を突合する。

```
| # | エンドポイント | メソッド | APIスキーマのフィールド | FE型のフィールド | 型一致 | nullable一致 | 備考 |
|----|-------------|---------|---------------------|----------------|--------|-------------|------|
| 1 | /api/plans | GET | - | - | - | - | レスポンス型 |
| 1a | | | id: integer | id: number | OK | OK | |
| 1b | | | name: string | name: string | OK | OK | |
| 1c | | | planType: string | planType: PlanType | OK | OK | enum化 |
| 1d | | | monthlyPrice: integer | monthlyPrice: number | OK | OK | |
| 1e | | | dataCapacity: integer | dataCapacity: number | OK/NG | OK/NG | |
| 2 | /api/estimates | POST | - | - | - | - | リクエスト型 |
| 2a | | | planId: integer(required) | planId: number | OK | OK | |
| 2b | | | options: array | options: number[] | OK/NG | OK/NG | |
| ... | | | | | | | |
```

全フィールドについて以下を確認:
- 型が一致しているか（integer→number、string→string、enum→union type等）
- nullable/optional属性が一致しているか
- 配列型の要素型が一致しているか

### Step 2｜Props/Emits ↔ コンポーネント設計 整合表

detail-design-frontend.md の各コンポーネント定義と、型定義設計書のProps/Emits型を突合する。

```
| # | コンポーネント | 設計書のProps | 型定義のProps型 | 一致 | 設計書のEmits | 型定義のEmits型 | 一致 |
|----|-------------|-------------|---------------|------|-------------|---------------|------|
| 1 | PlanSelector | planType: string, plans: Plan[] | PlanSelectorProps | OK/NG | select: (plan) => void | PlanSelectorEmits | OK/NG |
| 2 | OptionList | options: Option[], selected: number[] | OptionListProps | OK/NG | toggle: (id) => void | OptionListEmits | OK/NG |
| 3 | EstimateResult | estimate: Estimate | EstimateResultProps | OK/NG | recalculate: () => void | EstimateResultEmits | OK/NG |
| 4 | DiscountBadge | discount: Discount | DiscountBadgeProps | OK/NG | - | - | - |
| ... | | | | | | | |
```

不一致がある場合、どちらを正とするかを判断する。

### Step 3｜バリデーションルール ↔ バックエンド制約 整合表

型定義設計書のバリデーションルールと、detail-design-api.md（またはバックエンド設計書）の制約を突合する。

```
| # | フィールド | FEバリデーションルール | BE制約 | 一致 | 備考 |
|----|----------|---------------------|--------|------|------|
| 1 | planId | 必須、number、正の整数 | NOT NULL、INTEGER | OK | |
| 2 | userName | 必須、1〜50文字 | NOT NULL、VARCHAR(50) | OK | |
| 3 | email | 必須、メール形式 | NOT NULL、email format | OK | |
| 4 | dataCapacity | 必須、0〜100の整数 | NOT NULL、0〜100 | OK/NG | |
| 5 | discountCode | 任意、英数字8文字 | NULL許可、CHAR(8) | OK/NG | |
| ... | | | | | |
```

特にチェックすべき観点:
- 最大文字数がFE/BEで一致しているか
- 必須/任意がFE/BEで一致しているか
- 数値範囲がFE/BEで一致しているか

### Step 4｜型ガード ↔ ランタイム安全性チェック

型ガード関数が、対応する型のすべてのフィールドを正しくチェックしているかを確認する。

```
| # | 型ガード関数 | 対象型 | チェック対象フィールド数 | 実際のチェック数 | 漏れ | 備考 |
|----|------------|--------|---------------------|---------------|------|------|
| 1 | isPlan | Plan | 5 | 5 | なし | |
| 2 | isEstimate | Estimate | 8 | 7 | あり | discountApplied未チェック |
| 3 | isOption | Option | 4 | 4 | なし | |
| 4 | isPlanListResponse | Plan[] | 配列+要素 | 配列+要素 | なし | isPlansを利用 |
| ... | | | | | | |
```

## 判定基準

- Step 1: 全APIスキーマフィールドとFE型が一致していればPass
- Step 2: 全コンポーネントのProps/Emitsが型定義と一致していればPass
- Step 3: 全バリデーションルールがバックエンド制約と一致していればPass
- Step 4: 全型ガードが対象型の全フィールドをチェックしていればPass
- いずれかのStepでNGがあれば、設計書を修正してから次のPhaseへ進む
