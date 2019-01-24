package ru.mycrg.wrapper.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;

public class MqOrganizationInit implements Serializable {

    private Long id;
    private String rawPassword;
    private String comment;

    public MqOrganizationInit(@JsonProperty("id") long id,
                              @JsonProperty("rawPassword") String rawPassword) {
        this.id = id;
        this.rawPassword = rawPassword;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRawPassword() {
        return rawPassword;
    }

    public void setRawPassword(String rawPassword) {
        this.rawPassword = rawPassword;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public String toString() {
        return "MqOrganizationInit{" +
                "id=" + id +
                ", rawPassword.length='" + rawPassword.length() + '\'' +
                ", comment='" + comment + '\'' +
                '}';
    }
}
