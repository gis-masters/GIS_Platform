package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.dto.Record;
import ru.mycrg.data_service.service.PrincipalService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static ru.mycrg.data_service.dao.SqlBuilder.buildInSection;
import static ru.mycrg.data_service.dao.SqlBuilder.buildOrderBySection;
import static ru.mycrg.data_service.util.RoleHandler.defineRoleById;

@Repository
@Transactional
public class BasePermissionsRepository {

    private final Logger log = LoggerFactory.getLogger(BasePermissionsRepository.class);

    private final PrincipalService principalService;
    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public BasePermissionsRepository(PrincipalService principalService,
                                     NamedParameterJdbcTemplate pJdbcTemplate) {
        this.principalService = principalService;
        this.pJdbcTemplate = pJdbcTemplate;
    }

    public List<Record> findAllowedByParent(ResourceQualifier targetTable,
                                            String parent,
                                            String title,
                                            Pageable pageable) {
        final String tableQualifier = targetTable.getQualifier();
        final String tableName = targetTable.getTable();

        final List<String> allPrincipalIds = principalService.getAllIds();

        String requestTemplate = "" +
                "SELECT n2.* FROM " +
                "  (" +
                "    SELECT " +
                "      res.id AS allowed_res_id " +
                "    FROM " +
                "      " + tableQualifier + " AS res " +
                "      JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "      AND p.resource_table = '" + tableName + "' " +
                "      AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ") " +
                "      AND res.path = '" + parent + "' " +
                " " +
                "    UNION " +
                " " +
                "    SELECT " +
                "      SPLIT_PART(" +
                "        regexp_replace(path, '" + parent + "/', ''), " +
                "        '/', " +
                "        1" +
                "      ):: bigint as allowed_res_id " +
                "    FROM " +
                "      " + tableQualifier + " AS res " +
                "      JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "      AND p.resource_table = '" + tableName + "' " +
                "      AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ") " +
                "      AND res.path LIKE '" + parent + "/%' " +
                "    GROUP BY " +
                "      allowed_res_id" +
                "  ) AS n1 " +
                "  JOIN " + tableQualifier + " AS n2 ON n1.allowed_res_id = n2.id " +
                "WHERE LOWER(n2.title) LIKE LOWER('%" + title + "%') " +
                " " + buildOrderBySection(pageable.getSort()) +
                "LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset();

        log.debug("Request to find allowed resources by parent: [{}]", requestTemplate);

        return pJdbcTemplate.getJdbcTemplate()
                            .query(requestTemplate,
                                   new RowMapperResultSetExtractor<>(
                                           new RecordRowMapper()
                                   ));
    }

    public boolean isAllowedByParentsPermissions(ResourceQualifier targetTable, Set<String> parentFolderIds) {
        final String tableQualifier = targetTable.getQualifier();
        final String tableName = targetTable.getTable();

        final List<String> allPrincipalIds = principalService.getAllIds();

        String requestTemplate = "" +
                "SELECT exists (" +
                "  SELECT res.id AS allowed_res_id" +
                "  FROM " + tableQualifier + " AS res" +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id" +
                "  AND p.resource_table = '" + tableName + "'" +
                "  AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ")" +
                "  AND res.id IN (" + buildInSection(parentFolderIds) + ")" +
                ")";

        log.debug("Request is allowed by parents permissions: [{}]", requestTemplate);

        Boolean result = pJdbcTemplate.getJdbcTemplate().queryForObject(requestTemplate, Boolean.class);

        return Boolean.TRUE.equals(result);
    }

    public Long getTotalByParent(ResourceQualifier targetTable, String path, String title) {
        final String tableQualifier = targetTable.getQualifier();
        final String tableName = targetTable.getTable();

        final List<String> allPrincipalIds = principalService.getAllIds();

        String requestTemplate = "" +
                "SELECT " +
                "  count(allowed_res_id) " +
                "FROM " +
                "  (" +
                "    SELECT " +
                "      res.id AS allowed_res_id " +
                "    FROM " +
                "      " + tableQualifier + " AS res " +
                "      JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "      AND p.resource_table = '" + tableName + "' " +
                "      AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ") " +
                "      AND res.path = '" + path + "' " +
                "    UNION " +
                "    SELECT " +
                "      SPLIT_PART(" +
                "        regexp_replace(path, '" + path + "/', ''), " +
                "        '/', " +
                "        1" +
                "      ):: bigint as allowed_res_id " +
                "    FROM " +
                "      " + tableQualifier + " AS res " +
                "      JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "      AND p.resource_table = '" + tableName + "' " +
                "      AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ") " +
                "      AND res.path LIKE '" + path + "/%' " +
                "    GROUP BY " +
                "      allowed_res_id" +
                "  ) AS n1 " +
                "  JOIN " + tableQualifier + " AS n2 ON n1.allowed_res_id = n2.id " +
                "WHERE LOWER(n2.title) LIKE LOWER('%" + title + "%')";

        log.debug("Request to total allowed resources by path: [{}]", requestTemplate);

        return pJdbcTemplate.getJdbcTemplate().queryForObject(requestTemplate, Long.class);
    }

    public boolean isViewAllowed(ResourceQualifier targetTable, String parent) {
        final String tableQualifier = targetTable.getQualifier();
        final String tableName = targetTable.getTable();

        final List<String> allPrincipalIds = principalService.getAllIds();

        String requestTemplate = "" +
                "SELECT exists(" +
                "  SELECT " +
                "    SPLIT_PART(" +
                "      regexp_replace(path, '/root/', '')," +
                "      '/'," +
                "      1" +
                "    ):: bigint as allowed_res_id" +
                "  FROM " + tableQualifier + " AS res" +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id" +
                "    AND p.resource_table = '" + tableName + "'" +
                "    AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ")" +
                "    AND path LIKE '" + parent + "%'" +
                "  GROUP BY allowed_res_id" +
                ")";

        log.debug("Request isViewAllowed: [{}]", requestTemplate);

        Boolean result = pJdbcTemplate.getJdbcTemplate().queryForObject(requestTemplate, Boolean.class);

        return Boolean.TRUE.equals(result);
    }

    public boolean isDatasetAllowed(ResourceQualifier targetTable, Long datasetId) {
        final String tableQualifier = targetTable.getQualifier();
        final String tableName = targetTable.getTable();

        final List<String> allPrincipalIds = principalService.getAllIds();

        String requestTemplate = "" +
                "SELECT exists (" +
                "   SELECT * " +
                "   FROM " + tableQualifier + " AS res " +
                "   JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "   AND p.resource_table = '" + tableName + "' " +
                "   AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ") " +
                "   AND res.id = " + datasetId +
                ")";

        log.debug("Request isDatasetAllowed: [{}]", requestTemplate);

        Boolean result = pJdbcTemplate.getJdbcTemplate().queryForObject(requestTemplate, Boolean.class);

        return Boolean.TRUE.equals(result);
    }

    public Optional<String> bestRoleForTable(ResourceQualifier tableQualifier) {
        String tableName = tableQualifier.getTable();
        String schemaName = tableQualifier.getSchema();

        List<String> allPrincipalIds = principalService.getAllIds();

        String requestTemplate = "" +
                "SELECT max(p.role_id) FROM data.schemas_and_tables AS res " +
                "JOIN data.acl_permissions AS p " +
                "ON p.resource_id = res.id " +
                "AND p.resource_table = 'schemas_and_tables' " +
                "AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ") " +
                "AND (" +
                "   res.identifier = '" + tableName + "'" +
                "   OR res.identifier = '" + schemaName + "'" +
                ")";

        log.debug("Request bestRoleForTable: [{}]", requestTemplate);

        Long roleId = pJdbcTemplate.getJdbcTemplate().queryForObject(requestTemplate, Long.class);

        return defineRoleById(roleId);
    }

    public Optional<String> bestRoleByPath(ResourceQualifier targetTable, String path) {
        final String tableQualifier = targetTable.getQualifier();
        final String tableName = targetTable.getTable();

        final List<String> allPrincipalIds = principalService.getAllIds();

        String requestTemplate = "" +
                "SELECT max(p.role_id) FROM " + tableQualifier + " AS res " +
                "JOIN data.acl_permissions AS p " +
                "ON p.resource_id = res.id " +
                "AND p.resource_table = '" + tableName + "' " +
                "AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ") " +
                "AND (res.path = '" + path + "' OR res.path = '/root')";

        log.debug("Request bestRoleByPath: [{}]", requestTemplate);

        Long roleId = pJdbcTemplate.getJdbcTemplate().queryForObject(requestTemplate, Long.class);

        return defineRoleById(roleId);
    }

    /**
     * Проверка наличия доступа к "сквозной папке" - доступная для чтения папка по причине наличия в ней записей к
     * которым есть доступ.
     */
    public boolean isPassThroughFolder(ResourceQualifier tableQualifier, String path) {
        String qualifier = tableQualifier.getQualifier();
        String tableName = tableQualifier.getTable();

        List<String> allPrincipalIds = principalService.getAllIds();

        String queryTemplate = "" +
                "SELECT " +
                "  exists (" +
                "    SELECT " +
                "      * " +
                "    FROM " +
                "      " + qualifier + " AS res " +
                "      JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "      AND p.resource_table = '" + tableName + "' " +
                "      AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ") " +
                "      AND res.path LIKE '" + path + "%'" +
                ")";

        log.debug("Query: is pass-through folder: [{}]", queryTemplate);

        Boolean result = pJdbcTemplate.getJdbcTemplate().queryForObject(queryTemplate, Boolean.class);

        return Boolean.TRUE.equals(result);
    }

    /**
     * Возвращает лучшую роль наследованную от родителей
     */
    public Optional<String> bestRoleInheritedFromParent(ResourceQualifier tableQualifier,
                                                        Set<String> parentFolderIds) {
        String qualifier = tableQualifier.getQualifier();
        String tableName = tableQualifier.getTable();

        List<String> allPrincipalIds = principalService.getAllIds();

        String queryTemplate = "" +
                "SELECT " +
                "  max(p.role_id) " +
                "FROM " +
                "  " + qualifier + " AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = '" + tableName + "' " +
                "  AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ")" +
                "  AND res.id IN (" + buildInSection(parentFolderIds) + ")";

        log.debug("Query: best role inherited from parent: [{}]", queryTemplate);

        List<Long> results = pJdbcTemplate.getJdbcTemplate().query(queryTemplate, new SingleColumnRowMapper<>());
        if (results.isEmpty()) {
            return Optional.empty();
        } else {
            return defineRoleById(results.get(0));
        }
    }

    /**
     * Возвращает роль выданную на конкретную запись.
     */
    public Optional<String> getRoleForRecord(ResourceQualifier tableQualifier, Long recordId) {
        String qualifier = tableQualifier.getQualifier();
        String tableName = tableQualifier.getTable();

        List<String> allPrincipalIds = principalService.getAllIds();

        String queryTemplate = "" +
                "SELECT " +
                "  p.role_id " +
                "FROM " +
                "  " + qualifier + " AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = '" + tableName + "' " +
                "  AND p.principal_id IN (" + buildInSection(allPrincipalIds) + ") " +
                "  AND res.id = " + recordId;

        log.debug("Query: role for record: [{}]", queryTemplate);

        List<Long> results = pJdbcTemplate.getJdbcTemplate().query(queryTemplate, new SingleColumnRowMapper<>());
        if (results.isEmpty()) {
            return Optional.empty();
        } else {
            return defineRoleById(results.get(0));
        }
    }
}
