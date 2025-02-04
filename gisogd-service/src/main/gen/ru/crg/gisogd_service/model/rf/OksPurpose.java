package ru.crg.gisogd_service.model.rf;

import lombok.Data;

/**
 * Model OksPurpose from classifiers rf.
 * @author Vladimir Nomokonov
 */
@Data
public class OksPurpose implements RfGuid {

    private String code;
    private String title;

}
