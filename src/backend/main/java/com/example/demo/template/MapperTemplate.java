package com.example.demo.template;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * {Entity}のデータアクセスを担当するMapperインターフェース（テンプレート）
 *
 * <p>このファイルをコピーして、{Entity}を実際のエンティティ名に置換して使用してください。</p>
 *
 * <h2>使い方</h2>
 * <ol>
 *   <li>このファイルをコピーして {Entity}Mapper.java にリネーム</li>
 *   <li>{Entity} を実際のエンティティ名（例: User, Todo, Project）に置換</li>
 *   <li>{entity} を小文字のエンティティ名に置換</li>
 *   <li>{TABLE_NAME} をテーブル名に置換</li>
 *   <li>対応するXMLファイル（MapperTemplate.xml）も作成</li>
 * </ol>
 *
 * <h2>責務</h2>
 * <ul>
 *   <li>SQLの実行</li>
 *   <li>結果のエンティティへのマッピング</li>
 * </ul>
 *
 * <h2>対応XMLファイル</h2>
 * <p>src/main/resources/mapper/{Entity}Mapper.xml</p>
 *
 * @author テンプレート
 * @since 1.0.0
 * @see {Entity}
 * @see {Entity}Service
 */
// TODO: コメントを解除して使用
// @Mapper
public interface MapperTemplate {

    // ========================================
    // 取得系メソッド
    // ========================================

    /**
     * 全件取得（作成日時順）
     *
     * <p>XMLのselect id="selectAll"に対応。</p>
     *
     * @return {Entity}のリスト
     */
    // List<{Entity}> selectAll();

    /**
     * ID指定取得
     *
     * <p>XMLのselect id="selectById"に対応。</p>
     *
     * @param id {Entity}のID
     * @return {Entity}（見つからない場合はnull）
     */
    // {Entity} selectById(Long id);

    /**
     * 条件指定取得
     *
     * <p>XMLのselect id="selectByStatus"に対応。</p>
     *
     * @param status ステータス
     * @return 条件に一致する{Entity}のリスト
     */
    // List<{Entity}> selectByStatus(String status);

    /**
     * 名前指定取得（一意制約用）
     *
     * <p>重複チェック用。</p>
     *
     * @param name 名前
     * @return {Entity}（見つからない場合はnull）
     */
    // {Entity} selectByName(String name);

    // ========================================
    // 作成・更新・削除系メソッド
    // ========================================

    /**
     * 新規作成
     *
     * <p>useGeneratedKeys="true"でIDが自動採番される。</p>
     * <p>XMLのinsert id="insert"に対応。</p>
     *
     * @param {entity} 作成する{Entity}
     */
    // void insert({Entity} {entity});

    /**
     * 更新
     *
     * <p>XMLのupdate id="update"に対応。</p>
     *
     * @param {entity} 更新する{Entity}
     */
    // void update({Entity} {entity});

    /**
     * ID指定削除
     *
     * <p>XMLのdelete id="deleteById"に対応。</p>
     *
     * @param id 削除する{Entity}のID
     */
    // void deleteById(Long id);

    /**
     * 全件削除
     *
     * <p>XMLのdelete id="deleteAll"に対応。</p>
     */
    // void deleteAll();

    // ========================================
    // 件数取得系メソッド
    // ========================================

    /**
     * 件数取得
     *
     * <p>XMLのselect id="count"に対応。</p>
     *
     * @return 件数
     */
    // int count();

    /**
     * 条件別件数取得
     *
     * <p>XMLのselect id="countByStatus"に対応。</p>
     *
     * @param status ステータス
     * @return 条件に一致する件数
     */
    // int countByStatus(String status);

    // ========================================
    // 関連エンティティ用メソッド
    // ========================================

    /**
     * 親ID指定取得
     *
     * <p>外部キーで関連付けられたデータを取得。</p>
     *
     * @param parentId 親エンティティのID
     * @return 関連する{Entity}のリスト
     */
    // List<{Entity}> selectByParentId(Long parentId);

    /**
     * 親ID指定削除
     *
     * <p>カスケード削除用。</p>
     *
     * @param parentId 親エンティティのID
     */
    // void deleteByParentId(Long parentId);

    /**
     * 親ID指定件数取得
     *
     * @param parentId 親エンティティのID
     * @return 件数
     */
    // int countByParentId(Long parentId);
}
