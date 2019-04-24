package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public abstract class BaseProcessService implements Processable {

    private static Logger log = LoggerFactory.getLogger(BaseProcessService.class);

    protected List<CrgProcess> processes = new ArrayList<>();

    public BaseProcessService() {}

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<CrgProcess> processById = getProcessById(response.getId());
        if (processById.isPresent()) {
            CrgProcess process = processById.get();
            process.handleMqResponse(response);
        } else {
            log.warn("Not found validation process by id: {}", response.getId());
        }
    }

    protected Optional<CrgProcess> getProcessById(UUID id) {
        return processes.stream()
                .filter(processInfo -> processInfo.getId().equals(id))
                .findFirst();
    }

}
