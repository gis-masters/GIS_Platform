package ru.mycrg.data_service.service.processes.file_placement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.IProcessExecutorsFactory;
import ru.mycrg.data_service.dto.ProcessDto;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.enums.ProcessType;

import java.util.*;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.service.files.FileUtil.defineType;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Component
public class PlacementProcessExecutorsFactory implements IProcessExecutorsFactory {

    private final Logger log = LoggerFactory.getLogger(PlacementProcessExecutorsFactory.class);

    private final String FILE_ID = "fileId";
    private final Map<FileType, IFilePlacer> executors;
    private final FileRepository fileRepository;

    public PlacementProcessExecutorsFactory(List<IFilePlacer> importExecutors,
                                            FileRepository fileRepository) {
        this.fileRepository = fileRepository;
        this.executors = importExecutors.stream()
                                        .collect(toMap(IFilePlacer::getFileType, Function.identity()));
    }

    @Override
    public ProcessType getType() {
        return IMPORT;
    }

    @Override
    public IExecutor<?> getExecutor(ProcessDto payload) {
        UUID fileId = extractFileIdOrThrow(payload);
        Optional<File> oFile = fileRepository.findById(fileId);
        if (oFile.isEmpty()) {
            String msg = String.format("Не удалось найти файл: '%s'", fileId);
            log.error(msg);

            throw new BadRequestException(msg);
        }

        FileType fileType = defineType(oFile.get());

        IExecutor<?> executor = (IExecutor<?>) executors.get(fileType);
        if (executor == null) {
            throw new BadRequestException("Не найдено обработчика для файла типа: " + fileType);
        }

        return executor;
    }

    private UUID extractFileIdOrThrow(ProcessDto processableModel) {
        try {
            Object fileId = ((LinkedHashMap) processableModel.getPayload()).get(FILE_ID);

            return UUID.fromString(fileId.toString());
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель для импорта: '%s' Не удалось извлечь 'fileId'",
                                       processableModel.getPayload());
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }
    }
}
