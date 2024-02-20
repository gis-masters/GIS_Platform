package ru.mycrg.data_service.dto.smev3;

public class GetCadastrialPlanDto implements ISmevRequestDto {
    private String cadastrialNumber;
    private String clientId;

    public String getCadastrialNumber() {
        return cadastrialNumber;
    }

    public void setCadastrialNumber(String cadastrialNumber) {
        this.cadastrialNumber = cadastrialNumber;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    //todo заглушка
    @Override
    public Boolean sendToSmev() {
        return true;
    }
}
