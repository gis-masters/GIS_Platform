package ru.mycrg.gis.unit;

import org.junit.Test;
import org.springframework.util.ResourceUtils;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.common.propertyTypes.AbstractProperty;
import ru.mycrg.common.propertyTypes.EnumerationProperty;
import ru.mycrg.common.propertyTypes.GeometryProperty;
import ru.mycrg.gis.service.fgistp.parser.XsdSimpleType;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;
import ru.mycrg.gis.service.fgistp.parser.ClassDefinitionParser;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
        assertEquals(0, countEmptyTitle(entityTypes));
        assertTrue(functionalZone.isPresent());
        assertTrue(checkPropertySequencesOrder(functionalZone.get().getProperties()));

        List<AbstractProperty> properties = new ArrayList<>(functionalZone.get().getProperties());
        assertFalse(properties.isEmpty());

        AbstractProperty property4 = properties.get(4);

        assertEquals("Функциональные зоны", functionalZone.get().getTitle());
        assertEquals("functionalzone", functionalZone.get().getTableName());
        assertEquals("Класс объектов «Функциональные зоны»", functionalZone.get().getDescription());
        assertEquals(21, properties.size());
        assertFalse(property4.isMultiple());
        assertEquals(7, ((EnumerationProperty) property4).getEnumerations().size());
        assertTrue(properties.get(9).isMultiple());
        assertEquals("Справочник: Статус объекта", properties.get(18).getTitle());
        assertEquals("Справочник: Значение объекта", properties.get(19).getTitle());

        EnumerationProperty status = (EnumerationProperty) properties.get(19);

        assertEquals("Федеральное значение", status.getEnumerations().get(0).getTitle());
        assertNotNull(properties.get(10).getValueType());

        // Check enumeration aliases
        EnumerationProperty fzTrstp = (EnumerationProperty) properties.get(5);
        assertEquals(7, fzTrstp.getEnumerations().size());
        assertEquals("Зона объектов автомобильного транспорта", fzTrstp.getEnumerations().get(0).getTitle());
        assertEquals("Зона объектов трубопроводного транспорта", fzTrstp.getEnumerations().get(4).getTitle());
        assertEquals("Зона улично-дорожной сети", fzTrstp.getEnumerations().get(6).getTitle());

        // Check enumeration aliases for CLASSID property
        EnumerationProperty classId = (EnumerationProperty) properties.get(1);
        assertEquals(35, classId.getEnumerations().size());
        assertEquals("Жилые зоны", classId.getEnumerations().get(0).getTitle());
        assertEquals("Иные зоны", classId.getEnumerations().get(34).getTitle());

        // Test Geometry
        Optional<AbstractProperty> fzGeometry = properties.stream()
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

    /**
     * Проверка что элементы последовательности идут попорядку
     */
    private boolean checkPropertySequencesOrder(Set<AbstractProperty> properties) {
        if (properties.isEmpty()) {
            return true;
        }

        List<AbstractProperty> propertyList = new ArrayList<>(properties);
        if (!"GLOBALID".equals(propertyList.get(0).getName()))   return false;
        if (!"CLASSID".equals(propertyList.get(1).getName()))    return false;
        if (!"FZ_MFSTP".equals(propertyList.get(2).getName()))   return false;
        if (!"FZ_ODSTP".equals(propertyList.get(3).getName()))   return false;
        if (!"FZ_INGSTP".equals(propertyList.get(4).getName()))  return false;
        if (!"FZ_TRSTP".equals(propertyList.get(5).getName()))   return false;
        if (!"FZ_SHSTP".equals(propertyList.get(6).getName()))   return false;
        if (!"FZ_RECSTP".equals(propertyList.get(7).getName()))  return false;
        if (!"FZ_ORECSTP".equals(propertyList.get(8).getName())) return false;
        if (!"AREA".equals(propertyList.get(9).getName()))       return false;
        if (!"INFO_OBJ".equals(propertyList.get(10).getName()))  return false;
        if (!"POPULATION".equals(propertyList.get(14).getName()))return false;
        if (!"OTHER".equals(propertyList.get(16).getName()))     return false;
        if (!"REG_STATUS".equals(propertyList.get(19).getName()))return false;

        return true;
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
