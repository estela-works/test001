# H2データベースのデータが永続化されない

## 症状

ToDoリストにデータを保存しても、アプリケーションを再起動するとデータが消えてしまう。

## 原因

以下の2つの設定が組み合わさり、起動のたびにデータがリセットされていた:

1. **application.properties**: `spring.sql.init.mode=always`
   - 毎回起動時にSQLスクリプト（schema.sql、data.sql）を実行する設定

2. **schema.sql**: `DROP TABLE IF EXISTS ...`
   - テーブルを削除してから再作成するSQL

この組み合わせにより、アプリ起動時に「テーブル削除→テーブル作成→初期データ投入」が毎回実行され、保存したデータが全て消えていた。

## 解決策

`application.properties` の設定を変更:

```properties
# 変更前
spring.sql.init.mode=always

# 変更後
spring.sql.init.mode=never
```

### spring.sql.init.mode の値

| 値 | 動作 | 用途 |
|----|------|------|
| `always` | 毎起動時にschema.sql/data.sqlを実行 | 開発時のリセット用 |
| `embedded` | 組み込みDB（H2等）の場合のみ初回実行 | テスト環境 |
| `never` | 実行しない | 本番用・データ永続化 |

## 再発防止

- 本番環境や永続化が必要な環境では `spring.sql.init.mode=never` を使用する
- 開発環境で意図的にリセットしたい場合のみ `always` を使用する
- schema.sqlに`DROP TABLE`を含める場合は、init.modeの設定に注意する

## 関連ファイル

- `src/main/resources/application.properties`
- `src/main/resources/schema.sql`
- `src/main/resources/data.sql`

## 発生日

2024-12-24
