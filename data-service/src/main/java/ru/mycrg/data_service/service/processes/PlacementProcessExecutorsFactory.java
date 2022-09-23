package ru.mycrg.data_service.service.processes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service_contract.enums.ProcessType;

import java.util.*;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
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
    public IExecutor<?> getExecutor(ProcessDto processableModel) {
        UUID fileId = extractFileIdPayload(processableModel);
        FileType fileType = defineType(fileId);

        IExecutor<?> executor = (IExecutor<?>) executors.get(fileType);
        if (executor == null) {
            throw new BadRequestException("Не найдено обработчика для файла типа: " + fileType);
        }

        return executor;
    }

    private UUID extractFileIdPayload(ProcessDto processableModel) {
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

    private FileType defineType(UUID fileId) {
        Optional<File> oFile = fileRepository.findById(fileId);
        if (oFile.isPresent()) {
            File file = oFile.get();
            try {
                String extension = file.getExtension().toUpperCase();

                return FileType.valueOf(extension);
            } catch (Exception e) {
                String msg = String.format("Не удалось определить тип файла: '%s'", file);
                log.error(msg);

                throw new BadRequestException(msg);
            }
        } else {
            String msg = String.format("Не удалось найти файла: '%s'", fileId);
            log.error(msg);

            throw new BadRequestException(msg);
        }
    }
}
