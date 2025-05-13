package ru.mycrg.data_service.service.cqrs.specialization.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service.service.SystemTagsPublisher;
import ru.mycrg.data_service.service.cqrs.specialization.SpecializationManager;
import ru.mycrg.data_service.service.cqrs.specialization.requests.InitSpecializationSchemaRequest;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.Set;

import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;

@Component
public class InitSpecializationSchemaRequestHandler implements IRequestHandler<InitSpecializationSchemaRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(InitSpecializationSchemaRequestHandler.class);
    private final SpecializationManager specializationManager;
    private final SchemaTemplateRepository schemaRepository;
    private final SystemTagsPublisher systemTagsPublisher;

    public InitSpecializationSchemaRequestHandler(SpecializationManager specializationManager,
                                                  SchemaTemplateRepository schemaRepository,
                                                  SystemTagsPublisher systemTagsPublisher) {
        this.specializationManager = specializationManager;
        this.schemaRepository = schemaRepository;
        this.systemTagsPublisher = systemTagsPublisher;
    }

    @Transactional
    public Voidy handle(InitSpecializationSchemaRequest request) {
        Integer specializationId = request.getId();
        Set<SchemaDto> schemas = specializationManager.getSchemas(specializationId);

        for (SchemaDto dto: schemas) {
            if (!schemaRepository.findByName(dto.getName()).isEmpty()) {
                log.error("Схема: '{}' уже существует", dto.getName());
            }

            schemaRepository.save(mapToEntity(new SchemaTemplate(), dto));

            log.debug("Сохранена схема: {}", dto.getName());
        }

        systemTagsPublisher.publish();

        return new Voidy();
    }
}
