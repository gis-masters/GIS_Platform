package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_GEO_WRAPPER_QUEUE;

public class BuildGpkgRastersEvent extends DefaultMessageBusRequestEvent implements Serializable {

    private String businessKey;
    private Map<String, String> resourceAndPath = new HashMap<>();
    private String path;

    public BuildGpkgRastersEvent() {
        super();
    }

    public BuildGpkgRastersEvent(String businessKey, Map<String, String> resourceAndPath, String path) {
        super(UUID.randomUUID(), INTEGRATION_TO_GEO_WRAPPER_QUEUE);

        this.businessKey = businessKey;
        this.resourceAndPath = resourceAndPath;
        this.path = path;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public Map<String, String> getResourceAndPath() {
        return resourceAndPath == null ? new HashMap<>() : resourceAndPath;
    }

    public void setResourceAndPath(Map<String, String> resourceAndPath) {
        this.resourceAndPath = resourceAndPath == null ? new HashMap<>() : resourceAndPath;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public String toString() {
        return "{" +
                "\"businessKey\":" + (businessKey == null ? "null" : "\"" + businessKey + "\"") + ", " +
                "\"resourceAndPath\":" + (resourceAndPath == null ? "null" : "\"" + resourceAndPath + "\"") + ", " +
                "\"path\":" + (path == null ? "null" : "\"" + path + "\"") +
                "}";
    }
}
