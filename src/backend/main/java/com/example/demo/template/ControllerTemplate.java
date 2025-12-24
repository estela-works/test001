package com.example.demo.template;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * {Entity}のREST APIコントローラー（テンプレート）
 *
 * <p>このファイルをコピーして、{Entity}を実際のエンティティ名に置換して使用してください。</p>
 *
 * <h2>使い方</h2>
 * <ol>
 *   <li>このファイルをコピーして {Entity}Controller.java にリネーム</li>
 *   <li>{Entity} を実際のエンティティ名（例: User, Todo, Project）に置換</li>
 *   <li>{entity} を小文字のエンティティ名に置換</li>
 *   <li>{entities} をAPIパス名（複数形）に置換</li>
 *   <li>必要に応じてエンドポイントを追加・削除</li>
 * </ol>
 *
 * <h2>APIエンドポイント</h2>
 * <ul>
 *   <li>GET /api/{entities} - 一覧取得</li>
 *   <li>GET /api/{entities}/{id} - ID指定取得</li>
 *   <li>POST /api/{entities} - 新規作成</li>
 *   <li>PUT /api/{entities}/{id} - 更新</li>
 *   <li>DELETE /api/{entities}/{id} - 削除</li>
 *   <li>GET /api/{entities}/stats - 統計情報取得</li>
 * </ul>
 *
 * @author テンプレート
 * @since 1.0.0
 * @see {Entity}Service
 */
// TODO: コメントを解除して使用
// @RestController
// @RequestMapping("/api/{entities}")
public class ControllerTemplate {

    // TODO: 実際のServiceクラスに置換
    // @Autowired
    // private {Entity}Service {entity}Service;

    // ========================================
    // GET /api/{entities} - 一覧取得
    // ========================================

    /**
     * すべての{Entity}を取得
     *
     * <p>クエリパラメータによるフィルタリングに対応。</p>
     *
     * @return {Entity}のリスト
     *
     * @apiNote GET /api/{entities}
     * @apiNote GET /api/{entities}?status=active
     */
    // @GetMapping
    // public ResponseEntity<List<{Entity}>> getAll{Entity}s(
    //         @RequestParam(required = false) String status) {
    //     List<{Entity}> {entity}s;
    //
    //     if (status != null) {
    //         {entity}s = {entity}Service.get{Entity}sByStatus(status);
    //     } else {
    //         {entity}s = {entity}Service.getAll{Entity}s();
    //     }
    //     return ResponseEntity.ok({entity}s);
    // }

    // ========================================
    // GET /api/{entities}/{id} - ID指定取得
    // ========================================

    /**
     * 指定されたIDの{Entity}を取得
     *
     * @param id {Entity}のID
     * @return {Entity}（見つからない場合は404）
     *
     * @apiNote GET /api/{entities}/1
     */
    // @GetMapping("/{id}")
    // public ResponseEntity<{Entity}> get{Entity}ById(@PathVariable Long id) {
    //     {Entity} {entity} = {entity}Service.get{Entity}ById(id);
    //     if ({entity} != null) {
    //         return ResponseEntity.ok({entity});
    //     } else {
    //         return ResponseEntity.notFound().build();
    //     }
    // }

    // ========================================
    // POST /api/{entities} - 新規作成
    // ========================================

    /**
     * 新しい{Entity}を作成
     *
     * <p>バリデーションエラーの場合は400を返却。</p>
     *
     * @param {entity} 作成する{Entity}
     * @return 作成された{Entity}（201 Created）
     *
     * @apiNote POST /api/{entities}
     * @apiNote Content-Type: application/json
     */
    // @PostMapping
    // public ResponseEntity<{Entity}> create{Entity}(@RequestBody {Entity} {entity}) {
    //     // バリデーション
    //     if ({entity}.getName() == null || {entity}.getName().trim().isEmpty()) {
    //         return ResponseEntity.badRequest().build();
    //     }
    //
    //     try {
    //         {Entity} created = {entity}Service.create{Entity}({entity});
    //         return ResponseEntity.status(HttpStatus.CREATED).body(created);
    //     } catch (IllegalArgumentException e) {
    //         return ResponseEntity.badRequest().build();
    //     }
    // }

    // ========================================
    // PUT /api/{entities}/{id} - 更新
    // ========================================

