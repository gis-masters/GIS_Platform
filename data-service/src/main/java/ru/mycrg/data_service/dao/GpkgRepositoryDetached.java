package ru.mycrg.data_service.dao;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgImportedStyles;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgImportedSvg;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.gpkg.importer.mappers.GpkgImportedStylesMapper;
import ru.mycrg.data_service.service.gpkg.importer.mappers.GpkgImportedSvgMapper;
import ru.mycrg.data_service.service.gpkg.importer.mappers.LayerProjectionMapper;
import ru.mycrg.data_service.service.gpkg.importer.mappers.TableCreateDtoMapper;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.service.gpkg.export.GpkgWriter.*;
import static ru.mycrg.data_service.service.gpkg.importer.mappers.GpkgImportedStylesMapper.GPKG_STYLE_LAYER_STYLE_NAME;
import static ru.mycrg.data_service.service.gpkg.importer.mappers.GpkgImportedStylesMapper.GPKG_STYLE_LAYER_STYLE_SLD;
import static ru.mycrg.data_service.service.gpkg.importer.mappers.LayerProjectionMapper.*;

@Repository
public class GpkgRepositoryDetached {

    private final Logger log = LoggerFactory.getLogger(GpkgRepositoryDetached.class);

    public Optional<SchemaDto> getSchemaFromSchemaTable(JdbcTemplate jdbcTemplate,
                                                        String schema,
                                                        String filterParam) {
        String sql = "SELECT " + GPKG_SCHEMA_JSON_COLUMN + " " +
                "FROM " + schema + "." + GPKG_VECTOR_TABLE_SCHEMAS_TABLE + " " +
                "WHERE resource_name LIKE '%." + filterParam + "' LIMIT 1";

        try {
            String jsonString = jdbcTemplate.queryForObject(sql, String.class);

            return JsonConverter.fromJson(jsonString, new TypeReference<SchemaDto>() {
            });
        } catch (Exception e) {
            log.error("Не удалось найти информацию о векторной таблице. Причина: {}", e.getMessage());

            return Optional.empty();
        }
    }

    public Optional<TableCreateDto> getTableInfo(JdbcTemplate jdbcTemplate,
                                                 String schema,
                                                 String tableName) {

        String sql = "SELECT * " +
                "FROM " + schema + "." + GPKG_VECTOR_TABLE_INFO_TABLE + " " +
                "WHERE resource_name LIKE '%." + tableName + "' LIMIT 1";

        try {
            List<TableCreateDto> results = jdbcTemplate.query(sql, new TableCreateDtoMapper());

            return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
        } catch (Exception e) {
            log.error("Не удалось прочитать информацию о векторной таблице из временного хранилища {}", e.getMessage());

            return Optional.empty();
        }
    }

    public List<LayerProjection> getLayerInfoFromGpkg(JdbcTemplate jdbcTemplate,
                                                      String schema,
                                                      String oldTableName) {
        List<LayerProjection> layerProjections = new ArrayList<>();

        String sql = "SELECT *, " +
                "CONCAT(" + GPKG_LAYER_INFO_DATASET + ", '.', " + GPKG_LAYER_INFO_RESOURCE_ID + ")" +
                " AS " + GPKG_LAYER_INFO_COMPLEX_NAME + ", " +
                "createdAt::timestamp(6) AS " + GPKG_LAYER_INFO_CREATED_ATER + ", " +
                "lastModified::timestamp(6) AS " + GPKG_LAYER_INFO_LAST_MODIFIEDEER + " " +
                "FROM " + schema + "." + GPKG_LAYER_INFO_TABLE + " " +
                "WHERE " + GPKG_LAYER_INFO_RESOURCE_ID + " LIKE '" + oldTableName + "'";

        log.debug("Query получения списка crg слоёв: [{}], для {}", sql, oldTableName);
        try {
            layerProjections = jdbcTemplate.query(sql, new LayerProjectionMapper());

            return layerProjections;
        } catch (Exception e) {
            log.error("Не удалось прочитать информацию о crg слоях из временного хранилища {}", e.getMessage());

            return layerProjections;
        }
    }

    public List<GpkgImportedStyles> getStyleInfoFromGpkg(JdbcTemplate jdbcTemplate,
                                                         String schema,
                                                         String styleName) {

        List<GpkgImportedStyles> styles = new ArrayList<>();
        if (styleName == null || styleName.equals("__custom__")) {
            return styles;
        }

        String sqlGetLayer = "SELECT " + GPKG_STYLE_LAYER_STYLE_NAME + ", " + GPKG_STYLE_LAYER_STYLE_SLD + " " +
                "FROM " + schema + "." + GPKG_STYLE_LAYER_TABLE +
                " WHERE " + GPKG_STYLE_LAYER_STYLE_NAME + " = ?";

        log.debug("Query получения списка стилей: [{}] для '{}'", sqlGetLayer, styleName);

        try {
            styles = jdbcTemplate.query(sqlGetLayer, new GpkgImportedStylesMapper(), styleName);
        } catch (Exception e) {
            log.warn("Ошибка чтения из {}: {}", GPKG_STYLE_LAYER_TABLE, e.getMessage());
        }

        styles.forEach(style -> {
            List<GpkgImportedSvg> svgs = getSvgInfoFromGpkg(jdbcTemplate, schema, styleName);
            if (!svgs.isEmpty()) {
                style.setSvgs(svgs);
            }
        });

        return styles;
    }

    private List<GpkgImportedSvg> getSvgInfoFromGpkg(JdbcTemplate jdbcTemplate,
                                                     String schema,
                                                     String styleName) {
        List<GpkgImportedSvg> svgs = new ArrayList<>();
        String sqlGetSvg = "SELECT " + GPKG_SVG_SVG_NAME_COLUMN + ", " + GPKG_SVG_SVG_BODY_COLUMN + " " +
                "FROM " + schema + "." + GPKG_SVG_CONTENT_TABLE +
                " WHERE " + GPKG_SVG_STYLE_NAME_COLUMN + " = ?";

        log.debug("Query получения списка svg: [{}] + [{}]", sqlGetSvg, styleName);

        try {
            svgs = jdbcTemplate.query(sqlGetSvg, new GpkgImportedSvgMapper(), styleName);
        } catch (Exception e) {
            log.warn("Ошибка чтения таблицы {}: {}", GPKG_SVG_STYLE_NAME_COLUMN, e.getMessage());
        }

        return svgs;
    }
}
