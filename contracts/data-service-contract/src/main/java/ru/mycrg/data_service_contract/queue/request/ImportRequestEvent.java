package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.FANOUT_IMPORT_INIT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.KEY_IMPORT_INIT;

public class ImportRequestEvent extends DefaultMessageBusRequestEvent {

    private Long processId;
    private String dbName;
    private List<ImportMqTask> tasks = new ArrayList<>();

    public ImportRequestEvent() {
        super();
    }

    public ImportRequestEvent(Long processId, String dbName, List<ImportMqTask> tasks) {
        super(UUID.randomUUID(), FANOUT_IMPORT_INIT, KEY_IMPORT_INIT);

        this.processId = processId;
        this.dbName = dbName;
        this.tasks = tasks;
    }

    public Long getProcessId() {
        return processId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public List<ImportMqTask> getTasks() {
        return tasks;
    }

    public void setTasks(List<ImportMqTask> tasks) {
        this.tasks = tasks;
    }
}
