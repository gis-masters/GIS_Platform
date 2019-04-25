package ru.mycrg.common.enums;

public enum ProcessStatus {
    PENDING,    // В процессе
    DONE,       // Процесс полностью завершен
    SUB_DONE,   // Завершена часть процесса (например: обработан один ресур из нескольких)
    ERROR,
    EMPTY,      // Предпологалось использовать чтобы показывать что таблица пуста
}
