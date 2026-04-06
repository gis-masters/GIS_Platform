package ru.mycrg.report_service.controller;

import org.junit.jupiter.api.Test;
import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;
import ru.mycrg.common_contracts.generated.report_service.ReportOutputFormat;
import ru.mycrg.report_service.exceptions.BadRequestException;

import java.util.HashMap;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ReportMainControllerTest {

    private final ReportMainController reportController = new ReportMainController(null);

    @Test
    void nullDto_shouldThrowBadRequestException() {
        assertThatThrownBy(() -> reportController.createReport(null))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Поле outputFormat обязательно для заполнения");
    }

    @Test
    void dtoWithoutOutputFormat_shouldThrowBadRequestException() {
        ReportMainDto dto = new ReportMainDto();
        dto.setMedia(new HashMap<>());
        dto.setData(new HashMap<>());

        assertThatThrownBy(() -> reportController.createReport(dto))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Поле outputFormat обязательно для заполнения");
    }

    @Test
    void nullData_shouldThrowBadRequestException() {
        ReportMainDto reportMainDto = new ReportMainDto();
        reportMainDto.setOutputFormat(ReportOutputFormat.PDF);

        assertThatThrownBy(() -> reportController.createReport(reportMainDto))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Поля Data или media обязательный для заполнения");
    }
}
