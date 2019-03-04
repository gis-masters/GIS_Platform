package ru.mycrg.common.enums;

public enum ProcessStatus {
    PENDING,// В процессе
    DONE,   // Валидация закончена
    ERROR,  // Ошибка при валидации
    EMPTY,  // Нечего валидировать
}
