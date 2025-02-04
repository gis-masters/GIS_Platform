package ru.mycrg.data_service.entity;

import ru.mycrg.data_service.dto.AisUmsDto;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;

@Entity
@Table(name = "ais_ums", schema = "public")
public class AisUms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 255)
    @Column(name = "name")
    private String name;

    @Size(max = 50)
    @Column(name = "cad_num")
    private String cadNum;

    @Size(max = 50)
    @Column(name = "reg_num")
    private String regNum;

    @Size(max = 50)
    @Column(name = "property_type")
    private String propertyType;

    @Size(max = 255)
    @Column(name = "department_name")
    private String departmentName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public AisUms() {
        // Framework required
    }

    public AisUms(String name,
                  String cadNum,
                  String regNum,
                  String propertyType,
                  String departmentName) {
        this.name = name;
        this.cadNum = cadNum;
        this.regNum = regNum;
        this.propertyType = propertyType;
        this.departmentName = departmentName;

        this.createdAt = now();
    }

    public AisUms(AisUmsDto aisUmsDto) {
        this(aisUmsDto.getName(), aisUmsDto.getCadNum(), aisUmsDto.getRegNum(), aisUmsDto.getPropertyType(),
             aisUmsDto.getDepartmentName());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCadNum() {
        return cadNum;
    }

    public void setCadNum(String cadNum) {
        this.cadNum = cadNum;
    }

    public String getRegNum() {
        return regNum;
    }

    public void setRegNum(String regNum) {
        this.regNum = regNum;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
