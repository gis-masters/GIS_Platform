package ru.mycrg.data_service.service.cqrs.files;

import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.service.resources.IQualifiable;
import ru.mycrg.data_service.service.schemas.ISchemable;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface IUpdateFilesRelation extends ISchemable, IQualifiable {

    IRecord getNewRecord();

    IRecord getOldRecord();

    ResponseWithReport getResponseWithReport();

    void setOldRecord(IRecord oldRecord);

    void addEcpReport(Map<UUID, List<VerifyEcpResponse>> ecpReport);
}
