package ru.mycrg.data_service.dto.smev3;

import java.util.Base64;

import static java.util.Optional.ofNullable;

public interface ISmevRequestDto {

    /**
     * Отправлять ли сообщение в СМЭВ или остановить на генерации запроса?
     */
    Boolean isSendToSmev();

    /**
     * Тестовый ответный пакет для отладки
     */
    String getStubSmevResponse();

    default boolean isStubResponse() {
        return getStubSmevResponse() != null;
    }

    default String getStubSmevResponseAsXml() {
        return ofNullable(getStubSmevResponse())
                .map(s -> Base64.getDecoder().decode(s))
                .map(String::new)
                .orElse(null);
    }
}
