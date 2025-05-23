package ru.mycrg.data_service.service.aop;

import ru.mycrg.data_service_contract.dto.FollowUpAction;
import ru.mycrg.data_service_contract.dto.SchemaDto;

public interface IFollowUpActionHandler {

    String getType();

    void doAction(FollowUpAction followUpAction,
                  Object payload,
                  SchemaDto schema);
}
