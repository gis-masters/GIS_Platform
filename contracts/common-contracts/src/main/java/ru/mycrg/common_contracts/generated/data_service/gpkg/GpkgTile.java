package ru.mycrg.common_contracts.generated.data_service.gpkg;

import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgReportBaseDto;

import java.io.Serializable;

public class GpkgTile extends GpkgReportBaseDto implements Serializable {

    private String libraryIdentifier;
    private Long documentId;
    private String field;
    private String gpkgLayerTableName;
    private Long gpkgMediaReference;
    private String srs;
    private String pathAfterImport;

    public GpkgTile() {
        //Req
    }

    public GpkgTile(String gpkgLayerTableName, String libraryIdentifier, Long documentId, String field) {
        this.gpkgLayerTableName = gpkgLayerTableName;
        this.field = field;
        this.documentId = documentId;
        this.libraryIdentifier = libraryIdentifier;
    }

    public GpkgTile(String libraryIdentifier,
                    Long documentId,
                    String field,
                    String gpkgLayerTableName,
                    Long gpkgMediaReference) {
        this.libraryIdentifier = libraryIdentifier;
        this.documentId = documentId;
        this.field = field;
        this.gpkgLayerTableName = gpkgLayerTableName;
        this.gpkgMediaReference = gpkgMediaReference;
    }

    public String getLibraryIdentifier() {
        return libraryIdentifier;
    }

    public void setLibraryIdentifier(String libraryIdentifier) {
        this.libraryIdentifier = libraryIdentifier;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getGpkgLayerTableName() {
        return gpkgLayerTableName;
    }

    public void setGpkgLayerTableName(String gpkgLayerTableName) {
        this.gpkgLayerTableName = gpkgLayerTableName;
    }

    public Long getGpkgMediaReference() {
        return gpkgMediaReference;
    }

    public void setGpkgMediaReference(Long gpkgMediaReference) {
        this.gpkgMediaReference = gpkgMediaReference;
    }

    public String getSrs() {
        return srs;
    }

    public void setSrs(String srs) {
        this.srs = srs;
    }

    public String getPathAfterImport() {
        return pathAfterImport;
    }

    public void setPathAfterImport(String pathAfterImport) {
        this.pathAfterImport = pathAfterImport;
    }

    @Override
    public String toString() {
        return "{" +
                "\"libraryIdentifier\":" + (libraryIdentifier == null ? "null" : "\"" + libraryIdentifier + "\"") + ", " +
                "\"documentId\":" + (documentId == null ? "null" : "\"" + documentId + "\"") + ", " +
                "\"field\":" + (field == null ? "null" : "\"" + field + "\"") + ", " +
                "\"gpkgLayerTableName\":" + (gpkgLayerTableName == null ? "null" : "\"" + gpkgLayerTableName + "\"") + ", " +
                "\"gpkgMediaReference\":" + (gpkgMediaReference == null ? "null" : "\"" + gpkgMediaReference + "\"") + ", " +
                "\"srs\":" + (srs == null ? "null" : "\"" + srs + "\"") + ", " +
                "\"pathAfterImport\":" + (pathAfterImport == null ? "null" : "\"" + pathAfterImport + "\"") +
                "}";
    }
}
