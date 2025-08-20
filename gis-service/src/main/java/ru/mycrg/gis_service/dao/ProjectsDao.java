package ru.mycrg.gis_service.dao;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.stereotype.Repository;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.gis_service.dto.project.ProjectPermission;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    public List<ProjectPermission> getMaxRoleFromDirectlyPermissions(Set<String> pIds) {
        UserDetails userDetails = authenticationFacade.getUserDetails();
        Long userId = userDetails.getUserId();
        List<String> groupIds = userDetails.getGroups().stream()
                                           .map(Object::toString)
                                           .collect(Collectors.toList());

        String query = "" +
                "SELECT per.project_id, max(per.role_id) AS max_role " +
                "FROM permissions AS per " +
                "WHERE per.project_id IN (" + buildInSection(pIds) + ")" +
                "    AND (" +
                "      (" +
                "        per.principal_id = " + userId + " " +
                "        AND per.principal_type = 'user'" +
                "      ) " +
                "      " + buildWhereByUserGroupSection(groupIds) +
                "    ) " +
                "GROUP BY per.project_id";

        log.debug("Query getMaxRoleFromDirectlyPermissions: [{}]", query);

        return jdbcTemplate.query(query,
                                  new RowMapperResultSetExtractor<>(
                                          new ProjectPermissionMapper()
                                  ));
    }

    @Nullable
    public Long getBestRoleFromParents(Set<String> parentIds) {
        Long orgId = authenticationFacade.getOrganizationId();
        UserDetails userDetails = authenticationFacade.getUserDetails();
        Long userId = userDetails.getUserId();
        List<String> groupIds = userDetails.getGroups().stream()
                                           .map(Object::toString)
                                           .collect(Collectors.toList());

        String query = "" +
                "SELECT max(per.role_id) AS role " +
                "  FROM projects AS proj " +
                "    JOIN permissions AS per ON proj.id = per.project_id " +
                "    AND proj.organization_id = " + orgId +
                "    AND proj.id IN (" + buildInSection(parentIds) + ")" +
                "    AND (" +
                "      (" +
                "        per.principal_id = " + userId + " " +
                "        AND per.principal_type = 'user'" +
                "      ) " +
                "      " + buildWhereByUserGroupSection(groupIds) +
                "    ) ";

        log.debug("Query get best role inherit by parents: [{}]", query);

        return jdbcTemplate.queryForObject(query, Long.class);
    }

    public List<ProjectProjectionImpl> allowedProjectsByRoot(String name, Pageable pageable) {
        return allowedProjects(null, name, pageable);
    }

    public List<ProjectProjectionImpl> allowedProjects(String pathToParent,
                                                       String name,
                                                       Pageable pageable) {
        Long orgId = authenticationFacade.getOrganizationId();
        UserDetails userDetails = authenticationFacade.getUserDetails();
        Long userId = userDetails.getUserId();
        List<String> groupIds = userDetails.getGroups().stream()
                                           .map(Object::toString)
                                           .collect(Collectors.toList());

        String pathSectionBase = pathToParent == null
                ? "IS NULL"
                : "LIKE '" + pathToParent + "'";

        String pathSectionSplit = pathToParent == null
                ? "'/'"
                : "'" + pathToParent + "/'";

        String pathSectionChild = pathToParent == null
                ? "'/%'"
                : "'" + pathToParent + "/%'";

        String query = "" +
                "SELECT n2.*, max(n1.role) AS role " +
                "FROM " +
                "  (" +
                "  SELECT proj.id as allowed_res_id, max(per.role_id) AS role" +
                "  FROM projects AS proj " +
                "    JOIN permissions AS per ON proj.id = per.project_id " +
                "    AND proj.organization_id = " + orgId +
                "    AND proj.path " + pathSectionBase + // '/22'
                "    AND LOWER(proj.name) LIKE LOWER('%" + name + "%') " +
                "    AND (" +
                "      (" +
                "        per.principal_id = " + userId + " " +
                "        AND per.principal_type = 'user'" +
                "      ) " +
                "      " + buildWhereByUserGroupSection(groupIds) +
                "    ) " +
                "    GROUP BY proj.id" +
                "  " +
                "  UNION" +
                "  " +
                "  SELECT SPLIT_PART(regexp_replace(path, " + pathSectionSplit + ", ''), '/', 1):: bigint as allowed_res_id, " +
                "         10 AS role" +
                "  FROM projects AS proj " +
                "    JOIN permissions AS per ON proj.id = per.project_id " +
                "    AND proj.organization_id = " + orgId +
                "    AND proj.path LIKE " + pathSectionChild +
                "    AND (" +
                "      (" +
                "        per.principal_id = " + userId + " " +
                "        AND per.principal_type = 'user'" +
                "      ) " +
                "      " + buildWhereByUserGroupSection(groupIds) +
                "    ) " +
                "    GROUP BY allowed_res_id " +
                "  ) AS n1 " +
                "  JOIN projects AS n2 ON n1.allowed_res_id = n2.id " +
                "WHERE path " + pathSectionBase + " " + // '/22'
                "GROUP BY n2.id " +
                " " + buildOrderBySection(pageable.getSort()) +
                " " + buildLimitOffsetSection(pageable);

        log.debug("Query get allowed projects: [{}]", query);

        return jdbcTemplate.query(query,
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
                "SELECT count(*) FROM ( " +
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
                "  ) " +
                "GROUP BY proj.id" +
                ") sub;";

        log.debug("Query get total allowed projects: [{}]", queryTemplate);

        return jdbcTemplate.queryForObject(queryTemplate, Long.class);
    }

    /**
     * Возвращает идентификаторы всех объектов вложенных в заданную папку, вместе с родителем.
     *
     * @param id идентификатор родительской папки
     */
    public List<Long> getProjectItemIdsFromParent(Long id) {
        Long orgId = authenticationFacade.getOrganizationId();

        String query = "" +
                "SELECT id FROM public.projects " +
                "   WHERE " +
                "   (" +
                "      id = " + id + " OR " +
                "      path LIKE (SELECT CONCAT(path, '/" + id + "%') FROM public.projects WHERE id = " + id + ")" +
                "   )" +
                "   AND organization_id = " + orgId;

        log.debug("Запрос на поиск всех объектов вложенных в заданную папку: {}", query);

        return jdbcTemplate.queryForList(query, Long.class);
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
    private String buildOrderBySection(Sort sort) {
        if (sort.isUnsorted()) {
            return "";
        }

        List<String> orderItems = sort.stream()
                                      .map(order -> getProperty(order.getProperty()) + " " + order.getDirection())
                                      .collect(Collectors.toList());

        return " ORDER BY " + join(",", orderItems) + " ";
    }

    private String buildLimitOffsetSection(Pageable pageable) {
        if (pageable.isUnpaged()) {
            return "";
        }

        return " LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset();
    }

    private String buildInSection(Collection<String> ids) {
        List<String> asString = ids.stream()
                                   .map(s -> "'" + s + "'")
                                   .collect(Collectors.toList());

        return join(",", asString);
    }

    private String getProperty(String property) {
        if (property.equalsIgnoreCase("createdAt")) {
            return "created_at";
        }

        return property;
    }
}
