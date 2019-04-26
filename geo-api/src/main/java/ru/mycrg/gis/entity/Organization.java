package ru.mycrg.gis.entity;

import ru.mycrg.gis.enums.EntityStatus;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "organization")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String name;

    @Column
    private String phone;

    @OneToMany(cascade = CascadeType.REMOVE)
    private List<User> users = new ArrayList<>();

    @OneToMany(cascade = CascadeType.REMOVE)
    private List<Project> projects = new ArrayList<>();

    @Enumerated(value = EnumType.STRING)
    private EntityStatus status = EntityStatus.NEW;

    public Organization() {}

    public Organization(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    public void addUser(User user) {
        this.users.add(user);
    }

    public void addProject(Project project) {
        this.projects.add(project);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public EntityStatus getStatus() {
        return status;
    }

    public void setStatus(EntityStatus status) {
        this.status = status;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }
}
