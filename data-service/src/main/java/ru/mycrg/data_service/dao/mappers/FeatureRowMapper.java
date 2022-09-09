package ru.mycrg.data_service.dao.mappers;

import org.jetbrains.annotations.Nullable;
import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Map;

import static java.sql.Types.*;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;

public class FeatureRowMapper extends BySchemaRowMapper implements RowMapper<Feature> {

    public FeatureRowMapper(@Nullable SchemaDto schema) {
        super(schema);
    }

    @Override
    public Feature mapRow(ResultSet rs, int rowNum) throws SQLException {
        Feature feature = new Feature();
        Map<String, Object> properties = feature.getProperties();

        ResultSetMetaData metaData = rs.getMetaData();
        int i = 1;
        while (i <= metaData.getColumnCount()) {
            String columnName = metaData.getColumnName(i);

            switch (metaData.getColumnType(i)) {
                case BIT:
                    properties.put(columnName, rs.getBoolean(i));
                    break;
                case BIGINT:
                    properties.put(columnName, rs.getLong(i));
                    break;
                case INTEGER:
                    properties.put(columnName, rs.getInt(i));
                    break;
                case OTHER:
                    if (rs.getObject(i) != null && schema != null) {
                        handleBySchema(properties, columnName, rs.getObject(i));
                    } else {
                        properties.put(columnName, rs.getString(i));
                    }
                    break;
                default:
                    properties.put(columnName, rs.getString(i));
                    break;
            }

            i++;
        }

        Object primaryKey = properties.get(PRIMARY_KEY);
        if (primaryKey != null) {
            feature.setId(Long.valueOf(primaryKey.toString()));
        }

        return feature;
    }
}
