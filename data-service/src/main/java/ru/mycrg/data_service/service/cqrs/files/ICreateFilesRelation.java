package ru.mycrg.data_service.service.cqrs.files;

import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.service.resources.IQualifiable;
import ru.mycrg.data_service.service.schemas.ISchemable;
import ru.mycrg.geo_json.Feature;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Необходимость в дублирующих друг друга record/feature остаётся до того пока в библиотеках не работаем с геометрией,
 * позже, скорее всего, всё будет feature {@link Feature}
 */
public interface ICreateFilesRelation extends ISchemable, IQualifiable {

    IRecord getRecord();

    Feature getFeature();

    ResponseWithReport getResponseWithReport();

    void addEcpReport(Map<UUID, List<VerifyEcpResponse>> ecpReport);
}
