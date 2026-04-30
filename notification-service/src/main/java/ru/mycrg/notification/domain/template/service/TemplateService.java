package ru.mycrg.notification.domain.template.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.notification.domain.template.dto.TemplateRequestDto;
import ru.mycrg.notification.domain.template.dto.TemplateResponseDto;
import ru.mycrg.notification.domain.template.entity.TemplateEntity;
import ru.mycrg.notification.domain.template.repository.TemplateRepository;
import ru.mycrg.notification.exceptions.NotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemplateService {

    private static final Logger log = LoggerFactory.getLogger(TemplateService.class);

    private final TemplateRepository templateRepository;

    @Autowired
    public TemplateService(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    @Transactional(readOnly = true)
    public List<TemplateResponseDto> getAllTemplates() {
        log.debug("Получение всех шаблонов");
        return templateRepository.findAll().stream()
                                 .map(this::mapToResponseDto)
                                 .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TemplateResponseDto getTemplateById(String name) {
        log.debug("Получение шаблона по имени: {}", name);
        return templateRepository.findById(name)
                                 .map(this::mapToResponseDto)
                                 .orElseThrow(() -> new NotFoundException("Шаблон с именем " + name + " не найден"));
    }

    @Transactional
    public TemplateResponseDto createTemplate(TemplateRequestDto requestDto) {
        log.debug("Создание нового шаблона: {}", requestDto.getName());

        if (templateRepository.existsById(requestDto.getName())) {
            throw new IllegalArgumentException("Шаблон с именем " + requestDto.getName() + " уже существует");
        }

        TemplateEntity templateEntity = new TemplateEntity(requestDto.getName(), requestDto.getContent());
        TemplateEntity savedEntity = templateRepository.save(templateEntity);

        return mapToResponseDto(savedEntity);
    }

    @Transactional
    public TemplateResponseDto updateTemplate(String name, TemplateRequestDto requestDto) {
        log.debug("Обновление шаблона с именем {}", name);

        // Проверяем существование шаблона
        if (!templateRepository.existsById(name)) {
            throw new NotFoundException("Шаблон с именем " + name + " не найден");
        }

        // Если имя меняется, нужно удалить старый шаблон и создать новый
        if (!name.equals(requestDto.getName())) {
            // Проверяем, не существует ли уже шаблон с новым именем
            if (templateRepository.existsById(requestDto.getName())) {
                throw new IllegalArgumentException("Шаблон с именем " + requestDto.getName() + " уже существует");
            }

            // Получаем старый шаблон
            TemplateEntity oldTemplate = templateRepository
                    .findById(name)
                    .orElseThrow(() -> new NotFoundException("Шаблон с именем " + name + " не найден"));

            // Создаем новый шаблон с новым именем, но сохраняем дату создания
            TemplateEntity newTemplate = new TemplateEntity(requestDto.getName(), requestDto.getContent());
            newTemplate.setCreatedAt(oldTemplate.getCreatedAt());

            // Удаляем старый шаблон
            templateRepository.deleteById(name);

            // Сохраняем новый шаблон
            TemplateEntity savedEntity = templateRepository.save(newTemplate);
            return mapToResponseDto(savedEntity);
        } else {
            // Если имя не меняется, просто обновляем содержимое
            TemplateEntity templateEntity = templateRepository
                    .findById(name)
                    .orElseThrow(() -> new NotFoundException("Шаблон с именем " + name + " не найден"));

            templateEntity.setContent(requestDto.getContent());
            TemplateEntity updatedEntity = templateRepository.save(templateEntity);

            return mapToResponseDto(updatedEntity);
        }
    }

    @Transactional
    public void deleteTemplate(String name) {
        log.debug("Удаление шаблона с именем: {}", name);

        if (!templateRepository.existsById(name)) {
            throw new NotFoundException("Шаблон с именем " + name + " не найден");
        }

        templateRepository.deleteById(name);
    }

    private TemplateResponseDto mapToResponseDto(TemplateEntity entity) {
        return new TemplateResponseDto(
                entity.getName(),
                entity.getContent(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
