package ru.mycrg.schemas;

import java.util.ArrayList;
import java.util.List;

public class EntityDescriptionResponseModel {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private List<IEntityProperty> properties = new ArrayList<>();
    private String customRuleFunction = "";
    private String calcFiledFunction = "";
    private String originName;
    private String type;
    private boolean readOnly;
    private GeometryType geometryType;
    private List<ContentType> contentTypes = new ArrayList<>();

}
