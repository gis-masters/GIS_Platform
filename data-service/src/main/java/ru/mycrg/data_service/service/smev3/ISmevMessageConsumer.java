package ru.mycrg.data_service.service.smev3;

import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;

public interface ISmevMessageConsumer {
    String consumerId();

    ProcessAdapterMessageResult processAdapterMessage(String messageBody);
}
