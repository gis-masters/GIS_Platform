package ru.mycrg.gis_service.dao;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.gis_service.dto.project.ProjectPermission;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ProjectPermissionMapper implements RowMapper<ProjectPermission> {

    @Override
    public ProjectPermission mapRow(ResultSet rs, int rowNum) throws SQLException {
        ProjectPermission projectPermission = new ProjectPermission();
        projectPermission.setProjectId(rs.getLong("project_id"));
        projectPermission.setMaxRole(rs.getLong("max_role"));

        return projectPermission;
    }
}
