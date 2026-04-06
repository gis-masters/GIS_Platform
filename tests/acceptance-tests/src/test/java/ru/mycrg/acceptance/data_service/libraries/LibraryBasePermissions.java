package ru.mycrg.acceptance.data_service.libraries;

import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.util.LinkedHashMap;
import java.util.Map;

public class LibraryBasePermissions extends BaseStepsDefinitions {

    public static Integer currentPermissionId;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data/document-libraries");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/document-libraries");
    }

    //TODO метод изменён при переходе на  java 25. Если всё ок удалить комментарий 30.09.2026
    public static String makeLibraryPermissionUrl(String libraryName, Integer permissionId) {
        return String.format("%s:%d/document-libraries/%s/roleAssignment/%s",
                             "http://crg-data-service", 8084, libraryName, permissionId);
    }

    /**
     * Add permission for some entity in libraries, or exactly for library
     *
     * @param url           URL to resource
     * @param principalId   principal id
     * @param principalType type - one of 'user' or 'group'
     * @param role          one of: 'VIEWER', 'CONTRIBUTOR', 'OWNER'
     */
    public void addPermission(String url, Integer principalId, String principalType, String role) {
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("principalId", principalId.toString());
        payload.put("principalType", principalType);
        payload.put("role", role);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(payload)).
                        contentType(ContentType.JSON)
                .when().
                        post(url);
    }
}
