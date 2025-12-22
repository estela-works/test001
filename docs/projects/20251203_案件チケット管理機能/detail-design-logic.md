# ロジック詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 案件チケット管理機能 |
| 案件ID | 20251201_案件チケット管理機能 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

ビジネスロジック（Service層、Entity）の詳細仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 | 種別 |
|---------|---------------|------|------|
| Entity | Project | 案件データ構造 | 新規 |
| Entity | Todo | チケットデータ構造 | 変更 |
| Service | ProjectService | 案件ビジネスロジック | 新規 |
| Service | TodoService | チケットビジネスロジック | 変更 |

---

## 2. エンティティ設計

### 2.1 Project（新規）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.Project` |
| 種別 | Entity |
| 責務 | 案件データの保持 |

#### フィールド

| フィールド名 | 型 | 概要 | 初期値 |
|-------------|-----|------|--------|
| id | Long | 一意識別子 | null |
| name | String | 案件名（1〜100文字） | null |
| description | String | 説明（500文字以内） | null |
| createdAt | LocalDateTime | 作成日時 | LocalDateTime.now() |

#### コンストラクタ

| シグネチャ | 説明 |
|-----------|------|
| `Project()` | デフォルトコンストラクタ（createdAt自動設定） |
| `Project(String name, String description)` | 名前・説明指定コンストラクタ |

#### メソッド

| メソッド | 説明 |
|---------|------|
| getter/setter | 全フィールド用 |
| toString() | デバッグ用文字列表現 |

---

### 2.2 Todo（変更）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.Todo` |
| 種別 | Entity |
| 変更内容 | 3フィールド追加 |

#### 追加フィールド

| フィールド名 | 型 | 概要 | 初期値 |
|-------------|-----|------|--------|
| projectId | Long | 所属案件ID | null |
| startDate | LocalDate | 開始日 | null |
| dueDate | LocalDate | 終了日 | null |

#### 追加メソッド

| メソッド | 説明 |
|---------|------|
| getProjectId() / setProjectId(Long) | 案件ID getter/setter |
| getStartDate() / setStartDate(LocalDate) | 開始日 getter/setter |
| getDueDate() / setDueDate(LocalDate) | 終了日 getter/setter |

---

## 3. Serviceクラス設計

### 3.1 ProjectService（新規）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.ProjectService` |
| 種別 | Service |
| 責務 | 案件のCRUD操作、統計計算 |
| アノテーション | `@Service` |

#### フィールド

| フィールド名 | 型 | 概要 | 注入方法 |
|-------------|-----|------|---------|
| projectMapper | ProjectMapper | 案件データアクセス | コンストラクタ |
| todoMapper | TodoMapper | チケットデータアクセス | コンストラクタ |

#### メソッド詳細

##### 3.1.1 getAllProjects()

| 項目 | 内容 |
|------|------|
| シグネチャ | `List<Project> getAllProjects()` |
| 概要 | 全案件を作成日時降順で取得 |
| 引数 | なし |
| 戻り値 | 案件リスト |

**処理フロー**:

1. projectMapper.selectAll()を呼び出し
2. 結果を返却

##### 3.1.2 getProjectById(Long id)

| 項目 | 内容 |
|------|------|
| シグネチャ | `Project getProjectById(Long id)` |
| 概要 | ID指定で案件を取得 |
| 引数 | id: 案件ID |
| 戻り値 | 案件（見つからない場合null） |

**処理フロー**:

1. projectMapper.selectById(id)を呼び出し
2. 結果を返却

##### 3.1.3 createProject(Project project)

| 項目 | 内容 |
|------|------|
| シグネチャ | `Project createProject(Project project)` |
| 概要 | 新しい案件を作成 |
| 引数 | project: 作成する案件 |
| 戻り値 | 作成された案件（ID採番済み） |

**処理フロー**:

1. projectMapper.insert(project)を呼び出し
2. 作成されたprojectを返却

##### 3.1.4 updateProject(Long id, Project updatedProject)

| 項目 | 内容 |
|------|------|
| シグネチャ | `Project updateProject(Long id, Project updatedProject)` |
| 概要 | 案件を更新 |
| 引数 | id: 案件ID, updatedProject: 更新内容 |
| 戻り値 | 更新された案件（見つからない場合null） |

**処理フロー**:

1. projectMapper.selectById(id)で既存案件取得
2. 存在しない場合：nullを返却
3. 存在する場合：
   - name, descriptionを更新
   - projectMapper.update(existingProject)
   - 更新後のprojectを返却

