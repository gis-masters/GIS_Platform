package ru.mycrg.gis.unit;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import ru.mycrg.common.propertyTypes.AbstractProperty;
import ru.mycrg.common.propertyTypes.GeometryProperty;
import ru.mycrg.common.propertyTypes.StringProperty;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.service.fgistp.FeatureDescription;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.Assert.*;

public class FgistpRuleServiceTest {

    @InjectMocks
    private FgistpRuleService ruleService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test(expected = CrgNotFoundException.class)
    public void shouldThrowException() {
        assertNull(ruleService.getRuleByName("someFeatureName"));
    }

    @Test
    public void shouldFindRuleByFeatureNameSimple() {
        String notExistName = "notExistName";
        String epFeatureName = "electric_point";

        FeatureDescription electricPointFeature = new FeatureDescription();
        electricPointFeature.setName(epFeatureName);
        electricPointFeature.setOriginName(epFeatureName);

        FgistpRules fgistpRules = new FgistpRules();
        fgistpRules.addComplexType(electricPointFeature);

        assertTrue(fgistpRules.getFeatureTypeByName(epFeatureName).isPresent());
        assertFalse(fgistpRules.getFeatureTypeByName(notExistName).isPresent());
    }

    @Test
    public void shouldFindRuleByFeatureNameAdvance() {
        String featureName = "Hydro_Type";

        FeatureDescription HydroFeature = new FeatureDescription();
        HydroFeature.setName(featureName);
        HydroFeature.setOriginName(featureName);

        FgistpRules fgistpRules = new FgistpRules();
        fgistpRules.addComplexType(HydroFeature);

        assertFalse(fgistpRules.getFeatureTypeByName("wrongName").isPresent());
        assertTrue(fgistpRules.getFeatureTypeByName("hydro_point").isPresent());
        assertTrue(fgistpRules.getFeatureTypeByName("hydro_line").isPresent());
        assertTrue(fgistpRules.getFeatureTypeByName("hydro").isPresent());
    }

    @Test
    public void shouldSplitFeatureByGeometry_PolygonPoint() {
        GeometryProperty geomProperty = new GeometryProperty();
        geomProperty.setAllowedValues(Arrays.asList("Polygon", "Point"));

        StringProperty sProperty = new StringProperty();
        geomProperty.setName("some string prop");

        FeatureDescription naturalRiskZone = new FeatureDescription();
        naturalRiskZone.setName("NaturalRiskZone_Type");
        naturalRiskZone.setTitle("Территории, подверженные риску возникновения чрезвычайных ситуаций природного характера");
        naturalRiskZone.setDescription("test description");
        naturalRiskZone.setTableName("naturalriskzone");
        naturalRiskZone.setProperties(Arrays.asList(geomProperty, sProperty));

        FgistpRules targetRules = new FgistpRules();
        targetRules.addComplexType(naturalRiskZone);

        FgistpRules resultRules = ruleService.splitRulesByGeometry(targetRules);

        // Common assert
        assertNotNull(resultRules);
        assertEquals(2, resultRules.getFeatureDescriptions().size());

        // Check table name
        FeatureDescription polygonFeature = resultRules.getFeatureDescriptions().get(0);
        assertEquals("naturalriskzone", polygonFeature.getTableName());

        FeatureDescription pointFeature = resultRules.getFeatureDescriptions().get(1);
        assertEquals("naturalriskzone_point", pointFeature.getTableName());

        // Check geom property
        Optional<GeometryProperty> optionalProperty1 = polygonFeature.getProperties().stream()
                .filter(AbstractProperty::isGeometry)
                .findFirst()
                .map(property -> (GeometryProperty) property);

        assertTrue(polygonFeature.getProperties().size() > 1);
        assertTrue(optionalProperty1.isPresent());
        assertEquals(1, optionalProperty1.get().getAllowedValues().size());
        assertTrue(optionalProperty1.get().getAllowedValues().contains("Polygon"));

        Optional<GeometryProperty> optionalProperty2 = pointFeature.getProperties().stream()
                .filter(AbstractProperty::isGeometry)
                .findFirst()
                .map(property -> (GeometryProperty) property);

        assertTrue(pointFeature.getProperties().size() > 1);
        assertTrue(optionalProperty2.isPresent());
        assertEquals(1, optionalProperty2.get().getAllowedValues().size());
        assertTrue(optionalProperty2.get().getAllowedValues().contains("Point"));
    }

    @Test
    public void shouldSplitFeatureByGeometry_CurveLineString() {
        GeometryProperty geomProperty = new GeometryProperty();
        geomProperty.setAllowedValues(Arrays.asList("Curve", "LineString"));

        StringProperty sProperty = new StringProperty();
        geomProperty.setName("some string prop");

        FeatureDescription electricLine = new FeatureDescription();
        electricLine.setName("ElectricLine_Type");
        electricLine.setTitle("test title");
        electricLine.setDescription("test description");
        electricLine.setTableName("electricline");
        electricLine.setProperties(Arrays.asList(geomProperty, sProperty));

        FgistpRules targetRules = new FgistpRules();
        targetRules.addComplexType(electricLine);

        FgistpRules resultRules = ruleService.splitRulesByGeometry(targetRules);

        // Common assert
        assertNotNull(resultRules);
        assertEquals(1, resultRules.getFeatureDescriptions().size());

        // Check table name
        FeatureDescription curveFeature = resultRules.getFeatureDescriptions().get(0);
        assertEquals("electricline_line", curveFeature.getTableName());

        // Check geom property
        Optional<GeometryProperty> optionalProperty1 = curveFeature.getProperties().stream()
                .filter(AbstractProperty::isGeometry)
                .findFirst()
                .map(property -> (GeometryProperty) property);

        assertTrue(curveFeature.getProperties().size() > 1);
        assertTrue(optionalProperty1.isPresent());
        assertEquals(1, optionalProperty1.get().getAllowedValues().size());
        assertTrue(optionalProperty1.get().getAllowedValues().contains("LineString"));
    }

}
