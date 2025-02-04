package ru.crg.gisogd_service.route;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.tomakehurst.wiremock.WireMockServer;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.camel.CamelContext;
import org.apache.camel.Produce;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.test.spring.junit5.CamelSpringBootTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.test.context.ActiveProfiles;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static ru.crg.gisogd_service.route.DocumentRoute.*;

/**
 * Description.
 * @author Vladimir Nomokonov
 */
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@SpringBootTest(properties = {
        "camel.springboot.auto-startup=false",
        "logging.level.ru.crg.gisogd_service.route.DocumentRoute=DEBUG"
})
@CamelSpringBootTest
@ActiveProfiles(value = "doclist")
@Disabled
class DocumentRouteLibraryTest {

    private final CamelContext camelContext;
    private final ObjectMapper objectMapper;

    @Produce
    private ProducerTemplate producerTemplate;

    @Value("classpath:route/DocumentsList_response.xml")
    private Resource docListResponse;

    @Value("classpath:gisogd_error/inboxDataDublicateError.xml")
    private Resource errorResponse;

    private WireMockServer wireMockServer;

    @BeforeEach
    @SneakyThrows
    void start() {
        camelContext.getRouteController().startRoute(GET_REQUESTED_DOCUMENTS_ROUTE_ID);
        camelContext.getRouteController().startRoute(GET_DOCUMENT_FROM_CRIMEA_ROUTE_ID);
        camelContext.getRouteController().startRoute(SEND_DOCUMENT_ROUTE_ID);

        wireMockServer = new WireMockServer(8083);
        wireMockServer.start();
        configureFor("localhost", 8083);

        String responseXml = new String(docListResponse.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        stubFor(get(urlPathMatching("/api/rgmu/DocumentsList.*"))
                        .willReturn(aResponse()
                                            .withStatus(200)
                                            .withHeader("Content-Type", "application/xml; charset=utf-8")
                                            .withBody(responseXml)));

        stubFor(post(urlPathEqualTo("/api/rgmu/DocumentsFiles"))
                        .withMultipartRequestBody(
                                aMultipart().withBody(containing("2bd85322-27ad-4286-a6d5-3ef7cd5403f2"))
                        )
                        .willReturn(aResponse().withStatus(200)));

        stubFor(post(urlPathEqualTo("/api/rgmu/DocumentsFiles"))
                        .withMultipartRequestBody(
                                aMultipart().withBody(containing("e63d40c0-eba2-4a26-9993-10e19becc02f"))
                        )
                        .willReturn(aResponse()
                                            .withStatus(400)
                                            .withBody(Files.readString(errorResponse.getFile().toPath(),
                                                                       StandardCharsets.UTF_8))
                        ));
    }

    @AfterEach
    void afterAll() {
        wireMockServer.stop();
    }

    @Test
    void getDocumentsListRouteFullTest() {
        assertDoesNotThrow(() -> producerTemplate.request("direct:get-requested-documents", null));
    }
}
