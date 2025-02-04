package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dto.FtsHeadline;
import ru.mycrg.data_service.dto.FtsItem;
import ru.mycrg.data_service.dto.RegistryData;
import ru.mycrg.data_service.service.PrincipalService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.*;
import java.util.stream.Collectors;

import static java.sql.Types.VARCHAR;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.*;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getFtsProperties;
import static ru.mycrg.data_service.util.StringUtil.removeSpecificChars;

@Repository
public class FtsDao {

    private final Logger log = LoggerFactory.getLogger(FtsDao.class);

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
                                String text,
                                @NotNull Set<String> words,
                                Pageable pageable) {
        String query = buildFtsLayersQuery(requestedTables, words, pageable);

        log.debug("fts v2 query by '{}': [{}]", qualifier.getQualifier(), query);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("searchedText", text, VARCHAR);

        return pJdbcTemplate.query(query, parameters, new BeanPropertyRowMapper<>(FtsItem.class));
    }

    public List<FtsItem> searchCadastrNumber(ResourceQualifier qualifier,
                                             List<String> requestedTables,
                                             @Nullable String ecqlFilter,
                                             String text,
                                             Pageable pageable) {
        String query = buildCadastrNumberQuery(qualifier, requestedTables, ecqlFilter, pageable);

        log.debug("Search cadastr number query: [{}]", query);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("searchedText", "%" + text + "%", VARCHAR);

        return pJdbcTemplate.query(query, parameters, new BeanPropertyRowMapper<>(FtsItem.class));
    }

    public List<FtsItem> searchWithPermissions(ResourceQualifier libraryQualifier,
                                               String ecqlFilter,
                                               String text,
                                               @NotNull Set<String> words,
                                               @Nullable RegistryData registryData) {
        List<String> allPrincipalIds = principalService.getAllIds();
        if (allPrincipalIds.isEmpty()) {
            return new ArrayList<>();
        }

        String ftsQuery = buildFtsDocumentsQuery(ecqlFilter, List.of(libraryQualifier.getTable()), words);
        String findAllowedQuery = buildFindAllowedForRegistryQuery(libraryQualifier, ecqlFilter, registryData);

        String resultQuery = "" +
                "SELECT result.dist, result.schema, result.table, result.id, result.concatenated_data " +
                "FROM (" + ftsQuery + ") AS result " +
                "JOIN (" + findAllowedQuery + ") AS document ON result.id = document.id " +
                "ORDER BY dist LIMIT 10";

        log.debug("fts query for document-library: [{}]", resultQuery);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("searchedText", text, VARCHAR);

        return pJdbcTemplate.query(resultQuery, parameters, new BeanPropertyRowMapper<>(FtsItem.class));
    }

    public Set<FtsHeadline> searchHeadlines(@NotNull String baseWord,
                                            @NotNull String text) {
        Set<String> preparedText = Arrays.stream(removeSpecificChars(text).split(" "))
                                         .filter(w -> w.length() > 1)
                                         .filter(w -> !w.contains(ROOT_FOLDER_PATH))
                                         .collect(Collectors.toSet());
        String query = buildHeadlinesQuery(baseWord, preparedText);

        log.trace("Query for search selection: [{}]", query);

        List<FtsHeadline> headlines = pJdbcTemplate
                .getJdbcTemplate()
                .query(query, (rs, rowNum) -> new FtsHeadline(rs.getString(1), rs.getFloat(2)));

        return new HashSet<>(headlines);
    }
}
