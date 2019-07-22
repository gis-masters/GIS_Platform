package ru.mycrg.gis.unit;

import org.junit.Test;
import org.springframework.util.ResourceUtils;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.propertyTypes.AbstractProperty;
import ru.mycrg.common.propertyTypes.EnumerationProperty;
import ru.mycrg.common.propertyTypes.GeometryProperty;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.parser.ClassDefinitionParser;
import ru.mycrg.gis.service.fgistp.parser.XsdSimpleType;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;

import java.io.File;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

public class XsdParserTest {

    @Test
    public void complexTypesParsingTest() throws Exception {
        File file = ResourceUtils.getFile("classpath:fgistp/fgistp.xsd");

        ClassDefinitionParser parser = new ClassDefinitionParser();
        FgistpRules xsdRules = parser.parse(file);

        // ASSERT
        List<EntityType> featuresDescription = xsdRules.getEntityTypes();
        featuresDescription.forEach(entityType -> {
            System.out.println("=== " + entityType.getOriginName());
        });

        // Common
        assertFalse(featuresDescription.isEmpty());
        assertEquals(0, countEmptyTitle(featuresDescription));

        // Check GasPipeline
        Optional<EntityType> gasPipeline = featuresDescription.stream()
                .filter(fgistpClassType -> fgistpClassType.getOriginName().equals("GasPipeline"))
                .findFirst();
        assertTrue(gasPipeline.isPresent());


        // Check Education
        Optional<EntityType> oEducation = featuresDescription.stream()
                .filter(fgistpClassType -> fgistpClassType.getOriginName().equals("Education"))
                .findFirst();
        assertTrue(oEducation.isPresent());

        // =================================== Check FunctionalZone ================================
        Optional<EntityType> functionalZone = featuresDescription.stream()
                .filter(fgistpClassType -> fgistpClassType.getOriginName().equals("FunctionalZone"))
                .findFirst();

        assertTrue(functionalZone.isPresent());

        List<AbstractProperty> fzProperties = functionalZone.get().getProperties();
        assertFalse(fzProperties.isEmpty());
        assertEquals(21, fzProperties.size());
        assertEquals("Функциональные зоны", functionalZone.get().getTitle());
        assertEquals("functionalzone", functionalZone.get().getTableName());
        assertEquals("Класс объектов «Функциональные зоны»", functionalZone.get().getDescription());

        assertEquals(5, fzProperties.stream().filter(AbstractProperty::isRequired).count());
        AbstractProperty fzProperty4 = fzProperties.get(4);
        assertFalse(fzProperty4.isRequired());
        assertEquals(7, ((EnumerationProperty) fzProperty4).getEnumerations().size());
        assertEquals("Справочник: Статус объекта", fzProperties.get(18).getTitle());
        assertEquals("Справочник: Значение объекта", fzProperties.get(19).getTitle());

        EnumerationProperty status = (EnumerationProperty) fzProperties.get(19);
        assertEquals("Федеральное значение", status.getEnumerations().get(0).getTitle());

        assertTrue(fzProperties.get(9).isRequired());
        assertNotNull(fzProperties.get(10).getValueType());

        // Check enumeration aliases
        EnumerationProperty fzTrstp = (EnumerationProperty) fzProperties.get(5);
        assertEquals(7, fzTrstp.getEnumerations().size());
        assertEquals("Зона объектов автомобильного транспорта", fzTrstp.getEnumerations().get(0).getTitle());
        assertEquals("Зона объектов трубопроводного транспорта", fzTrstp.getEnumerations().get(4).getTitle());
        assertEquals("Зона улично-дорожной сети", fzTrstp.getEnumerations().get(6).getTitle());

        // Check enumeration aliases for CLASSID property
        EnumerationProperty classId = (EnumerationProperty) fzProperties.get(1);
        assertEquals(35, classId.getEnumerations().size());
        assertEquals("Жилые зоны", classId.getEnumerations().get(0).getTitle());
        assertEquals("Иные зоны", classId.getEnumerations().get(34).getTitle());

        // Test Geometry
        Optional<AbstractProperty> fzGeometry = fzProperties.stream()
                .filter(AbstractProperty::isGeometry)
                .findFirst();

        assertTrue(fzGeometry.isPresent());
        assertEquals(1, ((GeometryProperty) fzGeometry.get()).getAllowedValues().size());
        // =========================================================================================

        // Check Hydro
        Optional<AbstractProperty> hGeometry = featuresDescription.stream()
                .filter(fDescription -> fDescription.getOriginName().equals("Hydro"))
                .findFirst().get()
                .getProperties().stream()
                .filter(AbstractProperty::isGeometry)
                .findFirst();

        assertTrue(hGeometry.isPresent());
        assertEquals(4, ((GeometryProperty) hGeometry.get()).getAllowedValues().size());

        // Check heritagearea
        List<AbstractProperty> heritageAreaProperties = featuresDescription.stream()
                .filter(fDescription -> fDescription.getOriginName().equals("HeritageArea"))
                .findFirst().get()
                .getProperties();

        AbstractProperty histCatProperty = heritageAreaProperties.stream()
                .filter(abstractProperty -> abstractProperty.getName().equals("HIST_CAT"))
                .findFirst().get();

        assertTrue(histCatProperty.isRequired());
        assertEquals(ValueType.CHOICE, histCatProperty.getValueType());
    }

    private long countEmptyTitle(List<EntityType> entityTypes) {
        return entityTypes.stream()
                .filter(entityType -> entityType.getTitle() == null)
                .count();
    }

    @Test
    public void simpleTypesParsingTest() throws Exception {
        File file = ResourceUtils.getFile("classpath:fgistp/fgistp.xsd");

        ClassDefinitionParser parser = new ClassDefinitionParser();
        List<XsdSimpleType> xsdSimpleTypes = parser.fetchEnumerationsAliasesFromXsdSimpleTypes(file);

        assertFalse(xsdSimpleTypes.isEmpty());

        long typesWithEmptyAlias = xsdSimpleTypes
                .stream()
                .filter(this::isSimpleTypesAliasEmpty)
                .count();

        assertEquals(0, typesWithEmptyAlias);
    }

    private boolean isSimpleTypesAliasEmpty(XsdSimpleType type) {
        System.out.println("================== " + type.getName());

        final boolean[] isEmpty = {false};
        type.getProperties().forEach((key, alias) -> {
            System.out.println("  --- " + alias);
            if (alias.length() == 0) {
                isEmpty[0] = true;
            }
        });

        return isEmpty[0];
    }

}
