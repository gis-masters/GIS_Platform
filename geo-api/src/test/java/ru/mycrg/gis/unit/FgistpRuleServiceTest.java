package ru.mycrg.gis.unit;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import ru.mycrg.gis.exceptions.FgistpRuleNotFoundException;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;

import static org.junit.Assert.*;

public class FgistpRuleServiceTest {

    @InjectMocks
    private FgistpRuleService ruleService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test(expected = FgistpRuleNotFoundException.class)
    public void shouldThrowException() {
        assertNull(ruleService.getRuleByName("someFeatureName"));
    }

    @Test
    public void shouldFindRuleByFeatureNameSimple() {
        String notExistName = "notExistName";
        String epFeatureName = "electric_point";

        EntityType electricPointFeature = new EntityType();
        electricPointFeature.setName(epFeatureName);

        FgistpRules fgistpRules = new FgistpRules();
        fgistpRules.addComplexType(electricPointFeature);

        assertTrue(fgistpRules.getFeatureTypeByName(epFeatureName).isPresent());
        assertFalse(fgistpRules.getFeatureTypeByName(notExistName).isPresent());
    }

    @Test
    public void shouldFindRuleByFeatureNameAdvance() {
        String featureName = "Hydro_Type";

        EntityType HydroFeature = new EntityType();
        HydroFeature.setName(featureName);

        FgistpRules fgistpRules = new FgistpRules();
        fgistpRules.addComplexType(HydroFeature);

        assertFalse(fgistpRules.getFeatureTypeByName("wrongName").isPresent());
        assertTrue(fgistpRules.getFeatureTypeByName("hydro_point").isPresent());
        assertTrue(fgistpRules.getFeatureTypeByName("hydro_line").isPresent());
        assertTrue(fgistpRules.getFeatureTypeByName("hydro").isPresent());
    }
}
