package ru.mycrg.report_service.services;

import io.carbone.CarboneDocument;
import io.carbone.CarboneException;
import io.carbone.ICarboneServices;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;
import ru.mycrg.common_contracts.generated.report_service.ReportOutputFormat;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.report_service.dto.CarbonDto;
import ru.mycrg.report_service.entity.Template;
import ru.mycrg.report_service.exceptions.BadRequestException;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.common_contracts.generated.report_service.ReportOutputFormat.DOCX;
import static ru.mycrg.http_client.JsonConverter.toJson;

@Service
public class CarboneBasedReportService implements IReportService {

    private final Logger log = LoggerFactory.getLogger(CarboneBasedReportService.class);

    private final FileService fileService;
    private final TemplateService templateService;
    private final ReplacePictureService replacePictureService;
    private final DataServiceSpeaker dataServiceSpeaker;
    private final IAuthenticationFacade authenticationFacade;
    private final ICarboneServices carboneServices;
    private final String carboneLang;
    private final String carboneTimezone;

    public CarboneBasedReportService(FileService fileService,
                                     TemplateService templateService,
                                     ReplacePictureService replacePictureService,
                                     DataServiceSpeaker dataServiceSpeaker,
                                     IAuthenticationFacade authenticationFacade,
                                     ICarboneServices carboneServices,
                                     @Value("${crg-options.carbone.lang}") String carboneLang,
                                     @Value("${crg-options.carbone.timezone}") String carboneTimezone) {
        this.fileService = fileService;
        this.templateService = templateService;
        this.replacePictureService = replacePictureService;
        this.dataServiceSpeaker = dataServiceSpeaker;
        this.authenticationFacade = authenticationFacade;
        this.carboneServices = carboneServices;
        this.carboneLang = carboneLang;
        this.carboneTimezone = carboneTimezone;
    }

    @Override
    public UUID makeReport(ReportMainDto dto) {
        try {
            // 1 - Убедиться что шаблон есть у этого сервиса
            Template currentTemplate = templateService.getTemplateByName(dto.getTemplateName());
            log.debug("Запрошен отчёт по шаблону {} ->  {}", currentTemplate.getName(), currentTemplate.getName());
            File defaultTemplate = fileService.throwIfNotExist(currentTemplate.getPath());

            // 2 - Определить нужен ли DOCX для SwapPictureService
            boolean hasMedia = dto.getMedia() != null && !dto.getMedia().isEmpty();
            ReportOutputFormat firstRenderFormat = hasMedia ? DOCX : dto.getOutputFormat();

            // 3 - Скормить новый шаблон сервису
            String templateId = carboneServices.addTemplate(Files.readAllBytes(Paths.get(defaultTemplate.getPath())));

            // 4 - Попросить движок создать файл
            CarboneDocument report = carboneServices.
                    render(toJson(createCarbonDto(dto.getData(), firstRenderFormat.name().toLowerCase())), templateId);

            // 5 - Модифицировать шаблон переданной media
            File newTemplate = replacePictureService
                    .createNewFile(fileService.createFileCopy(report.getName(), report.getFileContent()),
                                   dto.getMedia());

            carboneServices.deleteTemplate(templateId);

            if (hasMedia && dto.getOutputFormat() != DOCX) {
                newTemplate = changeFileIfNeed(dto.getOutputFormat(), newTemplate);
            }

            // 6 - Сохранить полученный файл как сущность платформы
            Optional<UUID> fileProjection = dataServiceSpeaker
                    .postFileOnService(authenticationFacade.getAccessToken(), newTemplate);

            // 7 - Отдать uuid по которому юзер может сделать /export/uuid и получить файл
            if (fileProjection.isEmpty()) {
                throw new IllegalArgumentException("Отчёт успешно сформирован, но не может быть выдан пользователю. " +
                                                           "Уточните подробности у создателя 😉😉😉");
            }

            return fileProjection.get();
        } catch (FileNotFoundException e) {
            String message = e.getMessage();
            log.error("Произошла ошибка формирования отчёта. Причина: {}", message);

            throw new BadRequestException("Указанного шаблона не существует на сервере. [" + message + "]");
        } catch (CarboneException e) {
            String message = e.getMessage();
            log.error("Невозможно сформировать отчёт. Причина: {}", message);

            throw new BadRequestException("Сервер отчётов не смог сформировать документ. Причина: " + message);
        } catch (HttpClientException e) {
            String message = e.getMessage();
            log.error("Ошибка работы по сети. Подробности: {}", message);

            throw new BadRequestException("Нарушено микросервисное взаимодействие. Подробности: " + message);
        } catch (Exception e) {
            String message = e.getMessage();
            log.error(e.getMessage());

            throw new BadRequestException("Неожиданная ошибка формирования отчёта. Подробности: " + message);
        }
    }

    /**
     * Конвертирует DOCX в запрошенный формат, если требуется. SwapPictureService работает только с DOCX, поэтому
     * конвертация выполняется после обработки картинок.
     *
     * @param format      исходный запрос с целевым форматом
     * @param newTemplate обработанный DOCX файл
     *
     * @return файл в запрошенном формате или исходный DOCX
     */
    private File changeFileIfNeed(ReportOutputFormat format, File newTemplate) throws Exception {
        // 5.1: Загрузить обработанный DOCX как шаблон
        String docxTemplateId = carboneServices.addTemplate(
                Files.readAllBytes(Paths.get(newTemplate.getPath()))
        );

        // 5.2: Рендер с пустыми данными = конвертация формата
        CarboneDocument converted = carboneServices.render(
                toJson(createCarbonDto(new HashMap<>(), format.name().toLowerCase())),
                docxTemplateId
        );

        newTemplate = fileService.createFileCopy(converted.getName(), converted.getFileContent());

        // 5.3: Удалить временный DOCX-шаблон
        carboneServices.deleteTemplate(docxTemplateId);

        return newTemplate;
    }

    private CarbonDto createCarbonDto(Object data, String convertTo) {
        return new CarbonDto(data, convertTo, carboneLang, carboneTimezone);
    }
}
