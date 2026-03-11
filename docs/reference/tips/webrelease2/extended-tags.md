# WebRelease2 拡張タグ

## 拡張タグ一覧

テンプレートの展開内で使用できる制御構文。HTMLタグ形式で記述する。

| タグ | 用途 |
|------|------|
| `wr-if` / `wr-then` / `wr-else` | 条件分岐 |
| `wr-for` | ループ（繰り返し） |
| `wr-variable` | 変数の宣言 |
| `wr-append` | 変数への値追加 |
| `wr-break` | ループの中断 |
| `wr-return` | メソッドからの返却 |
| `wr-conditional` / `wr-cond` | 多分岐条件（switch的） |

---

## wr-if / wr-then / wr-else（条件分岐）

### パターン1：シンプル形式

```html
<wr-if condition="条件式">
  条件が真のときの出力
</wr-if>
```

### パターン2：明示的then

```html
<wr-if condition="条件式">
  <wr-then>条件が真のときの出力</wr-then>
</wr-if>
```

### パターン3：then/else分岐

```html
<wr-if condition="条件式">
  <wr-then>条件が真のときの出力</wr-then>
  <wr-else>条件が偽のときの出力</wr-else>
</wr-if>
```

### condition属性の記述ルール

- `%` 記号は不要（自動的に式として評価される）
- 文字列は二重引用符で囲む：`"東京都"`
- 文字列内の引用符はバックスラッシュでエスケープ：`\"`
- 論理演算子（`&&`, `||`）や比較演算子が使用可能
- 関数呼び出し可能：`isNull()`, `isNotNull()`, `isNumber()` 等

### 使用例

```html
<!-- 要素値の比較 -->
<wr-if condition="都道府県==\"東京都\"">
  %都道府県%
</wr-if>

<!-- Nullチェック付き条件分岐 -->
<wr-if condition="isNotNull(メールアドレス)">
  <wr-then><a href="mailto:%メールアドレス%">%メールアドレス%</a></wr-then>
  <wr-else>未設定</wr-else>
</wr-if>

<!-- 複合条件（数値判定＋計算） -->
<wr-if condition="isNumber(価格) && (価格 * 1.1 > 1000)">
  高額商品
</wr-if>
```

---

## wr-for（ループ）

### 3つの構文形式

#### 1. リスト型（list=）

配列に対してループ処理を実行。

```html
<wr-for list="目次要素名" variable="item" count="cnt">
  %cnt%. %item%
</wr-for>
```

対応データ：目次、繰り返し要素、wr-variableで宣言した変数、その他のリスト。

#### 2. 文字列型（string=）

文字列の各文字に対してループ処理。

```html
<wr-for string="テキスト要素名" variable="char" index="idx">
  [%idx%] %char%
</wr-for>
```

#### 3. 回数型（times=）

指定回数だけ繰り返し。

```html
<wr-for times="10" variable="i" count="cnt">
  項目 %cnt%
</wr-for>
```

### 属性一覧

| 属性 | 必須 | 説明 |
|------|------|------|
| `list` / `string` / `times` | ○（いずれか1つ） | ループ対象の指定 |
| `variable` | ○ | ループ内で使用する変数名 |
| `count` | - | 1始まりのループカウンタ |
| `index` | - | 0始まりのループカウンタ |

**制限**: `list`, `string`, `times` を同時に2つ以上指定することは不可。

---

## wr-variable（変数宣言）

変数を宣言する。宣言される変数は**配列型**。

```html
<wr-variable name="変数名" />
```

---

## wr-append（変数への値追加）

`wr-variable` で定義した変数に値を追加する。

```html
<wr-variable name="myList" />
<wr-append variable="myList" value="追加する値" />
```

---

## wr-break（ループ中断）

wr-forループを途中で中断する。

```html
<wr-for list="一覧" variable="item" count="cnt">
  <wr-if condition="cnt > 5">
    <wr-break />
  </wr-if>
  %item%
</wr-for>
```

---

## wr-return（メソッドからの返却）

メソッド内から値を返却する。

```html
<wr-return value="返却値" />
```

---

## wr-conditional / wr-cond（多分岐条件）

switch文のような多分岐条件。複数の条件を順に評価し、最初に成立した条件の内容を出力する。

```html
<wr-conditional>
  <wr-cond condition="条件1">条件1が真のときの出力</wr-cond>
  <wr-cond condition="条件2">条件2が真のときの出力</wr-cond>
  <wr-cond>デフォルト出力（条件なし）</wr-cond>
</wr-conditional>
```
