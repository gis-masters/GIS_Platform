package main.config;

import io.cucumber.java.AfterAll;
import io.cucumber.java.Before;
import io.cucumber.java.BeforeAll;

public class Initializer {

    public static String rootUserName;
    public static String rootPassword;

    public static RestClient restClient;

    @Before
    public void before() {
        System.out.println("=== Before ===");
    }

    @BeforeAll
    public static void beforeAll() {
        System.out.println("=== BeforeAll ===");

        String host = System.getProperty("env.HOST");
        rootUserName = System.getProperty("env.ROOT_NAME");
        rootPassword = System.getProperty("env.ROOT_PASS");

        assert host != null && rootPassword != null && rootUserName != null
                : "You should specify test server HOST as '-Denv.HOST', PORT as '-Denv.PORT', ROOT_NAME as '-Denv" +
                ".ROOT_NAME', ROOT_PASS as '-Denv.ROOT_PASS'";
        int port = Integer.parseInt(System.getProperty("env.PORT"));

        restClient = new RestClient(host, port);
    }

    @AfterAll
    public static void afterAll() {
        System.out.println("=== afterAll ===");
    }
}
