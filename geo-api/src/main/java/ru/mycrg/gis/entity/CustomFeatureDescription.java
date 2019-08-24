package ru.mycrg.gis.entity;

import org.hibernate.annotations.Type;

import javax.persistence.*;

@Entity
@Table(name = "custom_rules")
public class CustomFeatureDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column(name = "group_")
    private String group;

    @Column
    private String groupAlias;

    @Column
    private String className;

    @Column
    @Type(type="text")
    private String classRule;

    @Column
    @Type(type="text")
    private String calculatedFields;

    public CustomFeatureDescription() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getGroupAlias() {
        return groupAlias;
    }

    public void setGroupAlias(String groupAlias) {
        this.groupAlias = groupAlias;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getClassRule() {
        return classRule;
    }

    public void setClassRule(String classRule) {
        this.classRule = classRule;
    }

    public String getCalculatedFields() {
        return calculatedFields;
    }

    public void setCalculatedFields(String calculatedFields) {
        this.calculatedFields = calculatedFields;
    }
}
