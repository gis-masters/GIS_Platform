package ru.mycrg.data_service.service.processes;

import ru.mycrg.data_service.dto.ProcessDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service_contract.enums.ProcessType;

import javax.validation.constraints.NotNull;

public interface IProcessExecutorsFactory {

    /**
     * Фабрика, по содержимому payload определит и вернет исполнителя процесса.
     *
     * @param payload Данные процесса.
     *
     * @throws BadRequestException В случае если не найден исполнитель.
     */
    @NotNull
    IExecutor<?> getExecutor(ProcessDto payload);

    ProcessType getType();
}
