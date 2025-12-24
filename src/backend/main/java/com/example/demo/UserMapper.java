package com.example.demo;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * ユーザーデータアクセス用のMyBatis Mapperインターフェース
 */
@Mapper
public interface UserMapper {

    /**
     * 全ユーザーを作成日時昇順で取得
     * @return ユーザーリスト
     */
    List<User> selectAll();

    /**
     * ID指定でユーザーを取得
     * @param id ユーザーID
     * @return ユーザー（見つからない場合はnull）
     */
    User selectById(Long id);

    /**
     * 名前指定でユーザーを取得
     * @param name ユーザー名
     * @return ユーザー（見つからない場合はnull）
     */
    User selectByName(String name);

    /**
     * ユーザーを新規作成
     * @param user 作成するユーザー
     */
    void insert(User user);

    /**
     * ID指定でユーザーを削除
     * @param id ユーザーID
     */
    void deleteById(Long id);

    /**
     * ユーザー件数を取得
     * @return ユーザー件数
     */
    int count();
}
