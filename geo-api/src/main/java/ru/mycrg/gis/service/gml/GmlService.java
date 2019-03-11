package ru.mycrg.gis.service.gml;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.GmlMqRequest;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.queue.MqSender;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class GmlService {

    private static Logger log = LoggerFactory.getLogger(GmlService.class);

    private final MqSender mqSender;

    private List<GmlProcess> gmlProcesses = new ArrayList<>();

    public GmlService(MqSender mqSender) {
        this.mqSender = mqSender;
    }

    public CompletableFuture<String> initProcess(GmlRequestDto request) {
        GmlProcess process = new GmlProcess(request);
        gmlProcesses.add(process);

        // TODO
        mqSender.sendGmlInit(new GmlMqRequest());

        return process.getFutureResponse();
    }

    public void progress(GmlMqResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

//        getProcessById(response.getId())
//                .ifPresentOrElse(
//                        process -> process.addResponse(response),
//                        () -> log.warn("Not found import process by id: {}", response.getId()));
    }

    private Optional<GmlProcess> getProcessById(UUID id) {
        return gmlProcesses.stream()
                .filter(importProcess -> importProcess.getId().equals(id))
                .findFirst();
    }

}
