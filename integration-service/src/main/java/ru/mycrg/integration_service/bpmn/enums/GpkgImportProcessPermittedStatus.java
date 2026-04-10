package ru.mycrg.integration_service.bpmn.enums;

public enum GpkgImportProcessPermittedStatus {
    DEFAULT("default"),

    NO_ACCESS_TO_PROJECT("noAccessToProject"),
    PROJECT_ACCESS_HTTP_FAILED("projectAccessHttpFailed"),

    GROUP_CREATE_HTTP_FAILED("groupCreateHttpFailed"),
    CREATE_GROUP_IN_PROJECT_FAIL("createGroupInProjectFail"),

    FEATURES("features"),
    TILES("tiles"),
    FEATURES_AND_TILES("featuresAndtiles"),

    GDAL_IMPORT_VECTOR_DONE("gdalImportVectorDone"),
    GDAL_IMPORT_VECTOR_FAILED("gdalImportVectorFailed"),
    HAVE_ONE_MORE_OBJECT("haveOneMoreObject"),
    ALL_VECTOR_IS_DONE("allVectorIsDone"),

    HAVE_ONE_MORE_FILE("haveOneMoreFile"),
    ALL_FILES_WORK_DONE("allFilesWorkDone"),

    ONE_MORE_RASTERS("oneMoreRasters"),
    DONE_ALL_RASTERS("doneAllRasters"),

    EXTRACT_RASTER_WRAPPER_ONLY("wrapperOnly"),
    EXTRACT_RASTER_DATA_SERVICE_ONLY("dataService"),
    EXTRACT_RASTER_BOTH_WAYS("wrapperAndData"),
    NEED_PUBLISH_ONE_MORE_RASTER("needPublishOneMoreRaster"),
    ALL_RASTERS_IS_PUBLISHED("allRastersIsPublished"),

    IMPORT_DONE("importDone"),
    IMPORT_FAILED("importFailed");

    private final String value;

    GpkgImportProcessPermittedStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

    public static GpkgImportProcessPermittedStatus stringToValue(String status) {
        if (status == null) {
            throw new IllegalArgumentException("Переданное значение не может быть null");
        }

        for (GpkgImportProcessPermittedStatus s: GpkgImportProcessPermittedStatus.values()) {
            if (s.value.equalsIgnoreCase(status)) {
                return s;
            }
        }

        throw new IllegalArgumentException("Неожиданный статус '" + status + "'");
    }
}
