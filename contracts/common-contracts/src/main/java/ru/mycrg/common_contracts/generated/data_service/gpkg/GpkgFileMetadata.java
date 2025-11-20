package ru.mycrg.common_contracts.generated.data_service.gpkg;

import ru.mycrg.common_contracts.generated.data_service.FileMetadata;

import java.util.List;
import java.util.UUID;

public class GpkgFileMetadata extends FileMetadata<List<GpkgTablesData>> {

    public GpkgFileMetadata() {
        super();
    }

    public GpkgFileMetadata(UUID id, List<GpkgTablesData> tables) {
        super(id, tables);
    }
}
