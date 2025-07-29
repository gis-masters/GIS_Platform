package ru.mycrg.acceptance.data_service.spatial_reference_system;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;

import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.Assert.assertEquals;

public class SrsStepsDefinition extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/srs");
    }

    @When("Пользователь создаёт систему координат: {string}")
    public void createSrsFromWkt(String wktKey) {
        SpatialReferenceSystem srs = createSrsFromWktKey(wktKey);
        super.createEntity(srs);
    }

    @And("Система координат создана и имеет ожидаемые параметры: {string}")
    public void checkSrs(String wktKey) {
        validateSrsResponse(wktKey);
    }

    @When("Пользователь удаляет систему координат {string}")
    public void deleteSrsFromWkt(String wktKey) {
        String srsId = findSrsIdByName(wktKey);

        deleteSystemSrs(srsId);

        assertEquals(204, response.getStatusCode());
    }

    @When("Пользователь пытается удалить системную проекцию {string}")
    public void deleteSystemSrs(String epsg) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/" + epsg);
    }

    @When("Пользователь пытается изменить системную проекцию {string}")
    public void updateSystemSrc(String epsg) {
        SpatialReferenceSystem srs = createSrsFromWktKey("ProjAfterChange");

        updateSrs(srs, epsg);
    }

    @When("Пользователь изменяет систему координат {string} на {string}")
    public void updateSrc(String currentSrc, String newSrc) {
        String currentSrcId = findSrsIdByName(currentSrc);
        SpatialReferenceSystem srs = createSrsFromWktKey(newSrc);

        updateSrs(srs, currentSrcId);
    }

    @Given("Многопоточно создаём проекции: {int}")
    public void createSomeSrcInThread(int count) {
        ExecutorService executor = Executors.newFixedThreadPool(count);

        try {
            CompletableFuture<?>[] futures = IntStream
                    .rangeClosed(1, count)
                    .mapToObj(i -> CompletableFuture.runAsync(() -> createSrsInThread(i), executor))
                    .toArray(CompletableFuture[]::new);

            CompletableFuture.allOf(futures).join();
        } finally {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }

    @When("Проекции были изменены многопоточно")
    public void modifySomeSrcInThread() {
        String epsgProperties = getEpsgProperties();
        String srsThread1Id = findSrsIdByNameAndEpsgProperties(epsgProperties, "srsThread1");
        String srsThread2Id = findSrsIdByNameAndEpsgProperties(epsgProperties, "srsThread2");
        String srsThread3Id = findSrsIdByNameAndEpsgProperties(epsgProperties, "srsThread3");

        ExecutorService executor = Executors.newFixedThreadPool(4);

        try {
            CompletableFuture<?>[] futures = new CompletableFuture[]{
                    // Поток 1: удалить srsThread1
                    CompletableFuture.runAsync(() -> deleteSrsFromWkt(srsThread1Id), executor),
                    // Поток 2: удалить srsThread3
                    CompletableFuture.runAsync(() -> deleteSrsFromWkt(srsThread3Id), executor),
                    // Поток 3: модифицировать srsThread2
                    CompletableFuture.runAsync(() -> modifySrsById(srsThread2Id), executor),
                    // Поток 4: создать srsThread5
                    CompletableFuture.runAsync(() -> super.createEntity(createThreadSrs(5)), executor)
            };

            CompletableFuture.allOf(futures).join();
        } finally {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }

    private void createSrsInThread(int threadNumber) {
        SpatialReferenceSystem srs = createThreadSrs(threadNumber);

        getBaseRequestWithCurrentCookie()
                .given()
                    .body(srs)
                    .contentType("application/json")
                .when()
                    .post()
                .then()
                    .log().ifError();
    }

    private SpatialReferenceSystem createThreadSrs(int threadNumber) {
        String BASE_SRTEXT = "PROJCS[\"srsThread\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",-18001.8],PARAMETER[\"False_Northing\",-4915002.6],PARAMETER[\"Central_Meridian\",33.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]";
        String BASE_PROJ4_TEXT = "+proj=merc +lat_0=0.0 +lon_0=33.0 +k_0=1.0 +x_0=-18001.8 +y_0=-4915002.6 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs";

        SpatialReferenceSystem srs = new SpatialReferenceSystem();
        String threadSrtext = BASE_SRTEXT.replace("srsThread", "srsThread" + threadNumber);
        srs.setSrtext(threadSrtext);
        srs.setProj4Text(BASE_PROJ4_TEXT);

        return srs;
    }

    private void modifySrsById(String srsId) {
        SpatialReferenceSystem modifiedSrs = createThreadSrs(2);
        // Изменяем параметры для модификации
        String modifiedSrtext = modifiedSrs.getSrtext().replace("srsThread2", "srsThread2Modified");
        modifiedSrs.setSrtext(modifiedSrtext);

        getBaseRequestWithCurrentCookie()
                .given()
                    .body(modifiedSrs)
                    .contentType("application/json")
                .when()
                    .patch("/" + srsId)
                .then()
                    .log().ifError();
    }

    private String getEpsgProperties() {
        response = super.getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/resource/user_projections/epsg.properties");

        response.then().statusCode(SC_OK);

        return response.asString();
    }

    private SpatialReferenceSystem createSrsFromWktKey(String wktKey) {
        SpatialReferenceSystem srs = new SpatialReferenceSystem();
        srs.setSrtext(WktPool.getWkt(wktKey));
        return srs;
    }

    private String findSrsIdByName(String srsName) {
        String epsgProperties = getEpsgProperties();
        String srsId = findSrsIdByNameAndEpsgProperties(epsgProperties, srsName);

        if (srsId == null) {
            throw new RuntimeException("Система координат с именем '" + srsName + "' не найдена");
        }

        return srsId;
    }

    private String findSrsIdByNameAndEpsgProperties(String epsgProperties, String srsName) {
        String[] lines = epsgProperties.split("\n");
        for (String line: lines) {
            if (line.contains(srsName)) {
                String[] parts = line.split("=", 2);
                if (parts.length == 2) {
                    return parts[0].trim();
                }
            }
        }
        return null;
    }

    private void validateSrsResponse(String wktKey) {
        response.then()
                .statusCode(SC_OK)
                .body("authSrid", notNullValue())
                .body("srtext", notNullValue())
                .body("proj4Text", equalTo(WktPool.getSrs(wktKey).getProj4Text()));
    }

    private void updateSrs(SpatialReferenceSystem srs, String currentSrcId) {
        response = getBaseRequestWithCurrentCookie()
                .given()
                    .body(srs)
                    .contentType("application/json")
                .when()
                    .patch("/" + currentSrcId)
                .then()
                    .log().ifError()
                    .extract().response();
    }
}
