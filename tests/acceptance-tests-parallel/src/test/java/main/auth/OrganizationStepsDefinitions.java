package main.auth;

import io.cucumber.java.en.Given;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;

public class OrganizationStepsDefinitions {

    public static OrganizationCreateDto organization;

    /**
     * Должна быть одна организация для всех тестов. Проверяем ее существование на сервере и создаем если таковой нет.
     * Организация гарантированно создаётся один раз до запуска параллельных тестов и доступна через
     * {@code organization}
     */
    @Given("Существует организация")
    public void createOrganization() {

    }
}