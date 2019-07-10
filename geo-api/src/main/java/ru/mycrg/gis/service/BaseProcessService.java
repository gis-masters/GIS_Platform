package ru.mycrg.gis.service;

import org.springframework.stereotype.Service;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.repository.ProcessRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public abstract class BaseProcessService implements Processable {

    protected List<CrgProcess> processes = new ArrayList<>();

    private final ProcessRepository processRepository;

    public BaseProcessService(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    Optional<Process> getProcessById(Long id) {
        return processRepository.findById(id);
    }

    void complete(Process process) {
        process.setActive(false);

        processRepository.save(process);
    }

}
