package ru.mycrg.data_service.queue.handlers.gpkg;

import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportedStyles;
import ru.mycrg.data_service.dao.GpkgRepositoryDetached;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.OrgSettingsKeeper;
import ru.mycrg.data_service.service.gpkg.GpkgContentsDto;
import ru.mycrg.data_service.service.gpkg.importer.GpkgReaderService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.CrsHandler;
import ru.mycrg.data_service.util.SimplePropertyCollector;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.GeometryType;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.*;

import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_EPSG_METRE;
import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_EPSG_TEXT_PART;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ValueType.GEOMETRY;

@Service
public class ImportGpkgAckInfoEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGpkgAckInfoEventHandler.class);

    private final DatasourceFactory datasourceFactory;
    private final GpkgRepositoryDetached gpkgTablesDao;
    private final SimplePropertyCollector simplePropertyCollector;
    private final GpkgReaderService gpkgReader;
    private final OrgSettingsKeeper orgSettingsKeeper;
    private final IMessageBusProducer messageBus;

    public ImportGpkgAckInfoEventHandler(DatasourceFactory datasourceFactory,
                                         GpkgRepositoryDetached gpkgTablesDao,
                                         SimplePropertyCollector simplePropertyCollector,
                                         GpkgReaderService gpkgReader,
                                         OrgSettingsKeeper orgSettingsKeeper,
                                         IMessageBusProducer messageBus) {
        this.datasourceFactory = datasourceFactory;
        this.gpkgTablesDao = gpkgTablesDao;
        this.simplePropertyCollector = simplePropertyCollector;
        this.gpkgReader = gpkgReader;
        this.orgSettingsKeeper = orgSettingsKeeper;
        this.messageBus = messageBus;
    }

    @Override
    public String getEventType() {
        return ImportGpkgAckInfoEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        log.debug("Начали обработку запроса получения данных из GPKG.");

        final ImportGpkgAckInfoEvent event = (ImportGpkgAckInfoEvent) mqEvent;
        final String businessKey = event.getBusinessKey();

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(event.getDbName()));

        String sourceSchemaName = event.getSourceSchemaName();
        String sourceTableName = event.getTableName();
        UUID fileId = event.getFileId();

        // 1.1 Читаем данные о схеме
        Optional<SchemaDto> oSchemaDto = getSchemaDto(jdbcTemplate,
                                                      sourceSchemaName,
                                                      sourceTableName,
                                                      fileId);
        if (oSchemaDto.isEmpty()) {
            String msg = "В gpkg нет схемы данных." +
                    " Генерация схемы на основе данных провалились. Таблица не будет импортирована!";

            messageBus.produce(new ImportGpkgAckInfoBackwardEvent(ERROR, businessKey, msg));
            //Без схемы продолжать не можем.
            return;
        }

        // 1.2 Читаем данные о векторной таблице
        Optional<TableCreateDto> oTargetVectorTableDto = gpkgTablesDao.getTableInfo(jdbcTemplate,
                                                                                    sourceSchemaName,
                                                                                    sourceTableName);

        if (oTargetVectorTableDto.isEmpty()) {
            log.warn("В gpkg нет информации о векторной таблице. Создадим её как дефолтную.");
            TableCreateDto tcd = new TableCreateDto();
            tcd.setTitle(oSchemaDto.get().getTitle());

            Long orgId = Long.valueOf(event.getDbName().substring(event.getDbName().lastIndexOf('_') + 1));
            saturateExistInfoOrUseDefault(jdbcTemplate, tcd, fileId, sourceTableName, orgId);

            oTargetVectorTableDto = Optional.of(tcd);
        }

        //1.3 Вычитать дополнительную информацию и отправить её обратно
        List<LayerProjection> crgLayerData = gpkgTablesDao.getLayerInfoFromGpkg(jdbcTemplate,
                                                                                sourceSchemaName,
                                                                                sourceTableName);

        List<GpkgImportedStyles> styles = new ArrayList<>();

        if (!crgLayerData.isEmpty()) {
            log.debug("Количество слоёв созданных по векторной таблице: {}", crgLayerData.size());

            for (LayerProjection layerProjection: crgLayerData) {
                List<GpkgImportedStyles> curStyles = gpkgTablesDao.getStyleInfoFromGpkg(jdbcTemplate,
                                                                                        sourceSchemaName,
                                                                                        layerProjection.getStyleName());
                styles.addAll(curStyles);
            }
        } else {
            log.debug("В gpkg нет информации о crg слоях. Создадим новый на значениях по умолчанию.");

            LayerProjection defaultLp = new LayerProjection(oTargetVectorTableDto.get().getCrs(),
                                                            oSchemaDto.get().getStyleName(),
                                                            oTargetVectorTableDto.get().getTitle(),
                                                            "vector");

            crgLayerData = List.of(defaultLp);
        }

        ResourceProjection table = new ResourceProjection(oSchemaDto.get(),
                                                          oTargetVectorTableDto.get().getTitle(),
                                                          oTargetVectorTableDto.get().getCrs(),
                                                          oTargetVectorTableDto.get().getDetails());

        log.debug("Таблица: {}", table);
        log.debug("Схема: {}", oSchemaDto.get());

        messageBus.produce(new ImportGpkgAckInfoBackwardEvent(DONE, businessKey, table, crgLayerData, styles));
    }

    private void saturateExistInfoOrUseDefault(JdbcTemplate jdbcTemplate,
                                               TableCreateDto tcd,
                                               UUID fileId,
                                               String sourceTableName,
                                               Long orgId) {
        GpkgContentsDto gpkgContent = gpkgReader.getVectorTableContent(jdbcTemplate, fileId, sourceTableName);

        tcd.setDetails(
                gpkgContent.getDescription() == null ? "Таблица сгенерирована исходя из значений 'по умолчанию'" :
                        gpkgContent.getDescription());

        tcd.setCrs(gpkgContent.getSriId() == null ?
                           getDefaultOrgEpsg(orgId) :
                           DEFAULT_EPSG_TEXT_PART + gpkgContent.getSriId());
    }

    private String getDefaultOrgEpsg(Long orgId) {
        try {
            Map<String, Object> orgSettings = orgSettingsKeeper.getOrgSettingsById(orgId);

            //внутри -> "Pulkovo 1942 / CS63 zone X4, EPSG:7828, метры"
            String fullProjectionName = (String) orgSettings.get("default_epsg");

            return DEFAULT_EPSG_TEXT_PART + CrsHandler.extractCrsNumber(fullProjectionName);
        } catch (Exception e) {
            log.warn("Ошибка формирования EPSG: {}. Будет установлена {}", e.getMessage(), DEFAULT_EPSG_METRE);

            return DEFAULT_EPSG_METRE;
        }
    }

    private Optional<SchemaDto> getSchemaDto(JdbcTemplate jdbcTemplate,
                                             String sourceSchemaName,
                                             String sourceTableName,
                                             UUID filedId) {
        Optional<SchemaDto> oSchemaDto = gpkgTablesDao.getSchemaFromSchemaTable(jdbcTemplate,
                                                                                sourceSchemaName,
                                                                                sourceTableName);
        if (oSchemaDto.isPresent()) {
            return oSchemaDto;
        }

        //Если схемы нет в gpkg на прямую, то мы должны максимально её сгенерировать
        log.warn("В gpkg не существует схемы для таблицы: {}", sourceSchemaName);

        GeometryType geometryType;
        try {
            geometryType = gpkgReader.getLayerGeometryType(jdbcTemplate, filedId, sourceTableName);
        } catch (Exception e) {
            log.error("Невозможно получить тип геометрии объекта. Причина => {}", e.getMessage());

            return Optional.empty();
        }

        SchemaDto schemaDto = new SchemaDto();
        String generatedSchemaName = RandomStringUtils.randomAlphabetic(7).toLowerCase();
        schemaDto.setName(generatedSchemaName);
        schemaDto.setTitle(generatedSchemaName);
        schemaDto.setTableName(generatedSchemaName);
        schemaDto.setDescription("Схема сгенерирована автоматически на основе GPKG");

        schemaDto.setGeometryType(geometryType);
        schemaDto.setStyleName(getStyleNameBaseGeometry(geometryType));

        List<SimplePropertyDto> generatedProps = simplePropertyCollector
                .getSimpleProperties(jdbcTemplate, new ResourceQualifier(sourceSchemaName, sourceTableName));

        //Возможно тут ошибка, в схемах чаще всего MultiPolygon->Polygon а тут происходит
        //MultiPolygon->MultiPolygon
        generatedProps.stream()
                      .filter(p -> p.getValueTypeAsEnum() == GEOMETRY)
                      .findFirst()
                      .ifPresent(p -> p.setAllowedValues(List.of(String.valueOf(geometryType))));

        schemaDto.setProperties(generatedProps);

        return Optional.of(schemaDto);
    }

    private String getStyleNameBaseGeometry(GeometryType geometryType) {
        switch (geometryType) {
            case POINT:
                return "simple_point_1";

            case MULTI_LINE_STRING:
                return "simple_line_1";

            case MULTI_POLYGON:
                return "simple_polygon_1";

            default:
                return "generic";
        }
    }
}
