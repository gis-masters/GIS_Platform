package ru.mycrg.integration_service.bpmn.gpkg.export.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.gpkg.BuildGpkgRastersEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.Map;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EXPORT_GPKG_PATH_TO_GPKG;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EXPORT_GPKG_RESOURCE_AND_PATH;

@Service("askWrapperExportRasters")
public class AskWrapperExportRasters implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskWrapperExportRasters.class);

    private final IMessageBusProducer messageBus;

    public AskWrapperExportRasters(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        Map<String, String> resourceAndPath = (Map<String, String>) delegateExecution
                .getVariable(EXPORT_GPKG_RESOURCE_AND_PATH);

        String path = null;

        try {
            path = (String) delegateExecution.getVariable(EXPORT_GPKG_PATH_TO_GPKG);
        } catch (Exception ex) {
            log.warn("Нет пути к gpkg, будем создавать новый geoPackage файл.");
        }

        String businessKey = delegateExecution.getProcessBusinessKey();

        log.debug("Поставили запрос выгрузки растров в geo-wrapper");

        messageBus.produce(new BuildGpkgRastersEvent(businessKey, resourceAndPath, path));
    }
}
