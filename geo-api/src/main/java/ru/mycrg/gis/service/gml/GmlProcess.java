package ru.mycrg.gis.service.gml;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.gis.dto.GmlRequestDto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class GmlProcess {

    private static Logger log = LoggerFactory.getLogger(GmlProcess.class);

    private UUID id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ProcessStatus status;
    private GmlRequestDto request;
    private List<GmlMqResponse> mqResponse = new ArrayList<>();
    private CompletableFuture<String> futureResponse = new CompletableFuture<>();

    public GmlProcess(GmlRequestDto request) {
        this.id = UUID.randomUUID();
        this.status = ProcessStatus.PENDING;
        this.startTime = LocalDateTime.now();
        this.request = request;
    }

    public void addResponse(GmlMqResponse response) {
        mqResponse.add(response);

        if (response.getStatus() == ProcessStatus.DONE) {
            endTime = LocalDateTime.now();

            log.info("Process id: {} is DONE. Processed: {}", id, mqResponse.size());
            futureResponse.complete(response.getPathToFile());
        } else {
            log.debug("Process: {} is: {}", id, response.getStatus());

            if (response.getStatus() == ProcessStatus.ERROR) {
                futureResponse.complete("");
            }
        }
    }

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

    public GmlRequestDto getRequest() {
        return request;
    }

}
