package ru.mycrg.auth_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.auth_service.entity.User;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.auth_service.util.EcqlHandler.buildWhereSection;

@Repository
public class UserDao {

    private final Logger log = LoggerFactory.getLogger(UserDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public UserDao(NamedParameterJdbcTemplate pJdbcTemplate) {
        this.pJdbcTemplate = pJdbcTemplate;
    }

    public List<User> findAll(String ecqlFilter,
                              Pageable pageable,
                              Long orgId) {
        String whereSection = buildWhereSection(ecqlFilter);
        whereSection = whereSection.isEmpty()
                ? " WHERE organization_id = " + orgId
                : whereSection + " AND organization_id = " + orgId;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize());

        String query = "SELECT * FROM users " +
                "LEFT JOIN organizations_users ou on users.id = ou.users_id" +
                "  " + whereSection +
                "  " + buildOrderBySection(pageable.getSort()) +
                "  LIMIT :limit OFFSET :offset";

        log.debug("Request find all by path: [{}]", query);

        return pJdbcTemplate.query(query, params, new UsersMapper());
    }

    public Long getTotal(String ecqlFilter, Long orgId) {
        String whereSection = buildWhereSection(ecqlFilter);
        whereSection = whereSection.isEmpty()
                ? " WHERE organization_id = " + orgId
                : whereSection + " AND organization_id = " + orgId;

        String query = "SELECT count(*) FROM users " +
                "LEFT JOIN organizations_users ou ON users.id = ou.users_id " + whereSection;

        log.debug("Query getTotal users: [{}]", query);

        return pJdbcTemplate.queryForObject(query, new HashMap<>(), Long.class);
    }

    @NotNull
    private static String buildOrderBySection(Sort sort) {
        if (sort.isUnsorted()) {
            return "";
        }

        List<String> orderItems = sort.stream()
                                      .map(order -> getProperty(order.getProperty()) + " " + order.getDirection())
                                      .collect(Collectors.toList());

        return " ORDER BY " + String.join(",", orderItems) + " ";
    }

    private static String getProperty(String property) {
        if (property.equalsIgnoreCase("createdAt")) {
            return "created_at";
        }

        return property;
    }
}
