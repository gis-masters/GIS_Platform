package ru.mycrg.data_service.dao.mappers;

import org.jetbrains.annotations.Nullable;
import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.ID;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;

public class FeatureRowMapper extends BySchemaRowMapper implements RowMapper<Feature> {

    public FeatureRowMapper(@Nullable SchemaDto schema) {
        super(schema);
    }

    @Override
    public Feature mapRow(ResultSet rs, int rowNum) throws SQLException {
        Feature feature = new Feature();
        Map<String, Object> properties = feature.getProperties();

        extract(rs, properties);

        Object primaryKey = properties.get(PRIMARY_KEY);
        if (primaryKey != null) {
            feature.setId(Long.valueOf(primaryKey.toString()));
        }

        primaryKey = properties.get(ID);
        if (primaryKey != null) {
            feature.setId(Long.valueOf(primaryKey.toString()));
        }

        return feature;
    }
}
