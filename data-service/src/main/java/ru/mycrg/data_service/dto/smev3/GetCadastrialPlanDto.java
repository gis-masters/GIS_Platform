package ru.mycrg.data_service.dto.smev3;

public class GetCadastrialPlanDto implements ISmevRequestDto {
    private String archiveFilename;

    public String getArchiveFilename() {
        return archiveFilename;
    }

    public GetCadastrialPlanDto setArchiveFilename(String archiveFilename) {
        this.archiveFilename = archiveFilename;
        return this;
    }

    //todo заглушка
    @Override
    public Boolean sendToSmev() {
        return true;
    }
}
