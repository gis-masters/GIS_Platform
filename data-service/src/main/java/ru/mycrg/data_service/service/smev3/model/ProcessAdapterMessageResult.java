package ru.mycrg.data_service.service.smev3.model;

public class ProcessAdapterMessageResult {

    private SmevRequestMeta smevRequestMeta;
    private ProcessMessageStatus status;
    private String message;

    public ProcessAdapterMessageResult(ProcessMessageStatus status) {
        this.status = status;
        this.message = status.getDescription();
    }

    public SmevRequestMeta getXmlBuildMeta() {
        return smevRequestMeta;
    }

    public ProcessAdapterMessageResult setXmlBuildMeta(SmevRequestMeta smevRequestMeta) {
        this.smevRequestMeta = smevRequestMeta;
        return this;
    }

    public ProcessMessageStatus getStatus() {
        return status;
    }

    public ProcessAdapterMessageResult setStatus(ProcessMessageStatus status) {
        this.status = status;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public ProcessAdapterMessageResult setMessage(String message) {
        this.message = message;
        return this;
    }

    public ProcessAdapterMessageResult setSmevDescription(String smevCode, String smevDescription) {
        setMessage(String.format("%s -%s - %s", status.getDescription(), smevCode, smevDescription));
        return this;
    }

    public boolean isFgisEgrnMessage() {
        return smevRequestMeta.getRequestXmlString().contains("RRTR02");
    }
}
