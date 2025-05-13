package ru.mycrg.gis_service.dao;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.security.Roles;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

public class ProjectsMapper implements RowMapper<ProjectProjectionImpl> {

    @Override
    public ProjectProjectionImpl mapRow(ResultSet rs, int rowNum) throws SQLException {
        ProjectProjectionImpl project = new ProjectProjectionImpl();
        project.setId(rs.getLong("id"));
        project.setName(rs.getString("name"));
        project.setOrganizationId(rs.getLong("organization_id"));
        project.setBbox(rs.getString("bbox"));
        project.setDefault(rs.getBoolean("is_default"));
        project.setFolder(rs.getBoolean("is_folder"));
        project.setDescription(rs.getString("description"));
        project.setRole(Roles.valueToRole(rs.getLong("role")).name());
        project.setPath(rs.getString("path"));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            project.setCreatedAt(createdAt.toLocalDateTime());
        }

        return project;
    }
}
