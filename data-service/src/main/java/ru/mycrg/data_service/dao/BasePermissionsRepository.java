package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.mappers.DocLibraryMapper;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.dao.mappers.SchemasAndTablesMapper;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.service.PrincipalService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildFindAllowedQuery;
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

    public List<IRecord> findAllowedDirectly(ResourceQualifier rQualifier) {
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
                                           new RecordRowMapper(null)
                                   ));
    }

    public List<SchemasAndTables> findAllowedByParent(ResourceQualifier qualifier,
                                                      String parent) {
        return findAllowedByParent(qualifier,
                                   parent,
                                   null,
                                   Pageable.unpaged(),
                                   new SchemasAndTablesMapper());
    }

    public List<DocumentLibrary> findAllowedByParent(ResourceQualifier qualifier,
                                                     String parent,
                                                     String ecqlFilter) {
        return findAllowedByParent(qualifier,
                                   parent,
                                   ecqlFilter,
                                   Pageable.unpaged(),
                                   new DocLibraryMapper());
    }

    public <T> List<T> findAllowedByParent(ResourceQualifier qualifier,
                                           String parent,
                                           String ecqlFilter,
                                           @Nullable Pageable pageable,
                                           RowMapper<T> rowMapper) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return new ArrayList<>();
        }

        String query = buildFindAllowedQuery(parent, ecqlFilter, qualifier, allPrincipalIds);
        if (pageable != null && !pageable.isUnpaged()) {
            query = String.format("%s %s LIMIT %d OFFSET %d",
                                  query, buildOrderBySection(pageable.getSort()),
                                  pageable.getPageSize(), pageable.getOffset());
        }

        log.debug("Request to find allowed resources by parent: [{}]", query);

        return pJdbcTemplate.query(query, rowMapper);
    }

    public boolean isAllowedByParentsPermissions(ResourceQualifier targetTable, Set<String> parentFolderIds) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty() || parentFolderIds.isEmpty()) {
            return false;
        }

        String tableQualifier = targetTable.getTableQualifier();
        String tableName = targetTable.getTable();
        String query = "" +
                "SELECT exists (" +
                "  SELECT res.id AS allowed_res_id" +
                "  FROM " + tableQualifier + " AS res" +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id" +
                "  AND p.resource_table = '" + tableName + "'" +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ")" +
                "  AND res.id IN (" + joinAndQuoteMark(parentFolderIds) + ")" +
                ")";

        log.debug("Request is allowed by parents permissions: [{}]", query);

        Boolean result = pJdbcTemplate.getJdbcTemplate().queryForObject(query, Boolean.class);

        return Boolean.TRUE.equals(result);
    }

    public Long getTotalByParent(ResourceQualifier targetTable, String path, String ecqlFilter) {
        String tableQualifier = targetTable.getTableQualifier();
        String tableName = targetTable.getTable();

        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return 0L;
        }

        String query = "" +
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

        log.debug("Request to total allowed resources by path: [{}]", query);

        return pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);
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

        String query = "" +
                "SELECT max(p.role_id) FROM data.schemas_and_tables AS res " +
                "JOIN data.acl_permissions AS p " +
                "ON p.resource_id = res.id " +
                "AND p.resource_table = 'schemas_and_tables' " +
                "AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "AND (" +
                "   res.identifier = '" + tableName + "'" +
                "   OR res.identifier = '" + schemaName + "'" +
                ")";

        log.debug("Request bestRoleForTable: [{}]", query);

        Long roleId = pJdbcTemplate.getJdbcTemplate()
                                   .queryForObject(query, Long.class);

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

        String query = "" +
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

        log.debug("Query: is pass-through folder: [{}]", query);

        Boolean result = pJdbcTemplate.getJdbcTemplate().queryForObject(query, Boolean.class);

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

        String query = "" +
                "SELECT " +
                "  max(p.role_id) " +
                "FROM " +
                "  " + qualifier + " AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = '" + tableName + "' " +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ")" +
                "  AND res.id IN (" + joinAndQuoteMark(parentFolderIds) + ")";

        log.debug("Query: best role inherited from parent: [{}]", query);

        List<Long> results = pJdbcTemplate.getJdbcTemplate().query(query, new SingleColumnRowMapper<>());
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

        String query = "" +
                "SELECT " +
                "  max(p.role_id) " +
                "FROM " +
                "  data.doc_libraries AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = 'doc_libraries' " +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "  AND res.table_name = '" + tableName + "'";

        log.debug("Request getRoleForLibrary: [{}]", query);

        Long results = pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);

        return defineRoleById(results);
    }

    public Optional<String> getBestRoleForDataset(ResourceQualifier dQualifier) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return Optional.empty();
        }

        String identifier = dQualifier.getTable() != null ? dQualifier.getTable() : dQualifier.getSchema();

        String query = "" +
                "SELECT " +
                "  max(p.role_id) " +
                "FROM " +
                "  data.schemas_and_tables AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = 'schemas_and_tables' " +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "  AND res.identifier = '" + identifier + "'";

        log.debug("Request getRoleForDataset: [{}]", query);

        Long results = pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);

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

        String query = "" +
                "SELECT " +
                "  max(p.role_id) " +
                "FROM " +
                "  " + tableQualifier + " AS res " +
                "  JOIN data.acl_permissions AS p ON p.resource_id = res.id " +
                "  AND p.resource_table = '" + tableName + "' " +
                "  AND p.principal_id IN (" + joinAndQuoteMark(allPrincipalIds) + ") " +
                "  AND res.id = " + recordId;

        log.debug("Query: role for record: [{}]", query);

        Long results = pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);

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
}
