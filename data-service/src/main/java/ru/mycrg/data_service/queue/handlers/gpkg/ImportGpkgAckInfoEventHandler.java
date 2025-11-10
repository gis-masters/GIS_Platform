package ru.mycrg.data_service.queue.handlers.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgImportedStyles;
import ru.mycrg.data_service.dao.GpkgRepositoryDetached;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static java.lang.Thread.sleep;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;

@Service
public class ImportGpkgAckInfoEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGpkgAckInfoEventHandler.class);

    private final DatasourceFactory datasourceFactory;
    private final GpkgRepositoryDetached gpkgTablesDao;

    private final IMessageBusProducer messageBus;

    public ImportGpkgAckInfoEventHandler(DatasourceFactory datasourceFactory,
                                         GpkgRepositoryDetached gpkgTablesDao,
                                         IMessageBusProducer messageBus) {
        this.datasourceFactory = datasourceFactory;
        this.gpkgTablesDao = gpkgTablesDao;
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

        // 1.1 Читаем данные о схеме
        String sourceSchemaName = event.getSourceSchemaName();
        String sourceTableName = event.getTableName();
        Optional<SchemaDto> oSchemaDto = gpkgTablesDao.getSchemaFromSchemaTable(jdbcTemplate,
                                                                                sourceSchemaName,
                                                                                sourceTableName);
        if (oSchemaDto.isEmpty()) {
            log.error("Невозможно создать таблицу без схемы. Пока что!");
            String errorMessage = String.format("В gpkg не существует схемы для таблицы: %s",
                                                sourceSchemaName);

            try {
                sleep(10000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            messageBus.produce(new ImportGpkgAckInfoBackwardEvent(ERROR, businessKey, errorMessage));

            return;
        }

        // 1.2 Читаем данные о векторной таблице
        Optional<TableCreateDto> oTargetVectorTableDto = gpkgTablesDao.getTableInfo(jdbcTemplate,
                                                                                    sourceSchemaName,
                                                                                    sourceTableName);

        if (oTargetVectorTableDto.isEmpty()) {
            log.warn("В gpkg нет информации о векторной таблице. Публикуем её как дефолтную.");

            TableCreateDto tcd = new TableCreateDto();
            tcd.setTitle(oSchemaDto.get().getTitle()); //Сделать русское имя из полей схемы
            tcd.setCrs("EPSG:3857"); //Сделать применение из дефолта организации
            tcd.setDetails("Таблица создана с использованием значений 'по умолчанию'");
            oTargetVectorTableDto = Optional.of(tcd);
        }

        ResourceProjection table = new ResourceProjection(oSchemaDto.get(),
                                                          oTargetVectorTableDto.get().getTitle(),
                                                          oTargetVectorTableDto.get().getCrs(),
                                                          oTargetVectorTableDto.get().getDetails());

        //1.3 Вычитать дополнительную информацию и отправить её обратно
        List<LayerProjection> lp = gpkgTablesDao.getLayerInfoFromGpkg(jdbcTemplate,
                                                                      sourceSchemaName,
                                                                      sourceTableName);

        log.debug("Количество слоёв созданных по векторной таблице: {}", lp.size());
        List<GpkgImportedStyles> styles = new ArrayList<>();
        for (LayerProjection layerProjection: lp) {
            List<GpkgImportedStyles> curStyles = gpkgTablesDao.getStyleInfoFromGpkg(jdbcTemplate,
                                                                                    sourceSchemaName,
                                                                                    layerProjection.getStyleName());
            styles.addAll(curStyles);
        }

        log.debug("Таблица: {}", table);
        log.debug("Схема: {}", oSchemaDto);
        log.debug("Слои: {}", lp);
        log.debug("Стили: {}", styles);

        try {
            sleep(10000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        messageBus.produce(new ImportGpkgAckInfoBackwardEvent(DONE, businessKey, table, lp, styles));
    }
}
