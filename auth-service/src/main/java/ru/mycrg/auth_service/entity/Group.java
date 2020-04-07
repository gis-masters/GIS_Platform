package ru.mycrg.auth_service.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private Long id;

    @Column
    private String name;

    @Column
    private String description;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "groups_users",
            joinColumns = {@JoinColumn(name = "group_id")},
            inverseJoinColumns = {@JoinColumn(name = "user_id")}
    )
    private Set<User> users = new HashSet<>();

    @ManyToOne
    private Organization organization;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate LocalDateTime lastModified = LocalDateTime.now();

    public void addUser(User user) {
        this.users.add(user);
    }

    public void removeUser(Long id) {
        this.users.stream()
                .filter(user -> id.equals(user.getId()))
                .findFirst()
                .ifPresent(u -> this.users.remove(u));
    }

}
