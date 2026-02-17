package ru.mycrg.integration_service.bpmn.gpkg.import_.raster;

import com.fasterxml.jackson.core.type.TypeReference;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.integration_service.service.DataServiceSpeaker;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("patchLibraryRecords")
public class PatchLibraryRecords implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(PatchLibraryRecords.class);

    private final DataServiceSpeaker dataServiceSpeaker;
    private final GpkgReportManager reportManager;

    public PatchLibraryRecords(DataServiceSpeaker dataServiceSpeaker, GpkgReportManager reportManager) {
        this.dataServiceSpeaker = dataServiceSpeaker;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        //Тут у нас есть все успешно обработанные растры
        List<GpkgTile> extractedData = (List<GpkgTile>) delegateExecution.getVariable(IMPORT_GPKG_GDAL_RASTERS_LIST);

        if (extractedData == null || extractedData.isEmpty()) {
            log.warn("Нет успешно обработанных растров для обновления библиотеки!");

            throw new BpmnError("allRastersFailedOnPrevStep");
        }

        //Все объекты у нас пойдут в одну библиотеку, в одну запись, в одно поле
        String docLibId = extractedData.get(0).getLibraryIdentifier();
        Long recId = extractedData.get(0).getDocumentId();
        String currentField = extractedData.get(0).getField();

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        String token = event.getToken();

        Map<String, Object> response = dataServiceSpeaker.getLibRecordById(token,
                                                                           docLibId,
                                                                           recId);

        List<FileDescription> currentFieldState = JsonConverter.convertValue(
                response.get(currentField),
                new TypeReference<>() {
                }
        );

        if (currentFieldState == null) {
            currentFieldState = new ArrayList<>();
        }

        //TODO: что-то придумать с size
        List<FileDescription> updateData = extractedData.stream()
                                                        .map(data -> new FileDescription(
                                                                UUID.fromString(data.getTitle()),
                                                                data.getGpkgLayerTableName() + ".tif",
                                                                0L))
                                                        .collect(Collectors.toList());

        currentFieldState.addAll(updateData);

        boolean updateResponse = dataServiceSpeaker.patchCurrentLibRecordField(token,
                                                                               docLibId,
                                                                               recId,
                                                                               currentField,
                                                                               currentFieldState);

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(IMPORT_GPKG_EVENT_REPORT);
        if (updateResponse) {
            String msg = String.format("Успешно обновлено %d растров для библиотеки: %s, запись: %d, поле: %s",
                                       extractedData.size(), docLibId, recId, currentField);
            log.debug(msg);

            reportManager.updateTilesReportWithDone(rabbitDto, importReport, extractedData);
        } else {
            String msg = String.format("Ошибка при обновлении растров для библиотеки: %s, запись: %d, поле: %s",
                                       docLibId, recId, currentField);
            log.warn(msg);

            reportManager.updateTilesReportWithError(rabbitDto, importReport, extractedData);
        }
    }
}
