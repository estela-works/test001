# Javaソースコード

Spring Bootアプリケーションのソースコード。

## パッケージ構成

```
com/example/demo/
├── SimpleSpringApplication.java  # アプリケーションエントリポイント
├── HelloController.java          # ルートコントローラ
├── *Controller.java              # REST APIコントローラ
├── *Service.java                 # ビジネスロジック
├── *Mapper.java                  # MyBatis Mapper
├── *.java                        # エンティティ
└── template/                     # コードテンプレート
```

## レイヤー構成

| レイヤー | 役割 | ファイル例 |
|---------|------|-----------|
| Controller | REST API | TodoController.java |
| Service | ビジネスロジック | TodoService.java |
| Mapper | データアクセス | TodoMapper.java |
| Entity | データ構造 | Todo.java |

## 関連ドキュメント

- [実装ガイド](../../../docs/implementation/IMPLEMENTATION_GUIDE.md)
- [コードテンプレート](com/example/demo/template/)
