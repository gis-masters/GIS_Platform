package ru.mycrg.gis.service.validation;

import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.ValidationStatus;
import ru.mycrg.gis.dto.ValidationRequestDto;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;

public class ValidationProcess {

    private UUID id;
    private String userName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ValidationStatus status;
    private Set<ValidationRequestDto> requests = new HashSet<>();
    private List<ValidationMqResponse> responses = new ArrayList<>();
    private CompletableFuture<ValidationMqResponse> futureResponse = new CompletableFuture<>();

    public ValidationProcess() {
        this.id = UUID.randomUUID();
        this.status = ValidationStatus.PENDING;
        this.startTime = LocalDateTime.now();
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

    public List<ValidationMqResponse> getResponses() {
        return responses;
    }

    public void addResponse(ValidationMqResponse response) {
        responses.add(response);

        if (response.isDone()) {
            status = ValidationStatus.DONE;
        }
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public CompletableFuture<ValidationMqResponse> getFutureResponse() {
        return futureResponse;
    }

    public void setFutureResponse(CompletableFuture<ValidationMqResponse> futureResponse) {
        this.futureResponse = futureResponse;
    }
}
