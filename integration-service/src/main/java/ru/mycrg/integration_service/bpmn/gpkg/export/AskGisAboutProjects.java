package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.ExportGpkgPayload;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType.PROJECT;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.CHECK_STATUS_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_SUB_PAYLOAD_NAME;

@Service("askGisAboutProjects")
public class AskGisAboutProjects implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskGisAboutProjects.class);

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", AskGisAboutProjects.class.getSimpleName());

        ExportGpkgPayload subPayload = (ExportGpkgPayload) delegateExecution.getVariable(EVENT_SUB_PAYLOAD_NAME);

        log.debug("Запрашиваемая сущность: {}, {}", subPayload.getType(), subPayload.getPayload());

        if (subPayload.getType() == PROJECT) {
            log.debug("У нас попросили проекты. Мы не умеем их выгружать и хотим давать нормальную ошибку.");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "dontKnowHow");
        } else {
            log.debug("У нас не просили проекты. Пропускаем шаг!");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "exportNext");
        }
    }
}
