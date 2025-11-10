package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgPayload;
import ru.mycrg.data_service_contract.queue.request.gpkg.BuildGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * Класс в рамках BPMN экспорта GPKG ставит сообщение в кролика. (четвёртый в цепочке)
 *
 * <p>Реализован</p>
 *
 * <h3>Текущее поведение:</h3>
 * <ul>
 *   <li>Собираем все ресурсы и просто кидаем ивент в кролика.</li>
 * </ul>
 * <p>
 */

@Service("askGeoWrapperCreateGpkg")
public class AskGeoWrapperCreateGpkg implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskGeoWrapperCreateGpkg.class);

    private final IMessageBusProducer messageBus;

    public AskGeoWrapperCreateGpkg(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", AskGeoWrapperCreateGpkg.class.getSimpleName());
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        GpkgPayload subPayload = (GpkgPayload) delegateExecution.getVariable(EVENT_SUB_PAYLOAD_NAME);
        List<ExportResourceModel> resources = (List<ExportResourceModel>) subPayload.getPayload();
        resources = resources.stream().distinct().collect(Collectors.toList());

        String dbName = (String) delegateExecution.getVariable(DB_NAME);
        produceGeoWrapperEvent(resources, businessKey, dbName);

        log.debug("Поставили запрос в geo-wrapper");
    }

    private void produceGeoWrapperEvent(List<ExportResourceModel> resources, String businessKey, String dbName) {
        List<ResourceProjection> resourceProjections = new ArrayList<>();
        for (ExportResourceModel er: resources) {
            resourceProjections.add(new ResourceProjection(dbName, er.getDataset(), er.getTable()));
        }

        ExportProcessModel processModel = new ExportProcessModel();
        processModel.setResourceProjections(resourceProjections);
        processModel.setFormat("GPKG");

        messageBus.produce(new BuildGpkgEvent(businessKey, dbName, processModel));
    }
}
