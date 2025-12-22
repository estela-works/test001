package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 案件のREST APIコントローラー
 */
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * すべての案件を取得
     * @return 案件リスト（作成日時降順）
     */
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    /**
     * 指定IDの案件を取得
     * @param id 案件ID
     * @return 案件
     */
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        if (project != null) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 新しい案件を作成
     * @param project 作成する案件
     * @return 作成された案件
     */
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        if (project.getName() == null || project.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Project createdProject = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    /**
     * 案件を更新
     * @param id 案件ID
     * @param project 更新内容
     * @return 更新された案件
     */
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        if (project.getName() == null || project.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Project updatedProject = projectService.updateProject(id, project);
        if (updatedProject != null) {
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 案件を削除（配下のチケットも削除）
     * @param id 案件ID
     * @return 削除結果
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        Project deletedProject = projectService.deleteProject(id);
        if (deletedProject != null) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 案件の統計情報を取得
     * @param id 案件ID
     * @return 統計情報（total, completed, pending, progressRate）
     */
    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Integer>> getProjectStats(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        if (project == null) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Integer> stats = projectService.getProjectStats(id);
        return ResponseEntity.ok(stats);
    }
}
