package ru.mycrg.gis_service.mappers;

import ru.mycrg.gis_service.dto.LayerUpdateDto;
import ru.mycrg.gis_service.entity.Layer;

class LayerMapperImpl implements LayerMapper {

    @Override
    public Layer toEntity(LayerUpdateDto updateDto) {
        Layer layer = new Layer();
        update(layer, updateDto);

        return layer;
    }

    @Override
    public LayerUpdateDto toDto(Layer layer) {
        LayerUpdateDto dto = new LayerUpdateDto();
        dto.setTitle(layer.getTitle());
        dto.setDataset(layer.getDataset());
        dto.setEnabled(Boolean.toString(layer.isEnabled()));
        dto.setPosition(layer.getPosition());
        dto.setTransparency(layer.getTransparency());
        dto.setMinZoom(layer.getMinZoom());
        dto.setMaxZoom(layer.getMaxZoom());
        dto.setParentId(layer.getParent() == null ? null : layer.getParent().getId());
        dto.setNativeCRS(layer.getNativeCRS());
        dto.setContentType(layer.getContentType());
        dto.setView(layer.getView());
        dto.setErrorText(layer.getErrorText());
        dto.setStyleName(layer.getStyleName());
        dto.setStyle(layer.getStyle());
        dto.setPhotoMode(layer.getPhotoMode());

        return dto;
    }

    @Override
    public void update(Layer layer, LayerUpdateDto updateDto) {
        layer.setTitle(updateDto.getTitle());
        layer.setDataset(updateDto.getDataset());
        if (updateDto.getEnabled() != null) {
            layer.setEnabled(Boolean.parseBoolean(updateDto.getEnabled()));
        }
        layer.setPosition(updateDto.getPosition());
        layer.setTransparency(updateDto.getTransparency());
        layer.setMinZoom(updateDto.getMinZoom());
        layer.setMaxZoom(updateDto.getMaxZoom());
        layer.setNativeCRS(updateDto.getNativeCRS());
        layer.setContentType(updateDto.getContentType());
        layer.setView(updateDto.getView());
        layer.setErrorText(updateDto.getErrorText());
        layer.setStyleName(updateDto.getStyleName());
        layer.setStyle(updateDto.getStyle());
        layer.setPhotoMode(updateDto.getPhotoMode());
    }
}
