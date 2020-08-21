package ru.mycrg.mq_queue_contract.enums;

// Править в соответствии с: portal-ui/src/app/services/crg/crg-models.ts
public enum ProcessStatus {
    PENDING,    // В процессе

    TASK_DONE,   // Завершена часть процесса (например: обработан один ресур из нескольких)
    TASK_ERROR,  // Часть процесса завершилась неудачно

    DONE,       // Процесс полностью завершен
    ERROR,      // Процесс завершен некорректно
}
