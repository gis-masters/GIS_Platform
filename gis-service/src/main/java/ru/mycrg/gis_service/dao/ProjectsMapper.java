package ru.mycrg.gis_service.dao;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.gis_service.dto.project.ProjectProjection;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

public class ProjectsMapper implements RowMapper<ProjectProjection> {

    @Override
    public ProjectProjection mapRow(ResultSet rs, int rowNum) throws SQLException {
        ProjectProjectionImpl project = new ProjectProjectionImpl();
        project.setId(rs.getLong("id"));
        project.setName(rs.getString("name"));
        project.setOrganizationId(rs.getLong("organization_id"));
        project.setBbox(rs.getString("bbox"));
        project.setDefault(rs.getBoolean("is_default"));
        project.setDescription(rs.getString("description"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            project.setCreatedAt(createdAt.toLocalDateTime());
        }

        long roleId = rs.getLong("role");
        if (roleId == 10) {
            project.setRole("VIEWER");
        } else if (roleId == 30) {
            project.setRole("OWNER");
        }

        return project;
    }
}
