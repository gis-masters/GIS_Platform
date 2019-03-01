package unit;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.Test;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.PropertyViolation;
import ru.mycrg.wrapper.service.validation.Util;

import java.util.List;

import static org.junit.Assert.assertEquals;

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

}
