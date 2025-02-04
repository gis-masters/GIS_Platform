package ru.mycrg.data_service.service.processes;

import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service_contract.dto.ProcessModel;

public interface IExecutor<T> {

    /**
     * Основной метод.
     *
     * @return Результат (часто в виде отчета о проделанной работе).
     *
     * @throws ru.mycrg.data_service.exceptions.DataServiceException в общем случае
     */
    T execute();

    /**
     * Инициализация, добавляем данные по процессу в котором это будет выполняться.
     *
     * @param payload Переданные данные, необходимые для выполнения задачи.
     *
     * @return IExecutor для удобства (построения "цепочки").
     *
     * @throws BadRequestException Если не смогли "понять" переданные данные.
     */
    IExecutor<T> initialize(Object payload);

    /**
     * Предварительная валидация поступивших данных.
     * <p>
     * Встроена в процесс и выполняется фабрикой после выбора подходящего executor-а и вызова метода initialize.
     *
     * @return IExecutor для удобства (построения "цепочки").
     *
     * @throws BadRequestException Валидация по бизнес правилам.
     */
    IExecutor<T> validate();

    /**
     * В случае неудачи, отчет должен быть доступен тут.
     *
     * @return Отчет о процессе
     */
    T getReport();

    /**
     * Добавляем в executor пришедшие данные.
     *
     * @param processModel Данные о процессе.
     *
     * @return IExecutor для удобства (построения "цепочки").
     *
     * @throws BadRequestException Если не смогли "понять" переданные данные.
     */
    IExecutor<T> setPayload(ProcessModel processModel);

    FilePlacementPayloadModel getPayload();

    /**
     * Detached процесс - это процесс, который будет завершен позже, например после прихода сообщения из очереди.
     */
    default boolean notDetached() {
        return true;
    }
}
