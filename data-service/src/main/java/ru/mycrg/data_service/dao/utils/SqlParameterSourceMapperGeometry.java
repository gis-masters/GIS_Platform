package ru.mycrg.data_service.dao.utils;

import org.postgresql.util.PGobject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.sql.SQLException;

@Component
public class SqlParameterSourceMapperGeometry implements SqlParameterSourceMapper {

    private final Logger log = LoggerFactory.getLogger(SqlParameterSourceMapperGeometry.class);

    @Override
    public void map(MapSqlParameterSource parameterSource, SimplePropertyDto property, Object value) {
        String name = property.getName().toLowerCase();
        try {
            PGobject geometry = new PGobject();
            geometry.setType("public.geometry");
            geometry.setValue(value.toString());

            parameterSource.addValue(name, geometry);
        } catch (SQLException e) {
            log.warn("Failed to map GEOMETRY value to sql parameter source: {}", value);

            parameterSource.addValue(name, value);
        }
    }

    @Override
    public ValueType getType() {
        return ValueType.GEOMETRY;
    }
}