##### 3.1.5 deleteProject(Long id)

| 項目 | 内容 |
|------|------|
| シグネチャ | `Project deleteProject(Long id)` |
| 概要 | 案件と配下チケットを削除 |
| 引数 | id: 案件ID |
| 戻り値 | 削除された案件（見つからない場合null） |
| アノテーション | `@Transactional` |

**処理フロー**:

1. projectMapper.selectById(id)で案件取得
2. 存在しない場合：nullを返却
3. 存在する場合：
   - todoMapper.deleteByProjectId(id)で配下チケット削除
   - projectMapper.deleteById(id)で案件削除
   - 削除したprojectを返却

##### 3.1.6 getProjectStats(Long id)

| 項目 | 内容 |
|------|------|
| シグネチャ | `Map<String, Integer> getProjectStats(Long id)` |
| 概要 | 案件の統計情報を取得 |
| 引数 | id: 案件ID |
| 戻り値 | 統計情報（total, completed, pending, progressRate） |

**処理フロー**:

1. todoMapper.countByProjectId(id)で総数取得
2. todoMapper.countByProjectIdAndCompleted(id, true)で完了数取得
3. pending = total - completed
4. progressRate = (total > 0) ? (completed * 100 / total) : 0
5. Mapに格納して返却

---

### 3.2 TodoService（変更）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.TodoService` |
| 変更内容 | 案件フィルタ、日付処理の追加 |

#### 追加・変更メソッド

##### 3.2.1 getTodosByProjectId(Long projectId)（新規）

| 項目 | 内容 |
|------|------|
| シグネチャ | `List<Todo> getTodosByProjectId(Long projectId)` |
| 概要 | 案件IDでチケットをフィルタ取得 |
| 引数 | projectId: 案件ID（nullの場合は未分類） |
| 戻り値 | チケットリスト |

**処理フロー**:

1. projectId == null の場合：todoMapper.selectByProjectIdIsNull()
2. それ以外：todoMapper.selectByProjectId(projectId)
3. 結果を返却

##### 3.2.2 createTodo(Todo todo)（変更）

**変更内容**:

- projectId, startDate, dueDateの設定処理を追加
- 日付バリデーション呼び出しを追加

**処理フロー（変更後）**:

1. 日付バリデーション（validateDateRange）
2. todoMapper.insert(todo)を呼び出し
3. 作成されたtodoを返却

##### 3.2.3 updateTodo(Long id, Todo updatedTodo)（変更）

**変更内容**:

- projectId, startDate, dueDateの更新処理を追加

**処理フロー（変更後）**:

1. 既存チケット取得
2. 存在しない場合：nullを返却
3. 日付バリデーション
4. 各フィールドを更新（projectId, startDate, dueDate含む）
5. todoMapper.update(existingTodo)
6. 更新後のtodoを返却

##### 3.2.4 validateDateRange(LocalDate startDate, LocalDate dueDate)（新規）

| 項目 | 内容 |
|------|------|
| シグネチャ | `void validateDateRange(LocalDate startDate, LocalDate dueDate)` |
| 概要 | 開始日・終了日の整合性をチェック |
| 引数 | startDate: 開始日, dueDate: 終了日 |
| 例外 | IllegalArgumentException（不正な場合） |

**処理フロー**:

1. 両方nullの場合：正常終了
2. 片方のみnullの場合：正常終了
3. 両方設定の場合：
   - dueDate.isBefore(startDate)ならIllegalArgumentExceptionをスロー

---

## 4. ビジネスルール

### 4.1 ルール一覧

| ルールID | ルール内容 | 適用箇所 |
|---------|-----------|---------|
| BR-001 | 案件削除時は配下チケットも削除する | ProjectService.deleteProject() |
| BR-002 | 終了日は開始日以降でなければならない | TodoService.validateDateRange() |
| BR-003 | 進捗率は(完了数/総数)*100で計算（小数点以下切り捨て） | ProjectService.getProjectStats() |
| BR-004 | チケット0件の場合、進捗率は0% | ProjectService.getProjectStats() |
| BR-005 | 既存チケットのprojectIdはnullとして扱う | マイグレーション |

---

## 5. 初期データ

既存のTODOテーブルデータは維持し、新規追加カラムはNULLのまま（案件未設定）とする。

PROJECTテーブルの初期データは投入しない（ユーザーが作成）。

---

## 6. トランザクション管理

| 操作 | アノテーション | 理由 |
|------|---------------|------|
| ProjectService.deleteProject() | @Transactional | 案件と配下チケットの整合性を保つため |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
