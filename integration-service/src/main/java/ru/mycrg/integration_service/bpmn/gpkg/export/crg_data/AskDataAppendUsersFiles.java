package ru.mycrg.integration_service.bpmn.gpkg.export.crg_data;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.queue.request.gpkg.AppendGpkgFilesEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("askDataAppendUsersFiles")
public class AskDataAppendUsersFiles implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskDataAppendUsersFiles.class);

    private final IMessageBusProducer messageBus;

    public AskDataAppendUsersFiles(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", AskDataAppendUsersFiles.class.getSimpleName());

        String status = (String) delegateExecution.getVariable(CHECK_STATUS_VAR_NAME);
        if (status.equals("rasterGdalWorkDone")) {
            log.debug("Под-процесс дополнения gpkg запущен из ветки растров. Добавление файлов из векторных таблиц" +
                              " не нужно!");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "noRabbit");

            return;
        }

        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "waitRabbit");

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        String pathToGpkg = (String) delegateExecution.getVariable(EXPORT_GPKG_PATH_TO_GPKG);

        List<ExportResourceModel> resources = (List<ExportResourceModel>) delegateExecution
                .getVariable(EXPORT_GPKG_VECTOR_LIST);

        String businessKey = delegateExecution.getProcessBusinessKey();
        messageBus.produce(new AppendGpkgFilesEvent(event.getDbName(), businessKey, pathToGpkg, resources));
    }
}
