package ru.mycrg.gis_service.dao;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.gis_service.dto.ProjectProjection;
import ru.mycrg.gis_service.service.ProjectProjectionImpl;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ProjectsMapper implements RowMapper<ProjectProjection> {

    @Override
    public ProjectProjection mapRow(ResultSet rs, int rowNum) throws SQLException {
        ProjectProjectionImpl project = new ProjectProjectionImpl();
        project.setId(rs.getLong(1));
        project.setName(rs.getString(2));
        project.setInternalName(rs.getString(3));
        project.setOrganizationId(rs.getLong(4));
        project.setBbox(rs.getString(5));
        project.setCreatedAt(rs.getTimestamp(6).toLocalDateTime());
        project.setDefault(rs.getBoolean(8));
        project.setRole(rs.getString(9));

        return project;
    }
}
