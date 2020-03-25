package ru.mycrg.data_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WMTSBaseMapDto implements IBaseMap {

    private long id;
    private String name;
    private String title;
    private String thumbnail;

    private WMTSSource source;
    private TileGrid tileGrid;

}
