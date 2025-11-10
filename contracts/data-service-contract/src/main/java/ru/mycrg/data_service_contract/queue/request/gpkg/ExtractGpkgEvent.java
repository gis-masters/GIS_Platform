package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_GEO_WRAPPER_QUEUE;

//пакет не тот как будто бы
public class ExtractGpkgEvent extends DefaultMessageBusRequestEvent {

    private String dbName;
    private String filePath;
    private String businessKey;

    public ExtractGpkgEvent() {
        super();
    }

    public ExtractGpkgEvent(String dbName,
                            String filePath,
                            String businessKey) {
        super(UUID.randomUUID(), INTEGRATION_TO_GEO_WRAPPER_QUEUE);

        this.dbName = dbName;
        this.filePath = filePath;
        this.businessKey = businessKey;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }
}
