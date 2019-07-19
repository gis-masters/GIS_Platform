package ru.mycrg.gis.unit;

import org.junit.Test;
import ru.mycrg.gis.service.fgistp.parser.FeaturesUtil;

import static junit.framework.TestCase.assertEquals;

public class FeaturesUtilTest {

    @Test
    public void shouldClearName() {
        assertEquals("Functionalzone", FeaturesUtil.removePostfix("Functionalzone_Type"));
        assertEquals("Functionalzone", FeaturesUtil.removePostfix("Functionalzone_Type_some"));
        assertEquals("Functionalzone", FeaturesUtil.removePostfix("Functionalzone"));
        assertEquals("", FeaturesUtil.removePostfix(""));
    }

}
