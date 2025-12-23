package com.example.demo.template;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * {Entity}Mapperの単体テストクラス（テンプレート）
 *
 * <p>このファイルをコピーして、{Entity}を実際のエンティティ名に置換して使用してください。</p>
 *
 * <h2>使い方</h2>
 * <ol>
 *   <li>このファイルをコピーして {Entity}MapperTest.java にリネーム</li>
 *   <li>{Entity} を実際のエンティティ名（例: User, Todo, Project）に置換</li>
 *   <li>{entity} を小文字のエンティティ名に置換</li>
 *   <li>{ENTITY} を大文字のエンティティ略称（例: USR, TODO, PRJ）に置換</li>
 *   <li>テストデータの初期化処理を実装</li>
 * </ol>
 *
 * <h2>テスト仕様書番号</h2>
 * <p>MT-{ENTITY}-001 ~ MT-{ENTITY}-XXX</p>
 *
 * <h2>テスト対象メソッド</h2>
 * <ul>
 *   <li>selectAll() - 全件取得</li>
 *   <li>selectById(Long) - ID指定取得</li>
 *   <li>insert({Entity}) - 挿入</li>
 *   <li>update({Entity}) - 更新</li>
 *   <li>deleteById(Long) - 削除</li>
 *   <li>deleteAll() - 全件削除</li>
 *   <li>count() - 件数取得</li>
 * </ul>
 *
 * <h2>注意事項</h2>
 * <p>@MybatisTestは軽量なテストコンテキストを使用します。
 * MyBatis関連のコンポーネントのみがロードされるため、
 * Service層のテストよりも高速に実行されます。</p>
 *
 * @author テンプレート
 * @since 1.0.0
 * @see {Entity}Mapper
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@DisplayName("{Entity}Mapper 単体テスト")
class MapperTestTemplate {

    // TODO: テスト対象のMapperをインジェクション
    // @Autowired
    // private {Entity}Mapper {entity}Mapper;

    // 関連するMapperが必要な場合はインジェクション
    // @Autowired
    // private RelatedMapper relatedMapper;

    /**
     * 各テスト実行前のセットアップ
     *
     * <p>テストデータの初期化を行います。</p>
     * <p>@MybatisTestではトランザクションが自動的にロールバックされます。</p>
     */
    @BeforeEach
    void setUp() {
        // TODO: テストデータの初期化処理を実装
        // 例:
        // {entity}Mapper.deleteAll();
        //
        // {Entity} entity1 = new {Entity}("テストデータ1", "説明1");
        // {entity}Mapper.insert(entity1);
        //
        // {Entity} entity2 = new {Entity}("テストデータ2", "説明2");
        // {entity}Mapper.insert(entity2);
        //
        // {Entity} entity3 = new {Entity}("テストデータ3", "説明3");
        // {entity}Mapper.insert(entity3);
    }

    // ========================================
    // selectAll() テスト
    // ========================================
    @Nested
    @DisplayName("selectAll()")
    class SelectAllTest {

