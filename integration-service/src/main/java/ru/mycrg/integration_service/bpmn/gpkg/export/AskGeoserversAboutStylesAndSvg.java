package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.gpkg.GkpgExportDetailsModel;
import ru.mycrg.common_contracts.generated.gpkg.MessageFromExport;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.data_service_contract.dto.gpkg.StyleWithIcons;
import ru.mycrg.data_service_contract.queue.request.ExportGpkgEvent;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.integration_service.bpmn.gpkg.GeoServerSpeaker;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.LinkedList;
import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * Класс в рамках BPMN экспорта GPKG запрашивает у geoserver все ресурсы. (шестой в цепочке)
 *
 * <p>Реализован</p>
 *
 * <h3>Текущее поведение:</h3>
 * <ul>
 *   <li>На основе данных собранных раньше собирает стили с геосервера</li>
 *   <li>Если стили содержат svg -> собирают svg.</li>
 *   <li>Формирует отчёт и идёт дальше.</li>
 *   <li>Ретраев нет. Если что-то не получили -> не важно. Максимально стараемся попасть в следующий шаг.</li>
 *   <li>Если gpkg не сформирован, то сразу выходим в ошибку.</li>
 * </ul>
 * <p>
 */

@Service("askGeoserversAboutStylesAndSvg")
public class AskGeoserversAboutStylesAndSvg implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskGeoserversAboutStylesAndSvg.class);

    private final GeoServerSpeaker geoServerSpeaker;
    private final IMessageBusProducer messageBus;

    public AskGeoserversAboutStylesAndSvg(GeoServerSpeaker geoServerSpeaker,
                                          IMessageBusProducer messageBus) {
        this.geoServerSpeaker = geoServerSpeaker;
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", AskGeoserversAboutStylesAndSvg.class.getSimpleName());

        String pathToGpkg = delegateExecution.getVariable(GPKG_PATH_VAR_NAME).toString();
        if (pathToGpkg == null || pathToGpkg.isBlank()) {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoserverGiveNothing");
        }

        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);
        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        GpkgAppendingData gpkgData = event.getGpkgAppendingData();
        if (gpkgData == null) {
            log.debug("GpkgAppendingData пустая, значит нас не просили информацию о слоях.");
            //Костыляка. Нужен нормальный статус
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoserverGiveSome");

            return;
        }

        List<LayerProjection> layersList = gpkgData.getLayerProjections();

        String token = event.getToken();

        if (layersList == null || layersList.isEmpty()) {
            log.debug("Лист слоёв пустой, при этом gpkg нам вернулся. Такого быть не должно!");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoserverGiveNothing");

            return;
        }

        List<String> stylesNames = new LinkedList<>();
        for (LayerProjection layersProjection: layersList) {
            stylesNames.add(layersProjection.getStyleName());
        }

        List<StyleWithIcons> stylesAndSvgs = new LinkedList<>();
        for (String styleName: stylesNames) {
            stylesAndSvgs.add(geoServerSpeaker.getStylesAndSvg(styleName, token));
        }

        log.debug("Всё прошло хорошо. У нас есть слои, стили и место где это объединить!");

        GpkgAppendingData gpkgAppendingData = event.getGpkgAppendingData();
        if (gpkgAppendingData == null) {
            gpkgAppendingData = new GpkgAppendingData();
        }
        gpkgAppendingData.setStylesAndSvgs(stylesAndSvgs);

        event.setGpkgAppendingData(gpkgAppendingData);

        messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                  businessKey,
                                                  event.getDbName(),
                                                  new PatchProcess(TASK_DONE, makeReport(event))));

        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoserverGiveSome");
    }

    private GkpgExportDetailsModel makeReport(ExportGpkgEvent event) {
        log.debug("Формируем отчёт о работе c геосервером");

        GkpgExportDetailsModel details = event.getGkpgExportDetailsModel();
        List<MessageFromExport> messages = details.getMessageFromExport();

        messages.add(new MessageFromExport("Забрали ресурсы с геосервера."));
        details.setMessageFromExport(messages);
        event.setGkpgExportDetailsModel(details);

        return details;
    }
}
