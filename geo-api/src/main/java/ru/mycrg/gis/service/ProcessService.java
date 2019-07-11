package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.fgistp.MapperUtil;

import java.util.Optional;

@Service
public class ProcessService {

    private static Logger log = LoggerFactory.getLogger(ProcessService.class);

    private final ProcessRepository processRepository;

    public ProcessService(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    public Process create(String userName, String title, ProcessType type) {
        return processRepository.save(new Process(userName, title, type));
    }

    public Process create(String userName, String title, ProcessType type, Object extra) {
        return processRepository.save(new Process(userName, title, type, MapperUtil.convertToJsonNode(extra)));
    }

    public Optional<Process> getProcessById(Long id) {
        return processRepository.findById(id);
    }

    public void complete(Process process) {
        process.setStatus(ProcessStatus.DONE);

        processRepository.save(process);

        log.info("Successfully complete process: {}", process.getTitle());
    }

    public void error(Process process) {
        process.setStatus(ProcessStatus.ERROR);

        processRepository.save(process);

        log.warn("Процесс {} завершился неудачей", process.getTitle());
    }
}
