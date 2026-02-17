package ru.mycrg.data_service.service.files;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.data_service.FileMetadata;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgFileMetadata;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsBaseDto;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.gpkg.importer.GpkgReaderService;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

@Component
public class GpkgMetadataExtractor implements IMetadataExtractor {

    private final GpkgReaderService gpkgReaderService;

    public GpkgMetadataExtractor(GpkgReaderService gpkgReaderService) {
        this.gpkgReaderService = gpkgReaderService;
    }

    @Override
    public FileMetadata<?> extract(@NotNull File file) {
        try (Connection connection = gpkgReaderService.getConnectionToGpkg(file.getPath())) {
            if (!gpkgReaderService.isGpkgValidDataBaseFile(connection)) {
                throw new BadRequestException("Файл " + file.getTitle() + " не является корректным GPKG файлом");
            }

            List<GpkgContentsBaseDto> gpkgLayersData = new ArrayList<>();
            gpkgLayersData.addAll(gpkgReaderService.getAllVectorLayersFromGpkgContents(connection));
            gpkgLayersData.addAll(gpkgReaderService.getAllTilesFromGpkgContents(connection));
            gpkgLayersData.addAll(gpkgReaderService.getAllSystemTablesFromGpkgContents(connection));

            return new GpkgFileMetadata(file.getId(), gpkgLayersData);
        } catch (Exception e) {
            throw new BadRequestException("Ошибка при получении информации из GPKG: " + e.getMessage());
        }
    }

    @Override
    public String getType() {
        return "gpkg";
    }
}
