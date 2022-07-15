package unit;

import com.fasterxml.jackson.databind.JsonNode;
import org.assertj.core.util.Lists;
import org.junit.Test;
import ru.mycrg.data_service_contract.dto.ErrorDescription;
import ru.mycrg.data_service_contract.dto.ObjectValidationResult;
import ru.mycrg.data_service_contract.dto.PropertyViolation;
import ru.mycrg.wrapper.service.validation.Util;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.wrapper.dao.DaoProperties.*;
import static ru.mycrg.wrapper.service.util.StringDecoder.decode;

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
        object.setGlobalId(GLOBAL_KEY);
        object.setxMin("xmin");
        object.addPropertyViolation(propertyViolation);
        object.addObjectViolation(new ErrorDescription("status", "some text"));

        JsonNode jsonNode = Util.convertToJson(object);

        assertEquals("{\"objectId\":\"objectid\",\"globalId\":\"globalid\",\"classId\":\"classid\",\"xMin\":\"xmin\"," +
                             "\"propertyViolations\":[{\"name\":\"pName\",\"value\":\"pValue\",\"" +
                             "errorTypes\":[\"INT\",\"CHOICE\",\"DOUBLE\"]}],\"objectViolations\":" +
                             "[{\"attribute\":\"status\",\"error\":\"some text\"}]}",
                     jsonNode.toString());
    }

    @Test
    public void shouldTestEncoding() {
        String windows1251 = "Ð¡Ñ\u0080ÐµÐ´Ð½ÐµÑ\u008DÑ\u0082Ð°Ð¶ÐºÐ° - Ð³Ð´Ðµ ÐµÑ\u0081Ñ\u0082Ñ\u008C,, " +
                "Ð¼Ð°Ð»Ð¾Ñ\u008DÑ\u0082Ð°Ð¶ÐºÐ° Ð³Ð´Ðµ Ð¼Ð¾Ð¶Ð½Ð¾";

        assertEquals("Среднеэтажка - где есть,, малоэтажка где можно", decode(windows1251));
        assertEquals("Корректный UTF-8 текст.", decode("Корректный UTF-8 текст."));
        assertEquals("", decode(""));
        assertEquals("{\"text\":\"Регламенты\"}", decode("{\"text\":\"Регламенты\"}"));
        assertEquals("{можно}", decode("{Ð¼Ð¾Ð¶Ð½Ð¾}"));
        assertEquals("ООО «НТО»", decode("ООО «НТО»"));
    }
}
