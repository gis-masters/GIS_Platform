package ru.mycrg.auth_service.service;

import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.Specialization;

import java.util.List;

@Service
public class SpecializationService {

    public List<Specialization> getAllSpecializations() {
        return List.of(
                new Specialization(1,
                                   "НТО",
                                   "Описание специализации НТО",
                                   List.of("НТО", "КПТ", "Инвентаризация недвижимости")),
                new Specialization(2,
                                   "Фотофиксация",
                                   "Описание специализации Фотофиксация",
                                   List.of("Фотофиксация")),
                new Specialization(3,
                                   "ГИСОГД",
                                   "Описание специализации ГИСОГД",
                                   List.of("Библиотека", "ГИСОГД", "Приказ 10", "Приказ 123", "Задачи",
                                           "Электронный архив"))
        );
    }
}
