package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.repository.ProcessRepository;

import java.util.Optional;

@Service
public class ProcessService {

    private static Logger log = LoggerFactory.getLogger(ProcessService.class);

    private final ProcessRepository processRepository;

    public ProcessService(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    public Process create(String name, ProcessType type) {
        return processRepository.save(new Process(name, type));
    }

    public Optional<Process> getProcessById(Long id) {
        return processRepository.findById(id);
    }

    public void complete(Process process) {
        process.setActive(false);

        processRepository.save(process);
    }

}
