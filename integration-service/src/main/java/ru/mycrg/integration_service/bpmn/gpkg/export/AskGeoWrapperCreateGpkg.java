package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.ExportGpkgPayload;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.queue.request.gpkg.BuildGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

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

        ExportGpkgPayload subPayload = (ExportGpkgPayload) delegateExecution.getVariable(EVENT_SUB_PAYLOAD_NAME);
        List<ExportResourceModel> resources = (List<ExportResourceModel>) subPayload.getPayload();

        List<ResourceProjection> resourceProjections = resources
                .stream()
                .map(er -> new ResourceProjection(er.getDataset(), er.getTable()))
                .collect(Collectors.toList());

        ExportProcessModel processModel = new ExportProcessModel("GPKG", resourceProjections);

        String dbName = (String) delegateExecution.getVariable(DB_NAME);
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);
        messageBus.produce(new BuildGpkgEvent(businessKey, dbName, processModel));

        log.debug("Поставили запрос в geo-wrapper");
    }
}
