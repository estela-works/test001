package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ユーザー管理用のREST APIコントローラー
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 全ユーザーを取得
     * GET /api/users
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * ID指定でユーザーを取得
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * ユーザーを新規作成
     * POST /api/users
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // バリデーション: 名前が空でないこと
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // バリデーション: 名前が100文字以内であること
        if (user.getName().length() > 100) {
            return ResponseEntity.badRequest().build();
        }

        // 重複チェック
        if (userService.existsByName(user.getName().trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        user.setName(user.getName().trim());
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    /**
     * ユーザーを削除
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User deletedUser = userService.deleteUser(id);
        if (deletedUser != null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
