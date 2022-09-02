package ru.mycrg.gis_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.stereotype.Repository;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.gis_service.dto.ProjectProjection;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.lang.String.join;

@Repository
public class ProjectsDao {

    private final Logger log = LoggerFactory.getLogger(ProjectsDao.class);

    private final JdbcTemplate jdbcTemplate;
    private final IAuthenticationFacade authenticationFacade;

    public ProjectsDao(JdbcTemplate jdbcTemplate,
                       IAuthenticationFacade authenticationFacade) {
        this.jdbcTemplate = jdbcTemplate;
        this.authenticationFacade = authenticationFacade;
    }

    public List<ProjectProjection> allowedProjects(String name,
                                                   Pageable pageable) {
        Long orgId = authenticationFacade.getOrganizationId();
        UserDetails userDetails = authenticationFacade.getUserDetails();
        Long userId = userDetails.getUserId();
        List<String> groupIds = userDetails.getGroups().stream()
                                           .map(Object::toString)
                                           .collect(Collectors.toList());

        String queryTemplate = "" +
                "SELECT " +
                " " + buildDistinctOnSection(pageable.getSort()) +
                "  proj.*, " +
                "  per.role " +
                "FROM " +
                "  projects AS proj " +
                "  JOIN permissions AS per ON proj.id = per.project_id " +
                "WHERE " +
                "  proj.organization_id = " + orgId +
                "  AND LOWER(proj.name) LIKE LOWER('%" + name + "%') " +
                "  AND (" +
                "    (" +
                "      per.principal_id = " + userId + " " +
                "      AND per.principal_type = 'user'" +
                "    ) " +
                " " + buildWhereByUserGroupSection(groupIds) +
                "  )" +
                " " + buildOrderBySection(pageable.getSort()) +
                "LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset();

        log.debug("Query get allowed projects: [{}]", queryTemplate);

        return jdbcTemplate.query(queryTemplate,
                                  new RowMapperResultSetExtractor<>(
                                          new ProjectsMapper()
                                  ));
    }

    public Long totalAllowedProjects(String name) {
        Long orgId = authenticationFacade.getOrganizationId();
        UserDetails userDetails = authenticationFacade.getUserDetails();
        Long userId = userDetails.getUserId();
        List<String> groupIds = userDetails.getGroups().stream()
                                           .map(Object::toString)
                                           .collect(Collectors.toList());

        String queryTemplate = "" +
                "SELECT " +
                "  count(proj.*)" +
                "FROM " +
                "  projects AS proj " +
                "  JOIN permissions AS per ON proj.id = per.project_id " +
                "WHERE " +
                "  proj.organization_id = " + orgId +
                "  AND LOWER(proj.name) LIKE LOWER('%" + name + "%') " +
                "  AND (" +
                "    (" +
                "      per.principal_id = " + userId + " " +
                "      AND per.principal_type = 'user'" +
                "    ) " +
                " " + buildWhereByUserGroupSection(groupIds) +
                "  )";

        log.debug("Query get total allowed projects: [{}]", queryTemplate);

        return jdbcTemplate.queryForObject(queryTemplate, Long.class);
    }

    @NotNull
    private String buildWhereByUserGroupSection(List<String> groupIds) {
        if (!groupIds.isEmpty()) {
            return "OR (" +
                    "  per.principal_id IN (" + buildInSection(groupIds) + ") " +
                    "  AND per.principal_type = 'group'" +
                    ")";
        } else {
            return "";
        }
    }

    @NotNull
    public static String buildOrderBySection(Sort sort) {
        if (sort.isUnsorted()) {
            return "";
        }

        final List<String> orderItems = sort.stream()
                                            .map(order -> getProperty(order.getProperty()) + " " + order.getDirection())
                                            .collect(Collectors.toList());

        return " ORDER BY " + join(",", orderItems) + " ";
    }

    @NotNull
    public static String buildDistinctOnSection(Sort sort) {
        if (sort.isUnsorted()) {
            return "DISTINCT ON (proj.name)";
        }

        final List<String> propertiesForSorting = sort.stream()
                                                      .map(order -> getProperty(order.getProperty()))
                                                      .collect(Collectors.toList());

        return format("DISTINCT ON (proj.name, %s) ", join(",", propertiesForSorting));
    }

    public static String buildInSection(Collection<String> ids) {
        final List<String> asString = ids.stream()
                                         .map(s -> "'" + s + "'")
                                         .collect(Collectors.toList());

        return join(",", asString);
    }

    private static String getProperty(String property) {
        if (property.equalsIgnoreCase("createdAt")) {
            return "created_at";
        }

        return property;
    }
}
