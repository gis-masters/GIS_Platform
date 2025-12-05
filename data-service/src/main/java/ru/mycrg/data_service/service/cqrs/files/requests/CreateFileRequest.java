package ru.mycrg.data_service.service.cqrs.files.requests;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.mediator.IRequest;

import java.util.List;

public class CreateFileRequest implements IRequest<List<FileResponse>> {

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
