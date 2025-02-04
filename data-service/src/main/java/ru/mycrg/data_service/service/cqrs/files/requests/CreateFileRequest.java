package ru.mycrg.data_service.service.cqrs.files.requests;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dto.FileProjection;
import ru.mycrg.mediator.IRequest;

import java.util.List;

public class CreateFileRequest implements IRequest<List<FileProjection>> {

    private final MultipartFile[] files;

    public CreateFileRequest(MultipartFile[] files) {
        this.files = files;
    }

    public MultipartFile[] getFiles() {
        return files;
    }

    @Override
    public String getType() {
        return CreateFileRequest.class.getSimpleName();
    }
}
