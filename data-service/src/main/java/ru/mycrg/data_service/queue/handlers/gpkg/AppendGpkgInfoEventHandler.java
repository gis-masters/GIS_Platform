package ru.mycrg.data_service.queue.handlers.gpkg;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgStyle;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.repository.SchemasAndTablesRepositoryDetached;
import ru.mycrg.data_service.service.gpkg.export.GpkgAppender;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.data_service_contract.queue.request.gpkg.AppendGpkgInfoEvent;
import ru.mycrg.data_service_contract.queue.response.AppendGpkgInfoBackwardEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

@Service
public class AppendGpkgInfoEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(AppendGpkgInfoEventHandler.class);

    private final IMessageBusProducer messageBus;
    private final DatasourceFactory datasourceFactory;
    private final SchemasAndTablesRepositoryDetached schemasAndTablesRepository;
    private final GpkgAppender gpkgAppender;

    public AppendGpkgInfoEventHandler(IMessageBusProducer messageBus,
                                      DatasourceFactory datasourceFactory,
                                      SchemasAndTablesRepositoryDetached schemasAndTablesRepository,
                                      GpkgAppender gpkgAppender) {
        this.messageBus = messageBus;
        this.datasourceFactory = datasourceFactory;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.gpkgAppender = gpkgAppender;
    }

    @Override
    public String getEventType() {
        return AppendGpkgInfoEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        AppendGpkgInfoEvent event = (AppendGpkgInfoEvent) mqEvent;

        String pathToFile = event.getPathToGpkg();
        log.debug("Пытаемся добавить информацию к файлу по пути: ({})", pathToFile);

        try {
            appendAllExistData(pathToFile, event.getDbName(), event.getGpkgAppendingData());

            log.debug("Успешно добавили информацию в файл: ({})", pathToFile);

            messageBus.produce(new AppendGpkgInfoBackwardEvent(event.getBusinessKey(), DONE));
        } catch (Exception e) {
            String msg = String.format("При добавлении информации к файлу: (%s). Произошла ошибка: %s",
                                       pathToFile,
                                       e.getMessage());
            log.error(msg);
            messageBus.produce(new AppendGpkgInfoBackwardEvent(event.getBusinessKey(), ERROR, msg));
        }
    }

    private void appendAllExistData(String pathToGpkg, String dbName, GpkgAppendingData data) {

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

    private void addVectorTableInfoToGpkg(String pathToGpkg,
                                          String vectorTableTitle,
                                          String vectorTableCrs,
                                          String vectorTableDescription,
                                          ExportResourceModel resource) {
        log.debug("Извлеченный title векторной таблицы: {}", vectorTableTitle);

        gpkgAppender.appendVectorTableInfo(pathToGpkg,
                                           vectorTableTitle,
                                           vectorTableCrs,
                                           vectorTableDescription,
                                           resource);

        log.debug("Процесс добавления информации о векторных таблицах. Проверяйте файл.");
    }

    private void addSchemaToTable(String pathToGpkg, JsonNode schema, ExportResourceModel resource) {
        log.debug("Схема таблицы {} : {}", resource, schema);

        gpkgAppender.appendVectorTableSchema(pathToGpkg, schema, resource);

        log.debug("Процесс добавления схем успешно завершён. Проверяйте файл.");
    }

    private void appendStylesAndLayersInfo(String pathToGpkg,
                                           List<GpkgStyle> stylesAndSvgs,
                                           List<LayerProjection> layerProjections) {
        if (stylesAndSvgs.isEmpty()) {
            log.debug("Информации о стилях и svg нет. Пропускаем шаг.");
        } else {
            gpkgAppender.appendStylesAndSvgs(pathToGpkg, stylesAndSvgs);
        }

        if (layerProjections.isEmpty()) {
            log.debug("Информации о слоях нет. Пропускаем шаг.");
        } else {
            gpkgAppender.appendLayersInfo(pathToGpkg, layerProjections);
        }
    }
}
