package main.config;

import io.restassured.RestAssured;
import io.restassured.specification.RequestSpecification;

public class RestClient {

    private final String host;
    private final int port;

    public RestClient(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public RequestSpecification getBaseRequest() {
        return RestAssured
                .given().
                        log().ifValidationFails().
                        baseUri(host).
                        port(port).
                        basePath("");
    }
}
