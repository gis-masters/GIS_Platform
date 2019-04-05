package ru.mycrg.gis.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Сущность которая содержит запросы и процессит ответы.
 */
public class ValidationProcess {

    private static Logger log = LoggerFactory.getLogger(ValidationServiceImpl.class);

    private UUID id;
    private String userName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ProcessStatus status;
    private Set<ValidationRequestDto> requests = new HashSet<>();
    private Map<String, List<ValidationMqResponse>> mqResponses = new HashMap<>();
    private CompletableFuture<List<ValidationResponseDto>> futureResponse = new CompletableFuture<>();
    private int completeResponseCounter = 0;
    private RequestType requestType;

    public ValidationProcess() {
        this.id = UUID.randomUUID();
        this.status = ProcessStatus.PENDING;
        this.startTime = LocalDateTime.now();
    }

    public void addRequest(List<ValidationRequestDto> request) {
        request.stream()
                .distinct()
                .forEach((ValidationRequestDto requestDto) -> {
                    requests.add(requestDto);
                });
    }

    /**
     * Добавление и обработка ответа.
     * @param response {@link ValidationMqResponse}
     */
    public void handleResponse(ValidationMqResponse response) {
        if (mqResponses.containsKey(response.getResourceId())) {
            List<ValidationMqResponse> responses = this.mqResponses.get(response.getResourceId());
            responses.add(response);
        } else {
            List<ValidationMqResponse> responses = new ArrayList<>();
            responses.add(response);

            mqResponses.put(response.getResourceId(), responses);
        }

        if (response.isDone() || response.isEmpty() || response.isError()) {
            status = response.getStatus();

            completeResponseCounter++;
            if (completeResponseCounter == requests.size()) {
                log.info("Last completed. The process {} is successfully completed", id);

                futureResponse.complete(prepareResponse());
            } else {
                log.info("One more part of process {} DONE", id);
            }
        } else if (response.isPending()) {
            log.info("Process {} is PENDING yet", id);
        } else {
            log.warn("Unsupported response status: {}", response.getStatus());
        }
    }

    private List<ValidationResponseDto> prepareResponse() {
        return requests
                .stream()
                .map(ValidationRequestDto::getResourceId)
                .map(resourceId -> {
                    try {
                        return getFinishResponse(resourceId)
                                .map(ValidationResponseDto::new)
                                .orElseGet(() -> new ValidationResponseDto(ProcessStatus.ERROR));
                    } catch (NullPointerException e) {
                        return new ValidationResponseDto(ProcessStatus.ERROR);
                    }
                })
                .collect(Collectors.toList());
    }

    /**
     * Для заданного ресурса, среди всех ответов обработчика, найти завершающий.
     * DONE, ERROR or EMPTY
     */
    private Optional<ValidationMqResponse> getFinishResponse(String resourceId) throws NullPointerException {
        return mqResponses.get(resourceId).stream()
                .filter(response -> !response.isPending())
                .findFirst();
    }

    public UUID getId() {
        return id;
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

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
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

    public RequestType getRequestType() {
        return requestType;
    }

    public void setRequestType(RequestType requestType) {
        this.requestType = requestType;
    }
}
