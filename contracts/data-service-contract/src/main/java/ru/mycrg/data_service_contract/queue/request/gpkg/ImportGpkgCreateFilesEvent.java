package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class ImportGpkgCreateFilesEvent extends DefaultMessageBusRequestEvent {

    private String businessKey;
    private String dbName;
    private UUID gpkgFileId;
    private String login;
    private List<UUID> fileIds = new ArrayList<>();

    public ImportGpkgCreateFilesEvent() {
        super();
    }

    public ImportGpkgCreateFilesEvent(String businessKey,
                                      String dbName,
                                      UUID gpkgFileId,
                                      String login,
                                      List<UUID> fileIds) {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);

        this.businessKey = businessKey;
        this.dbName = dbName;
        this.gpkgFileId = gpkgFileId;
        this.login = login;
        this.fileIds = fileIds;
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

    public UUID getGpkgFileId() {
        return gpkgFileId;
    }

    public void setGpkgFileId(UUID gpkgFileId) {
        this.gpkgFileId = gpkgFileId;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public List<UUID> getFileIds() {
        return fileIds;
    }

    public void setFileIds(List<UUID> fileIds) {
        this.fileIds = fileIds != null ? fileIds : new ArrayList<>();
    }
}
