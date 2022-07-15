package ru.mycrg.data_service.dao.utils;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

@Component
public class DefaultSqlParameterSourceMapper implements SqlParameterSourceMapper {

    @Override
    public void map(MapSqlParameterSource parameterSource, SimplePropertyDto property, Object value) {
        parameterSource.addValue(property.getName().toLowerCase(), value);
    }

    @Override
    public ValueType getType() {
        return null;
    }
}
