package ru.mycrg.data_service.service.gpkg.importer.mappers;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgSvg;

import java.sql.ResultSet;
import java.sql.SQLException;

import static ru.mycrg.data_service.service.gpkg.export.tables.SvgContentWriter.GPKG_SVG_SVG_BODY_COLUMN;
import static ru.mycrg.data_service.service.gpkg.export.tables.SvgContentWriter.GPKG_SVG_SVG_NAME_COLUMN;

@Component
public class GpkgImportedSvgMapper implements RowMapper<GpkgSvg> {

    @Override
    public GpkgSvg mapRow(ResultSet rs, int rowNum) throws SQLException {
        GpkgSvg dto = new GpkgSvg();

        dto.setTitle(rs.getString(GPKG_SVG_SVG_NAME_COLUMN));
        dto.setBody(rs.getString(GPKG_SVG_SVG_BODY_COLUMN));

        return dto;
    }
}
