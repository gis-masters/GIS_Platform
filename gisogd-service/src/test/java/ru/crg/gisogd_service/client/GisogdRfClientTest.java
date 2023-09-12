package ru.crg.gisogd_service.client;

import lombok.AllArgsConstructor;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ru.crg.gisogd_service.model.rf.Classifiers;

import static org.junit.jupiter.api.Assertions.*;

@AllArgsConstructor(onConstructor_ = {@Autowired})
@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
@Disabled
class GisogdRfClientTest {

    private final GisogdRfClient gisogdRfClient;

    @Test
    void testClassifiers() {
        Classifiers classifiersContainer = gisogdRfClient.getClassifiers();
        assertNotNull(classifiersContainer);
        assertNotNull(classifiersContainer.getClassifierList());
        assertFalse(classifiersContainer.getClassifierList().isEmpty());
    }

    @Test
    void testDocumentsList() {
        assertDoesNotThrow(() -> gisogdRfClient.getRequestedDocuments(null, null));
        assertDoesNotThrow(() -> gisogdRfClient.getRequestedDocuments(null, 2));
        assertDoesNotThrow(() -> gisogdRfClient.getRequestedDocuments(100, null));
        assertDoesNotThrow(() -> gisogdRfClient.getRequestedDocuments(100, 3));
    }
}
