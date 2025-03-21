package ru.mycrg.acceptance.data_service.smev3;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.path.json.JsonPath;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.MessageProperties;
import ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

/**
 * Весь класс призван тестировать функционал связанный с SMEV и РНС РНВ ГПЗУ ...
 * <p>
 * На данный момент Класс способен: - поставить в Кролик заданное сообщение - получать из списка всех задач последнюю
 * (дожидаясь создания входящего объекта) - получать документ из последней задачи
 * <p>
 * Так как у нас чётко захардкожены присылаемые XML -> мы знаем что будет в ответ Все проверки над ожидаемым контентом
 * тоже в этом классе (как минимум планируется)
 */

// TODO: Сделать отдельный класс для "Имитации внешних систем которые что-то кладут в кролик"

public class SmevTasksDefinitions extends BaseStepsDefinitions {

    private final LibraryStepsDefinitions libraryStepsDefinitions = new LibraryStepsDefinitions();
    private final String RABBITMQ_HOST = "localhost";
    private final int RABBITMQ_PORT = 5672;
    private final String RABBITMQ_USER = "fiz";
    private final String RABBITMQ_PASS = "314";

    @When("в очередь попадает запрос на РНС")
    public void createRNSRequest() throws Exception {
        InputStream resource = getClass()
                .getClassLoader()
                .getResourceAsStream("ru/mycrg/acceptance/resources/RnsSmevDupRequest.xml");

        String xmlContent = new String(Objects.requireNonNull(resource).readAllBytes(), StandardCharsets.UTF_8);

        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(RABBITMQ_HOST);
        factory.setPort(RABBITMQ_PORT);
        factory.setUsername(RABBITMQ_USER);
        factory.setPassword(RABBITMQ_PASS);

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.queueDeclare("U629301_QUEUE_RECEIVE", true, false, false, null);
            channel.basicPublish("", "U629301_QUEUE_RECEIVE",
                                 MessageProperties.PERSISTENT_TEXT_PLAIN,
                                 xmlContent.getBytes(StandardCharsets.UTF_8));
        }
    }

    @When("я получаю прикреплённый к новой задаче документ")
    public void getLastDoc() {
        getLastDocument();
        assertEquals("Ошибка при получении документа", 200, response.getStatusCode());
    }

    @Then("создана задача ожидаемого вида")
    public void checkRnsTask() {
        int maxId = response.jsonPath().getList("content.id")
                            .stream()
                            .mapToInt(id -> Integer.parseInt(id.toString()))
                            .max()
                            .orElse(-1);

        System.out.println("Задача с максимальным ID: " + maxId);
        assertTrue("ID задачи должен быть больше 0", maxId > 0);

        Map<String, Object> task = (Map<String, Object>) response.jsonPath().getList("content").get(0);
        assertEquals("Неверное значение owner_id", 2, task.get("owner_id"));
        assertEquals("Неверное значение content_type_id", "rns_smev_rostelekom", task.get("content_type_id"));
        assertEquals("Неверное значение type", "CUSTOM", task.get("type"));
        assertEquals("Неверное значение intermediate_status", "1", task.get("intermediate_status"));
        assertEquals("Неверное значение status", "CREATED", task.get("status"));
        assertEquals("Неверное значение assigned_to", 2, task.get("assigned_to"));

        String inboxDataConnection = task.get("inbox_data_key_data_connection").toString();
        assertEquals("Неверное значение inbox_data_key_data_connection",
                     "[{\"id\":1,\"title\":\"РНC из ЕПГУ\",\"libraryTableName\":\"dl_data_inbox_data\"}]",
                     inboxDataConnection);
    }

    @And("прикреплённый документ в новой задаче заполнен ожидаемо")
    public void checkAdditionalDoc() {
        getLastDocument();

        JsonPath jsonPath = response.jsonPath();
        assertEquals("Неверный номер разрешения на строительство",
                     "RU01-2-3456-2020", jsonPath.getString("permits_data_number"));
        assertEquals("Неверный PGUID",
                     "4650599137", jsonPath.getString("pguid"));

        assertEquals("Неверная цель",
                     "4", jsonPath.getString("goal"));
        assertEquals("Неверный тип контента",
                     "rns_smev_rostelekom", jsonPath.getString("content_type_id"));
        assertEquals("Неверное имя заявителя",
                     "Ионов Вячеслав Владимирович", jsonPath.getString("person_name"));
        assertEquals("Неверный идентификатор сообщения СМЭВ",
                     "0ecf614d-fb28-11ef-8e72-1ed50ed0293c", jsonPath.getString("smev_message_id"));

        assertEquals("Неверная роль",
                     "OWNER", jsonPath.getString("role"));
        assertEquals("Неверный тип запроса",
                     "0B.5", jsonPath.getString("request_type"));
        assertEquals("Неверный статус записи",
                     "1.А.1", jsonPath.getString("record_status"));

        assertEquals("Неверный заголовок",
                     "РНC из ЕПГУ", jsonPath.getString("title"));
        assertEquals("Неверный идентификатор клиента СМЭВ",
                     "0a546300-9f22-4e41-9804-f3b2d6f889b4", jsonPath.getString("smev_client_id"));
        assertEquals("Неверный тип данных",
                     "0Е.2", jsonPath.getString("data_type"));

        List<Map<String, Object>> files = jsonPath.getList("file");
        assertNotNull("Отсутствует список файлов", files);
        assertEquals("Неверное количество файлов", 3, files.size());
    }

    private void getLastDocument() {
        List<Map<String, Object>> content = response.jsonPath().getList("content");
        if (content.isEmpty()) {
            throw new AssertionError("Не найдены задачи");
        }

        int lastTaskIndex = 0;
        int maxId = Integer.parseInt(content.get(0).get("id").toString());

        for (int i = 1; i < content.size(); i++) {
            int currentId = Integer.parseInt(content.get(i).get("id").toString());
            if (currentId > maxId) {
                maxId = currentId;
                lastTaskIndex = i;
            }
        }

        String inboxDataConnection = response.jsonPath().getString(
                "content[" + lastTaskIndex + "].inbox_data_key_data_connection");
        if (inboxDataConnection == null) {
            throw new AssertionError("В последней задаче отсутствует inbox_data_key_data_connection");
        }
        JsonPath connectionJsonPath = new JsonPath(inboxDataConnection);

        Integer inboxDataId = connectionJsonPath.getInt("[0].id");
        String libraryTableName = connectionJsonPath.getString("[0].libraryTableName");
        libraryStepsDefinitions.getRecordById(inboxDataId, libraryTableName);
    }
}
