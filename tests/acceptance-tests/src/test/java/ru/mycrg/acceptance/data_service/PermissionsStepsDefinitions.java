package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions;

import static java.lang.Thread.sleep;
import static ru.mycrg.acceptance.auth_service.GroupStepsDefinitions.usersGroupId;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;

public class PermissionsStepsDefinitions extends BaseStepsDefinitions {

    private final ProjectStepsDefinitions projectSteps = new ProjectStepsDefinitions();

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
    public void checkDeletedUsersProjectStepDefinitions() throws InterruptedException {
        sleep(200);

        checkDeletedProjectPermission("VIEWER");
    }

    @And("Разрешения на текущий проект, выданные удаленной пользовательской группе, были удалены")
    public void checkDeletedUsersGroupProjectStepDefinitions() {
        checkDeletedProjectPermission("VIEWER");
    }

    @Then("Разрешения на наборы данных, выданные удаленному пользователю, были удалены")
    public void checkDeletedUserStepDefinitions() throws InterruptedException {
        sleep(800);

        checkDeletedPermission(userId);
    }

    @Then("Разрешения на наборы данных, выданные удаленной пользовательской группе, были удалены")
    public void checkDeletedUserGroupStepDefinitions() {
        checkDeletedPermission(usersGroupId);
    }

    private boolean checkDeletedProjectPermission(String role) {
        try {
            int currentAttempt = 0;
            do {
                currentAttempt++;
                System.out.println("attempt checkDeletedProjectPermission " + currentAttempt);

                projectSteps.checkProjectPerm();

                if (isNonContainsProjectPermissionsRole(role)) {
                    return true;
                }

                sleep(800);
            } while (currentAttempt < MAX_RETRY_ATTEMPT);
            throw new RuntimeException("Users permissions was not deleted!");
        } catch (InterruptedException e) {
            throw new RuntimeException("Users permissions was not deleted!");
        }
    }

    private boolean checkDeletedPermission(Integer entityId) {
        try {
            int currentAttempt = 0;
            do {
                currentAttempt++;
                System.out.println("attempt checkDeletedPermission " + currentAttempt);

                getAllPermissions();

                if (isNonContainsEntityPermissions(entityId)) {
                    return true;
                }

                sleep(800);
            } while (currentAttempt < MAX_RETRY_ATTEMPT);
            throw new RuntimeException("Users permissions was not deleted!");
        } catch (InterruptedException e) {
            throw new RuntimeException("Users permissions was not deleted!");
        }
    }

    private boolean isNonContainsEntityPermissions(Integer entityId) {
        return !response.jsonPath().getList("_embedded.resources.permissions.principalId").contains(entityId);
    }

    private boolean isNonContainsProjectPermissionsRole(String role) {
        return !response.jsonPath().getList("role").contains(role);
    }
}
