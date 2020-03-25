package ru.mycrg.data_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TileGrid {

    /**
     * Количество рядов плитки и столбцов сетки для каждого уровня масштабирования.
     */
    private int size;

    /**
     * Индекс массива каждого разрешения должен соответствовать уровню масштабирования.
     */
    private int resolution;

    /**
     * Идентификаторы матрицы. Этого число должна соответствовать длине resolutions массива.
     */
    private int matrixIds;

}
