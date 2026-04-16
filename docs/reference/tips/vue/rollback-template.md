# ロールバック判断テンプレート

この文書は、`Vue 3.2.45 -> 3.5.13` 移行時の汎用ロールバック雛形です。プロジェクト固有の承認者、監視閾値、切り戻し責任者、作業時間帯、通知先は各プロジェクト配下の runbook に記載してください。

## ロールバック判断基準

以下のいずれかを満たしたら、継続改修ではなくロールバック判断を行います。

- 本番障害が発生し、業務影響が高い
- `npm run build` または `vue-tsc --noEmit` が短時間で復旧しない
- hydration mismatch や recursive update が主要導線で継続発生する
- 主要依存ライブラリの incompatibility が判明し、当日解消できない
- 監視指標の悪化が許容閾値を超えた

## package.json / lockfile の `git restore` 手順

### npm の例

```sh
git restore package.json package-lock.json
```

### pnpm の例

```sh
git restore package.json pnpm-lock.yaml
```

### Yarn の例

```sh
git restore package.json yarn.lock
```

### 追加で戻す候補

```sh
git restore vite.config.ts vite.config.js tsconfig.json tsconfig.app.json eslint.config.js .eslintrc.cjs
```

## 推奨ロールバック手順

1. 失敗内容を issue / チャット / runbook に記録する
2. `git restore` で `package.json` と lockfile を戻す
3. 必要なら `vite.config.*`, `tsconfig*.json`, `eslint` 設定も戻す
4. 依存を再インストールする
5. `vue-tsc --noEmit` と `npm run build` を再確認する
6. ロールバック後の動作確認を行う

## フローチャート

```text
[アップグレード後に障害発生]
          |
          v
[型検査/ビルド失敗か?] -- いいえ --> [ランタイム障害か?]
          |                               |
         はい                              はい
          |                               |
          v                               v
[1時間以内に復旧可能か?]          [回避策で業務継続可能か?]
          |                               |
      いいえ                              いいえ
          |                               |
          v                               v
      [ロールバック] ----------------> [ロールバック]
          |
         はい
          |
          v
   [修正を継続して検証]
```

## ロールバック後の確認項目

- `node_modules` 再インストール後に lockfile と整合しているか
- `vue-tsc --noEmit` が通るか
- `npm run build` が通るか
- 主要導線の手動確認が終わったか
- 失敗原因を次回計画へ反映したか

## 記録テンプレート

```md
- 発生日:
- 対象バージョン:
- 症状:
- 影響範囲:
- 暫定回避の可否:
- ロールバック実施有無:
- 根本原因:
- 次回アップグレード条件:
```

## 注意

- プロジェクト固有の DB マイグレーション、環境変数、CDN キャッシュ、SSR 配備手順はこの文書に書かない
- それらは必ず各プロジェクト配下の運用資料へ分離する
