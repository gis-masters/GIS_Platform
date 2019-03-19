package unit;

import org.junit.Test;
import ru.mycrg.wrapper.service.gml.GmlUtil;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class GmlUtilTest {

    @Test
    public void shouldClearName() {
        assertEquals("Functionalzone", GmlUtil.clearName("Functionalzone_Type"));
        assertEquals("Functionalzone", GmlUtil.clearName("Functionalzone_Type_some"));
        assertEquals("Functionalzone", GmlUtil.clearName("Functionalzone"));
        assertEquals("", GmlUtil.clearName(""));
    }

}
