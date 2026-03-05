package ru.mycrg.integration_service.bpmn.gpkg.export.vector;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.queue.request.gpkg.BuildGpkgEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EXPORT_GPKG_EVENT;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EXPORT_GPKG_VECTOR_LIST;

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
        List<ExportResourceModel> resources = (List<ExportResourceModel>) delegateExecution.getVariable(
                EXPORT_GPKG_VECTOR_LIST);

        List<ResourceProjection> resourceProjections = resources
                .stream()
                .map(er -> new ResourceProjection(er.getDataset(), er.getTable()))
                .collect(Collectors.toList());

        ExportProcessModel processModel = new ExportProcessModel("GPKG", resourceProjections);

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);

        String businessKey = delegateExecution.getProcessBusinessKey();
        log.debug("Поставили запрос выгрузки вектора в gpkg в geo-wrapper");

        messageBus.produce(new BuildGpkgEvent(businessKey, event.getDbName(), processModel));
    }
}
