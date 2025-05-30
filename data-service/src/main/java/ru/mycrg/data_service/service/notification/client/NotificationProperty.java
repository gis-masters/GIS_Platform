package ru.mycrg.data_service.service.notification.client;

public class NotificationProperty {

    /**
     * Название атрибута, для подключения в шаблоны.
     */
    private String name;

    /**
     * Тип, для формирования правильного типа сообщения. На данный момент STRING/FILE
     */
    private String type;

    /**
     * Само сообщение или путь к файлу.
     */
    private String value;

    // Конструктор
    public NotificationProperty(String name, String type, String value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }

    // Геттеры и сеттеры
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
