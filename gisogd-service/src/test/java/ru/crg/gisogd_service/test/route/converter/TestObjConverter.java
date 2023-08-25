package ru.crg.gisogd_service.test.route.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.crg.gisogd_service.test.route.dto.TestObj1;
import ru.crg.gisogd_service.test.route.dto.TestObj2;

@Component
public class TestObjConverter implements Converter<TestObj1, TestObj2> {
    public TestObj2 convert(TestObj1 testObj1) {
        return new TestObj2().toBuilder()
                .convertedField1(testObj1.getField1())
                .convertedField2(testObj1.getField2())
                .build();
    }
}
