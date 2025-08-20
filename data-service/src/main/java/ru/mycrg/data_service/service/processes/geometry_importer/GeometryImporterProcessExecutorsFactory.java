package ru.mycrg.data_service.service.processes.geometry_importer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.ProcessDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.IProcessExecutorsFactory;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.enums.ProcessType;

import java.util.LinkedHashMap;

import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT_GEOMETRY;

@Component
public class GeometryImporterProcessExecutorsFactory implements IProcessExecutorsFactory {

    private final Logger log = LoggerFactory.getLogger(GeometryImporterProcessExecutorsFactory.class);

    private final ShapeGeometryImporterExecutor shapeGeometryImporterExecutor;

    public GeometryImporterProcessExecutorsFactory(ShapeGeometryImporterExecutor executor) {
        this.shapeGeometryImporterExecutor = executor;
    }

    @Override
    public ProcessType getType() {
        return IMPORT_GEOMETRY;
    }

    @Override
    public IExecutor<?> getExecutor(ProcessDto payload) {
        FileType fileType = extractFileType(payload);
        if (fileType.equals(FileType.SHP)) {
            return shapeGeometryImporterExecutor;
        }

        throw new BadRequestException("Импорт геометрии поддерживается только для файлов формата SHP");
    }

    private FileType extractFileType(ProcessDto processableModel) {
        try {
            Object fileType = ((LinkedHashMap) processableModel.getPayload()).get("fileType");

            return FileType.valueOf(fileType.toString());
        } catch (Exception e) {
            String msg = "Импорт геометрии поддерживается только для файлов формата SHP";
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }
    }
}
