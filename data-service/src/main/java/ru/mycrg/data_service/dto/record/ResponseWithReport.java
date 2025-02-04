package ru.mycrg.data_service.dto.record;

import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;

import java.util.*;

public class ResponseWithReport {

    private Map<UUID, List<VerifyEcpResponse>> ecpReport;
    private Map<String, Object> content;

    public ResponseWithReport() {
        this.ecpReport = new HashMap<>();
        this.content = new HashMap<>();
    }

    public ResponseWithReport(Map<UUID, List<VerifyEcpResponse>> ecpReport, Map<String, Object> content) {
        this.ecpReport = ecpReport;
        this.content = content;
    }

    public Map<UUID, List<VerifyEcpResponse>> getEcpReport() {
        return ecpReport;
    }

    public void setEcpReport(Map<UUID, List<VerifyEcpResponse>> ecpReport) {
        this.ecpReport = ecpReport;
    }

    public Map<String, Object> getContent() {
        return content;
    }

    public void setContent(Map<String, Object> content) {
        this.content = content;
    }
}