    /**
     * {Entity}を更新
     *
     * <p>存在しないIDの場合は404を返却。</p>
     *
     * @param id 更新する{Entity}のID
     * @param {entity} 更新内容
     * @return 更新された{Entity}
     *
     * @apiNote PUT /api/{entities}/1
     * @apiNote Content-Type: application/json
     */
    // @PutMapping("/{id}")
    // public ResponseEntity<{Entity}> update{Entity}(
    //         @PathVariable Long id,
    //         @RequestBody {Entity} {entity}) {
    //     // バリデーション
    //     if ({entity}.getName() == null || {entity}.getName().trim().isEmpty()) {
    //         return ResponseEntity.badRequest().build();
    //     }
    //
    //     try {
    //         {Entity} updated = {entity}Service.update{Entity}(id, {entity});
    //         if (updated != null) {
    //             return ResponseEntity.ok(updated);
    //         } else {
    //             return ResponseEntity.notFound().build();
    //         }
    //     } catch (IllegalArgumentException e) {
    //         return ResponseEntity.badRequest().build();
    //     }
    // }

    // ========================================
    // PATCH /api/{entities}/{id}/xxx - 部分更新
    // ========================================

    /**
     * {Entity}の特定フィールドを更新（部分更新）
     *
     * <p>状態切り替えなど、特定のフィールドのみ更新する場合に使用。</p>
     *
     * @param id {Entity}のID
     * @return 更新された{Entity}
     *
     * @apiNote PATCH /api/{entities}/1/toggle
     */
    // @PatchMapping("/{id}/toggle")
    // public ResponseEntity<{Entity}> toggle{Entity}Status(@PathVariable Long id) {
    //     {Entity} updated = {entity}Service.toggleStatus(id);
    //     if (updated != null) {
    //         return ResponseEntity.ok(updated);
    //     } else {
    //         return ResponseEntity.notFound().build();
    //     }
    // }

    // ========================================
    // DELETE /api/{entities}/{id} - 削除
    // ========================================

    /**
     * {Entity}を削除
     *
     * <p>存在しないIDの場合は404を返却。</p>
     *
     * @param id 削除する{Entity}のID
     * @return 204 No Content
     *
     * @apiNote DELETE /api/{entities}/1
     */
    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> delete{Entity}(@PathVariable Long id) {
    //     {Entity} deleted = {entity}Service.delete{Entity}(id);
    //     if (deleted != null) {
    //         return ResponseEntity.noContent().build();
    //     } else {
    //         return ResponseEntity.notFound().build();
    //     }
    // }

    // ========================================
    // DELETE /api/{entities} - 全件削除
    // ========================================

    /**
     * すべての{Entity}を削除
     *
     * <p>管理者向け機能。注意して使用すること。</p>
     *
     * @return 204 No Content
     *
     * @apiNote DELETE /api/{entities}
     */
    // @DeleteMapping
    // public ResponseEntity<Void> deleteAll{Entity}s() {
    //     {entity}Service.deleteAll{Entity}s();
    //     return ResponseEntity.noContent().build();
    // }

    // ========================================
    // GET /api/{entities}/stats - 統計情報
    // ========================================

    /**
     * 統計情報を取得
     *
     * <p>ダッシュボード表示用の集計データ。</p>
     *
     * @return 統計情報のMap
     *
     * @apiNote GET /api/{entities}/stats
     */
    // @GetMapping("/stats")
    // public ResponseEntity<Map<String, Integer>> getStats() {
    //     Map<String, Integer> stats = new HashMap<>();
    //     stats.put("total", {entity}Service.getTotalCount());
    //     // 必要に応じて追加
    //     // stats.put("active", {entity}Service.getActiveCount());
    //     // stats.put("inactive", {entity}Service.getInactiveCount());
    //     return ResponseEntity.ok(stats);
    // }

    // ========================================
    // エラーハンドリング例
    // ========================================

    /**
     * ビジネスロジック例外のハンドリング例
     *
     * <p>Controller内で例外をキャッチして適切なHTTPステータスを返却する例。</p>
     */
    // 例: 重複エラー時は409 Conflict
    // try {
    //     {Entity} created = {entity}Service.create{Entity}({entity});
    //     return ResponseEntity.status(HttpStatus.CREATED).body(created);
    // } catch (DuplicateException e) {
    //     return ResponseEntity.status(HttpStatus.CONFLICT).build();
    // } catch (IllegalArgumentException e) {
    //     return ResponseEntity.badRequest().build();
    // }
}
