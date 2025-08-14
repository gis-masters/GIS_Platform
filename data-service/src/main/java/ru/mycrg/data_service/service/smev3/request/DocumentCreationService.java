package ru.mycrg.data_service.service.smev3.request;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.accept_rns_1_0_3.RequestType;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.smev3.request.accept_gpzu.IGpzuRequestDocumentCreator;
import ru.mycrg.data_service.service.smev3.request.accept_rns.IRnsRequestDocumentCreator;
import ru.mycrg.data_service.service.smev3.request.accept_rnv.IRnvRequestDocumentCreator;

import java.util.List;

@Service
public class DocumentCreationService {

    private final List<IRnsRequestDocumentCreator> rnsCreators;
    private final List<IRnvRequestDocumentCreator> rnvCreators;
    private final List<IGpzuRequestDocumentCreator> gpzuCreators;

    public DocumentCreationService(List<IRnsRequestDocumentCreator> rnsCreators,
                                   List<IRnvRequestDocumentCreator> rnvCreators,
                                   List<IGpzuRequestDocumentCreator> gpzuCreators) {
        this.rnsCreators = rnsCreators;
        this.rnvCreators = rnvCreators;
        this.gpzuCreators = gpzuCreators;
    }

    public XWPFDocument createRnsDoc(RequestType request) {
        return rnsCreators.stream()
                          .filter(creator -> creator.getGoal() == request.getGoal())
                          .findFirst()
                          .orElseThrow(() -> new BadRequestException("Неизвестный goal: " + request.getGoal()))
                          .create(request);
    }

    public XWPFDocument createRnvDoc(ru.mycrg.data_service.accept_rnv_1_0_6.RequestType request) {
        return rnvCreators.stream()
                          .filter(creator -> creator.getGoal() == request.getGoal() ||
                                  request.getGoal() == 2 && creator.getGoal() == 1)
                          .findFirst()
                          .orElseThrow(() -> new BadRequestException("Неизвестный goal: " + request.getGoal()))
                          .create(request);
    }

    public XWPFDocument createGpzuDoc(ru.mycrg.data_service.gpzu_1_0_1.RequestType request) {
        return gpzuCreators.stream()
                           .filter(creator -> String.valueOf(creator.getGoal()).equals(request.getGoal()))
                           .findFirst()
                           .orElseThrow(() -> new BadRequestException("Неизвестный goal: " + request.getGoal()))
                           .create(request);
    }
}
