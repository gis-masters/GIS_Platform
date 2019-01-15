package ru.mycrg.gis.unit;

import org.junit.Test;
import org.springframework.util.ResourceUtils;
import ru.mycrg.gis.dto.fgistp.FgistpClassType;
import ru.mycrg.gis.dto.fgistp.FgistpProperty;
import ru.mycrg.gis.dto.fgistp.FgistpRules;
import ru.mycrg.gis.dto.fgistp.types.FgistpEnumeration;
import ru.mycrg.gis.service.fgistp.FgistpParser;

import java.io.File;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

public class fgistpParserTest {

    @Test
    public void xsd() throws Exception {
        File file = ResourceUtils.getFile("classpath:fgistp/fgistp.xsd");

        FgistpParser fgistpParser = new FgistpParser();
        FgistpRules xsdRules = fgistpParser.parse(file);

        // ASSERT
        List<FgistpClassType> fgistpClassTypes = xsdRules.getFgistpClassTypes();

        Optional<FgistpClassType> functionalZone = fgistpClassTypes.stream()
                .filter(fgistpClassType -> fgistpClassType.getName().equals("FunctionalZone_Type"))
                .findFirst();

        assertFalse(fgistpClassTypes.isEmpty());
        assertTrue(functionalZone.isPresent());
        assertFalse(functionalZone.get().getProperties().isEmpty());

        FgistpProperty property4 = functionalZone.get().getProperties().get(4);

        assertEquals("Класс объектов «Функциональные зоны»", functionalZone.get().getAlias());
        assertEquals(20, functionalZone.get().getProperties().size());
        assertEquals(0, property4.getMinOccurs());
        assertEquals(1, property4.getMaxOccurs());
        assertEquals(7, ((FgistpEnumeration) property4.getBaseType()).getEnumerations().size());
        assertEquals(1, functionalZone.get().getProperties().get(9).getMinOccurs());
        assertTrue(functionalZone.get().getProperties().get(10).getBaseType() != null);
        assertEquals(1, functionalZone.get().getGeometryTypes().size());

        // Check enumeration aliases
        FgistpEnumeration fzTrstp = (FgistpEnumeration) functionalZone.get().getProperties().get(5).getBaseType();
        assertEquals(7, fzTrstp.getEnumerations().size());
        assertEquals("Зона объектов автомобильного транспорта", fzTrstp.getEnumerations().get(0).getAlias());
        assertEquals("Зона объектов трубопроводного транспорта", fzTrstp.getEnumerations().get(4).getAlias());
        assertEquals("Зона улично-дорожной сети", fzTrstp.getEnumerations().get(6).getAlias());

        // Check enumeration aliases for CLASSID property
        FgistpEnumeration classId = (FgistpEnumeration) functionalZone.get().getProperties().get(1).getBaseType();
        assertEquals(35, classId.getEnumerations().size());
        assertEquals("Жилые зоны", classId.getEnumerations().get(0).getAlias());
        assertEquals("Иные зоны", classId.getEnumerations().get(34).getAlias());
    }

}
