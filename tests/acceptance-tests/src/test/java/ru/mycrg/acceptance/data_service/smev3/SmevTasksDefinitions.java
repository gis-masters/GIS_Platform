package ru.mycrg.acceptance.data_service.smev3;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.path.json.JsonPath;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

/**
 * Весь класс призван тестировать функционал связанный с СМЭВ и РНС РНВ ГПЗУ ...
 * <p>
 * На данный момент Класс способен: - поставить в Кролик заданное сообщение - получать из списка всех задач последнюю
 * (дожидаясь создания входящего объекта) - получать документ из последней задачи
 * <p>
 * Так как у нас чётко захардкожены присылаемые XML -> мы знаем что будет в ответ Все проверки над ожидаемым контентом
 * тоже в этом классе (как минимум планируется)
 */

public class SmevTasksDefinitions extends BaseStepsDefinitions {

    private final LibraryStepsDefinitions libraryStepsDefinitions = new LibraryStepsDefinitions();

    private final String RECEIVE_RABBIT_QUEUE = "U629301_QUEUE_RECEIVE";
    private final String SEND_RABBIT_QUEUE = "U629301_QUEUE_SEND";
    private final String SMEV_RESOURCE_PATH = "ru/mycrg/acceptance/resources/SMEV/";

    private static final Map<String, String> MESSAGE_TYPE_MAPPING = Map.of(
            "Дубликат РНС Заявление зарегистрировано", "RnsDupInProgressStatus",
            "Дубликат РНС Заявление отменено", "RnsDupCancelledStatus",
            "Дубликат РНС Услуга оказана", "RnsDupDoneStatus",
            "Дубликат РНС Отказано в предоставлении услуги", "RnsDupAbolitionStatus",
            "Дубликат РНВ Заявление зарегистрировано", "RnvDupInProgressStatus",
            "Дубликат РНВ Заявление отменено", "RnvDupCancelledStatus",
            "Дубликат РНВ Услуга оказана", "RnvDupDoneStatus",
            "Дубликат РНВ Отказано в предоставлении услуги", "RnvDupAbolitionStatus"
    );

    private static final Map<String, String> REQUEST_TYPE_MAPPING = Map.of(
            "РНС выдача", "RnsGive",
            "РНС продление", "RnsRenewal",
            "РНС дубликат", "RnsDup",
            "РНВ выдача", "RnvGive",
            "РНВ изменение", "RnvChange",
            "РНВ дубликат", "RnvDup"
    );

    @When("в очередь попадает запрос на {string}")
    public void createRnsRequest(String epguType) throws Exception {
        String newFileName = REQUEST_TYPE_MAPPING.getOrDefault(epguType, "");
        if (newFileName.isEmpty()) {
            throw new IllegalArgumentException("Неизвестный тип запроса: " + epguType);
        }

        InputStream resource = getClass()
                .getClassLoader()
                .getResourceAsStream(SMEV_RESOURCE_PATH + newFileName + ".xml");

        String xmlContent = new String(Objects.requireNonNull(resource).readAllBytes(), StandardCharsets.UTF_8);

        RabbitMQManager rabbitMQManager = new RabbitMQManager();
        rabbitMQManager.sendMessage(RECEIVE_RABBIT_QUEUE, xmlContent);
    }

    @When("я получаю прикреплённый к новой задаче документ")
    public void getLastDoc() {
        getLastDocument();
        assertEquals("Ошибка при получении документа", 200, response.getStatusCode());
    }

