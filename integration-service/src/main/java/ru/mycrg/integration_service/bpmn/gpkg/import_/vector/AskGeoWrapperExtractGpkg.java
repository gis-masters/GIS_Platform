package ru.mycrg.integration_service.bpmn.gpkg.import_.vector;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsBaseDto;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsFeatures;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.integration_wrapper.ExtractGpkgEvent;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.enums.GpkgContentsDataType.FEATURES;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("askGeoWrapperExtractGpkg")
public class AskGeoWrapperExtractGpkg implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskGeoWrapperExtractGpkg.class);

    private final IMessageBusProducer messageBus;

    public AskGeoWrapperExtractGpkg(IMessageBusProducer messageBus) {

        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Ставим ивент распаковки geoPackage");
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);

        List<GpkgContentsBaseDto> vectorTables = event
                .getGpkgProcessReport().getPayload().getGpkgContents()
                .stream()
                .filter(v -> v.getDataType() == FEATURES)
                .collect(Collectors.toList());

        List<GpkgContentsFeatures> features = vectorTables.stream()
                                                          .filter(GpkgContentsFeatures.class::isInstance)
                                                          .map(GpkgContentsFeatures.class::cast)
                                                          .collect(Collectors.toList());

        delegateExecution.setVariable(IMPORT_GPKG_PERFORMED_CYCLES_COUNT_VECTOR, 0);
        delegateExecution.setVariable(IMPORT_GPKG_NEEDED_CYCLES_COUNT_VECTOR, vectorTables.size());
        delegateExecution.setVariable(IMPORT_GPKG_ALL_VECTOR_TABLES, asJava(features));

        String businessKey = delegateExecution.getProcessBusinessKey();
        messageBus.produce(new ExtractGpkgEvent(event.getDbName(), event.getFileId(), businessKey));
    }
}
