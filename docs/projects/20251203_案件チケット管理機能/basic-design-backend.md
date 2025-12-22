# バックエンド基本設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 案件チケット管理機能 |
| 案件ID | 20251201_案件チケット管理機能 |
| 作成日 | 2025-12-22 |
| 関連要件整理書 | [requirements.md](./requirements.md) |

---

## 1. 概要

### 1.1 本設計書の目的

案件管理機能およびチケット期間設定機能に関するバックエンドの機能・データ・APIの基本設計を定義する。

### 1.2 バックエンドの役割

| 責務 | 説明 |
|------|------|
| データ管理 | 案件・チケットデータの永続化と整合性維持 |
| ビジネスロジック | 日付バリデーション、進捗率計算 |
| API提供 | 案件CRUD API、チケットAPI（期間対応） |
| バリデーション | 入力データの妥当性検証 |

---

## 2. 機能要件

### 2.1 機能一覧

| ID | 機能名 | 概要 | 対応US |
|----|--------|------|--------|
| F-001 | 案件作成 | 新しい案件を作成する | US-001 |
| F-002 | 案件一覧取得 | 登録済み案件を一覧取得する | US-002 |
| F-003 | 案件詳細取得 | 指定IDの案件を取得する | US-002 |
| F-004 | 案件更新 | 案件情報を更新する | - |
| F-005 | 案件削除 | 案件を削除する（配下チケットも削除） | US-007 |
| F-006 | 案件統計取得 | 案件の進捗統計を取得する | US-006 |
| F-007 | 案件別チケット取得 | 指定案件のチケットを取得する | US-003 |
| F-008 | チケット期間設定 | チケットに開始日・終了日を設定する | US-004, US-005 |

---

## 3. データ要件

### 3.1 データ構造

| データ名 | 概要 | 永続化 |
|---------|------|--------|
| Project | 案件情報 | 要（H2 Database） |
| Todo | チケット情報（期間情報追加） | 要（H2 Database） |

### 3.2 エンティティ

#### 3.2.1 Project（新規）

| 属性 | 型 | 必須 | 説明 |
|------|-----|------|------|
| id | Long | 自動 | 一意識別子（主キー） |
| name | String | 必須 | 案件名（1〜100文字） |
| description | String | 任意 | 説明（500文字以内） |
| createdAt | LocalDateTime | 自動 | 作成日時 |

#### 3.2.2 Todo（拡張）

既存属性に加え、以下を追加:

| 属性 | 型 | 必須 | 説明 |
|------|-----|------|------|
| projectId | Long | 任意 | 所属案件ID（外部キー、NULLは未分類） |
| startDate | LocalDate | 任意 | 開始日 |
| dueDate | LocalDate | 任意 | 終了日 |

### 3.3 エンティティ関連図

```
┌──────────────┐          ┌──────────────┐
│   PROJECT    │          │     TODO     │
├──────────────┤          ├──────────────┤
│ ID (PK)      │──1:N────→│ ID (PK)      │
│ NAME         │          │ TITLE        │
│ DESCRIPTION  │          │ DESCRIPTION  │
│ CREATED_AT   │          │ COMPLETED    │
└──────────────┘          │ CREATED_AT   │
                          │ PROJECT_ID(FK)│
                          │ START_DATE   │
                          │ DUE_DATE     │
                          └──────────────┘
```

---

## 4. API要件

### 4.1 エンドポイント一覧

#### 4.1.1 案件API（新規）

| メソッド | パス | 機能 | 対応機能 |
|---------|------|------|----------|
| GET | /api/projects | 案件一覧取得 | F-002 |
| GET | /api/projects/{id} | 案件詳細取得 | F-003 |
| POST | /api/projects | 案件作成 | F-001 |
| PUT | /api/projects/{id} | 案件更新 | F-004 |
| DELETE | /api/projects/{id} | 案件削除 | F-005 |
| GET | /api/projects/{id}/stats | 案件統計取得 | F-006 |

#### 4.1.2 チケットAPI（変更）

| メソッド | パス | 機能 | 変更内容 |
|---------|------|------|---------|
| GET | /api/todos | 全件取得 | projectIdパラメータ追加 |
| GET | /api/todos?projectId={id} | 案件別取得 | 新規パラメータ |
| GET | /api/todos?projectId=none | 未分類取得 | 新規パラメータ |
| POST | /api/todos | 新規作成 | 開始日・終了日・案件ID追加 |
| PUT | /api/todos/{id} | 更新 | 開始日・終了日・案件ID追加 |

### 4.2 レスポンス形式

#### 4.2.1 Project

```json
{
  "id": 1,
  "name": "案件名",
  "description": "案件の説明",
  "createdAt": "2025-12-22T10:00:00"
}
```

#### 4.2.2 Project Stats

```json
{
  "total": 10,
  "completed": 3,
  "pending": 7,
  "progressRate": 30
}
```

#### 4.2.3 Todo（拡張後）

```json
{
  "id": 1,
  "title": "タスク名",
  "description": "説明",
  "completed": false,
  "createdAt": "2025-12-22T10:00:00",
  "projectId": 1,
  "startDate": "2025-01-01",
  "dueDate": "2025-01-15"
}
```

### 4.3 エラーレスポンス

