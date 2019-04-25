package ru.mycrg.gis.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.service.CrgProcess;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

public class ValidationProcess extends CrgProcess {

    private static Logger log = LoggerFactory.getLogger(ValidationService.class);

    private String userName;
    private Set<ValidationRequestDto> requests = new HashSet<>();
    private List<ValidationMqResponse> mqResponses = new ArrayList<>();
    private RequestType requestType;
    private CompletableFuture<List<ValidationResponseDto>> futureResponse = new CompletableFuture<>();

    public ValidationProcess() {
        super();
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        ValidationMqResponse response = (ValidationMqResponse) mqResponse;


//        if (mqResponses.containsKey(response.getResourceId())) {
//            List<ValidationMqResponse> responses = this.mqResponses.get(response.getResourceId());
//            responses.add(response);
//        } else {
//            List<ValidationMqResponse> responses = new ArrayList<>();
//            responses.add(response);
//
//            mqResponses.put(response.getResourceId(), responses);
//        }
//
//        if (response.isDone() || response.isEmpty() || response.isError()) {
//            setStatus(response.getStatus());
//
//            completeResponseCounter++;
//            if (completeResponseCounter == requests.size()) {
//                log.info("Last completed. The process {} is successfully completed", getId());
//
//                futureResponse.complete(prepareResponse());
//            } else {
//                log.info("One more part of process {} DONE", getId());
//            }
//        } else if (response.isPending()) {
//            log.info("Process {} is PENDING yet", getId());
//        } else {
//            log.warn("Unsupported response status: {}", response.getStatus());
//        }
    }

    public void addRequest(List<ValidationRequestDto> request) {
        request.stream()
                .distinct()
                .forEach((ValidationRequestDto requestDto) -> {
                    requests.add(requestDto);
                });
    }

//    private List<ValidationResponseDto> prepareResponse() {
//        return requests
//                .stream()
//                .map(ValidationRequestDto::getResourceId)
//                .map(resourceId -> {
//                    try {
//                        return getFinishResponse(resourceId)
//                                .map(ValidationResponseDto::new)
//                                .orElseGet(() -> new ValidationResponseDto(ProcessStatus.ERROR));
//                    } catch (NullPointerException e) {
//                        return new ValidationResponseDto(ProcessStatus.ERROR);
//                    }
//                })
//                .collect(Collectors.toList());
//    }

    /**
     * Для заданного ресурса, среди всех ответов обработчика, найти завершающий.
     * DONE, ERROR or EMPTY
     */
//    private Optional<ValidationMqResponse> getFinishResponse(String resourceId) throws NullPointerException {
//        return mqResponses.get(resourceId).stream()
//                .filter(response -> !response.isPending())
//                .findFirst();
//    }

    public Set<ValidationRequestDto> getRequests() {
        return requests;
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

    public RequestType getRequestType() {
        return requestType;
    }

    public void setRequestType(RequestType requestType) {
        this.requestType = requestType;
    }

}
