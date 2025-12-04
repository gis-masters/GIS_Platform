package ru.mycrg.report_service.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;
import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;
import ru.mycrg.common_contracts.generated.report_service.ReportOutputFormat;
import ru.mycrg.report_service.controler.ReportController;
import ru.mycrg.report_service.exceptions.BadRequestException;

import java.util.HashMap;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

@RunWith(MockitoJUnitRunner.class)
public class ReportControllerTest {

    @InjectMocks
    private ReportController reportController;

    @Test
    public void nullDto_shouldThrowBadRequestException() {
        assertThatThrownBy(() -> reportController.createReport(null))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Поле outputFormat обязательно для заполнения");
    }

    @Test
    public void dtoWithoutOutputFormat_shouldThrowBadRequestException() {
        ReportMainDto dto = new ReportMainDto();
        dto.setMedia(new HashMap<>());
        dto.setData(new HashMap<>());

        assertThatThrownBy(() -> reportController.createReport(dto))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Поле outputFormat обязательно для заполнения");
    }

    @Test
    public void nullData_shouldThrowBadRequestException() {
        ReportMainDto reportMainDto = new ReportMainDto();
        reportMainDto.setOutputFormat(ReportOutputFormat.PDF);

        assertThatThrownBy(() -> reportController.createReport(reportMainDto))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Поля Data или media обязательный для заполнения");
    }
}
