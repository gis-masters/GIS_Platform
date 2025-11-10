package ru.mycrg.data_service_contract.enums;

import java.io.Serializable;

public enum Updateability implements Serializable {
    CREATE_ONLY,
    CREATE_WRITE,
    READ_ONLY
}
