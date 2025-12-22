package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ユーザーの管理を担当するサービスクラス
 */
@Service
public class UserService {

    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * すべてのユーザーを取得
     * @return ユーザーリスト
     */
    public List<User> getAllUsers() {
        return userMapper.selectAll();
    }

    /**
     * IDでユーザーを取得
     * @param id ユーザーID
     * @return ユーザー（見つからない場合はnull）
     */
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }

    /**
     * 新しいユーザーを作成
     * @param user 作成するユーザー
     * @return 作成されたユーザー
     */
    public User createUser(User user) {
        userMapper.insert(user);
        return user;
    }

    /**
     * ユーザーを削除
     * @param id 削除するユーザーID
     * @return 削除されたユーザー（見つからない場合はnull）
     */
    public User deleteUser(Long id) {
        User user = userMapper.selectById(id);
        if (user != null) {
            userMapper.deleteById(id);
            return user;
        }
        return null;
    }

    /**
     * ユーザー名の重複チェック
     * @param name チェックするユーザー名
     * @return 存在する場合はtrue
     */
    public boolean existsByName(String name) {
        return userMapper.selectByName(name) != null;
    }

    /**
     * ユーザー総数を取得
     * @return ユーザー数
     */
    public int getCount() {
        return userMapper.count();
    }
}
