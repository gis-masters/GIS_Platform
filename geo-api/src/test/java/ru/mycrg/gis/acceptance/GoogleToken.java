package ru.mycrg.gis.acceptance;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.gis.config.CustomUserDetailsService;

import java.util.HashMap;

import static com.jayway.restassured.RestAssured.given;

public class GoogleToken {

    private static Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

//    @Test
//    public void shouldGetAuthKey() {
//        HashMap<String, String> params = new HashMap<>();
//        params.put("redirect_uri", "http://localhost:8080/geoserver");
//        params.put("response_type", "code");
//        params.put("client_id", "834804246009-sh7165n9rffo334cdqsone1rsnmf0hjn.apps.googleusercontent.com");
//        params.put("scope", "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile");
//
//        given()
//                .baseUri("https://accounts.google.com")
//                .basePath("/o/oauth2/auth")
//                .parameters(params)
//            .when()
//                .get()
//            .then()
//                .statusCode(200);
//    }

    /**
     * Код переслаемый при редиректе можно вытащить из логов геосервера в VERBOSE режиме
     * docker logs -f geoserver | grep 'Matched Path: , QueryString: code='
     */
    @Test
    public void shouldGetAuthToken() {
        HashMap<String, String> params = new HashMap<>();
        params.put("client_id", "834804246009-sh7165n9rffo334cdqsone1rsnmf0hjn.apps.googleusercontent.com");
        params.put("client_secret", "vjp4lLW_QmjMHiUw1OBVRIZH");
        params.put("redirect_uri", "http://localhost:8080/geoserver");
        params.put("grant_type", "authorization_code");
        params.put("code", "4/nwD9AoUBOabegwSDDSr_KNnLS3GvtG-fO2_e-tVNz7enuMsJn672x_4oJyTjirfYMJOADU36K-mM9fzXIuss9js");

        given()
                .baseUri("https://accounts.google.com")
                .basePath("/o/oauth2/token")
                .parameters(params)
            .when()
                .post()
            .then()
                .statusCode(200)
                .and()
                    .extract()
                    .body()
                    .jsonPath()
                    .prettyPrint();
    }

//    {
//    "access_token": "ya29.GlxeBmQWAYu-aAXnhnj3gAL94Sy4WimGEFcYRG_jx9iywi7cMkOmcD1PgGnJVJ83LOm9OGSMHQOp_4oTpakE5ZyWLRUKMoBNnj3jpT2NqMVJH2Y5yb6chOOhQqPGvg",
//    "scope": "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
//    "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwY2QzNzcxYzExMjVjOWY3N2U4MmUzOTk3NGUxNjNhOGM3M2IzYzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiODM0ODA0MjQ2MDA5LXNoNzE2NW45cmZmbzMzNGNkcXNvbmUxcnNubWYwaGpuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiODM0ODA0MjQ2MDA5LXNoNzE2NW45cmZmbzMzNGNkcXNvbmUxcnNubWYwaGpuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxMjIxMzYzNzUzNjc1ODQ3NjIwIiwiZW1haWwiOiJmYW5hdGljODNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiI4OVVXNXNnODBNN2UtcE1HeGhSTXpRIiwiaWF0IjoxNTQzMDYwMzgxLCJleHAiOjE1NDMwNjM5ODF9.VXTyb6nHzQoQmDQ2xbowZ8QQx0LoRkxXCJzNrRY1hnvht9RVRXEP4Xbsso9Yj1DdI6CM-1CVGq_8YjVGHCfC1gFEEA1ApNx8LvVDB0PDlqkwcEUsGli-pbzyJW1KZpZK2_H3QVmWGJwI6k3bH4rx4OsBIgm6dMPvdnmc6l_mt7F-5lMaLlnuK-bNC10euQn0OzSjlnE88vpqAM-x--w4ZxnR9OPbrPZL_EtelXiMEG1VPn4jckGx4HnhhLX7KLBOUySx46T14zapY6sH8IfQxx-QXISGE_gCWMQSafv0mMn90F6Sc1o0egeOkXdf-iQft7FWpiPXbxI2z2ptsKox8A",
//    "token_type": "Bearer",
//    "expires_in": 3581
//}

    @Test
    public void shouldGetInfo() {
        HashMap<String, String> params = new HashMap<>();
        params.put("access_token", "ya29.GlxeBmQWAYu-aAXnhnj3gAL94Sy4WimGEFcYRG_jx9iywi7cMkOmcD1PgGnJVJ83LOm9OGSMHQOp_4oTpakE5ZyWLRUKMoBNnj3jpT2NqMVJH2Y5yb6chOOhQqPGvg");

        given()
                .baseUri("https://www.googleapis.com")
                .basePath("/oauth2/v1/userinfo")
                .parameters(params)
            .when()
                .get()
            .then()
                .statusCode(200)
                .and()
                    .extract()
                    .body()
                    .jsonPath()
                    .prettyPrint();
    }

//    {
//        "gender": "male",
//            "name": "Денис Алексеев",
//            "link": "https://plus.google.com/101221363753675847620",
//            "id": "101221363753675847620",
//            "verified_email": true,
//            "given_name": "Денис",
//            "locale": "ru",
//            "family_name": "Алексеев",
//            "email": "fanatic83@gmail.com",
//            "picture": "https://lh3.googleusercontent.com/-ROeqvLmKNTw/AAAAAAAAAAI/AAAAAAAAAIs/Snc4AbitF1Y/photo.jpg"
//    }
}