| ステータス | 条件 |
|-----------|------|
| 400 Bad Request | バリデーションエラー（必須項目未入力、日付整合性エラー） |
| 404 Not Found | 指定IDの案件・チケットが存在しない |

---

## 5. ビジネスロジック

### 5.1 バリデーションルール

#### 5.1.1 案件

| 項目 | ルール |
|------|--------|
| name | 必須、1〜100文字 |
| description | 任意、500文字以内 |

#### 5.1.2 チケット（追加分）

| 項目 | ルール |
|------|--------|
| projectId | 任意、存在する案件IDまたはNULL |
| startDate | 任意、日付形式 |
| dueDate | 任意、日付形式、startDate以降 |

### 5.2 案件削除時の処理

| 処理 | 説明 |
|------|------|
| カスケード削除 | 案件削除時、配下の全チケットも削除する |
| トランザクション | 削除処理は1トランザクションで実行 |

### 5.3 進捗率計算

```
progressRate = (completed / total) * 100
```

- total = 0 の場合、progressRate = 0
- 小数点以下は切り捨て

---

## 6. 非機能要件

### 6.1 性能要件

| 項目 | 要件 |
|------|------|
| API応答時間 | 500ms以内 |
| 同時アクセス | 複数リクエストの安全な処理（Spring MVCによる） |

### 6.2 セキュリティ要件

| 項目 | 対応 |
|------|------|
| 認証 | なし（既存踏襲） |
| 入力バリデーション | サーバーサイドで実施 |
| SQLインジェクション | MyBatisのパラメータバインディングで対策 |

---

## 7. アーキテクチャ

### 7.1 レイヤー構成

```
┌─────────────────────────────────────────┐
│           Controller Layer              │
│  ProjectController  │  TodoController   │
├─────────────────────────────────────────┤
│            Service Layer                │
│   ProjectService    │   TodoService     │
├─────────────────────────────────────────┤
│           Mapper Layer                  │
│   ProjectMapper     │   TodoMapper      │
├─────────────────────────────────────────┤
│             H2 Database                 │
│     PROJECT         │     TODO          │
└─────────────────────────────────────────┘
```

### 7.2 クラス構成（新規・変更）

#### 7.2.1 新規クラス

| クラス | パッケージ | 説明 |
|--------|-----------|------|
| Project | model | 案件エンティティ |
| ProjectController | controller | 案件APIコントローラ |
| ProjectService | service | 案件ビジネスロジック |
| ProjectMapper | mapper | 案件データアクセス |

#### 7.2.2 変更クラス

| クラス | 変更内容 |
|--------|---------|
| Todo | projectId, startDate, dueDate フィールド追加 |
| TodoController | projectIdパラメータ対応 |
| TodoService | 案件フィルタリング対応 |
| TodoMapper | 日付・案件ID対応クエリ追加 |

---

## 8. データベース設計

### 8.1 テーブル定義（新規）

#### PROJECT

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| ID | BIGINT | NO | AUTO_INCREMENT | 主キー |
| NAME | VARCHAR(100) | NO | - | 案件名 |
| DESCRIPTION | VARCHAR(500) | YES | NULL | 説明 |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時 |

### 8.2 テーブル変更（TODO）

追加カラム:

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| PROJECT_ID | BIGINT | YES | NULL | 所属案件ID |
| START_DATE | DATE | YES | NULL | 開始日 |
| DUE_DATE | DATE | YES | NULL | 終了日 |

### 8.3 インデックス

| テーブル | インデックス | カラム | 目的 |
|---------|-------------|--------|------|
| TODO | IDX_TODO_PROJECT_ID | PROJECT_ID | 案件別検索の高速化 |

### 8.4 外部キー制約

| テーブル | 制約名 | カラム | 参照先 | 削除時 |
|---------|--------|--------|--------|--------|
| TODO | FK_TODO_PROJECT | PROJECT_ID | PROJECT.ID | CASCADE |

---

## 9. 制約条件

| 項目 | 制約 |
|------|------|
| データ保存 | H2 Database（ファイルモード） |
| トランザクション | Spring @Transactional使用 |
| ORM | MyBatis（既存踏襲） |

---

## 10. ファイル構成

### 10.1 新規ファイル

| ファイル | 説明 |
|---------|------|
| `src/main/java/.../model/Project.java` | 案件エンティティ |
| `src/main/java/.../controller/ProjectController.java` | 案件コントローラ |
| `src/main/java/.../service/ProjectService.java` | 案件サービス |
| `src/main/java/.../mapper/ProjectMapper.java` | 案件マッパー |
| `src/main/resources/mapper/ProjectMapper.xml` | 案件SQLマッピング |

### 10.2 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/main/java/.../model/Todo.java` | フィールド追加 |
| `src/main/java/.../controller/TodoController.java` | パラメータ追加 |
| `src/main/java/.../service/TodoService.java` | フィルタリング対応 |
| `src/main/java/.../mapper/TodoMapper.java` | メソッド追加 |
| `src/main/resources/mapper/TodoMapper.xml` | SQL追加・変更 |
| `src/main/resources/schema.sql` | テーブル定義追加・変更 |
| `src/main/resources/data.sql` | 初期データ変更（任意） |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
