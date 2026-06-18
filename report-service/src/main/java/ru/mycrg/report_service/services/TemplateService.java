package ru.mycrg.report_service.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.report_service.TemplateCreateDto;
import ru.mycrg.common_contracts.generated.report_service.TemplateFullInfo;
import ru.mycrg.common_contracts.generated.report_service.TemplateShortInfo;
import ru.mycrg.report_service.dto.TemplateFileInfo;
import ru.mycrg.report_service.entity.Template;
import ru.mycrg.report_service.exceptions.BadRequestException;
import ru.mycrg.report_service.exceptions.NotFoundException;
import ru.mycrg.report_service.mappers.TemplateMapper;
import ru.mycrg.report_service.repository.TemplateRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static java.time.LocalDateTime.now;

@Service
public class TemplateService {

    private static final Logger log = LoggerFactory.getLogger(TemplateService.class);

    private final TemplateRepository templateRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final FileService fileService;

    public TemplateService(TemplateRepository templateRepository,
                           IAuthenticationFacade authenticationFacade,
                           FileService fileService) {
        this.templateRepository = templateRepository;
        this.authenticationFacade = authenticationFacade;
        this.fileService = fileService;
    }

    public List<TemplateFullInfo> getAllFullInfoByOrgId() {
        Long organizationId = authenticationFacade.getOrganizationId();

        return templateRepository.findByOrganizationIdOrCommon(organizationId)
                                 .stream()
                                 .filter(template -> !Boolean.TRUE.equals(template.isHidden()))
                                 .map(TemplateMapper::toFullInfo)
                                 .toList();
    }

    public Set<String> getSystemTemplateNames() {
        return templateRepository.findByIsSystemTrue()
                                 .stream()
                                 .map(Template::getName)
                                 .collect(Collectors.toSet());
    }

    public Set<String> getTemplateNames() {
        return StreamSupport.stream(templateRepository.findAll().spliterator(), false)
                            .map(Template::getName)
                            .collect(Collectors.toSet());
    }

    public List<Template> getTemplates() {
        return StreamSupport.stream(templateRepository.findAll().spliterator(), true)
                            .toList();
    }

    public TemplateFullInfo getFullInfoByName(String name) {
        return TemplateMapper.toFullInfo(getTemplateEntityByNameInOrg(name));
    }

    public TemplateFileInfo getTemplateFileByName(String name) {
        Template template = getTemplateEntityByNameInOrg(name);

        try {
            Resource resource = fileService.loadFileByPath(template.getPath());

            return new TemplateFileInfo(template.getName(), resource, resource.contentLength());
        } catch (Exception e) {
            throw new BadRequestException("При скачивании шаблона печати возникла ошибка: " + e.getMessage());
        }
    }

    Template getTemplateEntityByNameInOrg(String name) {
        Long organizationId = authenticationFacade.getOrganizationId();

        Template template = templateRepository.findByName(name)
                                              .orElseThrow(
                                                      () -> new NotFoundException("Шаблон не найден по имени", name));

        //Системные шаблоны отдаём без привязки к организации
        if (template.isSystem()) {
            return template;
        }

        if (template.getOrganizationId() != null && !template.getOrganizationId().equals(organizationId)) {
            log.debug("Шаблон с именем {} не найден в организации {}", name, organizationId);

            throw new NotFoundException("Шаблон не найден по имени", name);
        }

        //Если шаблон не системный и при этом НИЧЕЙ, то отдадим его всем.
        return template;
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
        template.setHidden(false);
        template.setOrganizationId(authenticationFacade.getOrganizationId());

        save(template);

        return TemplateMapper.toFullInfo(template);
    }

    public void createSystemTemplate(TemplateCreateDto dto, String path, boolean hidden) {
        Template template = new Template(dto, path, "SYSTEM", now(), true);
        template.setHidden(hidden);

        save(template);
    }

    @Transactional
    public void deleteTemplate(String name) {
        Template template;
        try {
            template = getTemplateEntityByNameInOrg(name);
        } catch (NotFoundException e) {
            log.warn("Попросили удалить несуществующий шаблон");

            return;
        }

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
        deleteTemplates(templateRepository.findByNameIn(templatesToDelete));
    }

    private void deleteTemplates(List<Template> templates) {
        templateRepository.deleteAll(templates);

        log.info("Удалено шаблонов: {}", templates.size());

        templates.stream()
                 .map(Template::getPath)
                 .distinct()
                 .forEach(fileService::deleteByPath);
    }

    private void save(Template template) {
        templateRepository.save(template);
    }
}
