package ru.mycrg.data_service.service.smev3.request.accept_rns;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.accept_rns_1_0_3.RequestType;
import ru.mycrg.data_service.exceptions.BadRequestException;

import java.util.List;

@Service
public class DocumentCreationService {

    private final List<IRnsRequestDocumentCreator> creators;

    public DocumentCreationService(List<IRnsRequestDocumentCreator> creators) {
        this.creators = creators;
    }

    public XWPFDocument createDoc(RequestType request) {
        return creators.stream()
                       .filter(creator -> creator.getGoal() == request.getGoal())
                       .findFirst()
                       .orElseThrow(() -> new BadRequestException("Неизвестный goal: " + request.getGoal()))
                       .create(request);
    }
}
