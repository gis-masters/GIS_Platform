package ru.mycrg.auth_service.entity;

import javax.persistence.*;

@Entity
public class Authorities {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column(name = "authority")
    private String authority;

    @ManyToOne
    private User user;

    public Authorities() {}

    public Authorities(String authority, User user) {
        this.authority = authority;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthority() {
        return authority;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
