package ru.mycrg.data_service.service.processes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service_contract.enums.ProcessType;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT_GEOMETRY;

@Component
public class GeometryShapeProcessExecutorsFactory implements IProcessExecutorsFactory {

    private final Logger log = LoggerFactory.getLogger(GeometryShapeProcessExecutorsFactory.class);

    private final Map<FileType, IFilePlacer> executors;

    public GeometryShapeProcessExecutorsFactory(List<IFilePlacer> importExecutors) {
        this.executors = importExecutors.stream()
                                        .collect(toMap(IFilePlacer::getFileType, Function.identity()));
    }

    @Override
    public ProcessType getType() {
        return IMPORT_GEOMETRY;
    }

    @Override
    public IExecutor<?> getExecutor(ProcessDto processableModel) {
        FileType fileType = extractFileType(processableModel);
        IExecutor<?> executor = (IExecutor<?>) executors.get(fileType);
        if (executor == null) {
            throw new BadRequestException("Не найдено обработчика для файла типа: " + fileType);
        }

        return executor;
    }

    private FileType extractFileType(ProcessDto processableModel) {
        try {
            Object fileType = ((LinkedHashMap) processableModel.getPayload()).get("fileType");

            return FileType.valueOf(fileType.toString());
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель для импорта: '%s' Не удалось извлечь 'fileType'",
                                       processableModel.getPayload());
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }
    }
}
