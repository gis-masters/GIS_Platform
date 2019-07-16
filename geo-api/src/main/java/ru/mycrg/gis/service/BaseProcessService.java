package ru.mycrg.gis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
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

    protected ObjectMapper mapper = new ObjectMapper();

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

    protected void complete(Process process, Object data) {
        process.setStatus(ProcessStatus.DONE);

        if (data != null) {
            JsonNode jsonNode = MapperUtil.convertToJsonNode(data);
            process.setDetails(jsonNode);
        }

        processRepository.save(process);

        processesCache.remove(process);
        log.info("Successfully complete process: {} / {}", process.getId(), process.getTitle());
    }

    protected void error(Process process, String errMsg) {
        process.setStatus(ProcessStatus.ERROR);

        if (errMsg != null) {
            JsonNode jsonNode = MapperUtil.convertToJsonNode(errMsg);
            process.setDetails(jsonNode);
        }

        processRepository.save(process);

        processesCache.remove(process);
        log.info("Процесс {} / {} завершился неудачей", process.getId(), process.getTitle());
    }

    private Optional<Process> getProcessFromCache(Long id) {
        return processesCache.stream()
                .filter(process -> process.getId() == id)
                .findFirst();
    }

}
