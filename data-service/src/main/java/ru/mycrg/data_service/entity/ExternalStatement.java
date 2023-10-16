package ru.mycrg.data_service.entity;

import ru.mycrg.data_service.dto.ExternalStatementDto;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static java.time.LocalDateTime.now;
import static java.util.Objects.nonNull;

@Entity
@Table(name = "external_statements", schema = "public")
public class ExternalStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 255)
    @Column(name = "statement_num")
    private String statementNum;

    @Column(name = "type")
    private String type;

    @Size(max = 50)
    @Column(name = "cad_num")
    private String cadNum;

    @Column(name = "applicant")
    private String applicant;

    @Column(name = "status")
    private String status;

    @Column(name = "statement_date")
    private LocalDate statementDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public ExternalStatement() {
        // Framework required
    }

    public ExternalStatement(String statementNum, String type, String cadNum, String applicant, String status,
                             String statementDateStr) {
        LocalDate statementDate = null;
        if (nonNull(statementDateStr) && !statementDateStr.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            statementDate = LocalDate.parse(statementDateStr, formatter);
        }

        this.statementNum = statementNum;
        this.type = type;
        this.cadNum = cadNum;
        this.applicant = applicant;
        this.status = status;
        this.statementDate = statementDate;
        this.createdAt = now();
    }

    public ExternalStatement(ExternalStatementDto statementDto) {
        this(statementDto.getStatementNum(), statementDto.getType(), statementDto.getCadNum(),
             statementDto.getApplicant(), statementDto.getStatus(), statementDto.getStatementDate());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatementNum() {
        return statementNum;
    }

    public void setStatementNum(String statementNum) {
        this.statementNum = statementNum;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCadNum() {
        return cadNum;
    }

    public void setCadNum(String cadNum) {
        this.cadNum = cadNum;
    }

    public String getApplicant() {
        return applicant;
    }

    public void setApplicant(String applicant) {
        this.applicant = applicant;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getStatementDate() {
        return statementDate;
    }

    public void setStatementDate(LocalDate statementDate) {
        this.statementDate = statementDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
