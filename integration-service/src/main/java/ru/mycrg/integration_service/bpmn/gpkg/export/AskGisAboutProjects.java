package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.gpkg.ExportGpkgPayload;

import static ru.mycrg.common_contracts.generated.gpkg.GpkgExportType.PROJECT;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.CHECK_STATUS_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_SUB_PAYLOAD_NAME;

/**
 * Класс для работы с выгрузкой ПРОЕКТОВ в рамках BPMN процесса экспорта GPKG. (первый в цепочке)
 *
 * <p>На данный момент класс не полностью реализован и выполняет только базовую проверку типов запросов.</p>
 *
 * <h3>Планируемая функциональность:</h3>
 * <ul>
 *   <li>Проверка прав доступа на запрошенные проекты</li>
 *   <li>Преобразование payload: замена типа PROJECTS на LAYERS с передачей ID слоёв в следующий шаг</li>
 *   <li>Закрытие задачи при критических ошибках</li>
 *   <li>Передача ошибки + TASK_DONE и продолжение работы по возможности</li>
 *   <li>Передача статуса TASK_DONE и отчёта при положительной работе</li>
 * </ul>
 *
 * <h3>Текущее поведение:</h3>
 * <ul>
 *   <li>Для типа PROJECTS: устанавливает статус "dontKnowHow" (не реализовано)</li>
 *   <li>Для типов LAYERS и TABLES: устанавливает статус "exportNext" (пропуск шага)</li>
 *   <li>Для неподдерживаемых типов: устанавливает статус "dontKnowHow"</li>
 * </ul>
 *
 */
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
