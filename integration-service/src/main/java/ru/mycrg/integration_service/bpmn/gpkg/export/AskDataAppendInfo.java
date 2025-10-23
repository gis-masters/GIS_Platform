package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgPayload;
import ru.mycrg.data_service_contract.queue.request.AppendGpkgInfoEvent;
import ru.mycrg.data_service_contract.queue.request.ExportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * В рамках BPMN экспорта GPKG засылаем информацию которую нужно добавить. (седьмой в процессе)
 *
 * <p>Реализован.</p>
 *
 * <h3>Поведение:</h3>
 * <ul>
 *   <li>Из сущностей из прошлых шагов собирает объект и ставит его в data-service</li>
 *   <li>Шаг не делает TASK_DONE потому что дальше будет DONE</li>
 *   <li>Есть ретраи. При исчерпании говорим что не можем работать дальше.</li>
 *   <li>При успешном переходе на следующий шаг обнуляем счётчик</li>
 * </ul>
 *
 */

@Service("askDataAppendInfo")
public class AskDataAppendInfo implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskDataAppendInfo.class);

    private final IMessageBusProducer messageBus;

    public AskDataAppendInfo(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", AskDataAppendInfo.class.getSimpleName());

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        String pathToGpkg = delegateExecution.getVariable(GPKG_PATH_VAR_NAME).toString();

        GpkgPayload subPayload = (GpkgPayload) delegateExecution.getVariable(EVENT_SUB_PAYLOAD_NAME);
        List<ExportResourceModel> resources = (List<ExportResourceModel>) subPayload.getPayload();
        resources = resources.stream().distinct().collect(Collectors.toList());

        GpkgAppendingData gpkgData = event.getGpkgAppendingData();
        if (gpkgData == null) {
            log.debug("Если объект null, значит выгружаем инфу о таблицах и у нас нет данных о слоях.");

            gpkgData = new GpkgAppendingData();
            gpkgData.setResourceProjections(resources);
        } else {
            gpkgData.setResourceProjections(resources);
        }

        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        messageBus.produce(new AppendGpkgInfoEvent(event.getDbName(), businessKey, pathToGpkg, gpkgData));

        log.debug("GpkgAppendingData была: {}", gpkgData);
    }
}
