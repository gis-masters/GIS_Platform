package ru.mycrg.data_service_contract.dto;

import java.util.List;
import java.util.Map;

public class FollowUpAction {

    // TelegramNotificator
    private String type;

    // Тут технические параметры для формулы конкретного типа.
    // Например, для TelegramNotificator тут может быть записан: id чата куда отправлять
    private Map<String, Object> settings;

    // [name = 'mark'] / [area > 500_000] / [status != 'NEW']
    // функция на языке JS которая возвращает true/false
    private String triggerAsJsFunction;

    // Список полей, данные которых нужно отправить: ['file']
    private List<String> payload;

    public FollowUpAction() {
        // Required
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Map<String, Object> getSettings() {
        return settings;
    }

    public void setSettings(Map<String, Object> settings) {
        this.settings = settings;
    }

    public String getTriggerAsJsFunction() {
        return triggerAsJsFunction;
    }

    public void setTriggerAsJsFunction(String triggerAsJsFunction) {
        this.triggerAsJsFunction = triggerAsJsFunction;
    }

    public List<String> getPayload() {
        return payload;
    }

    public void setPayload(List<String> payload) {
        this.payload = payload;
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"settings\":" + (settings == null ? "null" : "\"" + settings + "\"") + ", " +
                "\"triggerAsJsFunction\":" + (triggerAsJsFunction == null ? "null" : "\"" + triggerAsJsFunction + "\"") + ", " +
                "\"payload\":" + (payload == null ? "null" : payload.toString()) +
                "}";
    }
}
