package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.geo_json.Feature;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getPropertyByName;

@Component
public class SqlParameterSourceFactory {

    private final Map<ValueType, SqlParameterSourceMapper> sourceMappers;
    private final SqlParameterSourceMapper defaultSqlParameterSourceMapper;

    public SqlParameterSourceFactory(List<SqlParameterSourceMapper> sourceMappers) {
        this.defaultSqlParameterSourceMapper = new DefaultSqlParameterSourceMapper();
        this.sourceMappers = sourceMappers.stream()
                                          .collect(toMap(SqlParameterSourceMapper::getType, Function.identity()));
    }

    @NotNull
    public MapSqlParameterSource buildParameterizedSource(@NotNull Feature feature,
                                                          @NotNull SchemaDto schema) {
        MapSqlParameterSource parameterSource = new MapSqlParameterSource();
        feature.getProperties().forEach((paramName, value) -> {
            if (value == null) {
                parameterSource.addValue(paramName, null);
            } else {
                getPropertyByName(schema, paramName).ifPresentOrElse(property -> {
                    sourceMappers.getOrDefault(property.getValueTypeAsEnum(), defaultSqlParameterSourceMapper)
                                 .map(parameterSource, property, value);
                }, () -> {
                    parameterSource.addValue(paramName, value);
                });
            }
        });

        return parameterSource;
    }
}
