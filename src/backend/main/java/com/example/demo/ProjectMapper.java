package com.example.demo;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * 案件のデータアクセスを担当するMapperインターフェース
 */
@Mapper
public interface ProjectMapper {

    /**
     * 全件取得（作成日時降順）
     */
    List<Project> selectAll();

    /**
     * ID指定取得
     */
    Project selectById(Long id);

    /**
     * 新規作成
     */
    void insert(Project project);

    /**
     * 更新
     */
    void update(Project project);

    /**
     * ID指定削除
     */
    void deleteById(Long id);
}
