package ru.mycrg.gis.service.fgistp.rules;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.exceptions.CrgFailedException;
import ru.mycrg.gis.exceptions.FgistpRuleNotFoundException;
import ru.mycrg.gis.repository.CustomRuleRepository;
import ru.mycrg.gis.repository.XsdRuleRepository;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.parser.ClassDefinitionParser;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

/**
 * Обрабатывает и содержит правила ФГИС ТП: <p>
 * Правила состоят из: <p>
 * - Правила полученные из xsd схемы <p>
 * - Наши правила, заданные вручную
 */
@Service
public class FgistpRuleService implements IFgistpRuleHandler, IFgistpRuleHolder {

    private static Logger log = LoggerFactory.getLogger(FgistpRuleService.class);

    private final String DEFAULT_XSD_SCHEMA_PATH = "/opt/fgistp/fgistp.xsd";

    private FgistpRules fgistpRules = new FgistpRules();

    private final ClassDefinitionParser parser;
    private final XsdRuleRepository xsdRuleRepository;
    private final CustomRuleRepository customRuleRepository;

    @Autowired
    public FgistpRuleService(ClassDefinitionParser parser,
                             CustomRuleRepository customRuleRepository,
                             XsdRuleRepository xsdRuleRepository) {
        this.parser = parser;
        this.xsdRuleRepository = xsdRuleRepository;
        this.customRuleRepository = customRuleRepository;
    }

    @Override
    public FgistpRules loadRulesFromXsdSchema(String path) {
        log.info("Try load rules from XsdSchema: {}", path);

        try {
            File file = ResourceUtils.getFile(DEFAULT_XSD_SCHEMA_PATH);

            fgistpRules = parser.parse(file);

            persistXsdRules(fgistpRules);
        } catch (FileNotFoundException e) {
            log.error("Not found xsd schema file by path: {} / {}", path, e.getLocalizedMessage());
        } catch (Exception e) {
            log.error("Failed load rules: {}", e.getMessage());
            throw new CrgFailedException("Failed load rules. " + e.getLocalizedMessage());
        }

        return fgistpRules;
    }

    @Override
    public FgistpRules loadRulesFromXsdSchema() {
        return loadRulesFromXsdSchema(DEFAULT_XSD_SCHEMA_PATH);
    }

    public FgistpRules updateRules() {
        log.info("Update rules");

        try {
            getRulesFromDb();
            imposeCustomRules();
        } catch (Exception e) {
            log.error("Failed update rules. {}", e.getMessage());
            throw new CrgFailedException("Failed update rules. " + e.getLocalizedMessage());
        }

        return getRules();
    }

    public FgistpRules getRules() {
        return fgistpRules;
    }

    public EntityType getRuleByClassName(String name) throws FgistpRuleNotFoundException {
        return fgistpRules
                .getEntityTypes().stream()
                .filter(fgistpClassType -> fgistpClassType.getName().toLowerCase().contains(name.toLowerCase()))
                .findFirst()
                .orElseThrow(() -> new FgistpRuleNotFoundException(name));
    }

    @Override
    public boolean isXsdRulesEmpty() {
        return xsdRuleRepository.count() == 0;
    }

    @Override
    public boolean isCacheEmpty() {
        return fgistpRules.getEntityTypes().isEmpty();
    }

    private void persistXsdRules(FgistpRules rules) {
        rules
                .getEntityTypes()
                .forEach(classType -> xsdRuleRepository.save(MapperUtil.mapEntityTypeToXsdRule(classType)));
    }

    private void getRulesFromDb() {
        log.info("Get rules from DB");

        List<EntityType> classTypes = fgistpRules.getEntityTypes();

        xsdRuleRepository
                .findAll()
                .forEach(xsdRule -> classTypes.add(MapperUtil.mapXsdRuleToEntityType(xsdRule)));
    }

    /**
     * Накладываем поверх сгенерированных правил, правила установленные вручную.
     */
    private void imposeCustomRules() {
        log.warn("ImposeCustomRules not implemented yet");
    }

}
