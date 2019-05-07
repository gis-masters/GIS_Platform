package ru.mycrg.gis.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public abstract class BaseProcessService implements Processable {

    protected List<CrgProcess> processes = new ArrayList<>();

    public BaseProcessService() {}

    protected Optional<CrgProcess> getProcessById(UUID id) {
        return processes.stream()
                .filter(processInfo -> processInfo.getId().equals(id))
                .findFirst();
    }

}
