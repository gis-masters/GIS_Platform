package ru.mycrg.gis_service.dto;

import org.hibernate.validator.constraints.Length;
import ru.mycrg.gis_service.validators.CrgParentGroup;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

public class LayerUpdateDto {

    @Length(min = 2, max = 255)
    private String title;

    @NotBlank
    @Length(min = 2, max = 255)
    private String dataset;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля enabled: true или false")
    private String enabled;

    @Min(message = "Минимальное допустимое значение -1", value = -1)
    @Max(Integer.MAX_VALUE)
    private int position = -1;

    @Min(message = "Минимальное значение прозрачности 0", value = -1)
    @Max(message = "Максимальное значение прозрачности 100", value = 100)
    private int transparency = -1;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int minZoom;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int maxZoom;

    @CrgParentGroup
    private Long parentId;

    @NotBlank
    @Length(min = 6, max = 255)
    private String nativeCRS;

    public LayerUpdateDto() {
        //Required by framework
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDataset() {
        return this.dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public String getEnabled() {
        return this.enabled;
    }

    public void setEnabled(String enabled) {
        this.enabled = enabled;
    }

    public int getPosition() {
        return this.position;
    }

    public void setPosition(
            int position) {
        this.position = position;
    }

    public int getTransparency() {
        return this.transparency;
    }

    public void setTransparency(int transparency) {
        this.transparency = transparency;
    }

    public int getMinZoom() {
        return this.minZoom;
    }

    public void setMinZoom(
            int minZoom) {
        this.minZoom = minZoom;
    }

    public int getMaxZoom() {
        return this.maxZoom;
    }

    public void setMaxZoom(
            int maxZoom) {
        this.maxZoom = maxZoom;
    }

    public Long getParentId() {
        return this.parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getNativeCRS() {
        return this.nativeCRS;
    }

    public void setNativeCRS(String nativeCRS) {
        this.nativeCRS = nativeCRS;
    }
}
