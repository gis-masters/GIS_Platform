package ru.mycrg.data_service.dao.utils;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

public interface SqlParameterSourceMapper {

    void map(MapSqlParameterSource sqlParameterSource, SimplePropertyDto property, Object value);

    ValueType getType();
}
