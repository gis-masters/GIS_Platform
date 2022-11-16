package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATETIME_PATTERN;
import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATE_PATTERN;
import static ru.mycrg.data_service_contract.enums.ValueType.DATETIME;

@Component
public class SqlParameterSourceMapperDatetime implements SqlParameterSourceMapper {

    private final Logger log = LoggerFactory.getLogger(SqlParameterSourceMapperDatetime.class);

    @Override
    public void map(@NotNull MapSqlParameterSource parameterSource,
                    @NotNull SimplePropertyDto property,
                    @NotNull Object value) {
        String name = property.getName().toLowerCase();

        if (value instanceof Date) {
            parameterSource.addValue(name, value);

            return;
        }

        if (value instanceof LocalDateTime) {
            parameterSource.addValue(name, value);

            return;
        }

        LocalDateTime dateTime;
        String asString = value.toString();
        if (asString.isEmpty()) {
            dateTime = null;
        } else {
            try {
                dateTime = LocalDateTime.parse(asString, DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN));
            } catch (Exception e) {
                String msg = String.format("Datetime '{}' does not match format: '%s'. Try without time as '%s'",
                                           SYSTEM_DATETIME_PATTERN, SYSTEM_DATE_PATTERN);
                log.debug(msg, value);

                dateTime = LocalDate.parse(asString, DateTimeFormatter.ofPattern(SYSTEM_DATE_PATTERN))
                                    .atTime(0, 0, 0);
            }
        }

        parameterSource.addValue(name, dateTime);
    }

    @Override
    public ValueType getType() {
        return DATETIME;
    }
}
