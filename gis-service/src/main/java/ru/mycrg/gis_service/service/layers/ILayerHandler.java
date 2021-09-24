package ru.mycrg.gis_service.service.layers;

import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.http_client.exceptions.HttpClientException;

interface ILayerHandler {

    Layer create(Project project, LayerCreateDto layerDto) throws HttpClientException;

    String getType();
}
