package ru.mycrg.gis.service.data_schema;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.exceptions.NotFoundException;
import ru.mycrg.gis.repository.CustomFeatureDefinitionRepository;
import ru.mycrg.gis.repository.DataSchemaRepository;
import ru.mycrg.mq_queue_contract.SchemaDto;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.gis.service.data_schema.MapperUtil.mapToSchemaDto;

/**
 * Сервис схемм данных.
 * Правила состоят из: <p>
 * - Правила полученные из xsd схемы <p>
 * - Наши правила, заданные вручную
 */
@Service
public class DataSchemaService implements IDataSchemaHolder {

    private static Logger log = LoggerFactory.getLogger(DataSchemaService.class);

    private DataSchema dataSchema = new DataSchema();

    private final DataSchemaRepository dataSchemaRepository;
    private final CustomFeatureDefinitionRepository customFeatureDefinitionRepository;

    @Autowired
    public DataSchemaService(CustomFeatureDefinitionRepository customFeatureDefinitionRepository,
                             DataSchemaRepository dataSchemaRepository) {
        this.dataSchemaRepository = dataSchemaRepository;
        this.customFeatureDefinitionRepository = customFeatureDefinitionRepository;
    }

    public List<SchemaDto> getSchemas(List<String> featureNames) {
        if (isCacheEmpty()) {
            cacheSchema();
        }

        if (featureNames.isEmpty()) {
            return dataSchema.getSchemas();
        } else {
            return dataSchema
                    .getSchemas().stream()
                    .filter(fDescription -> {
                        if (fDescription == null || fDescription.getName() == null) {
                            log.warn("broken schema: {}", fDescription);

                            return false;
                        }

                        return featureNames.contains(fDescription.getName());
                    })
                    .collect(Collectors.toList());
        }
    }

    /**
     * Возвращает описание фичи.
     *
     * @param featureName Название фичи(Слоя)
     * @return Описание фичи {@link SchemaDto}
     */
    public Optional<SchemaDto> getSchemaByName(String featureName) throws NotFoundException {
        if (dataSchema.getSchemas().isEmpty()) {
            cacheSchema();
        }

        Optional<SchemaDto> optionalSchema = dataSchema.getSchemaByName(featureName);
        if (optionalSchema.isPresent()) {
            SchemaDto schemaDto = optionalSchema.get();
            customFeatureDefinitionRepository
                    .findDefinitionByClassName(schemaDto.getName())
                    .ifPresent(customRule -> schemaDto.setCustomRuleFunction(customRule.getClassRule()));

            return Optional.of(schemaDto);
        }

        return Optional.empty();
    }

    @Override
    public void update() {
        dataSchema.clear();

        cacheSchema();
    }

    @Override
    public boolean isCacheEmpty() {
        return dataSchema.getSchemas().isEmpty();
    }

    /**
     * Проверяем наличие фичи по названию.
     * @param featureName Название фичи(Слоя)
     * @throws NotFoundException
     */
    public void checkFeatureByName(String featureName) throws NotFoundException {
        if (dataSchema.getSchemas().isEmpty()) {
            cacheSchema();
        }

        dataSchema
                .getSchemaByName(featureName)
                .orElseThrow(() -> new NotFoundException("Не найден слой: " + featureName));
    }

    /**
     * Накладываем поверх сгенерированных правил, правила установленные вручную.
     */
    private void imposeCustomRules(DataSchema dataSchema) {
        log.warn("ImposeCustomRules");

        customFeatureDefinitionRepository
                .findAll()
                .forEach(customRule -> {
                    String className = customRule.getClassName();

                    dataSchema.getSchemas()
                            .stream()
                            .filter(featureDescription -> className.equals(featureDescription.getName()))
                            .forEach(featureDescription -> {
                                featureDescription.setCustomRuleFunction(customRule.getClassRule());
                                featureDescription.setCalcFiledFunction(customRule.getCalculatedFields());
                            });
                });
    }

    private void cacheSchema() {
        if (isCacheEmpty()) {
            log.debug("Cache dataSchema");

            dataSchemaRepository
                    .findAll()
                    .forEach(fDescription -> {
                        mapToSchemaDto(fDescription).ifPresent(schema -> dataSchema.addSchema(schema));
                    });

            imposeCustomRules(dataSchema);
        }
    }

}
