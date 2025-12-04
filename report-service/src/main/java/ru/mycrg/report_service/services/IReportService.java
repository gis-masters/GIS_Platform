package ru.mycrg.report_service.services;

import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;

import java.util.UUID;

public interface IReportService {

    UUID makeReport(ReportMainDto dto);
}
