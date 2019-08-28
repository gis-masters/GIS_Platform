package unit;

import com.fasterxml.jackson.databind.JsonNode;
import org.assertj.core.util.Lists;
import org.junit.Test;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.PropertyViolation;
import ru.mycrg.wrapper.service.validation.Util;

import java.nio.charset.StandardCharsets;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static ru.mycrg.wrapper.dao.DaoProperties.CLASS_ID;
import static ru.mycrg.wrapper.dao.DaoProperties.PRIMARY_KEY;

public class ValidationUtilTest {

    @Test
    public void shouldConvertToJSON() {
        PropertyViolation propertyViolation = new PropertyViolation();
        propertyViolation.setName("pName");
        propertyViolation.setValue("pValue");

        propertyViolation.setErrorTypes(Lists.newArrayList("INT", "CHOICE", "DOUBLE"));

        ObjectValidationResult object = new ObjectValidationResult();
        object.setClassId(CLASS_ID);
        object.setObjectId(PRIMARY_KEY);
        object.setxMin("xmin");
        object.addPropertyViolation(propertyViolation);
        object.addObjectViolation("Some error");

        JsonNode jsonNode = Util.convertToJson(object);

        assertEquals("{\"objectId\":\"objectid\",\"classId\":\"classid\",\"xMin\":\"xmin\",\"" +
                        "propertyViolations\":[{\"name\":\"pName\",\"value\":\"pValue\",\"" +
                        "errorTypes\":[\"INT\",\"CHOICE\",\"DOUBLE\"]}],\"objectViolations\":[\"Some error\"]}",
                jsonNode.toString());
    }

    @Test
    public void shouldTestEncoding() {
        String windows1251 = "Ð¡Ñ\u0080ÐµÐ´Ð½ÐµÑ\u008DÑ\u0082Ð°Ð¶ÐºÐ° - Ð³Ð´Ðµ ÐµÑ\u0081Ñ\u0082Ñ\u008C,, " +
                "Ð¼Ð°Ð»Ð¾Ñ\u008DÑ\u0082Ð°Ð¶ÐºÐ° Ð³Ð´Ðµ Ð¼Ð¾Ð¶Ð½Ð¾";
        String utf8 = "Ð Ð\u008EÐ¡Ð\u0082Ð ÂµÐ Ò\u0091Ð Ð\u0085Ð ÂµÐ¡Ð\u008CÐ¡â\u0080\u009AÐ Â°Ð Â¶Ð Ñ\u0094Ð Â° - " +
                "Ð Ñ\u0096Ð Ò\u0091Ð Âµ Ð ÂµÐ¡Ð\u0083Ð¡â\u0080\u009AÐ¡Ð\u008A,, Ð Ñ\u0098Ð Â°Ð Â»Ð Ñ\u0095Ð¡Ð\u008CÐ" +
                "¡â\u0080\u009AÐ Â°Ð Â¶Ð Ñ\u0094Ð Â° Ð Ñ\u0096Ð Ò\u0091Ð Âµ Ð Ñ\u0098Ð Ñ\u0095Ð Â¶Ð Ð\u0085Ð Ñ\u0095";

        String eWindows1251 = new String(windows1251.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);

        assertEquals("Среднеэтажка - где есть,, малоэтажка где можно", eWindows1251);
    }

    @Test
    public void shouldTestChar() {
        assertEquals("CYRILLIC", Character.UnicodeBlock.of('Ц').toString());
        assertNotEquals("CYRILLIC", Character.UnicodeBlock.of('W').toString());
    }

}
