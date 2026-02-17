package ru.mycrg.messagebus_contract.events.integration_wrapper;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_GEO_WRAPPER_QUEUE;

public class ImportGpkgExtractRasterEvent extends DefaultMessageBusRequestEvent {

    private String businessKey;
    private String dbName;
    private UUID fileId;
    private String token;
    private List<String> tilesNames;

    public ImportGpkgExtractRasterEvent() {
        super();
    }

    public ImportGpkgExtractRasterEvent(String businessKey,
                                        String dbName,
                                        UUID fileId,
                                        String token,
                                        List<String> tilesNames) {
        super(UUID.randomUUID(), INTEGRATION_TO_GEO_WRAPPER_QUEUE);

        this.businessKey = businessKey;
        this.dbName = dbName;
        this.fileId = fileId;
        this.token = token;
        this.tilesNames = tilesNames;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<String> getTilesNames() {
        return tilesNames;
    }

    public void setTilesNames(List<String> tilesNames) {
        this.tilesNames = tilesNames;
    }
}
