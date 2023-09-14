package ru.crg.gisogd_service.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;

import lombok.SneakyThrows;
import ru.crg.gisogd_service.model.rf.RfGuid;
import ru.mycrg.gisog_service_contract.dto.Document;

/**
 * Description.
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