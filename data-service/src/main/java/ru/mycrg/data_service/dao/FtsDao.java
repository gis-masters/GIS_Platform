package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.data_service.dto.FtsItem;
import ru.mycrg.data_service.dto.RegistryData;
import ru.mycrg.data_service.service.PrincipalService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.ArrayList;
import java.util.List;

import static java.sql.Types.VARCHAR;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.*;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.util.SchemaUtil.getFtsProperties;

@Repository
public class FtsDao {

    private final Logger log = LoggerFactory.getLogger(FtsDao.class);

    private static final ResourceQualifier DOCUMENTS = new ResourceQualifier(SYSTEM_SCHEMA_NAME,
                                                                             "fts_documents",
                                                                             LIBRARY);

    private final PrincipalService principalService;
    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public FtsDao(PrincipalService principalService,
                  NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.principalService = principalService;
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public void copySourceData(ResourceQualifier qualifier,
                               SchemaDto schema) {
        try {
            String query = buildCopyDataToFtsLayersQuery(qualifier, getFtsProperties(schema));

            log.debug("Copy source: '{}' data to FTS table query: [{}]", qualifier.getQualifier(), query);

            pJdbcTemplate.getJdbcTemplate().update(query);
        } catch (Exception e) {
            log.error("Не удалось выполнить перенос данных в таблицу для полнотекстового поиска из таблицы: '{}'. " +
                              "По причине: {}", qualifier.getQualifier(), e.getMessage(), e);
        }
    }

    public void dropSourceData(ResourceQualifier qualifier) {
        String ftsTable = "fts_layers";
        if (qualifier.getType().equals(LIBRARY)) {
            ftsTable = "fts_documents";
        }

        String query = String.format("DELETE FROM data.%s WHERE \"schema\" = :schema AND \"table\" = :table", ftsTable);

        log.debug("Delete source: '{}' from fts table query: [{}]", qualifier.getQualifier(), query);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("schema", qualifier.getSchema(), VARCHAR);
        parameters.addValue("table", qualifier.getTable(), VARCHAR);

        pJdbcTemplate.update(query, parameters);
    }

    public List<FtsItem> search(ResourceQualifier qualifier,
                                List<String> requestedTables,
                                String ecqlFilter,
                                String text,
                                float bound,
                                Pageable pageable) {
        String query = buildFtsQuery(qualifier, ecqlFilter, bound, requestedTables, pageable);

        log.debug("fts by '{}': [{}]", qualifier.getQualifier(), query);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("searchedText", text, VARCHAR);

        return pJdbcTemplate.query(query, parameters, new BeanPropertyRowMapper<>(FtsItem.class));
    }

    public List<FtsItem> searchWithPermissions(ResourceQualifier qualifier, FtsRequestDto dto, float bound) {
        return searchWithPermissions(qualifier, dto.getEcqlFilter(), dto.getText(), bound, null);
    }

    public List<FtsItem> searchWithPermissions(ResourceQualifier libraryQualifier,
                                               String ecqlFilter,
                                               String text,
                                               float bound,
                                               @Nullable RegistryData registryData) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return new ArrayList<>();
        }

        String ftsQuery = buildFtsQuery(DOCUMENTS, ecqlFilter, bound, List.of(libraryQualifier.getTable()));
        String findAllowedQuery = buildFindAllowedForRegistryQuery(libraryQualifier, ecqlFilter);

        String resultQuery = "" +
                "SELECT result.dist, result.schema, result.table, result.id " +
                "FROM (" + ftsQuery + ") AS result " +
                "JOIN (" + findAllowedQuery + ") AS document ON result.id = document.id";

        log.debug("fts query for document-library: [{}]", resultQuery);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("searchedText", text, VARCHAR);

        return pJdbcTemplate.query(resultQuery, parameters, new BeanPropertyRowMapper<>(FtsItem.class));
    }

    public Long countTotal(ResourceQualifier qualifier,
                           List<String> resources,
                           String ecqlFilter,
                           String text,
                           float bound) {
        String query = "SELECT count(*) FROM " + qualifier.getTableQualifier() + " AS d " +
                " " + buildFtsWhere(ecqlFilter, bound, resources);

        log.debug("fts count total for documents: [{}]", query);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("searchedText", text, VARCHAR);

        return pJdbcTemplate.queryForObject(query, parameters, Long.class);
    }
}
