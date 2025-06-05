package ru.mycrg.data_service.service.cqrs.schema_comparator;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesSpecial;
import ru.mycrg.data_service.dto.ColumnShortInfo;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.mappers.TypeMapper;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static ru.mycrg.data_service.service.schemas.SchemaUtil.getPropertyByName;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Component
public class SchemaTableComparator {

    private final Logger log = LoggerFactory.getLogger(SchemaTableComparator.class);

    private final DdlTablesSpecial ddlTablesSpecial;

    public SchemaTableComparator(DdlTablesSpecial ddlTablesSpecial) {
        this.ddlTablesSpecial = ddlTablesSpecial;
    }

    @NotNull
    public Set<ErrorInfo> comparate(@NotNull SchemaDto schema,
                                    @NotNull ResourceQualifier qualifier) {
        Set<ErrorInfo> mismatches = new HashSet<>();
        try {
            List<ColumnShortInfo> columnsShortInfo = ddlTablesSpecial.getColumnShortInfo(qualifier.getTable());
            log.info("columnsShortInfo:{}", columnsShortInfo);

            // Проверка колонок БД на наличие в схеме
            checkColumnsInSchema(columnsShortInfo, schema, mismatches);

            // Проверка свойств схемы на наличие в БД
            checkSchemaPropertiesInDb(columnsShortInfo, schema, mismatches);

            return mismatches;
        } catch (Exception e) {
            logError("Не удалось проверить соответствие схемы и таблицы", e);

            throw new DataServiceException("Не удалось проверить соответствие схемы и таблицы");
        }
    }

    private void checkColumnsInSchema(List<ColumnShortInfo> columnsShortInfo,
                                      SchemaDto schema,
                                      Set<ErrorInfo> mismatches) {
        for (ColumnShortInfo columnInfo: columnsShortInfo) {
            String columnName = columnInfo.getColumnName();
            Optional<SimplePropertyDto> oProp = getPropertyByName(schema, columnName);

            if (oProp.isEmpty()) {
                String msg = "Поле '" + columnName + "' существует в таблице, но отсутствует в схеме";
                mismatches.add(new ErrorInfo(columnName, msg));

                continue;
            }

            validateColumn(columnInfo, oProp.get(), mismatches);
        }
    }

    private void checkSchemaPropertiesInDb(List<ColumnShortInfo> columnsShortInfo,
                                           SchemaDto schema,
                                           Set<ErrorInfo> mismatches) {
        for (SimplePropertyDto property: schema.getProperties()) {
            String name = property.getName();
            Optional<ColumnShortInfo> oInfo = columnsShortInfo
                    .stream()
                    .filter(colInfo -> colInfo.getColumnName().equalsIgnoreCase(name))
                    .findFirst();

            if (oInfo.isEmpty()) {
                String msg = "Поле '" + name + "' описано схемой, но отсутствует в таблице";
                mismatches.add(new ErrorInfo(name, msg));

                continue;
            }

            validateColumn(oInfo.get(), property, mismatches);
        }
    }

    private void validateColumn(ColumnShortInfo columnInfo,
                                SimplePropertyDto property,
                                Set<ErrorInfo> mismatches) {
        String columnName = columnInfo.getColumnName();
        String columnType = columnInfo.getUdtName();
        ValueType schemaType = ValueType.valueOf(property.getValueType());

        // Проверка типа
        if (!TypeMapper.compare(columnType, schemaType)) {
            String msg = String.format("Тип поля '%s' в схеме не совпадает с типом в таблице. [%s ≠ %s]",
                                       columnName, schemaType.name(), columnType);
            mismatches.add(new ErrorInfo(columnName, msg));

            return;
        }

        // Проверка длины строки
        if (schemaType == ValueType.STRING) {
            int schemaLength = property.getLength() != null
                    ? property.getLength()
                    : 255;
            int dbLength = columnInfo.getCharacterMaximumLength() != null
                    ? columnInfo.getCharacterMaximumLength()
                    : Integer.MAX_VALUE;

            if (dbLength < schemaLength) {
                String msg = String.format("Длина поля '%s' в БД: %d меньше указанной в схеме: %d",
                                           columnName, dbLength, schemaLength);
                mismatches.add(new ErrorInfo(columnName, msg));
            }
        }
    }
}
