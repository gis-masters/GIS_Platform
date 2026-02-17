package ru.mycrg.integration_service.bpmn.gpkg.import_.vector;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsFeatures;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.ALL_VECTOR_IS_DONE;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.HAVE_ONE_MORE_OBJECT;

@Service("startCycleProcessVector")
public class StartCycleProcessVector implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(StartCycleProcessVector.class);

    private final GpkgReportManager reportManager;

    public StartCycleProcessVector(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", StartCycleProcessVector.class.getSimpleName());

        int neededCyclesCount = (int) delegateExecution.getVariable(IMPORT_GPKG_NEEDED_CYCLES_COUNT_VECTOR);
        int performedCyclesCount = (int) delegateExecution.getVariable(IMPORT_GPKG_PERFORMED_CYCLES_COUNT_VECTOR);
        log.debug("Количество итераций 'создания векторных таблиц и слоёв по ним' нужно: {}", neededCyclesCount);
        log.debug("Количество итераций 'создания векторных таблиц и слоёв по ним' выполнено: {}", performedCyclesCount);

        if (neededCyclesCount != 0 && neededCyclesCount <= performedCyclesCount) {
            log.debug("Переходим на ветку завершения цикла обработки векторных таблиц и слоёв.");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, ALL_VECTOR_IS_DONE.getValue());

            return;
        }

        if (performedCyclesCount == 0) {
            log.debug("Мы первый раз в процессе -> нужно добавить отчёт geoWrapper.");

            ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
            GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                                  event.getDbName(),
                                                                  TASK_DONE);

            GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution
                    .getVariable(IMPORT_GPKG_EVENT_REPORT);
            ErrorReport geoWrapperReport = (ErrorReport) delegateExecution.getVariable(IMPORT_GPKG_FAIL_REASON);

            reportManager.createWrapperReport(rabbitDto, importReport, geoWrapperReport);
        }

        List<GpkgContentsFeatures> vectorTables = (List<GpkgContentsFeatures>) delegateExecution
                .getVariable(IMPORT_GPKG_ALL_VECTOR_TABLES);

        GpkgContentsFeatures currentFeature = vectorTables.get(performedCyclesCount);
        performedCyclesCount++;

        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, HAVE_ONE_MORE_OBJECT.getValue());

        //новый слой -> новый счётчик http ошибок
        delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, 0);
        delegateExecution.setVariable(IMPORT_GPKG_PERFORMED_CYCLES_COUNT_VECTOR, performedCyclesCount);

        delegateExecution.setVariable(IMPORT_GPKG_CURRENT_VECTOR_TABLE, asJava(currentFeature));

        //новый слой -> новый счётчик внесения файлов
        delegateExecution.setVariable(IMPORT_GPKG_CYCLES_COUNT_FILES, 0);
        delegateExecution.setVariable(IMPORT_GPKG_CYCLES_COUNT_FILES_DONE, 0);
    }
}
