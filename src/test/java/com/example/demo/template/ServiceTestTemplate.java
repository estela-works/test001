package com.example.demo.template;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;

/**
 * {Entity}Serviceの統合テストクラス（テンプレート）
 *
 * <p>このファイルをコピーして、{Entity}を実際のエンティティ名に置換して使用してください。</p>
 *
 * <h2>使い方</h2>
 * <ol>
 *   <li>このファイルをコピーして {Entity}ServiceTest.java にリネーム</li>
 *   <li>{Entity} を実際のエンティティ名（例: User, Todo, Project）に置換</li>
 *   <li>{entity} を小文字のエンティティ名に置換</li>
 *   <li>{ENTITY} を大文字のエンティティ略称（例: USR, TODO, PRJ）に置換</li>
 *   <li>テストデータの初期化処理を実装</li>
 * </ol>
 *
 * <h2>テスト仕様書番号</h2>
 * <p>ST-{ENTITY}-001 ~ ST-{ENTITY}-XXX</p>
 *
 * <h2>テスト対象メソッド</h2>
 * <ul>
 *   <li>getAll{Entity}s() - 一覧取得</li>
 *   <li>get{Entity}ById(Long) - ID指定取得</li>
 *   <li>create{Entity}({Entity}) - 新規作成</li>
 *   <li>update{Entity}(Long, {Entity}) - 更新</li>
 *   <li>delete{Entity}(Long) - 削除</li>
 * </ul>
 *
 * @author テンプレート
 * @since 1.0.0
 * @see {Entity}Service
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("{Entity}Service 統合テスト")
class ServiceTestTemplate {

    // TODO: テスト対象のServiceをインジェクション
    // @Autowired
    // private {Entity}Service {entity}Service;

    // TODO: テストデータ操作用のMapperをインジェクション
    // @Autowired
    // private {Entity}Mapper {entity}Mapper;

    // ========================================
    // モック使用時（単体テスト形式）
    // Mapperをモックに置き換える場合はコメントを解除
    // ========================================
    // @MockBean
    // private {Entity}Mapper {entity}Mapper;
    //
    // private {Entity}Service {entity}Service;

    /**
     * 各テスト実行前のセットアップ
     *
     * <p>テストデータの初期化を行います。</p>
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

        // モック使用時のセットアップ
        // {entity}Service = new {Entity}Service({entity}Mapper);
    }

    // ========================================
    // getAll{Entity}s() テスト
    // ========================================
    @Nested
    @DisplayName("getAll{Entity}s()")
    class GetAllTest {

        /**
         * ST-{ENTITY}-001: 一覧取得の正常系テスト
         *
         * <p>前提条件: テストデータが存在する</p>
         * <p>期待結果: 全データがリストで返却される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-001: データありで全件取得できる")
        void getAll_WhenDataExists_ReturnsAll() {
            // TODO: 実装例
            // List<{Entity}> result = {entity}Service.getAll{Entity}s();
            //
            // assertThat(result).isNotEmpty();
            // assertThat(result).hasSize(2);
            // assertThat(result).extracting({Entity}::getName)
            //     .containsExactlyInAnyOrder("テストデータ1", "テストデータ2");
        }

        /**
         * ST-{ENTITY}-002: データ0件時のテスト
         *
         * <p>前提条件: データが存在しない</p>
         * <p>期待結果: 空リストが返却される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-002: データなしで空リストが返却される")
        void getAll_WhenEmpty_ReturnsEmptyList() {
            // TODO: 全データ削除
            // {entity}Mapper.deleteAll();
            //
            // List<{Entity}> result = {entity}Service.getAll{Entity}s();
            //
            // assertThat(result).isEmpty();
        }

        /**
         * ST-{ENTITY}-003: ソート順確認テスト
         *
         * <p>前提条件: 複数データが存在する</p>
         * <p>期待結果: 作成日時順でソートされている</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-003: 作成日時順でソートされている")
        void getAll_ReturnsSortedByCreatedAt() {
            // TODO: 実装例
            // List<{Entity}> result = {entity}Service.getAll{Entity}s();
            //
            // for (int i = 0; i < result.size() - 1; i++) {
            //     assertThat(result.get(i).getCreatedAt())
            //         .isBeforeOrEqualTo(result.get(i + 1).getCreatedAt());
            // }
        }
    }

    // ========================================
    // get{Entity}ById() テスト
    // ========================================
    @Nested
    @DisplayName("get{Entity}ById()")
    class GetByIdTest {

        /**
         * ST-{ENTITY}-004: 存在するIDでの取得テスト
         *
         * <p>前提条件: 指定IDのデータが存在する</p>
         * <p>期待結果: 該当データが返却される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-004: 存在するIDで取得できる")
        void getById_WhenExists_ReturnsEntity() {
            // TODO: 実装例
            // List<{Entity}> all = {entity}Service.getAll{Entity}s();
            // Long existingId = all.get(0).getId();
            //
            // {Entity} result = {entity}Service.get{Entity}ById(existingId);
            //
            // assertThat(result).isNotNull();
            // assertThat(result.getId()).isEqualTo(existingId);
        }

        /**
         * ST-{ENTITY}-005: 存在しないIDでの取得テスト
         *
         * <p>前提条件: 指定IDのデータが存在しない</p>
         * <p>期待結果: nullが返却される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-005: 存在しないIDでnullが返却される")
        void getById_WhenNotExists_ReturnsNull() {
            // TODO: 実装例
            // {Entity} result = {entity}Service.get{Entity}ById(999L);
            //
            // assertThat(result).isNull();
        }
    }

    // ========================================
    // create{Entity}() テスト
    // ========================================
    @Nested
    @DisplayName("create{Entity}()")
    class CreateTest {

        /**
         * ST-{ENTITY}-006: 正常作成テスト
         *
         * <p>前提条件: 有効なエンティティ</p>
         * <p>期待結果: IDが自動採番され、データが保存される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-006: 正常作成でIDが付与される")
        void create_WhenValid_AssignsId() {
            // TODO: 実装例
            // {Entity} newEntity = new {Entity}();
            // newEntity.setName("新規データ");
            //
            // {Entity} created = {entity}Service.create{Entity}(newEntity);
            //
            // assertThat(created.getId()).isNotNull();
            // assertThat(created.getName()).isEqualTo("新規データ");
            // assertThat(created.getCreatedAt()).isNotNull();
        }

        /**
         * ST-{ENTITY}-007: 連続作成テスト
         *
         * <p>前提条件: 複数のエンティティを作成</p>
         * <p>期待結果: IDが連番で採番される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-007: 連続作成でIDが連番になる")
        void create_WhenMultiple_AssignsSequentialIds() {
            // TODO: 実装例
            // {Entity} entity1 = {entity}Service.create{Entity}(new {Entity}("データ1", "説明"));
            // {Entity} entity2 = {entity}Service.create{Entity}(new {Entity}("データ2", "説明"));
            //
            // assertThat(entity2.getId()).isGreaterThan(entity1.getId());
        }
    }

    // ========================================
    // update{Entity}() テスト
    // ========================================
    @Nested
    @DisplayName("update{Entity}()")
    class UpdateTest {

        /**
         * ST-{ENTITY}-008: 正常更新テスト
         *
         * <p>前提条件: 指定IDのデータが存在し、有効な更新データ</p>
         * <p>期待結果: データが更新される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-008: 存在するIDで更新できる")
        void update_WhenExists_UpdatesSuccessfully() {
            // TODO: 実装例
            // List<{Entity}> all = {entity}Service.getAll{Entity}s();
            // Long existingId = all.get(0).getId();
            //
            // {Entity} updateData = new {Entity}();
            // updateData.setName("更新後");
            //
            // {Entity} result = {entity}Service.update{Entity}(existingId, updateData);
            //
            // assertThat(result).isNotNull();
            // assertThat(result.getName()).isEqualTo("更新後");
        }

        /**
         * ST-{ENTITY}-009: 存在しないIDでの更新テスト
         *
         * <p>前提条件: 指定IDのデータが存在しない</p>
         * <p>期待結果: nullが返却される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-009: 存在しないIDでnullが返却される")
        void update_WhenNotExists_ReturnsNull() {
            // TODO: 実装例
            // {Entity} updateData = new {Entity}();
            // updateData.setName("更新");
            //
            // {Entity} result = {entity}Service.update{Entity}(999L, updateData);
            //
            // assertThat(result).isNull();
        }

        /**
         * ST-{ENTITY}-010: 更新時にcreatedAtが変更されないテスト
         *
         * <p>前提条件: 指定IDのデータが存在する</p>
         * <p>期待結果: createdAtは変更されない</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-010: 更新してもcreatedAtは変更されない")
        void update_DoesNotChangeCreatedAt() {
            // TODO: 実装例
            // List<{Entity}> all = {entity}Service.getAll{Entity}s();
            // {Entity} original = all.get(0);
            // var originalCreatedAt = original.getCreatedAt();
            //
            // {Entity} updateData = new {Entity}();
            // updateData.setName("更新");
            // {entity}Service.update{Entity}(original.getId(), updateData);
            //
            // {Entity} updated = {entity}Service.get{Entity}ById(original.getId());
            // assertThat(updated.getCreatedAt()).isEqualTo(originalCreatedAt);
        }
    }

    // ========================================
    // delete{Entity}() テスト
    // ========================================
    @Nested
    @DisplayName("delete{Entity}()")
    class DeleteTest {

        /**
         * ST-{ENTITY}-011: 正常削除テスト
         *
         * <p>前提条件: 指定IDのデータが存在する</p>
         * <p>期待結果: データが削除される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-011: 存在するIDで削除できる")
        void delete_WhenExists_DeletesSuccessfully() {
            // TODO: 実装例
            // List<{Entity}> all = {entity}Service.getAll{Entity}s();
            // int originalCount = all.size();
            // Long existingId = all.get(0).getId();
            //
            // {Entity} deleted = {entity}Service.delete{Entity}(existingId);
            //
            // assertThat(deleted).isNotNull();
            // assertThat({entity}Service.get{Entity}ById(existingId)).isNull();
            // assertThat({entity}Service.getAll{Entity}s()).hasSize(originalCount - 1);
        }

        /**
         * ST-{ENTITY}-012: 存在しないIDでの削除テスト
         *
         * <p>前提条件: 指定IDのデータが存在しない</p>
         * <p>期待結果: nullが返却される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-012: 存在しないIDでnullが返却される")
        void delete_WhenNotExists_ReturnsNull() {
            // TODO: 実装例
            // {Entity} result = {entity}Service.delete{Entity}(999L);
            //
            // assertThat(result).isNull();
        }
    }

    // ========================================
    // 例外テスト（エラーハンドリング）
    // ========================================
    @Nested
    @DisplayName("例外処理テスト")
    class ExceptionTest {

        /**
         * ST-{ENTITY}-X001: 不正な入力での例外テスト
         *
         * <p>前提条件: 不正な入力値</p>
         * <p>期待結果: IllegalArgumentExceptionがスローされる</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-X001: 不正入力でIllegalArgumentExceptionがスローされる")
        void method_WhenInvalidInput_ThrowsIllegalArgumentException() {
            // TODO: 実装例
            // {Entity} invalidEntity = new {Entity}();
            // invalidEntity.setName(null);  // 不正な入力
            //
            // assertThatThrownBy(() -> {entity}Service.create{Entity}(invalidEntity))
            //     .isInstanceOf(IllegalArgumentException.class)
            //     .hasMessageContaining("必須項目");
        }

        /**
         * ST-{ENTITY}-X002: ビジネスルール違反での例外テスト
         *
         * <p>前提条件: ビジネスルールに違反する入力</p>
         * <p>期待結果: 適切な例外がスローされる</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-X002: ビジネスルール違反で例外がスローされる")
        void method_WhenBusinessRuleViolated_ThrowsException() {
            // TODO: 実装例（日付バリデーションなど）
            // {Entity} entity = new {Entity}();
            // entity.setName("テスト");
            // entity.setStartDate(LocalDate.of(2025, 1, 31));
            // entity.setEndDate(LocalDate.of(2025, 1, 1));  // 開始日より前
            //
            // assertThatThrownBy(() -> {entity}Service.create{Entity}(entity))
            //     .isInstanceOf(IllegalArgumentException.class)
            //     .hasMessageContaining("終了日は開始日以降");
        }

        /**
         * ST-{ENTITY}-X003: nullパラメータでの例外テスト
         *
         * <p>前提条件: nullパラメータ</p>
         * <p>期待結果: NullPointerExceptionまたはIllegalArgumentExceptionがスローされる</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-X003: nullパラメータで例外がスローされる")
        void method_WhenNullParameter_ThrowsException() {
            // TODO: 実装例
            // assertThatThrownBy(() -> {entity}Service.create{Entity}(null))
            //     .isInstanceOf(IllegalArgumentException.class);
        }
    }

    // ========================================
    // モック使用例（単体テスト形式）
    // ========================================
    @Nested
    @DisplayName("モック使用テスト例")
    class MockExampleTest {

        /**
         * ST-{ENTITY}-M001: Mapperが正しく呼び出されることを検証
         *
         * <p>MockBeanを使用してMapperの動作をモックする例です。</p>
         * <p>使用する場合は、クラス上部の@MockBeanのコメントを解除してください。</p>
         */
        // @Test
        // @DisplayName("ST-{ENTITY}-M001: Mapperが正しく呼び出される")
        // void method_CallsMapperCorrectly() {
        //     // Arrange: モックの戻り値を設定
        //     {Entity} mockEntity = new {Entity}();
        //     mockEntity.setId(1L);
        //     mockEntity.setName("モックデータ");
        //     when({entity}Mapper.selectById(1L)).thenReturn(mockEntity);
        //
        //     // Act
        //     {Entity} result = {entity}Service.get{Entity}ById(1L);
        //
        //     // Assert
        //     assertThat(result.getName()).isEqualTo("モックデータ");
        //
        //     // Verify: Mapperが1回呼び出されたことを確認
        //     verify({entity}Mapper, times(1)).selectById(1L);
        // }

        /**
         * ST-{ENTITY}-M002: Mapperが例外をスローする場合のテスト
         *
         * <p>Mapperがエラーを返す場合のService層の動作をテストする例です。</p>
         */
        // @Test
        // @DisplayName("ST-{ENTITY}-M002: Mapper例外時の動作確認")
        // void method_WhenMapperThrows_HandlesException() {
        //     // Arrange: Mapperが例外をスローするよう設定
        //     when({entity}Mapper.selectById(any()))
        //         .thenThrow(new RuntimeException("DB接続エラー"));
        //
        //     // Act & Assert
        //     assertThatThrownBy(() -> {entity}Service.get{Entity}ById(1L))
        //         .isInstanceOf(RuntimeException.class)
        //         .hasMessageContaining("DB接続エラー");
        //
        //     // Verify
        //     verify({entity}Mapper, times(1)).selectById(1L);
        // }

        /**
         * ST-{ENTITY}-M003: Mapperの呼び出し順序を検証
         *
         * <p>複数のMapperメソッドが正しい順序で呼び出されることを検証する例です。</p>
         */
        // @Test
        // @DisplayName("ST-{ENTITY}-M003: Mapperの呼び出し順序を検証")
        // void method_CallsMapperInCorrectOrder() {
        //     // Arrange
        //     {Entity} mockEntity = new {Entity}();
        //     mockEntity.setId(1L);
        //     when({entity}Mapper.selectById(1L)).thenReturn(mockEntity);
        //
        //     // Act
        //     {entity}Service.delete{Entity}(1L);
        //
        //     // Verify: 呼び出し順序を検証
        //     InOrder inOrder = inOrder({entity}Mapper);
        //     inOrder.verify({entity}Mapper).selectById(1L);
        //     inOrder.verify({entity}Mapper).deleteById(1L);
        // }
    }

    // ========================================
    // 統計・集計メソッドのテスト例
    // ========================================
    @Nested
    @DisplayName("統計・集計メソッド")
    class StatisticsTest {

        /**
         * ST-{ENTITY}-013: 件数取得テスト
         *
         * <p>前提条件: テストデータが存在する</p>
         * <p>期待結果: 正確な件数が返却される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-013: 件数取得で正確な件数が返却される")
        void getTotalCount_ReturnsCorrectCount() {
            // TODO: 実装例
            // int count = {entity}Service.getTotalCount();
            //
            // assertThat(count).isEqualTo(2);
            //
            // // 追加後
            // {entity}Service.create{Entity}(new {Entity}("追加", "説明"));
            // assertThat({entity}Service.getTotalCount()).isEqualTo(3);
        }
    }

    // ========================================
    // フィルタリング・検索メソッドのテスト例
    // ========================================
    @Nested
    @DisplayName("フィルタリング・検索")
    class FilterTest {

        /**
         * ST-{ENTITY}-014: 条件付き検索テスト
         *
         * <p>前提条件: 条件に一致するデータが存在する</p>
         * <p>期待結果: 条件に一致するデータのみ返却される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-014: 条件指定で該当データのみ取得できる")
        void getByCondition_ReturnsFilteredResults() {
            // TODO: 実装例
            // List<{Entity}> result = {entity}Service.get{Entity}sByStatus("active");
            //
            // assertThat(result).isNotEmpty();
            // assertThat(result).allMatch(e -> "active".equals(e.getStatus()));
        }

        /**
         * ST-{ENTITY}-015: 条件に一致するデータがない場合
         *
         * <p>前提条件: 条件に一致するデータが存在しない</p>
         * <p>期待結果: 空リストが返却される</p>
         */
        @Test
        @DisplayName("ST-{ENTITY}-015: 条件に一致するデータがなければ空リスト")
        void getByCondition_WhenNoMatch_ReturnsEmptyList() {
            // TODO: 実装例
            // List<{Entity}> result = {entity}Service.get{Entity}sByStatus("nonexistent");
            //
            // assertThat(result).isEmpty();
        }
    }
}
