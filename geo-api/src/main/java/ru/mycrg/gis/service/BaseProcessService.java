package ru.mycrg.gis.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.exceptions.CrgFailedException;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.fgistp.MapperUtil;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public abstract class BaseProcessService implements Processable {

    private static Logger log = LoggerFactory.getLogger(BaseProcessService.class);

    private final ProcessRepository processRepository;

    private Set<Process> processesCache = new HashSet<>();

    public BaseProcessService(ProcessRepository processRepository) {
        this.processRepository = processRepository;
    }

    protected Process create(String userName, String title, ProcessType type) {
        return processRepository.save(new Process(userName, title, type));
    }

    protected Process create(String userName, String title, ProcessType type, Object extra) {
        return processRepository.save(new Process(userName, title, type, MapperUtil.convertToJsonNode(extra)));
    }

    protected Process getProcessById(Long id) {
        Optional<Process> processFromCache = getProcessFromCache(id);
        if (processFromCache.isPresent()) {
            log.debug("Process {} was get from cache", id);

            return processFromCache.get();
        } else {
            log.debug("Get process {} from DB", id);

            Optional<Process> optionalProcess = processRepository.findById(id);
            if (optionalProcess.isPresent()) {
                processesCache.add(optionalProcess.get());

                return optionalProcess.get();
            } else {
                throw new CrgFailedException("Not found import process by id: " + id);
            }
        }
    }

    protected void handleProcessResponse(@NotNull Process process, BaseMqProcessResponse mqResponse) {
        switch (mqResponse.getStatus()) {
            case PENDING:
            case SUB_ERROR:
            case SUB_DONE:  addSubStep(process, mqResponse);   break;
            case ERROR:     error(process);     break;
            case DONE:      complete(process);  break;
            default:
                log.warn("Not supported process status. {}", process);
        }
    }

    private void addSubStep(Process process, BaseMqProcessResponse mqResponse) {
        process.setStatus(mqResponse.getStatus());

        // TODO:

        processRepository.save(process);

        log.debug("Add subStep to process: {}", process.getId());
    }

    private void complete(Process process) {
        process.setStatus(ProcessStatus.DONE);

        processRepository.save(process);

        processesCache.remove(process);
        log.info("Successfully complete process: {} / {}", process.getId(), process.getTitle());
    }

    private void error(Process process) {
        process.setStatus(ProcessStatus.ERROR);

        processRepository.save(process);

        processesCache.remove(process);
        log.info("Процесс {} / {} завершился неудачей", process.getId(), process.getTitle());
    }

    private Optional<Process> getProcessFromCache(Long id) {
        return processesCache.stream()
                .filter(process -> process.getId() == id)
                .findFirst();
    }

    private void updateProcessInCache(Process oldProcess, Process newProcess) {
        oldProcess.setStatus(newProcess.getStatus());
        oldProcess.setExtra(newProcess.getExtra());
    }
}
