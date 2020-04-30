package ru.mycrg.data_service.dto;

import lombok.Data;

@Data
public class TableDto {

    private String name;
    private boolean isValid;
    private String permission;

    public TableDto(String tableName) {
        this.name = tableName;
        this.isValid = true;
    }
}
