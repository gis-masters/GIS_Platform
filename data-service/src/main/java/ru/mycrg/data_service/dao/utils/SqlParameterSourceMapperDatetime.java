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
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

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
        if (value instanceof LocalDateTime) {
            parameterSource.addValue(name, value);

            return;
        }

        LocalDateTime dateTime = null;
        String asString = value.toString();
        if (asString.isEmpty()) {
            return;
        }

        try {
            log.trace("'{}' try as DateTime '{}'", value, SYSTEM_DATETIME_PATTERN);

            dateTime = LocalDateTime.parse(asString, DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN));
        } catch (Exception e) {
            log.debug("Not a DateTime '{}'", SYSTEM_DATETIME_PATTERN);
            try {
                log.debug("Try as LocalDateTime 'yyyy-MM-ddTHH:mm:ss'");
                dateTime = LocalDateTime.parse(asString, DateTimeFormatter.ISO_LOCAL_DATE_TIME).withNano(0);
            } catch (Exception e1) {
                log.debug("Not a LocalDateTime 'yyyy-MM-ddTHH:mm:ss'");
                try {
                    log.debug("Try as LocalDate '{}'", SYSTEM_DATE_PATTERN);

                    dateTime = LocalDate.parse(asString, DateTimeFormatter.ofPattern(SYSTEM_DATE_PATTERN))
                            .atTime(0, 0, 0);
                } catch (Exception e2) {
                    log.warn("Not a LocalDate '{}'", SYSTEM_DATE_PATTERN);
                    try {
                        log.debug("Try as Zoned(ISO_ZONED_DATE_TIME) 'yyyy-MM-dd'T'HH:mm:ssZ'. Use ONE format plz!");

                        dateTime = ZonedDateTime.parse(asString).toLocalDateTime();
                    } catch (Exception e3) {
                        log.error("Not supported DateTime format: {}", asString);
                    }
                }
            }
        }

        parameterSource.addValue(name, dateTime);
    }

    @Override
    public ValueType getType() {
        return DATETIME;
    }
}
