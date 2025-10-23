package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.gpkg.GkpgExportDetailsModel;
import ru.mycrg.common_contracts.generated.gpkg.MessageFromExport;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.ExportGpkgEvent;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.LinkedList;
import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * В рамках BPMN экспорта GPKG завершаем основной процесс. (последний в цепочке)
 *
 * <p>Реализован.</p>
 *
 * <h3>Поведение:</h3>
 * <ul>
 *   <li>Отправляем ERROR в процесс.</li>
 * </ul>
 *
 * <h3>Планируемые доработки:</h3>
 * <ul>
 *   <li>Считывать результаты прошлых шагов и направлять в детали понятный полный отчёт. Azure: 3750</li>
 * </ul>
 *
 */

@Service("endExportProcessError")
public class EndExportProcessError implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(EndExportProcessError.class);

    private final IMessageBusProducer messageBus;

    public EndExportProcessError(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", EndExportProcessError.class.getSimpleName());

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        GkpgExportDetailsModel details = event.getGkpgExportDetailsModel();
        if (details == null) {
            details = new GkpgExportDetailsModel();
        }

        List<MessageFromExport> messages = details.getMessageFromExport();
        if (messages == null) {
            messages = new LinkedList<>();
        }

        String pathToGpkg = null;
        if (delegateExecution.getVariable(GPKG_PATH_VAR_NAME) != null
                && !delegateExecution.getVariable(GPKG_PATH_VAR_NAME).toString().isBlank()) {
            pathToGpkg = delegateExecution.getVariable(GPKG_PATH_VAR_NAME).toString();
            details.setPathToGpkgFile(pathToGpkg);
        }

        String status = delegateExecution.getVariable(CHECK_STATUS_VAR_NAME).toString();
        String msg = "Невозможно успешно завершить экспорт GPKG. Причина: ";

        switch (status) {
            case "dontKnowHow":
                msg = msg + "Невозможно экспортировать запрошенный тип объектов.";
                break;
            case "allLayersUnavailable":
                msg = msg + "Все запрошенные слои не существуют.";
                break;
            case "allResourcesUnavailable":
                msg = msg + "Все указанные ресурсы НЕДОСТУПНЫ пользователю.";
                break;
            case "gpkgNotExist":
                msg = msg + "Не получилось создать gpkg. Причина: " + pathToGpkg;
                break;
            case "geoserverGiveNothing":
                msg = msg + "Геосервер не вернул данные о стилях.";
                if (pathToGpkg == null || pathToGpkg.isBlank()) {
                    msg = msg + " Geo-wrapper не сформировал gpkg. Дальнейшая работа невозможна!";
                }

                break;
            case "fail":
                String failReason = (String) delegateExecution.getVariable(FAIL_REASON);
                msg = msg + "Не получилось добавить доп информацию в geoPackage. Причина: " + failReason;
                break;
            default:
                msg = msg + "gpkg не был сформирован в течении 5 минут. Останавливаем процесс.";
        }

        messages.add(new MessageFromExport(msg));
        details.setMessageFromExport(messages);

        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                  businessKey,
                                                  event.getDbName(),
                                                  new PatchProcess(ERROR, details)));

        log.debug("Выполнение процесса потерпело неудачу!");
    }
}
