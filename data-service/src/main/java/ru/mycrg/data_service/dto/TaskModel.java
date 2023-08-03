package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TaskModel {

    private String documentType;

    public TaskModel(Map<String, Object> task) {

    }
}
