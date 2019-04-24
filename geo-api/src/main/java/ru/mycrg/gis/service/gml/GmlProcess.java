package ru.mycrg.gis.service.gml;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.service.CrgProcess;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class GmlProcess extends CrgProcess {

    private static Logger log = LoggerFactory.getLogger(GmlProcess.class);

    private GmlRequestDto request;
    private List<GmlMqResponse> mqResponses = new ArrayList<>();
    private CompletableFuture<GmlMqResponse> futureResponse = new CompletableFuture<>();

    public GmlProcess(GmlRequestDto request) {
        super();

        this.request = request;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        GmlMqResponse response = (GmlMqResponse) mqResponse;

        mqResponses.add(response);

        futureResponse.complete(response);

        if (response.getStatus() == ProcessStatus.DONE) {
            setEndTime(LocalDateTime.now());

            log.info("Process id: {} is {}", getId(), response.getStatus());
        } else {
            log.debug("Process: {} is: {}", getId(), response.getStatus());
        }
    }

    public void addResponse(GmlMqResponse response) {
    }

    public CompletableFuture<GmlMqResponse> getFutureResponse() {
        return futureResponse;
    }

    public GmlRequestDto getRequest() {
        return request;
    }
}
