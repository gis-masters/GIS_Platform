package ru.mycrg.data_service.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "base_maps")
public class BaseMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "serial")
    private long id;

    @Column
    private String name;

    @Column
    private String title;

    @Column
    private String thumbnailUrn;

    @Column(length = 20)
    private String type;

    @Column
    private String url;

    @Column
    private String layerName;

    @Column(length = 50)
    private String style;

    @Column(length = 20)
    private String projection;

    @Column(length = 20)
    private String format;

    @Column
    private Integer size;

    @Column
    private Integer resolution;

    @Column
    private Integer matrixIds;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_modified")
    private @LastModifiedDate
    LocalDateTime lastModified = LocalDateTime.now();

}
