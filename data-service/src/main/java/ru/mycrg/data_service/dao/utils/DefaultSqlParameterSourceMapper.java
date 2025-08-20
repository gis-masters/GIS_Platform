package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

@Component
public class DefaultSqlParameterSourceMapper implements SqlParameterSourceMapper {

    private final Logger log = LoggerFactory.getLogger(DefaultSqlParameterSourceMapper.class);

    @Override
    public void map(@NotNull MapSqlParameterSource parameterSource,
                    @NotNull SimplePropertyDto property,
                    @NotNull Object value) {
        log.trace("Use default parameter source mapper for property: '{}' with type: '{}'",
                  property.getName(), property.getValueTypeAsEnum());

        parameterSource.addValue(property.getName().toLowerCase(), value);
    }

    @Override
    public ValueType getType() {
        return null;
    }
}