    @Then("создана задача ожидаемого вида {string} {string}")
    public void checkRnsTask(String expectedType, String expectedView) {

        int maxId = response.jsonPath().getList("content.id")
                            .stream()
                            .mapToInt(id -> Integer.parseInt(id.toString()))
                            .max()
                            .orElse(-1);

        System.out.println("Задача с максимальным ID: " + maxId);
        assertTrue("ID задачи должен быть больше 0", maxId > 0);

        // Находим задачу с максимальным ID
        Map<String, Object> task = response.jsonPath().getList("content").stream()
                                           .map(item -> (Map<String, Object>) item)
                                           .filter(t -> Integer.parseInt(t.get("id").toString()) == maxId)
                                           .findFirst()
                                           .orElseThrow(() -> new AssertionError("Не найдена задача с ID: " + maxId));

        //Базовые проверки
        assertEquals("Неверное значение owner_id", 3, task.get("owner_id"));
        assertEquals("Неверное значение type", "CUSTOM", task.get("type"));
        assertEquals("Неверное значение intermediate_status", "1", task.get("intermediate_status"));
        assertEquals("Неверное значение status", "CREATED", task.get("status"));
        assertEquals("Неверное значение assigned_to", 3, task.get("assigned_to"));

        //получаем последнюю запись из библиотеки документов
        libraryStepsDefinitions.getRecordsAsRegistry("", "dl_data_inbox_data");

        int maxExistingId = response.jsonPath()
                                    .getInt("content.collect { it.content.id }.max()");

        //Поля которые должны различаться в зависимости от типа
        assertEquals("Неверное значение content_type_id", expectedType, task.get("content_type_id"));
        String inboxDataConnection = task.get("inbox_data_key_data_connection").toString();
        assertEquals("Неверное значение inbox_data_key_data_connection",
                     "[{\"id\":" + maxExistingId + ",\"title\":\"" + expectedView + "\",\"libraryTableName" +
                             "\":\"dl_data_inbox_data\"}]", inboxDataConnection);
    }

    @And("прикреплённый документ в новой задаче заполнен ожидаемо {string}")
    public void checkAdditionalDoc(String view) {
        getLastDocument();

        Map<String, String> expectedValues = Arrays.stream(view.split(","))
                                                   .map(pair -> pair.split("="))
                                                   .collect(Collectors.toMap(
                                                           arr -> arr[0].trim(),
                                                           arr -> arr[1].replaceAll("\"", "").trim()
                                                   ));

        JsonPath jsonPath = response.jsonPath();
        for (Map.Entry<String, String> entry: expectedValues.entrySet()) {
            assertEquals("Неверное значение поля " + entry.getKey(),
                         entry.getValue(), jsonPath.getString(entry.getKey()));
        }

        List<Map<String, Object>> files = jsonPath.getList("file");
        assertNotNull("Отсутствует список файлов", files);
        assertTrue("Количество файлов должно быть больше 2-х", files.size() > 2);
    }

    @And("отправлено сообщение ожидаемого вида {string}")
    public void checkSendQueue(String expectedMessageType) throws Exception {
        String engMsg = MESSAGE_TYPE_MAPPING.getOrDefault(expectedMessageType, "");
        if (engMsg.isEmpty()) {
            throw new IllegalArgumentException("Неизвестный тип сообщения: " + expectedMessageType);
        }

        RabbitMQManager rabbitMQManager = new RabbitMQManager();
        String actualMessage = rabbitMQManager.receiveMessage(SEND_RABBIT_QUEUE);

        // Загружаем ожидаемое сообщение из ресурсов
        String resourcePath = SMEV_RESOURCE_PATH + engMsg + ".xml";
        InputStream resource = getClass()
                .getClassLoader()
                .getResourceAsStream(resourcePath);

        if (resource == null) {
            throw new IllegalStateException("Не найден файл с ожидаемым сообщением: " + resourcePath);
        }

        String expectedMessage = new String(resource.readAllBytes(), StandardCharsets.UTF_8);

        // Нормализуем оба сообщения
        String normalizedActual = actualMessage
                .replaceAll("<tns:clientId>[^<]*</tns:clientId>", "<tns:clientId></tns:clientId>")
                .replaceAll("<tns:Id>[^<]*</tns:Id>", "");
        String normalizedExpected = expectedMessage
                .replaceAll("<tns:clientId>[^<]*</tns:clientId>", "<tns:clientId></tns:clientId>")
                .replaceAll("<tns:Id>[^<]*</tns:Id>", "");

        assertEquals("Отправленное сообщение не соответствует ожидаемому",
                     normalizedExpected.trim(),
                     normalizedActual.trim());
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
