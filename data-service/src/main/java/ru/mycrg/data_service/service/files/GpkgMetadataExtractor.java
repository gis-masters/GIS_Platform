package ru.mycrg.data_service.service.files;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.data_service.FileMetadata;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgFileMetadata;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTablesData;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.service.gpkg.importer.GpkgReaderService;

import java.util.List;

@Component
public class GpkgMetadataExtractor implements IMetadataExtractor {

    private final GpkgReaderService gpkgReaderService;

    public GpkgMetadataExtractor(GpkgReaderService gpkgReaderService) {
        this.gpkgReaderService = gpkgReaderService;
    }

    @Override
    public FileMetadata<?> extract(@NotNull File file) {
        List<GpkgTablesData> data = gpkgReaderService.getTablesSmallInfoFromGpkg(file.getPath());

        return new GpkgFileMetadata(file.getId(), data);
    }

    @Override
    public String getType() {
        return "gpkg";
    }
}
