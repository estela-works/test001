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
    ├── ProjectMapper.xml
    ├── UserMapper.xml
    └── template/            # Mapperテンプレート
```

## 主要ファイル

| ファイル | 説明 |
|---------|------|
| application.properties | DB接続設定、MyBatis設定など |
| schema.sql | テーブル定義（起動時に実行） |
| data.sql | 初期データ（起動時に実行） |
