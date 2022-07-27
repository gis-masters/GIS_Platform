package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import static java.sql.Types.LONGVARCHAR;
import static ru.mycrg.data_service_contract.enums.ValueType.TEXT;

@Component
public class SqlParameterSourceMapperText implements SqlParameterSourceMapper {

    @Override
    public void map(@NotNull MapSqlParameterSource parameterSource,
                    @NotNull SimplePropertyDto property,
                    @NotNull Object value) {
        parameterSource.addValue(property.getName().toLowerCase(), value, LONGVARCHAR);
    }

    @Override
    public ValueType getType() {
        return TEXT;
    }
}
