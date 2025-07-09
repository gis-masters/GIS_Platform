package ru.crg.gisogd_service.client;

import com.jayway.jsonpath.JsonPath;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.reflections.Reflections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.util.FileCopyUtils;
import ru.crg.gisogd_service.annotation.CrimeaRelationResolve;
import ru.crg.gisogd_service.service.DocumentTypeResolver;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static ru.crg.gisogd_service.service.DocumentTypeResolver.PACKAGE_FOR_SCAN;

/**
 * Check endpoint api gisogd for classes.
 * @author Vladimir Nomokonov
 */
@SpringBootTest
@ActiveProfiles("test-base")
class EndpointChecksTest {
    @Autowired
    private DocumentTypeResolver resolver;

    @Test
    @SneakyThrows
    void checkEndpointsTest() {
        String message = "Not found endpoint in API GISOGD for class %s";
        InputStream inputStream = new ClassPathResource("swagger-api/api-rf-test.json").getInputStream();
        String apiString = FileCopyUtils.copyToString(new InputStreamReader(inputStream));
        Map<String, Object> apiEndpointsMap = JsonPath.parse(apiString)
                .read("$['paths']");
        Set<String> apiEndpoints = apiEndpointsMap.keySet();
        Reflections scanner = new Reflections(PACKAGE_FOR_SCAN);
        Set<Class<?>> crimeaClasses = scanner.getTypesAnnotatedWith(CrimeaRelationResolve.class);
        crimeaClasses.forEach(aClass -> {
            CrimeaRelationResolve resolveProps = aClass.getAnnotation(CrimeaRelationResolve.class);

            assertTrue(apiEndpoints.contains("/" + resolver.getEndpointByType(resolveProps.objectClass())),
                    String.format(message, resolveProps.objectClass()));
        });

    }
}
