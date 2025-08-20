package ru.mycrg.data_service.service.smev3;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.service.reestrs.Systems;

import java.util.Arrays;

public enum Mnemonic {
    GET_CADASTRIAL_PLAN_1_1_2(
            "get-cadastrial-plan",
            "1.1.2",
            Systems.FGIS_EGRN,
            "xsd_smev3/egrn_cadastrial_plans_1_1_2/core/service-adapter-types.xsd",
            "xsd_smev3/egrn_cadastrial_plans_1_1_2/egrn_cadastrial_plans_1_1_2.xsd",
            new NamespacePrefixMapper() {
                @Override
                public String getPreferredPrefix(String urn, String s1, boolean b) {
                    if ("urn://x-artefacts-rosreestr-gov-ru/virtual-services/egrn-statement/1.1.2".equals(urn)) {
                        return "req";
                    }
                    return "typ";
                }
            }),
    RECEIPT_RNS_1_0_9(
            "receipt-rns",
            "1.0.9",
            Systems.EIS_JS,
            "xsd_smev3/receipt_rns_1_0_9/core/service-adapter-types.xsd",
            "xsd_smev3/receipt_rns_1_0_9/receipt-rns-1.0.9.xsd",
            new NamespacePrefixMapper() {
                @Override
                public String getPreferredPrefix(String urn, String s1, boolean b) {
                    switch (urn) {
                        case "urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9":
                            return "tns";
                        case "urn://x-artefacts-uishc.domrf.ru/receipt-rns/commons/1.0.9":
                            return "com";
                        case "urn://x-artefacts-smev-gov-ru/supplementary/commons/1.3.0":
                            return "smev";
                        default:
                            return "typ";
                    }
                }
            }),
    REGISTER_RNS_1_0_10(
            "register-rns",
            "1.0.10",
            Systems.EIS_JS,
            "xsd_smev3/register_rns_1_0_10/core/service-adapter-types.xsd",
            "xsd_smev3/register_rns_1_0_10/register-rns-1.0.10.xsd",
            new NamespacePrefixMapper() {
                @Override
                public String getPreferredPrefix(String urn, String s1, boolean b) {
                    switch (urn) {
                        case "urn://x-artefacts-uishc.domrf.ru/register-rns/1.0.10":
                            return "tns";
                        case "urn://x-artefacts-uishc.domrf.ru/register-rns/commons/1.0.10":
                            return "com";
                        case "urn://x-artefacts-smev-gov-ru/supplementary/commons/1.3.0":
                            return "smev";
                        default:
                            return "typ";
                    }
                }
            }),
    RECEIPT_RNV_1_0_9(
            "receipt-rnv",
            "1.0.9",
            Systems.EIS_JS,
            "xsd_smev3/receipt_rnv_1_0_9/core/service-adapter-types.xsd",
            "xsd_smev3/receipt_rnv_1_0_9/receipt-rnv-1.0.9.xsd",
            new NamespacePrefixMapper() {
                @Override
                public String getPreferredPrefix(String urn, String s1, boolean b) {
                    switch (urn) {
                        case "urn://x-artefacts-uishc.domrf.ru/receipt-rnv/1.0.9":
                            return "tns";
                        case "urn://x-artefacts-uishc.domrf.ru/receipt-rnv/commons/1.0.9":
                            return "com";
                        case "urn://x-artefacts-smev-gov-ru/supplementary/commons/1.3.0":
                            return "smev";
                        default:
                            return "typ";
                    }
                }
            }),
    REGISTER_RNV_1_0_8(
            "register-rnv",
            "1.0.8",
            Systems.EIS_JS,
            "xsd_smev3/register_rnv_1_0_8/core/service-adapter-types.xsd",
            "xsd_smev3/register_rnv_1_0_8/register-rnv-1.0.8.xsd",
            new NamespacePrefixMapper() {
                @Override
                public String getPreferredPrefix(String urn, String s1, boolean b) {
                    switch (urn) {
                        case "urn://x-artefacts-uishc.domrf.ru/register-rnv/1.0.8":
                            return "tns";
                        case "urn://x-artefacts-uishc.domrf.ru/register-rnv/commons/1.0.8":
                            return "com";
                        case "urn://x-artefacts-smev-gov-ru/supplementary/commons/1.3.0":
                            return "smev";
                        default:
                            return "typ";
                    }
                }
            }),
    TERMINATE_RNS_1_0_6(
            "terminate-rns",
            "1.0.6",
            Systems.EIS_JS,
            "xsd_smev3/terminate_rns_1_0_6/core/service-adapter-types.xsd",
            "xsd_smev3/terminate_rns_1_0_6/terminate-rns-1.0.6.xsd",
            new NamespacePrefixMapper() {
                @Override
                public String getPreferredPrefix(String urn, String s1, boolean b) {
                    switch (urn) {
                        case "urn://x-artefacts-uishc.domrf.ru/terminate-rns/1.0.6":
                            return "tns";
                        case "urn://x-artefacts-uishc.domrf.ru/terminate-rns/commons/1.0.6":
                            return "com";
                        case "urn://x-artefacts-smev-gov-ru/supplementary/commons/1.3.0":
                            return "smev";
                        default:
                            return "typ";
                    }
                }
            });
    private final String mnemonic;
    private final String version;
    private final String system;
    private final String schemaPath;
    private final String rootSchemaPath;
    private final NamespacePrefixMapper prefixMapper;

    public String getMnemonic() {
        return mnemonic;
    }

    public String getVersion() {
        return version;
    }

    public String getSystem() {
        return system;
    }

    public String getSchemaPath() {
        return schemaPath;
    }

    public String getRootSchemaPath() {
        return rootSchemaPath;
    }

    public NamespacePrefixMapper getPrefixMapper() {
        return prefixMapper;
    }

    Mnemonic(String mnemonic,
             String version,
             String system,
             String rootSchemaPath,
             String schemaPath,
             NamespacePrefixMapper namespacePrefixMapper) {
        this.mnemonic = mnemonic;
        this.version = version;
        this.system = system;
        this.rootSchemaPath = rootSchemaPath;
        this.schemaPath = schemaPath;
        this.prefixMapper = namespacePrefixMapper;
    }

    @Nullable
    public static Mnemonic fromStringPair(@NotNull String mnemonic, String version) {
        return Arrays.stream(Mnemonic.values())
                .filter(enm -> enm.mnemonic.equals(mnemonic) && enm.version.equals(version))
                .findFirst()
                .orElse(null);
    }
}
