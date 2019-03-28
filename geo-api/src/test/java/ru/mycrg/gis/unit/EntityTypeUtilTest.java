package ru.mycrg.gis.unit;

import org.junit.Test;
import ru.mycrg.gis.service.fgistp.parser.EntityTypeUtil;

import static junit.framework.TestCase.assertEquals;

public class EntityTypeUtilTest {

    @Test
    public void shouldClearName() {
        assertEquals("Functionalzone", EntityTypeUtil.removePostfix("Functionalzone_Type"));
        assertEquals("Functionalzone", EntityTypeUtil.removePostfix("Functionalzone_Type_some"));
        assertEquals("Functionalzone", EntityTypeUtil.removePostfix("Functionalzone"));
        assertEquals("", EntityTypeUtil.removePostfix(""));
    }

}
