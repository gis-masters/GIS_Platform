package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.ProjectPermissionStepsDefinitions;

import static java.lang.Thread.sleep;
import static ru.mycrg.acceptance.auth_service.UserGroupStepsDefinitions.usersGroupId;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;
import static ru.mycrg.acceptance.data_service.ImportStepsDefinitions.RETRY_DELAY;

public class PermissionsStepsDefinitions extends BaseStepsDefinitions {

    private final ProjectPermissionStepsDefinitions projectPermission = new ProjectPermissionStepsDefinitions();

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest()
                    .basePath("/api/data");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data");
    }

    @Then("Администратор запрашивает все разрешения")
    public void getAllPermissions() {
        response = super.getBaseRequestWithCurrentCookie()
                .when().
                        get("/all-permissions");
    }

    @And("Разрешения на текущий проект, выданные удаленному пользователю, были удалены")
    public void checkDeletedUsersProjectStepDefinitions() {
        checkDeletedProjectPermission("VIEWER");
    }

    @And("Разрешения на текущий проект, выданные удаленной пользовательской группе, были удалены")
    public void checkDeletedUsersGroupProjectStepDefinitions() {
        checkDeletedProjectPermission("VIEWER");
    }

    @Then("Разрешения на наборы данных, выданные удаленному пользователю, были удалены")
    public void checkDeletedUserStepDefinitions() {
        checkDeletedPermission(userId);
    }

    @Then("Разрешения на наборы данных, выданные удаленной пользовательской группе, были удалены")
    public void checkDeletedUserGroupStepDefinitions() {
        checkDeletedPermission(usersGroupId);
    }

    private void checkDeletedProjectPermission(String role) {
        try {
            int currentAttempt = 0;
            do {
                sleep(RETRY_DELAY);

                currentAttempt++;
                System.out.println("attempt checkDeletedProjectPermission " + currentAttempt);

                projectPermission.checkProjectPerm();

                if (isNonContainsProjectPermissionsRole(role)) {
                    return; // Успешно проверили, что разрешения удалены
                }
            } while (currentAttempt < MAX_RETRY_ATTEMPT);

            throw new RuntimeException("User permissions for project was not deleted! Attempts ended");
        } catch (InterruptedException e) {
            throw new RuntimeException("Failed to check project permissions. Reason: " + e.getMessage());
        }
    }

    private void checkDeletedPermission(Integer entityId) {
        try {
            int currentAttempt = 0;
            do {
                sleep(RETRY_DELAY);

                currentAttempt++;
                System.out.println("attempt checkDeletedPermission " + currentAttempt);

                getAllPermissions();

                if (isNonContainsEntityPermissions(entityId)) {
                    return; // Успешно проверили, что разрешения удалены
                }
            } while (currentAttempt < MAX_RETRY_ATTEMPT);

            throw new RuntimeException("User permissions for dataset was not deleted! Attempts ended");
        } catch (InterruptedException e) {
            throw new RuntimeException("Failed to check dataset permissions. Reason: " + e.getMessage());
        }
    }

    private boolean isNonContainsEntityPermissions(Integer entityId) {
        return !response.jsonPath().getList("content.permissions.principalId").contains(entityId);
    }

    private boolean isNonContainsProjectPermissionsRole(String role) {
        return !response.jsonPath().getList("role").contains(role);
    }
}
