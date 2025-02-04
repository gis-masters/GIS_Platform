package ru.mycrg.data_service.dto.smev3;

public class GetCadastrialPlanDto implements ISmevRequestDto {

    private String archiveFilename;
    private String clientId;

    public String getArchiveFilename() {
        return archiveFilename;
    }

    public void setArchiveFilename(String archiveFilename) {
        this.archiveFilename = archiveFilename;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }
}
