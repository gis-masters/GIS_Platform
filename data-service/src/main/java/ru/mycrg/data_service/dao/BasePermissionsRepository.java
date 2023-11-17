package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.PrincipalService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildOrderBySection;
import static ru.mycrg.data_service.util.RoleHandler.defineRoleById;
import static ru.mycrg.data_service.util.StringUtil.joinAndQuoteMark;

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

    public List<IRecord> findAllowedDirectly(ResourceQualifier rQualifier, SchemaDto schema) {
        String tableQualifier = rQualifier.getTableQualifier();
        String tableName = rQualifier.getTable();

        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return new ArrayList<>();
        }

        String query = "" +
                " SELECT " +
                "   res.*" +
                " FROM " +
                "   " + tableQualifier + " AS res " +
                "   JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "   AND p.resource_table = '" + tableName + "' " +
                "   AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ")";

        log.debug("Query to find allowed directly: [{}]", query);

        return pJdbcTemplate.getJdbcTemplate()
                            .query(query,
                                   new RowMapperResultSetExtractor<>(
                                           new RecordRowMapper(schema)
                                   ));
    }

    public List<IRecord> findAllowedByParent(ResourceQualifier qualifier,
                                             String parent,
                                             String ecqlFilter,
                                             SchemaDto schema,
                                             Pageable pageable) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return new ArrayList<>();
        }

        String query = buildFindAllowedQuery(parent, ecqlFilter, qualifier, allPrincipalIds);

        String requestTemplate = query +
                " " + buildOrderBySection(pageable.getSort()) +
                "LIMIT " + pageable.getPageSize() + " OFFSET " + pageable.getOffset();

        log.debug("Request to find allowed resources by parent: [{}]", requestTemplate);

        return pJdbcTemplate.getJdbcTemplate()
                            .query(requestTemplate,
                                   new RowMapperResultSetExtractor<>(
                                           new RecordRowMapper(schema)
                                   ));
    }

    public List<IRecord> findAllowedByParent(ResourceQualifier qualifier,
                                             String parent,
                                             String ecqlFilter,
                                             SchemaDto schema) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return new ArrayList<>();
        }

        String query = buildFindAllowedQuery(parent, ecqlFilter, qualifier, allPrincipalIds);

        log.debug("Request to find allowed resources by parent: [{}]", query);

        return pJdbcTemplate.getJdbcTemplate()
                            .query(query,
                                   new RowMapperResultSetExtractor<>(
                                           new RecordRowMapper(schema)
                                   ));
    }

    public boolean isAllowedByParentsPermissions(ResourceQualifier targetTable, Set<String> parentFolderIds) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty() || parentFolderIds.isEmpty()) {
            return false;
        }

        String tableQualifier = targetTable.getTableQualifier();
        String tableName = targetTable.getTable();
        String requestTemplate = "" +
                "SELECT exists (" +
                "  SELECT res.id AS allowed_res_id" +
                "  FROM " + tableQualifier + " AS res" +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id" +
                "  AND p.resource_table = '" + tableName + "'" +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ")" +
                "  AND res.id IN (" + joinAndQuoteMark(parentFolderIds) + ")" +
                ")";

        log.debug("Request is allowed by parents permissions: [{}]", requestTemplate);

        Boolean result = pJdbcTemplate.getJdbcTemplate().queryForObject(requestTemplate, Boolean.class);

        return Boolean.TRUE.equals(result);
    }

    public Long getTotalByParent(ResourceQualifier targetTable, String path, String ecqlFilter) {
        String tableQualifier = targetTable.getTableQualifier();
        String tableName = targetTable.getTable();

        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return 0L;
        }

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
                "      AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
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
                "      AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "      AND res.path LIKE '" + path + "/%' " +
                "    GROUP BY " +
                "      allowed_res_id" +
                "  ) AS n1 " +
                "  JOIN " + tableQualifier + " AS n2 ON n1.allowed_res_id = n2.id " +
                " " + buildWhereSection(ecqlFilter);

        log.debug("Request to total allowed resources by path: [{}]", requestTemplate);

        return pJdbcTemplate.getJdbcTemplate().queryForObject(requestTemplate, Long.class);
    }

    public void decreasePermissionsToViewerForAll(ResourceQualifier rQualifier) {
        checkQualifier(rQualifier);

        String query = "" +
                "UPDATE " +
                "  data.acl_permissions " +
                "SET " +
                "  role_id = 10 " +
                "WHERE " +
                "  resource_table = '" + rQualifier.getTable() + "' " +
                "  AND resource_id = " + rQualifier.getRecordIdAsLong();

        log.debug("Query decrease permissions to viewer for all: [{}]", query);

        pJdbcTemplate.getJdbcTemplate().execute(query);
    }

    public Optional<String> bestRoleForTable(ResourceQualifier tableQualifier) {
        String tableName = tableQualifier.getTable();
        String schemaName = tableQualifier.getSchema();

        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return Optional.empty();
        }

        String requestTemplate = "" +
                "SELECT max(p.role_id) FROM data.schemas_and_tables AS res " +
                "JOIN data.acl_permissions AS p " +
                "ON p.resource_id = res.id " +
                "AND p.resource_table = 'schemas_and_tables' " +
                "AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "AND (" +
                "   res.identifier = '" + tableName + "'" +
                "   OR res.identifier = '" + schemaName + "'" +
                ")";

        log.debug("Request bestRoleForTable: [{}]", requestTemplate);

        Long roleId = pJdbcTemplate.getJdbcTemplate().queryForObject(requestTemplate, Long.class);

        return defineRoleById(roleId);
    }

    /**
     * Проверка наличия доступа к "сквозной папке" - доступная для чтения папка по причине наличия в ней записей к
     * которым есть доступ.
     */
    public boolean isPassThroughFolder(ResourceQualifier tableQualifier, String path) {
        String qualifier = tableQualifier.getTableQualifier();
        String tableName = tableQualifier.getTable();

        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return false;
        }

        String queryTemplate = "" +
                "SELECT " +
                "  exists (" +
                "    SELECT " +
                "      * " +
                "    FROM " +
                "      " + qualifier + " AS res " +
                "      JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "      AND p.resource_table = '" + tableName + "' " +
                "      AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
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
        if (parentFolderIds.isEmpty()) {
            return Optional.empty();
        }

        String qualifier = tableQualifier.getTableQualifier();
        String tableName = tableQualifier.getTable();

        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return Optional.empty();
        }

        String queryTemplate = "" +
                "SELECT " +
                "  max(p.role_id) " +
                "FROM " +
                "  " + qualifier + " AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = '" + tableName + "' " +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ")" +
                "  AND res.id IN (" + joinAndQuoteMark(parentFolderIds) + ")";

        log.debug("Query: best role inherited from parent: [{}]", queryTemplate);

        List<Long> results = pJdbcTemplate.getJdbcTemplate().query(queryTemplate, new SingleColumnRowMapper<>());
        if (results.isEmpty()) {
            return Optional.empty();
        } else {
            return defineRoleById(results.get(0));
        }
    }

    public Optional<String> getBestRoleForLibrary(String tableName) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return Optional.empty();
        }

        String queryTemplate = "" +
                "SELECT " +
                "  max(p.role_id) " +
                "FROM " +
                "  data.doc_libraries AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = 'doc_libraries' " +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "  AND res.table_name = '" + tableName + "'";

        log.debug("Request getRoleForLibrary: [{}]", queryTemplate);

        Long results = pJdbcTemplate.getJdbcTemplate().queryForObject(queryTemplate, Long.class);

        return defineRoleById(results);
    }

    public Optional<String> getBestRoleForDataset(ResourceQualifier dQualifier) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return Optional.empty();
        }

        String identifier = dQualifier.getTable() != null ? dQualifier.getTable() : dQualifier.getSchema();

        String queryTemplate = "" +
                "SELECT " +
                "  max(p.role_id) " +
                "FROM " +
                "  data.schemas_and_tables AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = 'schemas_and_tables' " +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "  AND res.identifier = '" + identifier + "'";

        log.debug("Request getRoleForDataset: [{}]", queryTemplate);

        Long results = pJdbcTemplate.getJdbcTemplate().queryForObject(queryTemplate, Long.class);

        return defineRoleById(results);
    }

    /**
     * Возвращает роль выданную на конкретную запись.
     *
     * @param rQualifier Квалификатор ресурса.
     *
     * @throws IllegalStateException если квалификатор не содержит record
     */
    public Optional<String> getBestRoleForRecord(ResourceQualifier rQualifier) {
        checkQualifier(rQualifier);

        String tableQualifier = rQualifier.getTableQualifier();
        String tableName = rQualifier.getTable();
        Object recordId = rQualifier.getRecordIdAsLong();

        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return Optional.empty();
        }

        String queryTemplate = "" +
                "SELECT " +
                "  max(p.role_id) " +
                "FROM " +
                "  " + tableQualifier + " AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = '" + tableName + "' " +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "  AND res.id = " + recordId;

        log.debug("Query: role for record: [{}]", queryTemplate);

        Long results = pJdbcTemplate.getJdbcTemplate().queryForObject(queryTemplate, Long.class);

        return defineRoleById(results);
    }

    private void checkQualifier(ResourceQualifier rQualifier) {
        if (rQualifier.getTable() == null) {
            throw new IllegalStateException("Qualifier must contain table");
        }

        if (rQualifier.getRecordIdAsLong() == null) {
            throw new IllegalStateException("Qualifier must contain record");
        }
    }

    @NotNull
    private static String buildFindAllowedQuery(String parent,
                                                String ecqlFilter,
                                                ResourceQualifier qualifier,
                                                List<String> allPrincipalIds) {
        String tableQualifier = qualifier.getTableQualifier();
        String tableName = qualifier.getTable();

        return "SELECT n2.* FROM " +
                "  (" +
                "    SELECT " +
                "      res.id AS allowed_res_id " +
                "    FROM " +
                "      " + tableQualifier + " AS res " +
                "      JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "      AND p.resource_table = '" + tableName + "' " +
                "      AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
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
                "      AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "      AND res.path LIKE '" + parent + "/%' " +
                "    GROUP BY " +
                "      allowed_res_id" +
                "  ) AS n1 " +
                "  JOIN " + tableQualifier + " AS n2 ON n1.allowed_res_id = n2.id " +
                " " + buildWhereSection(ecqlFilter);
    }
}
