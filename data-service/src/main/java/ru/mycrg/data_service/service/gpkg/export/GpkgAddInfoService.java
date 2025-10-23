package ru.mycrg.data_service.service.gpkg.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.repository.SchemasAndTablesRepositoryDetached;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.data_service_contract.dto.gpkg.StyleWithIcons;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import java.util.List;

@Service
public class GpkgAddInfoService {

    private final Logger log = LoggerFactory.getLogger(GpkgAddInfoService.class);

    private final GpkgAppender gpkgBuilder;
    private final SchemasAndTablesRepositoryDetached schemasAndTablesRepository;
    private final DatasourceFactory datasourceFactory;

    public GpkgAddInfoService(GpkgAppender gpkgBuilder,
                              SchemasAndTablesRepositoryDetached schemasAndTablesRepository,
                              DatasourceFactory datasourceFactory) {
        this.gpkgBuilder = gpkgBuilder;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.datasourceFactory = datasourceFactory;
    }

    public void appendAllExistData(String pathToGpkg,
                                   String dbName,
                                   GpkgAppendingData data) {
        appendStylesAndLayersInfo(pathToGpkg, data.getStylesAndSvgs(), data.getLayerProjections());

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));

        for (ExportResourceModel resource: data.getResourceProjections()) {
            schemasAndTablesRepository
                    .findByIdentifier(jdbcTemplate, resource.getTable())
                    .ifPresentOrElse(table -> {
                        addSchemaToTable(pathToGpkg, table.getSchema(), resource);

                        addVectorTableInfoToGpkg(pathToGpkg,
                                                 table.getTitle(),
                                                 table.getCrs(),
                                                 table.getDetails(),
                                                 resource);
                    }, () -> log.warn("Таблица {} отсутствует в базе данных, пропускаем", resource.getTable()));
        }
    }

    public void addVectorTableInfoToGpkg(String pathToGpkg,
                                         String vectorTableTitle,
                                         String vectorTableCrs,
                                         String vectorTableDescription,
                                         ExportResourceModel resource) {
        log.debug("Извлеченный title векторной таблицы: {}", vectorTableTitle);

        gpkgBuilder.appendVectorTableInfo(pathToGpkg,
                                          vectorTableTitle,
                                          vectorTableCrs,
                                          vectorTableDescription,
                                          resource);

        log.debug("Процесс добавления информации о векторных таблицах. Проверяйте файл.");
    }

    private void addSchemaToTable(String pathToGpkg, JsonNode schema, ExportResourceModel resource) {
        log.debug("Схема таблицы {} : {}", resource, schema);

        gpkgBuilder.appendVectorTableSchema(pathToGpkg, schema, resource);

        log.debug("Процесс добавления схем успешно завершён. Проверяйте файл.");
    }

    private void appendStylesAndLayersInfo(String pathToGpkg,
                                           List<StyleWithIcons> stylesAndSvgs,
                                           List<LayerProjection> layerProjections) {
        if (stylesAndSvgs.isEmpty()) {
            log.debug("Информации о стилях и svg нет. Пропускаем шаг.");
        } else {
            gpkgBuilder.appendStylesAndSvgs(pathToGpkg, stylesAndSvgs);
        }

        if (layerProjections.isEmpty()) {
            log.debug("Информации о слоях нет. Пропускаем шаг.");
        } else {
            gpkgBuilder.appendLayersInfo(pathToGpkg, layerProjections);
        }
    }
}
