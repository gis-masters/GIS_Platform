package ru.mycrg.acceptance.integration_service;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.acceptance.data_service.processes.ProcessableModel;
import ru.mycrg.common_contracts.generated.data_service.gpkg.DataFromGpkgPlacementModel;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgLayersPlacementModel;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTile;

import java.util.ArrayList;

import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.currentFileId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentDocumentId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentLibrary;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

public class GpkgTemplates {

    /**
     * Подразумевается что мы всегда публикуем всё в библиотеку dl_default со схемой, которая не меняется годами.
     */
    public static ProcessableModel makeProcessableModelByGpkgName(String gpkgName) {
        switch (gpkgName) {
            case "oneRaster7829.gpkg":
                return oneRaster7829();

            case "twoRaster7829andCustom.gpkg":
                return twoRaster7829andCustom();

            case "dot7828Poly7829R3857R28406.gpkg":
                return dot7828Poly7829R3857R28406();

            case "brokenVector.gpkg":
                return brokenVector();

            default:
                throw new IllegalStateException("Для файла " + gpkgName + " не прописан сценарий публикации в проекте");
        }
    }

    private static ProcessableModel oneRaster7829() {
        ProcessableModel mainModel = new ProcessableModel();
        mainModel.setType(String.valueOf(IMPORT));

        GpkgLayersPlacementModel subModel = new GpkgLayersPlacementModel();
        subModel.getRasterLayers().add(createTileData("one_raster_7829"));

        mainModel.setPayload(new DataFromGpkgPlacementModel(currentFileId,
                                                            Long.valueOf(projectId),
                                                            subModel));

        return mainModel;
    }

    private static ProcessableModel twoRaster7829andCustom() {
        ProcessableModel mainModel = new ProcessableModel();
        mainModel.setType(String.valueOf(IMPORT));

        GpkgLayersPlacementModel subModel = new GpkgLayersPlacementModel();
        subModel.getRasterLayers().addAll(new ArrayList<>() {{
            add(createTileData("one_raster_7829"));
            add(createTileData("two_raster_7829_102113"));
        }});

        mainModel.setPayload(new DataFromGpkgPlacementModel(currentFileId,
                                                            Long.valueOf(projectId),
                                                            subModel));

        return mainModel;
    }

    private static ProcessableModel dot7828Poly7829R3857R28406() {
        ProcessableModel mainModel = new ProcessableModel();
        mainModel.setType(String.valueOf(IMPORT));

        GpkgLayersPlacementModel subModel = new GpkgLayersPlacementModel();
        subModel.getRasterLayers().addAll(new ArrayList<>() {{
            add(createTileData("ras_3857"));
            add(createTileData("ras_28406"));
        }});

        subModel.getVectorLayers().addAll(new ArrayList<>() {{
            add("poly_7829");
            add("dot_7828");
        }});

        mainModel.setPayload(new DataFromGpkgPlacementModel(currentFileId,
                                                            Long.valueOf(projectId),
                                                            subModel));

        return mainModel;
    }

    private static ProcessableModel brokenVector() {
        ProcessableModel mainModel = new ProcessableModel();
        mainModel.setType(String.valueOf(IMPORT));

        GpkgLayersPlacementModel subModel = new GpkgLayersPlacementModel();
        subModel.getRasterLayers().addAll(new ArrayList<>() {{
            add(createTileData("rastr11"));
            add(createTileData("rastr2222"));
        }});

        subModel.getVectorLayers().addAll(new ArrayList<>() {{
            add("__5555");
            add("adm");
            add("gran");
        }});

        mainModel.setPayload(new DataFromGpkgPlacementModel(currentFileId,
                                                            Long.valueOf(projectId),
                                                            subModel));

        return mainModel;
    }

    private static @NotNull GpkgTile createTileData(String tableName) {
        return new GpkgTile(tableName,
                            currentLibrary.getTableName(),
                            Long.valueOf(currentDocumentId),
                            "some_files");
    }
}
