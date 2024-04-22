package ru.mycrg.data_service_contract.dto.publication;

import java.io.Serializable;

public class GeoserverPublicationData implements Serializable {

    private String workspaceName;
    private String storeName;
    private String featureTypeName;
    private String nativeName;

    public GeoserverPublicationData() {
        // Qualifier
    }

    /**
     * @param workspaceName   Название рабочей области "scratch_workspace_{orgId}"
     * @param storeName       Название хранилища
     * @param featureTypeName Желаемое название слоя на геосервере.
     * @param nativeName      Должен соответствовать названию таблицы для векторного слоя, названию файла для слоя на
     *                        основе файла, "entities" для DXF слоя.
     */
    public GeoserverPublicationData(String workspaceName, String storeName, String featureTypeName, String nativeName) {
        this.workspaceName = workspaceName;
        this.storeName = storeName;
        this.featureTypeName = featureTypeName;
        this.nativeName = nativeName;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getFeatureTypeName() {
        return featureTypeName;
    }

    public void setFeatureTypeName(String featureTypeName) {
        this.featureTypeName = featureTypeName;
    }

    public String getNativeName() {
        return nativeName;
    }

    public void setNativeName(String nativeName) {
        this.nativeName = nativeName;
    }

    @Override
    public String toString() {
        return "{" +
                "\"workspaceName\":" + (workspaceName == null ? "null" : "\"" + workspaceName + "\"") + ", " +
                "\"storeName\":" + (storeName == null ? "null" : "\"" + storeName + "\"") + ", " +
                "\"featureTypeName\":" + (featureTypeName == null ? "null" : "\"" + featureTypeName + "\"") + ", " +
                "\"nativeName\":" + (nativeName == null ? "null" : "\"" + nativeName + "\"") +
                "}";
    }
}
