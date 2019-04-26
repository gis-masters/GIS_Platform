package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.gis.dto.BaseRequest;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class CrgProcess implements Completable {

    private static Logger log = LoggerFactory.getLogger(CrgProcess.class);

    private final UUID id = UUID.randomUUID();
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ProcessStatus status;

    private BaseRequest request;
    private CompletableFuture<BaseMqProcessResponse> futureResponse = new CompletableFuture<>();

    public CrgProcess() {}

    public CrgProcess(BaseRequest request) {
        this.status = ProcessStatus.PENDING;
        this.startTime = LocalDateTime.now();
        this.request = request;
    }

    @Override
    public void complete(BaseMqProcessResponse mqResponse) {
        futureResponse.complete(mqResponse);

        if (mqResponse.getStatus() == ProcessStatus.DONE) {
            setEndTime(LocalDateTime.now());

            log.info("Process id: {} is {}", getId(), mqResponse.getStatus());
        } else {
            log.debug("Process: {} is: {}", getId(), mqResponse.getStatus());
        }
    }

    public UUID getId() {
        return id;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public BaseRequest getRequest() {
        return request;
    }

    public CompletableFuture<BaseMqProcessResponse> getFutureResponse() {
        return futureResponse;
    }

}
