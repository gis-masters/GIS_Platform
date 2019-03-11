package ru.mycrg.gis.service.gml;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.service.import_.WorkImport;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;

public class GmlProcess {

    private static Logger log = LoggerFactory.getLogger(GmlProcess.class);

    private UUID id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ProcessStatus status;
    private GmlRequestDto request;
    private List<ImportMqResponse> mqResponse = new ArrayList<>();
    private CompletableFuture<String> futureResponse = new CompletableFuture<>();

    public GmlProcess(GmlRequestDto request) {
        this.id = UUID.randomUUID();
        this.status = ProcessStatus.PENDING;
        this.startTime = LocalDateTime.now();
        this.request = request;
    }

    public void addResponse(ImportMqResponse response) {
        mqResponse.add(response);

//        if (request.getImportTasks().size() == mqResponse.size()) {
//            endTime = LocalDateTime.now();
//
//            log.info("Process id: {} is DONE. Processed: {}", id, mqResponse.size());
//            futureResponse.complete(prepareResponse());
//        } else {
//            log.info("Process id: {} is PENDING. Processed: {}", id, mqResponse.size());
//        }
    }

//    private Map<String, String> prepareResponse() {
//        Map<String, String> response = new HashMap<>();
//
//        mqResponse.forEach(mqResponse -> {
//            String layerName = mqResponse.getLayerName();
//            ProcessStatus status = mqResponse.getStatus();
//
//            if (layerName != null && status != null) {
//                response.put(layerName, status.toString());
//            } else {
//                log.warn("Incorrect response");
//            }
//        });
//
//        return response;
//    }

    public UUID getId() {
        return id;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public CompletableFuture<String> getFutureResponse() {
        return futureResponse;
    }
}