        /**
         * MT-{ENTITY}-001: 全件取得の正常系テスト
         *
         * <p>前提条件: テストデータが存在する</p>
         * <p>期待結果: 全データがリストで返却される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-001: データありで全件取得できる")
        void selectAll_WhenDataExists_ReturnsAll() {
            // TODO: 実装例
            // List<{Entity}> result = {entity}Mapper.selectAll();
            //
            // assertThat(result).hasSize(3);
            // assertThat(result).extracting({Entity}::getName)
            //     .containsExactlyInAnyOrder("テストデータ1", "テストデータ2", "テストデータ3");
        }

        /**
         * MT-{ENTITY}-002: ソート順確認テスト
         *
         * <p>前提条件: 複数データが存在する</p>
         * <p>期待結果: 作成日時順でソートされている</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-002: 作成日時順でソートされている")
        void selectAll_ReturnsSortedByCreatedAt() {
            // TODO: 実装例
            // List<{Entity}> result = {entity}Mapper.selectAll();
            //
            // for (int i = 0; i < result.size() - 1; i++) {
            //     assertThat(result.get(i).getCreatedAt())
            //         .isBeforeOrEqualTo(result.get(i + 1).getCreatedAt());
            // }
        }

        /**
         * MT-{ENTITY}-003: データ0件時のテスト
         *
         * <p>前提条件: データが存在しない</p>
         * <p>期待結果: 空リストが返却される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-003: データなしで空リストが返却される")
        void selectAll_WhenEmpty_ReturnsEmptyList() {
            // TODO: 実装例
            // {entity}Mapper.deleteAll();
            //
            // List<{Entity}> result = {entity}Mapper.selectAll();
            //
            // assertThat(result).isEmpty();
        }
    }

    // ========================================
    // selectById() テスト
    // ========================================
    @Nested
    @DisplayName("selectById()")
    class SelectByIdTest {

        /**
         * MT-{ENTITY}-004: 存在するIDでの取得テスト
         *
         * <p>前提条件: 指定IDのデータが存在する</p>
         * <p>期待結果: 該当データが返却される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-004: 存在するIDで取得できる")
        void selectById_WhenExists_ReturnsEntity() {
            // TODO: 実装例
            // List<{Entity}> all = {entity}Mapper.selectAll();
            // Long existingId = all.get(0).getId();
            //
            // {Entity} result = {entity}Mapper.selectById(existingId);
            //
            // assertThat(result).isNotNull();
            // assertThat(result.getId()).isEqualTo(existingId);
            // assertThat(result.getName()).isEqualTo("テストデータ1");
        }

        /**
         * MT-{ENTITY}-005: 存在しないIDでの取得テスト
         *
         * <p>前提条件: 指定IDのデータが存在しない</p>
         * <p>期待結果: nullが返却される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-005: 存在しないIDでnullが返却される")
        void selectById_WhenNotExists_ReturnsNull() {
            // TODO: 実装例
            // {Entity} result = {entity}Mapper.selectById(999L);
            //
            // assertThat(result).isNull();
        }
    }

    // ========================================
    // selectByXxx() テスト（条件付き検索）
    // ========================================
    @Nested
    @DisplayName("selectByXxx() 条件付き検索")
    class SelectByConditionTest {

        /**
         * MT-{ENTITY}-006: 条件付き検索テスト
         *
         * <p>前提条件: 条件に一致するデータが存在する</p>
         * <p>期待結果: 条件に一致するデータのみ返却される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-006: 条件指定で該当データのみ取得できる")
        void selectByCondition_WhenMatch_ReturnsFiltered() {
            // TODO: 実装例（例: completed=true で完了済みのみ取得）
            // // 1件を完了に
            // List<{Entity}> all = {entity}Mapper.selectAll();
            // {Entity} entity = all.get(0);
            // entity.setCompleted(true);
            // {entity}Mapper.update(entity);
            //
            // List<{Entity}> result = {entity}Mapper.selectByCompleted(true);
            //
            // assertThat(result).hasSize(1);
            // assertThat(result).allMatch({Entity}::isCompleted);
        }

        /**
         * MT-{ENTITY}-007: 条件に一致するデータがない場合
         *
         * <p>前提条件: 条件に一致するデータが存在しない</p>
         * <p>期待結果: 空リストが返却される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-007: 条件に一致するデータがなければ空リスト")
        void selectByCondition_WhenNoMatch_ReturnsEmptyList() {
            // TODO: 実装例
            // // 初期状態では全て未完了
            // List<{Entity}> result = {entity}Mapper.selectByCompleted(true);
            //
            // assertThat(result).isEmpty();
        }
    }

    // ========================================
    // insert() テスト
    // ========================================
    @Nested
    @DisplayName("insert()")
    class InsertTest {

        /**
         * MT-{ENTITY}-008: 正常挿入テスト
         *
         * <p>前提条件: 有効なエンティティ</p>
         * <p>期待結果: IDが自動採番され、データが保存される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-008: 正常挿入でIDが自動採番される")
        void insert_WhenValid_AssignsAutoGeneratedId() {
            // TODO: 実装例
            // {Entity} newEntity = new {Entity}("新規データ", "説明");
            //
            // {entity}Mapper.insert(newEntity);
            //
            // assertThat(newEntity.getId()).isNotNull();
            //
            // // DBから取得して確認
            // {Entity} saved = {entity}Mapper.selectById(newEntity.getId());
            // assertThat(saved).isNotNull();
            // assertThat(saved.getName()).isEqualTo("新規データ");
            // assertThat(saved.getCreatedAt()).isNotNull();
        }

        /**
         * MT-{ENTITY}-009: NULL許容フィールドがnullでも挿入できるテスト
         *
         * <p>前提条件: NULL許容フィールドがnull</p>
         * <p>期待結果: 正常に挿入される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-009: NULL許容フィールドがnullでも挿入できる")
        void insert_WhenOptionalFieldNull_InsertsSuccessfully() {
            // TODO: 実装例
            // {Entity} newEntity = new {Entity}("タスク", null);  // descriptionがnull
            //
            // {entity}Mapper.insert(newEntity);
            //
            // assertThat(newEntity.getId()).isNotNull();
            // {Entity} saved = {entity}Mapper.selectById(newEntity.getId());
            // assertThat(saved.getDescription()).isNull();
        }

        /**
         * MT-{ENTITY}-010: 連続挿入テスト
         *
         * <p>前提条件: 複数のエンティティを連続挿入</p>
         * <p>期待結果: IDが連番で採番される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-010: 連続挿入でIDが連番になる")
        void insert_WhenMultiple_AssignsSequentialIds() {
            // TODO: 実装例
            // {Entity} entity1 = new {Entity}("データ4", "説明");
            // {Entity} entity2 = new {Entity}("データ5", "説明");
            //
            // {entity}Mapper.insert(entity1);
            // {entity}Mapper.insert(entity2);
            //
            // assertThat(entity1.getId()).isNotNull();
            // assertThat(entity2.getId()).isNotNull();
            // assertThat(entity2.getId()).isGreaterThan(entity1.getId());
        }
    }

    // ========================================
    // update() テスト
    // ========================================
    @Nested
    @DisplayName("update()")
    class UpdateTest {

        /**
         * MT-{ENTITY}-011: 正常更新テスト
         *
         * <p>前提条件: 指定IDのデータが存在し、有効な更新データ</p>
         * <p>期待結果: データが更新される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-011: 既存データの更新が正常に行われる")
        void update_WhenExists_UpdatesSuccessfully() {
            // TODO: 実装例
            // List<{Entity}> all = {entity}Mapper.selectAll();
            // {Entity} entity = all.get(0);
            // Long id = entity.getId();
            //
            // entity.setName("更新後");
            // entity.setDescription("更新説明");
            //
            // {entity}Mapper.update(entity);
            //
            // {Entity} updated = {entity}Mapper.selectById(id);
            // assertThat(updated.getName()).isEqualTo("更新後");
            // assertThat(updated.getDescription()).isEqualTo("更新説明");
        }

        /**
         * MT-{ENTITY}-012: 存在しないIDでの更新テスト
         *
         * <p>前提条件: 指定IDのデータが存在しない</p>
         * <p>期待結果: 影響なし（例外なし、件数変化なし）</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-012: 存在しないIDで更新しても影響なし")
        void update_WhenNotExists_NoEffect() {
            // TODO: 実装例
            // int originalCount = {entity}Mapper.count();
            //
            // {Entity} nonExistent = new {Entity}();
            // nonExistent.setId(999L);
            // nonExistent.setName("存在しない");
            //
            // // 例外が発生しないことを確認
            // {entity}Mapper.update(nonExistent);
            //
            // // 件数に変化がないことを確認
            // assertThat({entity}Mapper.count()).isEqualTo(originalCount);
        }

        /**
         * MT-{ENTITY}-013: 全フィールド更新テスト
         *
         * <p>前提条件: 指定IDのデータが存在する</p>
         * <p>期待結果: 全フィールドが正しく更新される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-013: 全フィールドが正しく更新される")
        void update_UpdatesAllFields() {
            // TODO: 実装例
            // List<{Entity}> all = {entity}Mapper.selectAll();
            // {Entity} entity = all.get(0);
            // Long id = entity.getId();
            // var originalCreatedAt = entity.getCreatedAt();
            //
            // entity.setName("新名前");
            // entity.setDescription("新説明");
            // entity.setCompleted(true);
            //
            // {entity}Mapper.update(entity);
            //
            // {Entity} updated = {entity}Mapper.selectById(id);
            // assertThat(updated.getName()).isEqualTo("新名前");
            // assertThat(updated.getDescription()).isEqualTo("新説明");
            // assertThat(updated.isCompleted()).isTrue();
            // // createdAtは変更されないことを確認
            // assertThat(updated.getCreatedAt()).isEqualTo(originalCreatedAt);
        }
    }

    // ========================================
    // deleteById() テスト
    // ========================================
    @Nested
    @DisplayName("deleteById()")
    class DeleteByIdTest {

        /**
         * MT-{ENTITY}-014: 正常削除テスト
         *
         * <p>前提条件: 指定IDのデータが存在する</p>
         * <p>期待結果: データが削除される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-014: 既存データの削除が正常に行われる")
        void deleteById_WhenExists_DeletesSuccessfully() {
            // TODO: 実装例
            // List<{Entity}> all = {entity}Mapper.selectAll();
            // Long existingId = all.get(0).getId();
            // int originalCount = {entity}Mapper.count();
            //
            // {entity}Mapper.deleteById(existingId);
            //
            // assertThat({entity}Mapper.count()).isEqualTo(originalCount - 1);
            // assertThat({entity}Mapper.selectById(existingId)).isNull();
        }

        /**
         * MT-{ENTITY}-015: 存在しないIDでの削除テスト
         *
         * <p>前提条件: 指定IDのデータが存在しない</p>
         * <p>期待結果: 影響なし（例外なし、件数変化なし）</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-015: 存在しないIDで削除しても影響なし")
        void deleteById_WhenNotExists_NoEffect() {
            // TODO: 実装例
            // int originalCount = {entity}Mapper.count();
            //
            // {entity}Mapper.deleteById(999L);
            //
            // assertThat({entity}Mapper.count()).isEqualTo(originalCount);
        }
    }

    // ========================================
    // deleteAll() テスト
    // ========================================
    @Nested
    @DisplayName("deleteAll()")
    class DeleteAllTest {

        /**
         * MT-{ENTITY}-016: 全件削除テスト
         *
         * <p>前提条件: データが存在する</p>
         * <p>期待結果: 全データが削除される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-016: 全件削除で全レコードが削除される")
        void deleteAll_DeletesAllRecords() {
            // TODO: 実装例
            // assertThat({entity}Mapper.count()).isEqualTo(3);
            //
            // {entity}Mapper.deleteAll();
            //
            // assertThat({entity}Mapper.count()).isZero();
            // assertThat({entity}Mapper.selectAll()).isEmpty();
        }

        /**
         * MT-{ENTITY}-017: 空の状態で全件削除テスト
         *
         * <p>前提条件: データが存在しない</p>
         * <p>期待結果: エラーなく実行される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-017: 空の状態で全件削除してもエラーにならない")
        void deleteAll_WhenEmpty_NoError() {
            // TODO: 実装例
            // {entity}Mapper.deleteAll();
            // assertThat({entity}Mapper.count()).isZero();
            //
            // // 再度実行してもエラーにならない
            // {entity}Mapper.deleteAll();
            //
            // assertThat({entity}Mapper.count()).isZero();
        }
    }

    // ========================================
    // count() テスト
    // ========================================
    @Nested
    @DisplayName("count()")
    class CountTest {

        /**
         * MT-{ENTITY}-018: 件数取得テスト
         *
         * <p>前提条件: テストデータが存在する</p>
         * <p>期待結果: 正確な件数が返却される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-018: 件数取得で正確な件数が返却される")
        void count_ReturnsCorrectCount() {
            // TODO: 実装例
            // assertThat({entity}Mapper.count()).isEqualTo(3);
            //
            // {entity}Mapper.insert(new {Entity}("追加", "説明"));
            //
            // assertThat({entity}Mapper.count()).isEqualTo(4);
        }

        /**
         * MT-{ENTITY}-019: 0件時の件数取得テスト
         *
         * <p>前提条件: データが存在しない</p>
         * <p>期待結果: 0が返却される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-019: 0件時に0が返却される")
        void count_WhenEmpty_ReturnsZero() {
            // TODO: 実装例
            // {entity}Mapper.deleteAll();
            //
            // assertThat({entity}Mapper.count()).isZero();
        }
    }

    // ========================================
    // countByXxx() テスト（条件付き件数取得）
    // ========================================
    @Nested
    @DisplayName("countByXxx() 条件付き件数取得")
    class CountByConditionTest {

        /**
         * MT-{ENTITY}-020: 条件付き件数取得テスト
         *
         * <p>前提条件: 条件に一致するデータが存在する</p>
         * <p>期待結果: 条件に一致するデータの件数が返却される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-020: 条件指定で該当件数が取得できる")
        void countByCondition_ReturnsCorrectCount() {
            // TODO: 実装例（例: completed=true の件数取得）
            // // 初期状態では完了0件
            // assertThat({entity}Mapper.countByCompleted(true)).isZero();
            //
            // // 2件を完了に
            // List<{Entity}> all = {entity}Mapper.selectAll();
            // {Entity} entity1 = all.get(0);
            // entity1.setCompleted(true);
            // {entity}Mapper.update(entity1);
            //
            // {Entity} entity2 = all.get(1);
            // entity2.setCompleted(true);
            // {entity}Mapper.update(entity2);
            //
            // assertThat({entity}Mapper.countByCompleted(true)).isEqualTo(2);
            // assertThat({entity}Mapper.countByCompleted(false)).isEqualTo(1);
        }
    }

    // ========================================
    // 関連テーブルとのJOINテスト
    // ========================================
    @Nested
    @DisplayName("関連テーブルとのJOIN")
    class JoinTest {

        /**
         * MT-{ENTITY}-021: 関連データの取得テスト
         *
         * <p>前提条件: 関連データが設定されている</p>
         * <p>期待結果: 関連データも含めて取得される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-021: 関連データが取得できる")
        void selectWithRelation_ReturnsRelatedData() {
            // TODO: 実装例（例: 担当者情報の取得）
            // // ユーザーを取得
            // List<User> users = userMapper.selectAll();
            // assertThat(users).isNotEmpty();
            // User user = users.get(0);
            //
            // // 担当者付きエンティティを作成
            // {Entity} entity = new {Entity}("担当者ありデータ", "説明");
            // entity.setAssigneeId(user.getId());
            // {entity}Mapper.insert(entity);
            //
            // // 取得して確認
            // {Entity} saved = {entity}Mapper.selectById(entity.getId());
            // assertThat(saved.getAssigneeId()).isEqualTo(user.getId());
            // assertThat(saved.getAssigneeName()).isEqualTo(user.getName());
        }

        /**
         * MT-{ENTITY}-022: 関連データがnullの場合のテスト
         *
         * <p>前提条件: 関連データが設定されていない</p>
         * <p>期待結果: 関連フィールドがnullで取得される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-022: 関連データ未設定でnullが返却される")
        void selectWithRelation_WhenNoRelation_ReturnsNull() {
            // TODO: 実装例
            // {Entity} entity = new {Entity}("担当者なしデータ", "説明");
            // {entity}Mapper.insert(entity);
            //
            // {Entity} saved = {entity}Mapper.selectById(entity.getId());
            // assertThat(saved.getAssigneeId()).isNull();
            // assertThat(saved.getAssigneeName()).isNull();
        }
    }

    // ========================================
    // 外部キー制約のテスト
    // ========================================
    @Nested
    @DisplayName("外部キー制約")
    class ForeignKeyTest {

        /**
         * MT-{ENTITY}-023: 有効な外部キーでの挿入テスト
         *
         * <p>前提条件: 参照先のデータが存在する</p>
         * <p>期待結果: 正常に挿入される</p>
         */
        @Test
        @DisplayName("MT-{ENTITY}-023: 有効な外部キーで挿入できる")
        void insert_WithValidForeignKey_Succeeds() {
            // TODO: 実装例（例: projectIdの設定）
            // Project project = new Project("テストプロジェクト", "説明");
            // projectMapper.insert(project);
            //
            // {Entity} entity = new {Entity}("プロジェクト紐付きデータ", "説明");
            // entity.setProjectId(project.getId());
            // {entity}Mapper.insert(entity);
            //
            // assertThat(entity.getId()).isNotNull();
            // {Entity} saved = {entity}Mapper.selectById(entity.getId());
            // assertThat(saved.getProjectId()).isEqualTo(project.getId());
        }
    }
}
