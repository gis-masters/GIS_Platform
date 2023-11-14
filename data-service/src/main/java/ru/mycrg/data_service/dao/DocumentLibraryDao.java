package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.mappers.DocLibraryMapper;
import ru.mycrg.data_service.entity.DocumentLibrary;

import java.util.List;

import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildOrderBySection;

// TODO: уже пора подумать и привести DocumentLibraryDao, ProcessDao и RecordsDao к единому знаменателю
@Repository
public class DocumentLibraryDao {

    private final Logger log = LoggerFactory.getLogger(DocumentLibraryDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public DocumentLibraryDao(NamedParameterJdbcTemplate pJdbcTemplate) {
        this.pJdbcTemplate = pJdbcTemplate;
    }

    public List<DocumentLibrary> findAll(String ecqlFilter,
                                         Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("offset", pageable.getOffset())
                .addValue("limit", pageable.getPageSize());

        String query = "SELECT * FROM doc_libraries" +
                "  " + buildWhereSection(ecqlFilter) +
                "  " + buildOrderBySection(pageable.getSort()) +
                "  LIMIT :limit OFFSET :offset";

        log.debug("Request find all by path: [{}]", query);

        return pJdbcTemplate.query(query,
                                   params,
                                   new RowMapperResultSetExtractor<>(
                                           new DocLibraryMapper()
                                   ));
    }

    public List<DocumentLibrary> findAll(String ecqlFilter) {
        String query = "SELECT * FROM doc_libraries " + buildWhereSection(ecqlFilter);

        log.debug("Request find all by path: [{}]", query);

        return pJdbcTemplate.query(query,
                                   new RowMapperResultSetExtractor<>(
                                           new DocLibraryMapper()
                                   ));
    }

    public Long getTotal(String ecqlFilter) {
        String query = "SELECT count(*) FROM doc_libraries" + " " + buildWhereSection(ecqlFilter);

        log.debug("Query getTotal docLibraries: [{}]", query);

        return pJdbcTemplate.getJdbcTemplate().queryForObject(query, Long.class);
    }
}
