package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.COMMON_REQUEST_QUEUE;

public class BasemapReferencesDeletionEvent extends DefaultMessageBusRequestEvent {

    private Long basemapId;
    private String complexLayerName;
    private String authToken;
    private Long orgId;

    public BasemapReferencesDeletionEvent() {
        super();
    }

    public BasemapReferencesDeletionEvent(Long basemapId, String complexLayerName, String authToken, Long orgId) {
        super(UUID.randomUUID(), COMMON_REQUEST_QUEUE);

        this.basemapId = basemapId;
        this.authToken = authToken;
        this.complexLayerName = complexLayerName;
        this.orgId = orgId;
    }

    public Long getBasemapId() {
        return basemapId;
    }

    public void setBasemapId(Long basemapId) {
        this.basemapId = basemapId;
    }

    public String getComplexLayerName() {
        return complexLayerName;
    }

    public void setComplexLayerName(String complexLayerName) {
        this.complexLayerName = complexLayerName;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"basemapId\":" + (basemapId == null ? "null" : "\"" + basemapId + "\"") + ", " +
                "\"complexLayerName\":" + (complexLayerName == null ? "null" : "\"" + complexLayerName + "\"") + ", " +
                "\"authToken\":" + (authToken == null ? "null" : "\"" + authToken + "\"") + ", " +
                "\"orgId\":" + (orgId == null ? "null" : "\"" + orgId + "\"") +
                "}";
    }
}
