package ru.mycrg.data_service_contract.enums;

public enum TaskIntermediateStatus {
    APPLICATION_RECEIVED("1"),
    APPLICATION_ASSIGNED_TO_PERFORMER("2"),
    PREPARED_DOCUMENTS_WAITING_FOR_SIGN("3"),
    DOCUMENTS_CORRECTION("4"),
    DOCUMENTS_READY_TO_SENDING("5"),
    APPLICATION_REVIEW_ENDED_AND_ALLOWED("6"),
    APPLICATION_REVIEW_ENDED_AND_DECLINED("7"),
    APPLICATION_CANCELED("8");

    private final String intermediateStatus;

    TaskIntermediateStatus(String intermediateStatus) {
        this.intermediateStatus = intermediateStatus;
    }

    public String getIntermediateStatus() {
        return intermediateStatus;
    }
}
