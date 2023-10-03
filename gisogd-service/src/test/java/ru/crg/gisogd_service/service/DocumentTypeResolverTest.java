package ru.crg.gisogd_service.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Document type resolver tests.
 * @author Vladimir Nomokonov
 */
@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
class DocumentTypeResolverTest {

    @Autowired
    private DocumentTypeResolver resolver;

    @Test
    void getDoclibIdByClassName() {
        assertEquals("dl_data_section13", resolver.getDoclibIdByClassName("DataSection13"));
        assertEquals("dl_data_section3", resolver.getDoclibIdByClassName("DataSection3"));
    }
}
