package ru.mycrg.data_service.repository;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import ru.mycrg.data_service.entity.File;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RepositoryRestResource(exported = false)
public interface FileRepository extends PagingAndSortingRepository<File, UUID> {

    @Modifying
    @Query("UPDATE File f SET f.resourceType = :type, f.resourceQualifier = :qualifier WHERE f.id IN :fileIds")
    @RestResource(exported = false)
    void setQualifier(@Param("type") String type,
                      @Param("qualifier") JsonNode qualifier,
                      @Param("fileIds") Set<UUID> fileIds);

    @Modifying
    @Query("UPDATE File f SET f.path = :path WHERE f.id =:fileId")
    @RestResource(exported = false)
    void setPathById(@Param("path") String path,
                     @Param("fileId") UUID fileId);

    @Query("FROM File f WHERE f.path LIKE %:path% AND LOWER(f.title) IN :titles")
    @RestResource(exported = false)
    List<File> sameByPathAndIdenticalByTitle(@Param("path") String path, @Param("titles") Set<String> titles);

    @Query("FROM File f WHERE f.path LIKE :path% AND LOWER(f.title) LIKE :title% AND LOWER(f.extension) IN :extensions")
    @RestResource(exported = false)
    List<File> oneGroupFiles(@Param("path") String path,
                             @Param("title") String title,
                             @Param("extensions") Set<String> extensions);

    List<File> findAllByIdIn(Set<UUID> fileIds);
}
