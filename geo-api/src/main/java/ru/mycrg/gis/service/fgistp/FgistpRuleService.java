package ru.mycrg.gis.service.fgistp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import ru.mycrg.gis.dto.fgistp.FgistpClassType;
import ru.mycrg.gis.dto.fgistp.FgistpRules;
import ru.mycrg.gis.exceptions.CrgNotFoundException;

import java.io.File;
import java.io.FileNotFoundException;

/**
 * Обрабатывает и содержит правила ФГИС ТП: <p>
 * Правила состоят из: <p>
 * - Правила полученные из xsd схемы <p>
 * - Наши правила, заданные вручную
 */
@Service
public class FgistpRuleService implements IFgistpRuleHandler, IFgistpRuleHolder {

    private static Logger log = LoggerFactory.getLogger(FgistpRuleService.class);

    private FgistpRules fgistpRules = new FgistpRules();

    private String pathToXSDSchema = "classpath:fgistp/fgistp.xsd";

    private final FgistpParser parser;

    @Autowired
    public FgistpRuleService(FgistpParser parser) {
        this.parser = parser;
    }

    public FgistpRules updateRules() {
        getRulesFromDb();
        imposeCustomRules();

        return getRules();
    }

    private void getRulesFromDb() {

    }

    public FgistpClassType getRuleByClassName(String name) throws FgistpRuleNotFoundException {
        return fgistpRules
                .getFgistpClassTypes().stream()
                .filter(fgistpClassType -> fgistpClassType.getName().equals(name))
                .findFirst()
                .orElseThrow(() -> new FgistpRuleNotFoundException(name));
    }

    private void updateRulesFromXsdSchema(String path) {
        log.info("Try updateRulesFromXsdSchema by path: {}", path);

        File file = null;
        try {
            file = ResourceUtils.getFile(path);

            fgistpRules = parser.parse(file);
        } catch (FileNotFoundException e) {
            log.error("Not found xsd schema file by path: {} / {}", path, e.getLocalizedMessage());
        } catch (Exception e) {
            throw new CrgNotFoundException("Not found xsd schema by path: " + path);
        }
    }

    /**
     * Накладываем поверх сгенерированных правил, правила установленные вручную.
     */
    private void imposeCustomRules() {
        log.warn("ImposeCustomRules not implemented yet");
    }

    public FgistpRules getRules() {
        return fgistpRules;
    }

    public void setPathToXSDSchema(String path) {
        // TODO: Проверить на валидность
        this.pathToXSDSchema = path;
    }
}
