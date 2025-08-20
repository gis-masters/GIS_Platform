package ru.mycrg.gis_service.dto;

import org.hibernate.validator.constraints.Length;
import ru.mycrg.gis_service.validators.CrgParentGroup;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;

public class LayerUpdateDto {

    @Length(min = 2, max = 255)
    private String title;

    @Length(min = 2, max = 255)
    private String dataset;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля enabled: true или false")
    private String enabled;

    @Max(Integer.MAX_VALUE)
    private int position = -1;

    @Min(message = "Минимальное значение прозрачности 5", value = 5)
    @Max(message = "Максимальное значение прозрачности 100", value = 100)
    private int transparency = 75;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int minZoom;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int maxZoom;

    @CrgParentGroup
    private Long parentId;

    @Length(min = 6, max = 255)
    private String nativeCRS;

    @Length(max = 50)
    private String contentType;

    private String view;

    private String errorText;

    @Length(min = 1, max = 255)
    private String styleName;

    private String style;

    private String photoMode;

    public LayerUpdateDto() {
        // Required by framework
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

    public void setPosition(int position) {
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

    public void setMinZoom(int minZoom) {
        this.minZoom = minZoom;
    }

    public int getMaxZoom() {
        return this.maxZoom;
    }

    public void setMaxZoom(int maxZoom) {
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

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public String getView() {
        return view;
    }

    public void setView(String view) {
        this.view = view;
    }

    public String getErrorText() {
        return errorText;
    }

    public void setErrorText(String errorText) {
        this.errorText = errorText;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getPhotoMode() {
        return photoMode;
    }

    public void setPhotoMode(String photoMode) {
        this.photoMode = photoMode;
    }
}
