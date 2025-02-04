package ru.mycrg.http_client;

import com.github.tomakehurst.wiremock.WireMockServer;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.http_client.handlers.IHttpRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.options;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ClientTest {

    private static WireMockServer wireMockServer;
    private static int port;

    @BeforeAll
    public static void beforeAll() {
        wireMockServer = new WireMockServer(options().dynamicPort());
        wireMockServer.start();

        port = wireMockServer.port();
        configureFor("localhost", port);
    }

    @AfterAll
    public static void afterAll() {
        wireMockServer.stop();
    }

    @Test
    void shouldThrow() throws MalformedURLException {
        IHttpRequestHandler requestHandler = new BaseRequestHandler(new OkHttpClient());

        Request request = new Request.Builder()
                .url(new URL("http://somehost/not_exist/path"))
                .get()
                .build();

        assertThrows(UnknownHostException.class, () -> requestHandler.handle(request));
    }

    @Test
    void shouldCallOnce() throws HttpClientException, MalformedURLException {
        // Arrange server stub
        stubFor(get(urlEqualTo("/some/thing"))
                        .willReturn(aResponse()
                                            .withBody("\"Hello_wiremock!\"")));

        // Arrange client
        HttpClient httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));

        // Act
        URL baseUrl = new URL("http://localhost:" + port);
        ResponseModel<String> response = httpClient.get(new URL(baseUrl, "/some/thing"), String.class);

        // Assert
        assertEquals(200, response.getCode());
        assertEquals("Hello_wiremock!", response.getBody());
    }
}
