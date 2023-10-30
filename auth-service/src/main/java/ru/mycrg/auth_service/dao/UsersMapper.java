package ru.mycrg.auth_service.dao;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.auth_service.entity.User;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

public class UsersMapper implements RowMapper<User> {

    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setSurname(rs.getString("sur_name"));
        user.setLogin(rs.getString("login"));
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            user.setCreatedAt(createdAt.toLocalDateTime());
        }
        Timestamp lastModified = rs.getTimestamp("last_modified");
        if (lastModified != null) {
            user.setLastModified(lastModified.toLocalDateTime());
        }
        user.setMiddleName(rs.getString("middle_name"));
        user.setJob(rs.getString("job"));
        user.setPhone(rs.getString("phone"));
        user.setDepartment(rs.getString("department"));
        user.setGeoserverLogin(rs.getString("geoserver_login"));
        user.setBossId(rs.getInt("boss_id"));
        user.setEnabled(rs.getBoolean("enabled"));
        user.setCreatedBy(rs.getString("created_by"));
        user.setUpdatedBy(rs.getString("updated_by"));

        return user;
    }
}
