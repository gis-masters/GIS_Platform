package ru.mycrg.data_service.dao.detached;

import com.healthmarketscience.sqlbuilder.*;
import com.healthmarketscience.sqlbuilder.custom.postgresql.PgLimitClause;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbColumn;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSchema;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbSpec;
import com.healthmarketscience.sqlbuilder.dbspec.basic.DbTable;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service.util.filter.FilterItem;

import java.util.List;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.fillWhereSectionByFilter;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.EXTENSION_TABLE_ID;

@Transactional
public class ValidationResultDao {

    private final Logger log = LoggerFactory.getLogger(ValidationResultDao.class);

    private final JdbcTemplate jdbcTemplate;

    public ValidationResultDao(DatasourceFactory datasourceFactory, String dbName) {
        this.jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));
    }

    public List<IRecord> findPagedByFilter(ResourceQualifier rQualifier,
                                           Pageable pageable,
                                           CrgFilter filter) {
        DbTable table = getDbTable(rQualifier);

        SelectQuery selectQuery = new SelectQuery().addAllTableColumns(table);

        if (!filter.getFilters().isEmpty()) {
            fillConditions(table, selectQuery, filter.getFilters());
        }

        if (pageable.getOffset() > -1) {
            selectQuery.setOffset(pageable.getOffset());
        }

        if (pageable.getPageSize() > -1) {
            PgLimitClause limitClause = new PgLimitClause(pageable.getPageSize());
            selectQuery.addCustomization(limitClause);
        }

        pageable.getSort().forEach(order -> {
            String property = order.getProperty();

            OrderObject.Dir direction = order.getDirection().isAscending()
                    ? OrderObject.Dir.ASCENDING
                    : OrderObject.Dir.DESCENDING;

            DbColumn column = table.addColumn(property);

            selectQuery.addOrdering(column, direction);
        });

        log.info("SELECT QUERY: {}", selectQuery);

        return jdbcTemplate.query(selectQuery.toString(),
                                  new RowMapperResultSetExtractor<>(
                                          new RecordRowMapper(null)
                                  ));
    }

    public long getTotal(ResourceQualifier tableQualifier, CrgFilter filter) throws CrgDaoException {
        try {
            String sqlTemplate = "SELECT count(*) FROM " + tableQualifier.getQualifier();

            if (!filter.getFilters().isEmpty()) {
                sqlTemplate += " WHERE object_id > 0" + fillWhereSectionByFilter(filter);
            }

            log.debug("Request find total by: [{}]", sqlTemplate);

            return jdbcTemplate.queryForObject(sqlTemplate, Long.class);
        } catch (Exception e) {
            throw new CrgDaoException(String.format("Не удалось подсчитать общее кол-во в: %s",
                                                    tableQualifier.getQualifier()), e.getCause());
        }
    }

    private DbTable getDbTable(@NotNull ResourceQualifier rQualifier) {
        DbSpec spec = new DbSpec();
        DbSchema dbSchema = spec.addSchema(rQualifier.getSchema());

        DbTable dbTable = dbSchema.addTable(rQualifier.getTable());
        dbTable.addColumn(EXTENSION_TABLE_ID.getName());
        dbTable.addColumn("violations");
        dbTable.addColumn("_xmin");
        dbTable.addColumn("valid");
        dbTable.addColumn("class_id");

        return dbTable;
    }

    private void fillConditions(DbTable table, SelectQuery selectQuery, List<FilterItem> filters) {
        filters.forEach(filterItem -> {
            FilterCondition condition = filterItem.getCondition();
            String value = filterItem.getValue();
            String field = filterItem.getField();

            DbColumn fieldColumn = table.findColumn(field);
            switch (condition) {
                case IS_NULL:
                    selectQuery.addCondition(UnaryCondition.isNull(fieldColumn));

                    break;
                case EQUAL_TO:
                    selectQuery.addCondition(BinaryCondition.equalTo(fieldColumn, value));

                    break;
                case LIKE:
                    final String likeCondition = String.format("LOWER(%s) LIKE LOWER('%%%s%%')",
                                                               fieldColumn.getColumnNameSQL(), value);
                    selectQuery.addCondition(new CustomCondition(likeCondition));

                    break;
                default:
                    log.warn("Unsupported filter condition: {}", condition);
            }
        });
    }
}
