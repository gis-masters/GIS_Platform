package ru.mycrg.gis.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.gis.queue.MqSender;

import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class ImportService {

    private static Logger log = LoggerFactory.getLogger(ImportService.class);

    private final MqSender mqSender;

    private List<ImportProcess> importProcesses = new ArrayList<>();

    public ImportService(MqSender mqSender) {
        this.mqSender = mqSender;
    }

    public CompletableFuture<Map<String, String>> initProcess(WorkImport workImport) {
        ImportProcess process = new ImportProcess(workImport);
        importProcesses.add(process);

        workImport.getImportTasks().forEach(importTask -> {
            mqSender.initImport(mapToMqRequest(workImport, importTask, process.getId()));
        });

        return process.getFutureResponse();
    }

    public void progress(ImportMqResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<ImportProcess> processById = getProcessById(response.getId());
        if (processById.isPresent()) {
            ImportProcess process = processById.get();
            process.addResponse(response);
        } else {
            log.warn("Not found import process by id: {}", response.getId());
        }
    }

    private Optional<ImportProcess> getProcessById(UUID id) {
        return importProcesses.stream()
                .filter(importProcess -> importProcess.getId().equals(id))
                .findFirst();
    }

    private ImportMqRequest mapToMqRequest(WorkImport workImport, ImportTask importTask, UUID id) {
        return new ImportMqRequest(workImport.getDbName(), workImport.getSourceSchema(), workImport.getTargetSchema(),
                importTask.getLayerName(), importTask.getWorkTableName(), importTask.getMapping(), id);
    }

}
