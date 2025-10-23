package ru.mycrg.common_contracts.generated.gpkg;

import java.io.Serializable;

public class MessageFromExport implements Serializable {

    private String message;

    public MessageFromExport() {
        //requared
    }

    public MessageFromExport(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
