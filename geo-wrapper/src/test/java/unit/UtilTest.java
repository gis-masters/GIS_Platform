package unit;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.tika.parser.txt.CharsetDetector;
import org.junit.Ignore;
import org.junit.Test;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.PropertyViolation;
import ru.mycrg.wrapper.service.validation.Util;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class UtilTest {

    @Test
    public void shouldConvertToJSON() {
        PropertyViolation propertyViolation = new PropertyViolation();
        propertyViolation.setName("pName");
        propertyViolation.setValue("pValue");
        propertyViolation.setErrorTypes(List.of("INT", "CHOICE", "DOUBLE"));

        ObjectValidationResult object = new ObjectValidationResult();
        object.setClassId("classId");
        object.setObjectId("objectId");
        object.setxMin("xmin");
        object.addPropertyViolation(propertyViolation);
        object.addObjectViolation("Some error");

        JsonNode jsonNode = Util.convertToJson(object);

        assertEquals("{\"objectId\":\"objectId\",\"classId\":\"classId\",\"xMin\":\"xmin\",\"" +
                        "propertyViolations\":[{\"name\":\"pName\",\"value\":\"pValue\",\"" +
                        "errorTypes\":[\"INT\",\"CHOICE\",\"DOUBLE\"]}],\"objectViolations\":[\"Some error\"]}",
                jsonNode.toString());
    }

    @Test
    @Ignore
    public void shouldTestEncoding() {
        String windows1251 = "Ð¡Ñ\u0080ÐµÐ´Ð½ÐµÑ\u008DÑ\u0082Ð°Ð¶ÐºÐ° - Ð³Ð´Ðµ ÐµÑ\u0081Ñ\u0082Ñ\u008C,, " +
                "Ð¼Ð°Ð»Ð¾Ñ\u008DÑ\u0082Ð°Ð¶ÐºÐ° Ð³Ð´Ðµ Ð¼Ð¾Ð¶Ð½Ð¾";
        String utf8 = "Ð Ð\u008EÐ¡Ð\u0082Ð ÂµÐ Ò\u0091Ð Ð\u0085Ð ÂµÐ¡Ð\u008CÐ¡â\u0080\u009AÐ Â°Ð Â¶Ð Ñ\u0094Ð Â° - " +
                "Ð Ñ\u0096Ð Ò\u0091Ð Âµ Ð ÂµÐ¡Ð\u0083Ð¡â\u0080\u009AÐ¡Ð\u008A,, Ð Ñ\u0098Ð Â°Ð Â»Ð Ñ\u0095Ð¡Ð\u008CÐ" +
                "¡â\u0080\u009AÐ Â°Ð Â¶Ð Ñ\u0094Ð Â° Ð Ñ\u0096Ð Ò\u0091Ð Âµ Ð Ñ\u0098Ð Ñ\u0095Ð Â¶Ð Ð\u0085Ð Ñ\u0095";

        String eWindows1251 = new String(windows1251.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
        String encodedUtf8 = new String(utf8.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);

        assertEquals("Среднеэтажка - где есть,, малоэтажка где можно", eWindows1251);
        assertEquals("Среднеэтажка - где есть,, малоэтажка где можно", encodedUtf8);
    }

    @Test
    public void shouldTestChar() {
        assertEquals("CYRILLIC", Character.UnicodeBlock.of('Ц').toString());
        assertNotEquals("CYRILLIC", Character.UnicodeBlock.of('W').toString());
    }

    @Test
    public void shouldDefineEncodeType() {
        CharsetDetector utf8 = new CharsetDetector();
        utf8.setText(("Ð¡Ñ\u0080ÐµÐ´Ð½ÐµÑ\u008DÑ\u0082Ð°Ð¶ÐºÐ° - Ð³Ð´Ðµ ÐµÑ\u0081Ñ\u0082Ñ\u008C,, Ð¼Ð°Ð»Ð¾Ñ\u008DÑ" +
                "\u0082Ð°Ð¶ÐºÐ° Ð³Ð´Ðµ Ð¼Ð¾Ð¶Ð½Ð¾").getBytes());

        assertEquals("UTF-8", utf8.detect().getName());

        CharsetDetector windows1520 = new CharsetDetector();
        windows1520.setText(("Ð Ð\u008EÐ¡Ð\u0082Ð ÂµÐ Ò\u0091Ð Ð\u0085Ð ÂµÐ¡Ð\u008CÐ¡â\u0080\u009AÐ Â°Ð Â¶Ð Ñ\u0094" +
                "Ð Â° - Ð Ñ\u0096Ð Ò\u0091Ð Âµ Ð ÂµÐ¡Ð\u0083Ð¡â\u0080\u009AÐ¡Ð\u008A,, Ð Ñ\u0098Ð Â°Ð Â»Ð Ñ\u0095" +
                "Ð¡Ð\u008CÐ¡â\u0080\u009AÐ Â°Ð Â¶Ð Ñ\u0094Ð Â° Ð Ñ\u0096Ð Ò\u0091Ð Âµ Ð Ñ\u0098Ð Ñ\u0095Ð Â¶Ð Ð" +
                "\u0085Ð Ñ\u0095").getBytes());

        assertEquals("UTF-8", windows1520.detect().getName());

        CharsetDetector windows = new CharsetDetector();
        windows.setText("РЎСЂРµРґРЅРµСЌС‚Р°Р¶РєР° - РіРґРµ РµСЃС‚СЊ".getBytes());

        assertEquals("UTF-8", windows.detect().getName());
    }

}
