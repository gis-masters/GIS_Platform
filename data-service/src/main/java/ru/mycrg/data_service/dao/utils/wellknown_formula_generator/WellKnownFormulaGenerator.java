package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.Objects.nonNull;
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
    public String generate(@Nullable String formulaName, String base) {
        IWellKnownFormulaGenerator formulaGenerator = wellKnownFormulaGenerators.get(formulaName);
        if (nonNull(formulaGenerator)) {
            return base + " " + formulaGenerator.generate();
        }

        log.warn("No exist generator for valueWellKnownFormula: {}", formulaName);

        return base;
    }
}
