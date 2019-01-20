package ru.mycrg.gis.unit;

import org.junit.Test;
import org.springframework.util.ResourceUtils;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.XsdSimpleType;
import ru.mycrg.gis.service.fgistp.propertyTypes.GeometryProperty;
import ru.mycrg.gis.service.fgistp.propertyTypes.AbstractProperty;
import ru.mycrg.gis.service.fgistp.FgistpRules;
import ru.mycrg.gis.service.fgistp.propertyTypes.EnumerationProperty;
import ru.mycrg.gis.service.fgistp.ClassDefinitionParser;

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
        List<EntityType> entityTypes = xsdRules.getEntityTypes();

        Optional<EntityType> functionalZone = entityTypes.stream()
                .filter(fgistpClassType -> fgistpClassType.getName().equals("FunctionalZone_Type"))
                .findFirst();

        assertFalse(entityTypes.isEmpty());
        assertTrue(functionalZone.isPresent());
        assertFalse(functionalZone.get().getProperties().isEmpty());

        AbstractProperty property4 = functionalZone.get().getProperties().get(4);

        assertEquals("Функциональные зоны", functionalZone.get().getTitle());
        assertEquals("functionalzone", functionalZone.get().getTableName());
        assertEquals("Класс объектов «Функциональные зоны»", functionalZone.get().getDescription());
        assertEquals(21, functionalZone.get().getProperties().size());
        assertFalse(property4.isMultiple());
        assertEquals(7, ((EnumerationProperty) property4).getEnumerations().size());
        assertTrue(functionalZone.get().getProperties().get(9).isMultiple());
        assertEquals("Справочник: Статус объекта", functionalZone.get().getProperties().get(18).getTitle());
        assertEquals("Справочник: Значение объекта", functionalZone.get().getProperties().get(19).getTitle());

        EnumerationProperty status = (EnumerationProperty) functionalZone.get().getProperties().get(19);

        assertEquals("Федеральное значение", status.getEnumerations().get(0).getTitle());
        assertNotNull(functionalZone.get().getProperties().get(10).getValueType());

        // Check enumeration aliases
        EnumerationProperty fzTrstp = (EnumerationProperty) functionalZone.get().getProperties().get(5);
        assertEquals(7, fzTrstp.getEnumerations().size());
        assertEquals("Зона объектов автомобильного транспорта", fzTrstp.getEnumerations().get(0).getTitle());
        assertEquals("Зона объектов трубопроводного транспорта", fzTrstp.getEnumerations().get(4).getTitle());
        assertEquals("Зона улично-дорожной сети", fzTrstp.getEnumerations().get(6).getTitle());

        // Check enumeration aliases for CLASSID property
        EnumerationProperty classId = (EnumerationProperty) functionalZone.get().getProperties().get(1);
        assertEquals(35, classId.getEnumerations().size());
        assertEquals("Жилые зоны", classId.getEnumerations().get(0).getTitle());
        assertEquals("Иные зоны", classId.getEnumerations().get(34).getTitle());

        // Test Geometry
        Optional<AbstractProperty> fzGeometry = functionalZone.get().getProperties().stream()
                .filter(AbstractProperty::isGeometry)
                .findFirst();

        assertTrue(fzGeometry.isPresent());
        assertEquals(1, ((GeometryProperty) fzGeometry.get()).getAllowedValues().size());

        Optional<AbstractProperty> hGeometry = entityTypes.stream()
                .filter(entityType -> entityType.getName().equals("Hydro_Type"))
                .findFirst().get()
                .getProperties().stream()
                .filter(AbstractProperty::isGeometry)
                .findFirst();

        assertTrue(hGeometry.isPresent());
        assertEquals(4, ((GeometryProperty) hGeometry.get()).getAllowedValues().size());
    }

    @Test
    public void simpleTypesParsingTest() throws Exception {
        File file = ResourceUtils.getFile("classpath:fgistp/fgistp.xsd");

        ClassDefinitionParser parser = new ClassDefinitionParser();
        List<XsdSimpleType> xsdSimpleTypes = parser.fetchEnumerationsAliasesFromXsdSimpleTypes(file);

        assertFalse(xsdSimpleTypes.isEmpty());

        long typesWithEmptyAlias = xsdSimpleTypes
                .stream()
                .filter(this::isAliasEmpty)
                .count();

        assertEquals(0, typesWithEmptyAlias);
    }

    private boolean isAliasEmpty(XsdSimpleType type) {
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
