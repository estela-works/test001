# リソース

設定ファイル・静的リソースを格納するフォルダ。

## ファイル構成

```
resources/
├── application.properties   # アプリケーション設定
├── schema.sql               # DDL（テーブル定義）
├── data.sql                 # 初期データ
├── static/                  # 静的HTMLファイル
│   ├── todos.html           # ToDo管理画面
│   ├── projects.html        # 案件管理画面
│   └── users.html           # 担当者管理画面
└── mapper/                  # MyBatis Mapper XML
    ├── TodoMapper.xml
    ├── TodoCommentMapper.xml
    ├── ProjectMapper.xml
    ├── UserMapper.xml
    └── template/            # Mapperテンプレート
```

## 主要ファイル

| ファイル | 説明 |
|---------|------|
| application.properties | DB接続設定、MyBatis設定、スキーマ初期化設定など |
| schema.sql | DDL（テーブル定義）※ `spring.sql.init.mode` 設定による |
| data.sql | 初期データ ※ `spring.sql.init.mode` 設定による |

## スキーマ初期化設定

`application.properties` の `spring.sql.init.mode` でschema.sql/data.sqlの実行を制御:

| 値 | 動作 |
|----|------|
| `always` | 毎起動時に実行（データがリセットされる） |
| `embedded` | 組み込みDB（H2等）の場合のみ実行 |
| `never` | 実行しない（データ永続化） |

詳細: [H2データ永続化トラブルシューティング](../../../docs/reference/troubleshooting/h2-data-not-persisted.md)
