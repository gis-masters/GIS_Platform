package ru.mycrg.data_service.dao.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import static java.sql.Types.BOOLEAN;

@Component
public class SqlParameterSourceMapperBoolean implements SqlParameterSourceMapper {

    private final Logger log = LoggerFactory.getLogger(SqlParameterSourceMapperBoolean.class);

    @Override
    public void map(MapSqlParameterSource parameterSource, SimplePropertyDto property, Object value) {
        String name = property.getName().toLowerCase();
        if ("true".equals(value)) {
            parameterSource.addValue(name, true, BOOLEAN);
        } else if ("false".equals(value)) {
            parameterSource.addValue(name, false, BOOLEAN);
        } else {
            log.warn("Unknown boolean value: {}", value);

            parameterSource.addValue(name, value);
        }
    }

    @Override
    public ValueType getType() {
        return ValueType.BOOLEAN;
    }
}
