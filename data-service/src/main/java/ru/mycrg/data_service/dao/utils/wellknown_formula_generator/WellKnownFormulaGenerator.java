package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;

@Component
public class WellKnownFormulaGenerator {

    private final Logger log = LoggerFactory.getLogger(WellKnownFormulaGenerator.class);

    protected final Map<String, IWellKnownFormulaGenerator> wellKnownFormulaGenerators;

    public WellKnownFormulaGenerator(List<IWellKnownFormulaGenerator> generators) {
        this.wellKnownFormulaGenerators = generators
                .stream()
                .collect(toMap(IWellKnownFormulaGenerator::getType, Function.identity()));
    }

    @NotNull
    public String generate(@NotNull String formulaName) {
        IWellKnownFormulaGenerator formulaGenerator = wellKnownFormulaGenerators.get(formulaName);
        if (formulaGenerator == null) {
            log.info("Не поддерживаемая wellKnownFormula: '{}'", formulaName);

            return "";
        }

        return formulaGenerator.generate();
    }
}
