# DB構造

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 1. 概要

| 項目 | 内容 |
|------|------|
| データストア種別 | インメモリ |
| 実装 | ConcurrentHashMap<Long, Todo> |
| 永続化 | なし（再起動でリセット） |
| 最終更新日 | 2025-12-22 |

---

## 2. データ構造一覧

### 2.1 Todo

**格納先**: TodoService.todos (ConcurrentHashMap<Long, Todo>)

| フィールド | 型 | NULL | 説明 | 備考 |
|-----------|-----|------|------|------|
| id | Long | NO | 主キー（一意識別子） | AtomicLongで自動採番 |
| title | String | NO | タイトル | 必須項目 |
| description | String | YES | 説明 | 任意項目 |
| completed | boolean | NO | 完了フラグ | デフォルト: false |
| createdAt | LocalDateTime | NO | 作成日時 | 自動設定 |

---

## 3. 初期データ

アプリケーション起動時に3件のサンプルデータが作成される:

| ID | title | description | completed | createdAt |
|----|-------|-------------|-----------|-----------|
| 1 | Spring Bootの学習 | Spring Bootアプリケーションの基本を理解する | false | 起動時刻 |
| 2 | ToDoリストの実装 | REST APIとフロントエンドを実装する | false | 起動時刻 |
| 3 | プロジェクトのテスト | 作成したアプリケーションの動作確認 | false | 起動時刻 |

---

## 4. データ管理仕様

### 4.1 ID採番

| 項目 | 内容 |
|------|------|
| 実装 | AtomicLong |
| 開始値 | 1 |
| 採番方式 | getAndIncrement()（連番） |
| 再利用 | なし（削除されたIDは再利用しない） |

### 4.2 スレッドセーフティ

| 対策 | 説明 |
|------|------|
| ConcurrentHashMap | 複数スレッドからの同時アクセスに対応 |
| AtomicLong | ID採番の原子性を保証 |

---

## 5. 将来の拡張（参考）

RDB移行時のテーブル設計案:

```sql
CREATE TABLE todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 更新履歴

| 日付 | 変更内容 | 関連案件 |
|------|----------|----------|
| 2025-12-22 | 初版作成（インメモリ構造） | 初期構築 |
