package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

public interface SqlParameterSourceMapper {

    void map(@NotNull MapSqlParameterSource sqlParameterSource,
             @NotNull SimplePropertyDto property,
             @NotNull Object value);

    ValueType getType();
}
