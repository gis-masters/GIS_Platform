package ru.mycrg.common_contracts.generated.data_service.gpkg;

import ru.mycrg.common_contracts.generated.data_service.FileMetadata;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsBaseDto;

import java.util.List;
import java.util.UUID;

public class GpkgFileMetadata extends FileMetadata<List<GpkgContentsBaseDto>> {

    public GpkgFileMetadata() {
        super();
    }

    public GpkgFileMetadata(UUID id, List<GpkgContentsBaseDto> data) {
        super(id, data);
    }
}
