package ru.mycrg.report_service.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.report_service.TemplateCreateDto;
import ru.mycrg.common_contracts.generated.report_service.TemplateShortInfo;
import ru.mycrg.common_contracts.generated.report_service.TemplateShortProjection;
import ru.mycrg.report_service.entity.Template;
import ru.mycrg.report_service.exceptions.BadRequestException;
import ru.mycrg.report_service.exceptions.NotFoundException;
import ru.mycrg.report_service.repository.TemplateRepository;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.StreamSupport;

import static java.time.LocalDateTime.now;
import static ru.mycrg.report_service.services.FileService.TEMPLATES_DIR;

@Service
public class TemplateService {

    private final Logger log = LoggerFactory.getLogger(TemplateService.class);

    private final ProjectionFactory projectionFactory;
    private final TemplateRepository templateRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final FileService fileService;

    public TemplateService(ProjectionFactory projectionFactory,
                           TemplateRepository templateRepository,
                           IAuthenticationFacade authenticationFacade,
                           FileService fileService) {
        this.projectionFactory = projectionFactory;
        this.templateRepository = templateRepository;
        this.authenticationFacade = authenticationFacade;
        this.fileService = fileService;
    }

    public List<TemplateShortProjection> getAll() {
        return StreamSupport.stream(templateRepository.findAll().spliterator(), false)
                            .map(this::mapToShortProjection)
                            .toList();
    }

    public List<Template> getSystemTemplates() {
        return templateRepository.findByIsSystemTrue();
    }

    public Template getTemplateByName(String name) {
        return templateRepository.findByName(name)
                                 .orElseThrow(() -> new NotFoundException("Шаблон не найден по имени " + name));
    }

    public TemplateShortInfo createTemplate(TemplateCreateDto dto, MultipartFile file) {
        String currentName = dto.getName();

        Optional<Template> oTemplate = templateRepository.findByName(currentName);
        if (oTemplate.isPresent()) {
            throw new BadRequestException("Шаблон с именем " + currentName + " существует. Выберите другое имя!");
        }

        String path;
        try {
            path = fileService.saveInMainPath(file);
        } catch (Exception e) {
            throw new BadRequestException("Ошибка при сохранении шаблона на сервер. Подробнее: " + e.getMessage());
        }
        Template template = new Template(dto, path, authenticationFacade.getLogin(), now());
        save(template);

        return new TemplateShortInfo(template.getName(), template.getTitle());
    }

    public void save(Template template) {
        templateRepository.save(template);
    }

    @Transactional
    public void deleteTemplate(String name) {
        Optional<Template> oTemplate = templateRepository.findByName(name);
        if (oTemplate.isEmpty()) {
            log.debug("Попросили удалить несуществующий шаблон '{}'", name);

            return;
        }

        Template template = oTemplate.get();
        if (template.isSystem()) {
            log.debug("Пользователь {} попросил удалить системный шаблон {}",
                      authenticationFacade.getLogin(), name);

            throw new BadRequestException("Невозможно удалить системный шаблон печати!!!");
        }

        String filePath = template.getPath();

        try {
            templateRepository.deleteById(template.getId());
            log.debug("Шаблон с именем [{}] успешно удалён из базы данных", name);

            fileService.deleteByPath(filePath);
            log.debug("Шаблон {} успешно удалён с диска", filePath);
        } catch (Exception e) {
            log.error("Не удалось удалить шаблон {} после удаления записи в БД {}. Причина: {}",
                      filePath, name, e.getMessage());

            throw new BadRequestException("Ошибка при удалении шаблона печати => " + e.getMessage());
        }
    }

    @Transactional
    public void deleteTemplates(Set<String> templatesToDelete) {
        int deleted = templateRepository.deleteByNameInAndIsSystemTrue(templatesToDelete);

        log.info("Удалено шаблонов: {}", deleted);

        for (String template: templatesToDelete) {
            List<File> files = fileService.
                    getFilesByPathWithPattern(TEMPLATES_DIR, Pattern.compile(template + "\\.(?!json$).*"));

            fileService.deleteByPath(files.getFirst().getPath());
        }
    }

    private TemplateShortProjection mapToShortProjection(Template template) {
        return projectionFactory.createProjection(TemplateShortProjection.class, template);
    }
}
