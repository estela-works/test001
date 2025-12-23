[← 目次に戻る](./README.md)

# インデックス・パフォーマンス・セキュリティ・デバッグ

## 5. インデックス利用

### 5.1 利用インデックス

| クエリID | 使用インデックス | 備考 |
|---------|-----------------|------|
| selectById | PRIMARY (ID) | WHERE句でID検索 |
| deleteById | PRIMARY (ID) | WHERE句でID検索 |

### 5.2 フルスキャンとなるクエリ

| クエリID | 理由 | 影響 |
|---------|------|------|
| selectAll | 全件取得 | 件数が少ないため許容 |
| selectByCompleted | COMPLETEDにインデックスなし | 件数が少ないため許容 |
| deleteAll | 全件削除 | 意図的な全件操作 |
| count | COUNT(*) | 件数が少ないため許容 |
| countByCompleted | COMPLETEDにインデックスなし | 件数が少ないため許容 |

---

## 6. パフォーマンス考慮

### 6.1 想定データ量

| テーブル | 想定レコード数 | 備考 |
|---------|---------------|------|
| TODO | 〜100件 | 個人利用想定 |

### 6.2 注意事項

| クエリID | 注意点 | 対策 |
|---------|--------|------|
| deleteAll | 全件削除 | 確認ダイアログでユーザー確認 |

### 6.3 将来の最適化

データ量が増加した場合（1000件以上）、以下の対応を検討。

| 対策 | 内容 |
|------|------|
| インデックス追加 | COMPLETED, CREATED_AT にインデックス |
| ページネーション | selectAllにLIMIT/OFFSET追加 |

---

## 7. セキュリティ

### 7.1 SQLインジェクション対策

| 対策 | 内容 |
|------|------|
| パラメータバインディング | #{param} 形式を使用 |
| PreparedStatement | MyBatisが内部で使用 |

**悪い例（使用禁止）**:
```sql
-- ${param} は文字列連結のため危険
SELECT * FROM TODO WHERE TITLE = '${title}'
```

**良い例（採用）**:
```sql
-- #{param} はパラメータバインディングで安全
SELECT * FROM TODO WHERE TITLE = #{title}
```

---

## 8. デバッグ設定

### 8.1 SQL出力設定

`application.properties`で発行SQLをログ出力可能。

```properties
# MyBatis SQL出力
logging.level.com.example.demo.TodoMapper=DEBUG

# または詳細なログ
logging.level.org.mybatis=DEBUG
```

### 8.2 ログ出力例

```
DEBUG c.e.demo.TodoMapper.selectAll - ==>  Preparing: SELECT ID, TITLE, DESCRIPTION, COMPLETED, CREATED_AT FROM TODO ORDER BY CREATED_AT ASC
DEBUG c.e.demo.TodoMapper.selectAll - ==> Parameters:
DEBUG c.e.demo.TodoMapper.selectAll - <==      Total: 3
```

---

[← 目次に戻る](./README.md)
