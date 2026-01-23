package ru.mycrg.report_service.services;

import io.carbone.CarboneDocument;
import io.carbone.CarboneException;
import io.carbone.ICarboneServices;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.report_service.entity.Template;
import ru.mycrg.report_service.exceptions.BadRequestException;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.report_service.utils.CarbonUtils.prepareJsonData;

@Service
public class CarboneBasedReportService implements IReportService {

    private final Logger log = LoggerFactory.getLogger(CarboneBasedReportService.class);

    private final FileService fileService;
    private final TemplateService templateService;
    private final SwapPictureService swapPictureService;
    private final DataServiceSpeaker dataServiceSpeaker;
    private final IAuthenticationFacade authenticationFacade;
    private final ICarboneServices carboneServices;

    public CarboneBasedReportService(FileService fileService,
                                     TemplateService templateService,
                                     SwapPictureService swapPictureService,
                                     DataServiceSpeaker dataServiceSpeaker,
                                     IAuthenticationFacade authenticationFacade,
                                     ICarboneServices carboneServices) {
        this.fileService = fileService;
        this.templateService = templateService;
        this.swapPictureService = swapPictureService;
        this.dataServiceSpeaker = dataServiceSpeaker;
        this.authenticationFacade = authenticationFacade;
        this.carboneServices = carboneServices;
    }

    @Override
    public UUID makeReport(ReportMainDto dto) {
        try {
            // 1 - Убедиться что шаблон есть у этого сервиса
            Template currentTemplate = templateService.getTemplateByName(dto.getTemplateName());
            log.debug("Запрошен отчёт по шаблону {} ->  {}", currentTemplate.getName(), currentTemplate.getName());

            File defaultTemplate = fileService.throwIfNotExist(currentTemplate.getPath());

            // 2 - Модифицировать шаблон переданной картинкой
            File newTemplate = swapPictureService.createNewTemplateWithNewPictures(defaultTemplate, dto.getMedia());

            // 3 - Скормить новый шаблон сервису
            String templateId = carboneServices.addTemplate(Files.readAllBytes(Paths.get(newTemplate.getPath())));

            if (!newTemplate.delete()) {
                //Игнорируем результат удаления, потом что-то придумаем.
                //Плюс в крайнем случае при стопе jvm он сам удалится.
                log.warn("Созданный временный документ не удалён. {}", newTemplate.getPath());
            }

            // 4 - Попросить движок создать файл
            CarboneDocument report = carboneServices.render(prepareJsonData(dto), templateId);

            // 5 - Сохранить полученный файл как сущность платформы
            Optional<UUID> fileProjection = dataServiceSpeaker
                    .postFileOnService(authenticationFacade.getAccessToken(), report.getFileContent(),
                                       report.getName());

            // 6 - Отдать uuid по которому юзер может сделать /export/uuid и получить файл
            if (fileProjection.isEmpty()) {
                throw new IllegalArgumentException("Отчёт успешно сформирован, но не может быть выдан пользователю. " +
                                                           "Уточните подробности у создателя 😉😉😉");
            }

            // 7 - Удалить шаблон
            if (!carboneServices.deleteTemplate(templateId)) {
                //Игнорируем, считаем что пока не важно.
                log.warn("Временный шаблон не удалён!");
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
}
