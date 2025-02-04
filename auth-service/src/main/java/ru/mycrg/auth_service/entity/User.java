package ru.mycrg.auth_service.entity;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN;

@Entity
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = {"login"})})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column
    private String login;

    @Column(name = "geoserver_login")
    private String geoserverLogin;

    @Column
    private String password;

    @Column
    private boolean enabled = true;

    @Column
    private String name;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "sur_name")
    private String surname;

    @Column
    private String job;

    @Column
    private String phone;

    @Column(length = 60)
    private String email;

    @Column
    private String department;

    @Column(name = "boss_id")
    private Integer bossId;

    @Column
    private Short version;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = true)
    private Set<Authorities> authorities = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "organizations_users",
            joinColumns = {@JoinColumn(name = "users_id")},
            inverseJoinColumns = {@JoinColumn(name = "organization_id")}
    )
    private Set<Organization> organizations = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "groups_users",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "group_id")}
    )
    private Set<Group> groups = new HashSet<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    public User() {
        // Required by framework
    }

    public User(String password, String name, String surname, String email, String middleName, String job,
                String phone, Integer bossId) {
        this.password = password;
        this.enabled = false;
        this.name = name;
        this.middleName = middleName;
        this.surname = surname;
        this.job = job;
        this.phone = phone;
        this.email = email;
        this.createdAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
        this.bossId = bossId;
    }

    public User(String password, String name, String middleName, String surname, String job, String phone) {
        this.password = password;
        this.name = name;
        this.middleName = middleName;
        this.surname = surname;
        this.job = job;
        this.phone = phone;
    }

    public boolean isOwner() {
        return authorities.stream()
                          .map(Authorities::getAuthority)
                          .collect(Collectors.toList())
                          .contains(ORG_ADMIN);
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Set<Authorities> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<Authorities> authorities) {
        this.authorities = authorities;
    }

    public void addAuthority(@NotNull String authority) {
        this.authorities.add(new Authorities(authority.toUpperCase(), this));
    }

    public void removeAuthority(String authority) {
        this.authorities.stream()
                        .filter(item -> authority.equalsIgnoreCase(item.getAuthority()))
                        .findFirst()
                        .ifPresent(item -> this.authorities.remove(item));
    }

    public Set<Organization> getOrganizations() {
        return organizations;
    }

    public void setOrganizations(Set<Organization> organizations) {
        this.organizations = organizations;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Group> getGroups() {
        return groups;
    }

    public void setGroups(Set<Group> groups) {
        this.groups = groups;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getGeoserverLogin() {
        return geoserverLogin;
    }

    public void setGeoserverLogin(String geoserverLogin) {
        this.geoserverLogin = geoserverLogin;
    }

    public Integer getBossId() {
        return bossId;
    }

    public void setBossId(Integer bossId) {
        this.bossId = bossId;
    }

    public Short getVersion() {
        return version;
    }

    public void setVersion(Short version) {
        this.version = version;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
