package com.example.demo;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * UserServiceの統合テストクラス
 * テスト仕様書: TC-S01 ~ TC-S07
 *
 * @see UserService
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("UserService 統合テスト")
class UserServiceTest {

    @Autowired
    private UserService userService;

    // ========================================
    // getAllUsers() テスト
    // ========================================
    @Nested
    @DisplayName("getAllUsers()")
    class GetAllUsersTest {

        @Test
        @DisplayName("TC-S01: 全ユーザー一覧が取得できる")
        void getAllUsers_ReturnsAllUsers() {
            List<User> users = userService.getAllUsers();

            assertThat(users).isNotEmpty();
            // 初期データ（山田太郎、鈴木花子、佐藤一郎）が含まれることを確認
            assertThat(users).extracting(User::getName)
                .contains("山田太郎", "鈴木花子", "佐藤一郎");
        }
    }

    // ========================================
    // getUserById() テスト
    // ========================================
    @Nested
    @DisplayName("getUserById()")
    class GetUserByIdTest {

        @Test
        @DisplayName("TC-S02: 存在するIDでユーザーが取得できる")
        void getUserById_WhenExists_ReturnsUser() {
            List<User> allUsers = userService.getAllUsers();
            Long existingId = allUsers.get(0).getId();

            User user = userService.getUserById(existingId);

            assertThat(user).isNotNull();
            assertThat(user.getId()).isEqualTo(existingId);
        }

        @Test
        @DisplayName("TC-S02b: 存在しないIDでnullが返却される")
        void getUserById_WhenNotExists_ReturnsNull() {
            User user = userService.getUserById(999L);

            assertThat(user).isNull();
        }
    }

    // ========================================
    // createUser() テスト
    // ========================================
    @Nested
    @DisplayName("createUser()")
    class CreateUserTest {

        @Test
        @DisplayName("TC-S03: ユーザーが正常に作成される")
        void createUser_WhenValid_CreatesUser() {
            User newUser = new User();
            newUser.setName("新規ユーザー");

            User created = userService.createUser(newUser);

            assertThat(created.getId()).isNotNull();
            assertThat(created.getName()).isEqualTo("新規ユーザー");
            assertThat(created.getCreatedAt()).isNotNull();
        }
    }

    // ========================================
    // existsByName() テスト
    // ========================================
    @Nested
    @DisplayName("existsByName()")
    class ExistsByNameTest {

        @Test
        @DisplayName("TC-S04: 存在するユーザー名でtrueが返却される")
        void existsByName_WhenExists_ReturnsTrue() {
            boolean result = userService.existsByName("山田太郎");

            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("TC-S05: 存在しないユーザー名でfalseが返却される")
        void existsByName_WhenNotExists_ReturnsFalse() {
            boolean result = userService.existsByName("存在しないユーザー");

            assertThat(result).isFalse();
        }
    }

    // ========================================
    // deleteUser() テスト
    // ========================================
    @Nested
    @DisplayName("deleteUser()")
    class DeleteUserTest {

        @Test
        @DisplayName("TC-S06: 存在するユーザーが正常に削除される")
        void deleteUser_WhenExists_DeletesUser() {
            // 新規ユーザーを追加して削除テスト
            User newUser = new User();
            newUser.setName("削除テストユーザー");
            User created = userService.createUser(newUser);
            Long userId = created.getId();

            User deleted = userService.deleteUser(userId);

            assertThat(deleted).isNotNull();
            assertThat(deleted.getId()).isEqualTo(userId);
            assertThat(userService.getUserById(userId)).isNull();
        }

        @Test
        @DisplayName("TC-S07: 存在しないIDでnullが返却される")
        void deleteUser_WhenNotExists_ReturnsNull() {
            User result = userService.deleteUser(999L);

            assertThat(result).isNull();
        }
    }
}
