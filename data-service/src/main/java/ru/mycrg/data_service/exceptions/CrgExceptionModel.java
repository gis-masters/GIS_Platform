package ru.mycrg.data_service.exceptions;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CrgExceptionModel {

    private String timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

}
