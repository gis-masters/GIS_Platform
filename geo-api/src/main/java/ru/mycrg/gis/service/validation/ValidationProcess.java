package ru.mycrg.gis.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.ValidationStatus;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

public class ValidationProcess {

    private static Logger log = LoggerFactory.getLogger(ValidationServiceImpl.class);

    private UUID id;
    private String userName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ValidationStatus status;
    private Set<ValidationRequestDto> requests = new HashSet<>();
    private Map<String, List<ValidationMqResponse>> mqResponses = new HashMap<>();
    private CompletableFuture<List<ValidationResponseDto>> futureResponse = new CompletableFuture<>();
    private int doneCounter = 0;

    public ValidationProcess() {
        this.id = UUID.randomUUID();
        this.status = ValidationStatus.PENDING;
        this.startTime = LocalDateTime.now();
    }

    public void addResponse(ValidationMqResponse response) {
        if (mqResponses.containsKey(response.getResourceId())) {
            List<ValidationMqResponse> responses = this.mqResponses.get(response.getResourceId());
            responses.add(response);
        } else {
            List<ValidationMqResponse> responses = new ArrayList<>();
            responses.add(response);

            mqResponses.put(response.getResourceId(), responses);
        }

        handleResponse(response);
    }

    private void handleResponse(ValidationMqResponse response) {
        if (response.isDone()) {
            status = ValidationStatus.DONE;

            doneCounter++;
            if (doneCounter == requests.size()) {
                log.info("Process {} successfully complete", id);

                futureResponse.complete(prepareResponse());
            } else {
                log.info("One more part of process {} DONE", id);
            }
        } else if (response.isEmpty() || response.isError()) {
            log.info("Response for process: {} is {}", id, response.getStatus());
            futureResponse.complete(prepareResponse());
        } else if (response.isPending()) {
            log.info("Process {} is PENDING yet", id);
        } else {
            log.warn("Unsupported response status: {}", response.getStatus());
        }
    }

    public List<ValidationResponseDto> prepareResponse() {
        return requests
                .stream()
                .map(ValidationRequestDto::getResourceId)
                .map(resourceId -> new ValidationResponseDto(getFinishResponse(resourceId)))
                .collect(Collectors.toList());
    }

    private Optional<ValidationMqResponse> getFinishResponse(String resourceId) {
        return this.mqResponses
                .get(resourceId).stream()
                .filter(response -> !response.isPending())
                .findFirst();
    }

    public UUID getId() {
        return id;
    }

    public void addRequest(ValidationRequestDto requestDto) {
        requests.add(requestDto);
    }

    public Set<ValidationRequestDto> getRequests() {
        return requests;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public ValidationStatus getStatus() {
        return status;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public CompletableFuture<List<ValidationResponseDto>> getFutureResponse() {
        return futureResponse;
    }

    public Map<String, List<ValidationMqResponse>> getMqResponses() {
        return mqResponses;
    }
}
