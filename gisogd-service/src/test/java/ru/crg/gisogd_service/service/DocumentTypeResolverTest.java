package ru.crg.gisogd_service.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Document type resolver tests.
 * @author Vladimir Nomokonov
 */
@SpringBootTest
@ActiveProfiles("test-base")
class DocumentTypeResolverTest {

    @Autowired
    private DocumentTypeResolver resolver;

    @Test
    void getDoclibIdByClassName() {
        assertEquals("dl_data_section13", resolver.getDoclibIdByClassName("DataSection13"));
        assertEquals("dl_data_section3", resolver.getDoclibIdByClassName("DataSection3"));
    }
}
