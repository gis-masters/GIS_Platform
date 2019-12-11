package ru.mycrg.gis.entity;

import ru.mycrg.common.enums.ProcessStatus;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String name;

    @Column
    private String phone;

    @Enumerated(value = EnumType.STRING)
    private ProcessStatus status = ProcessStatus.PENDING;

    @OneToMany(cascade = CascadeType.ALL)
    private List<User> users = new ArrayList<>();

    public Organization() {}

    public Organization(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    public void addUser(User user) {
        users.add(user);
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

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

}
