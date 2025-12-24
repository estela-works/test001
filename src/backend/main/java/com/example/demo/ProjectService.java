package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 案件の管理を担当するサービスクラス
 */
@Service
public class ProjectService {

    private final ProjectMapper projectMapper;
    private final TodoMapper todoMapper;

    @Autowired
    public ProjectService(ProjectMapper projectMapper, TodoMapper todoMapper) {
        this.projectMapper = projectMapper;
        this.todoMapper = todoMapper;
    }

    /**
     * すべての案件を取得
     * @return 案件リスト（作成日時降順）
     */
    public List<Project> getAllProjects() {
        return projectMapper.selectAll();
    }

    /**
     * IDで案件を取得
     * @param id 案件ID
     * @return 案件（見つからない場合はnull）
     */
    public Project getProjectById(Long id) {
        return projectMapper.selectById(id);
    }

    /**
     * 新しい案件を作成
     * @param project 作成する案件
     * @return 作成された案件（ID採番済み）
     */
    public Project createProject(Project project) {
        projectMapper.insert(project);
        return project;
    }

    /**
     * 案件を更新
     * @param id 案件ID
     * @param updatedProject 更新内容
     * @return 更新された案件（見つからない場合はnull）
     */
    public Project updateProject(Long id, Project updatedProject) {
        Project existingProject = projectMapper.selectById(id);
        if (existingProject != null) {
            existingProject.setName(updatedProject.getName());
            existingProject.setDescription(updatedProject.getDescription());
            projectMapper.update(existingProject);
            return existingProject;
        }
        return null;
    }

    /**
     * 案件と配下チケットを削除
     * @param id 案件ID
     * @return 削除された案件（見つからない場合はnull）
     */
    @Transactional
    public Project deleteProject(Long id) {
        Project project = projectMapper.selectById(id);
        if (project != null) {
            todoMapper.deleteByProjectId(id);
            projectMapper.deleteById(id);
            return project;
        }
        return null;
    }

    /**
     * 案件の統計情報を取得
     * @param id 案件ID
     * @return 統計情報（total, completed, pending, progressRate）
     */
    public Map<String, Integer> getProjectStats(Long id) {
        int total = todoMapper.countByProjectId(id);
        int completed = todoMapper.countByProjectIdAndCompleted(id, true);
        int pending = total - completed;
        int progressRate = (total > 0) ? (completed * 100 / total) : 0;

        Map<String, Integer> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("completed", completed);
        stats.put("pending", pending);
        stats.put("progressRate", progressRate);
        return stats;
    }
}
