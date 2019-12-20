package ru.mycrg.gis.unit;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import ru.mycrg.gis.dto.DataSchema;
import ru.mycrg.gis.dto.FeatureDescription;
import ru.mycrg.gis.repository.CustomFeatureDefinitionRepository;
import ru.mycrg.gis.repository.DataSchemaRepository;
import ru.mycrg.gis.service.dataSchema.DataSchemaService;
import ru.mycrg.mq_queue_contract.propertyTypes.AbstractProperty;
import ru.mycrg.mq_queue_contract.propertyTypes.GeometryProperty;
import ru.mycrg.mq_queue_contract.propertyTypes.StringProperty;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.Assert.*;

public class DataSchemaServiceTest {

    @InjectMocks
    private DataSchemaService dataSchemaService;

    @Mock
    private DataSchemaRepository dataSchemaRepository;

    @Mock
    private CustomFeatureDefinitionRepository customFeatureDefinitionRepository;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void shouldFindRuleByFeatureNameSimple() {
        String notExistName = "notExistName";
        String epFeatureName = "electric_point";

        FeatureDescription electricPointFeature = new FeatureDescription();
        electricPointFeature.setName(epFeatureName);
        electricPointFeature.setOriginName(epFeatureName);

        DataSchema dataSchema = new DataSchema();
        dataSchema.addFeatureDescription(electricPointFeature);

        assertTrue(dataSchema.getFeatureTypeByName(epFeatureName).isPresent());
        assertFalse(dataSchema.getFeatureTypeByName(notExistName).isPresent());
    }

    @Test
    public void shouldFindRuleByFeatureNameAdvance() {
        String featureName = "Hydro_Type";

        FeatureDescription HydroFeature = new FeatureDescription();
        HydroFeature.setName(featureName);
        HydroFeature.setOriginName(featureName);

        DataSchema dataSchema = new DataSchema();
        dataSchema.addFeatureDescription(HydroFeature);

        assertFalse(dataSchema.getFeatureTypeByName("wrongName").isPresent());
        assertTrue(dataSchema.getFeatureTypeByName("hydro_point").isPresent());
        assertTrue(dataSchema.getFeatureTypeByName("hydro_line").isPresent());
        assertTrue(dataSchema.getFeatureTypeByName("hydro").isPresent());
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

        DataSchema targetRules = new DataSchema();
        targetRules.addFeatureDescription(naturalRiskZone);

        DataSchema resultRules = dataSchemaService.splitRulesByGeometry(targetRules);

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

        DataSchema targetRules = new DataSchema();
        targetRules.addFeatureDescription(electricLine);

        DataSchema resultRules = dataSchemaService.splitRulesByGeometry(targetRules);

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
