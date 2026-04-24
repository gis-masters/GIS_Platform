package ru.mycrg.data_service.kpt_import.model;

public class KptSourceDocumentMetadata {

    /**
     * Список объектов которые будут записаны в основной документ КПТ, а не в таблицы по импорту.
     */
    public static final String DATE_RECEIVED_REQUEST = "date_received_request";
    public static final String CAD_BLOCK_NUM = "cad_block_num";

    private String dateReceivedRequest;
    private String cadBlockNum;

    public String getDateReceivedRequest() {
        return dateReceivedRequest;
    }

    public void setDateReceivedRequest(String dateReceivedRequest) {
        this.dateReceivedRequest = dateReceivedRequest;
    }

    public String getCadBlockNum() {
        return cadBlockNum;
    }

    public void setCadBlockNum(String cadBlockNum) {
        this.cadBlockNum = cadBlockNum;
    }

    public boolean isEmpty() {
        return dateReceivedRequest == null && cadBlockNum == null;
    }

    public boolean isComplete() {
        return dateReceivedRequest != null && cadBlockNum != null;
    }
}
