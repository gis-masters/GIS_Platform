package ru.mycrg.common.enums;

public enum ProcessStatus {
    PENDING,    // В процессе

    SUB_DONE,   // Завершена часть процесса (например: обработан один ресур из нескольких)
    SUB_ERROR,  // Часть процесса завершилась неудачно

    DONE,       // Процесс полностью завершен
    ERROR,      // Процесс завершен некорректно
}
