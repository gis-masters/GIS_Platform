package ru.mycrg.data_service_contract.dto.publication;

import ru.mycrg.data_service_contract.dto.ProcessModel;

import java.io.Serializable;
import java.util.UUID;

public class BaseWsProcess implements Serializable {

    private String token;
    private ProcessModel processModel;
    private UUID wsMsgId;
    private String wsUiId;

    public BaseWsProcess() {
        // Required
    }

    public BaseWsProcess(String token, ProcessModel processModel, UUID wsMsgId, String wsUiId) {
        this.token = token;
        this.processModel = processModel;
        this.wsMsgId = wsMsgId;
        this.wsUiId = wsUiId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ProcessModel getProcessModel() {
        return processModel;
    }

    public void setProcessModel(ProcessModel processModel) {
        this.processModel = processModel;
    }

    public UUID getWsMsgId() {
        return wsMsgId;
    }

    public void setWsMsgId(UUID wsMsgId) {
        this.wsMsgId = wsMsgId;
    }

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"token\":" + (token == null ? "null" : "\"" + token + "\"") + ", " +
                "\"processModel\":" + (processModel == null ? "null" : processModel) + ", " +
                "\"wsMsgId\":" + (wsMsgId == null ? "null" : wsMsgId) + ", " +
                "\"wsUiId\":" + (wsUiId == null ? "null" : "\"" + wsUiId + "\"") +
                "}";
    }
}
