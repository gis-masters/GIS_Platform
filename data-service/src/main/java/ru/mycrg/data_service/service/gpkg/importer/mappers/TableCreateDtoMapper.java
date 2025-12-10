package ru.mycrg.data_service.service.gpkg.importer.mappers;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.TableCreateDto;

import java.sql.ResultSet;
import java.sql.SQLException;

import static ru.mycrg.data_service.service.gpkg.export.tables.VectorTableInfoWriter.*;

/**
 * RowMapper для маппинга результатов запроса в TableCreateDto. Используется для извлечения информации о таблицах из
 * GPKG файлов.
 */
@Component
public class TableCreateDtoMapper implements RowMapper<TableCreateDto> {

    @Override
    public TableCreateDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        TableCreateDto dto = new TableCreateDto();

        // Маппинг полей из результата запроса в DTO
        // layer_name -> title
        dto.setTitle(rs.getString(GPKG_VECTOR_TABLE_NAME_COLUMN));

        // epsg_code -> crs
        dto.setCrs(rs.getString(GPKG_VECTOR_TABLE_EPSG_CODE_COLUMN));

        // description -> details
        dto.setDetails(rs.getString(GPKG_VECTOR_TABLE_DESCRIPTION_COLUMN));

        return dto;
    }
}
