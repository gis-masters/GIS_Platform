package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ForeignKeyType;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.sql.Types;

import static ru.mycrg.data_service_contract.enums.ForeignKeyType.LONG;
import static ru.mycrg.data_service_contract.enums.ValueType.CHOICE;

@Component
public class SqlParameterSourceMapperChoice implements SqlParameterSourceMapper {

    private final Logger log = LoggerFactory.getLogger(SqlParameterSourceMapperChoice.class);

    @Override
    public void map(@NotNull MapSqlParameterSource parameterSource,
                    @NotNull SimplePropertyDto property,
                    @NotNull Object value) {
        String name = property.getName().toLowerCase();

        ForeignKeyType propertyFKType = property.getForeignKeyType();
        if (LONG == propertyFKType) {
            parameterSource.addValue(name, value, Types.BIGINT);
        } else if (ForeignKeyType.INTEGER == propertyFKType) {
            parameterSource.addValue(name, value, Types.INTEGER);
        } else if (ForeignKeyType.STRING == propertyFKType) {
            parameterSource.addValue(name, value);
        } else {
            log.trace("Not set 'foreignKeyType' for CHOICE property: '{}'. Handle it as string by default", name);

            parameterSource.addValue(name, value);
        }
    }

    @Override
    public ValueType getType() {
        return CHOICE;
    }
}
