package ru.mycrg.data_service.service.gpkg.importer.mappers;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgStyle;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class GpkgImportedStylesMapper implements RowMapper<GpkgStyle> {

    public static final String GPKG_STYLE_LAYER_STYLE_NAME = "stylename";
    public static final String GPKG_STYLE_LAYER_STYLE_SLD = "stylesld";

    @Override
    public GpkgStyle mapRow(ResultSet rs, int rowNum) throws SQLException {
        GpkgStyle dto = new GpkgStyle();

        dto.setName(rs.getString(GPKG_STYLE_LAYER_STYLE_NAME));
        dto.setBody(rs.getString(GPKG_STYLE_LAYER_STYLE_SLD));

        return dto;
    }
}
