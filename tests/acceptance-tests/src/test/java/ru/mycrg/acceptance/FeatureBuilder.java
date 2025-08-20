package ru.mycrg.acceptance;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.geo_json.LngLatAlt;
import ru.mycrg.geo_json.MultiPolygon;
import ru.mycrg.geo_json.Polygon;

import java.util.ArrayList;
import java.util.List;

public class FeatureBuilder {

    public static final String DATA_KEY = "тестовые данные";

    public static List<Feature> prepareFeatures(String dataTemplate) {
        List<Feature> features = new ArrayList<>();

        Feature feature1, feature2;

        switch (dataTemplate) {
            case "данные для множественного копирования":
                Feature featureF = getFeature_F();
                featureF.setProperty("field_3", "1");
                featureF.setProperty("field_4", "1");

                Feature featureI = getFeature_I();
                featureI.setProperty("field_3", "2");
                featureI.setProperty("field_4", "20");

                Feature featureZ = getFeature_Z();
                featureZ.setProperty("field_3", "3");
                featureZ.setProperty("field_4", "30");

                features.add(featureF);
                features.add(featureI);
                features.add(featureZ);

                break;
            case "исключение hidden полей при полнотекстовом поиске":
                feature1 = getFeature_F();
                feature1.setProperty("field_1", "с. Золотое поле, ул. Ленина, д. 71");
                feature1.setProperty("field_2", "с. Золотая балка, ул. Пушкина, д. 99");

                feature2 = getFeature_I();
                feature2.setProperty("field_1", "с. Льговсоке, ул. Долгоруковская, д. 22");
                feature2.setProperty("field_2", "с. Золотое поле, ул. Комарова, д. 71");

                features.add(feature1);
                features.add(feature2);

                break;
            case "данные для тестирования FTS":
                feature1 = getFeature_F();
                feature1.setProperty("field_1", "с. Золотое поле, ул. Ленина, д. 71");
                feature1.setProperty("field_2", "с. Золотая балка, ул. Пушкина, д. 99");

                feature2 = getFeature_I();
                feature2.setProperty("field_1", "с. Льговсоке, ул. Долгоруковская, д. 22");
                feature2.setProperty("field_2", "с. Золотое поле, ул. Пограничников, д. 71");

                features.add(feature1);
                features.add(feature2);

                break;
            default:
                int count = Integer.parseInt(dataTemplate.split(DATA_KEY)[1].trim());
                if (count > 0) {
                    for (int i = 0; i < count; i++) {
                        features.add(getFeature_I());
                    }
                }
        }

        return features;
    }

    @NotNull
    private static Feature getFeature_F() {
        List<LngLatAlt> line = new ArrayList<>();
        line.add(new LngLatAlt(6_657_047.4063, 4_999_784.2722));
        line.add(new LngLatAlt(6_657_013.8497, 4_999_783.7166));
        line.add(new LngLatAlt(6_657_013.8603, 4_999_727.9532));
        line.add(new LngLatAlt(6_657_023.1343, 4_999_728.182));
        line.add(new LngLatAlt(6_657_022.8372, 4_999_751.2962));
        line.add(new LngLatAlt(6_657_041.3919, 4_999_751.4818));
        line.add(new LngLatAlt(6_657_041.1438, 4_999_761.5403));
        line.add(new LngLatAlt(6_657_023.148, 4_999_760.8245));
        line.add(new LngLatAlt(6_657_023.9173, 4_999_773.9003));
        line.add(new LngLatAlt(6_657_047.1022, 4_999_774.4721));
        line.add(new LngLatAlt(6_657_047.4063, 4_999_784.2722));

        Feature feature = new Feature();
        feature.setGeometry(new MultiPolygon(new Polygon(line)));

        return feature;
    }

    @NotNull
    private static Feature getFeature_I() {
        List<LngLatAlt> line = new ArrayList<>();
        line.add(new LngLatAlt(6_657_058.3102, 4_999_784.8132));
        line.add(new LngLatAlt(6_657_069.4935, 4_999_785.0891));
        line.add(new LngLatAlt(6_657_066.2984, 4_999_726.5265));
        line.add(new LngLatAlt(6_657_059.1796, 4_999_727.4389));
        line.add(new LngLatAlt(6_657_058.3102, 4_999_784.8132));

        Feature feature = new Feature();
        feature.setGeometry(new MultiPolygon(new Polygon(line)));

        return feature;
    }

    @NotNull
    private static Feature getFeature_Z() {
        List<LngLatAlt> line = new ArrayList<>();
        line.add(new LngLatAlt(6_657_080.1447, 4_999_784.8079));
        line.add(new LngLatAlt(6_657_116.9745, 4_999_785.4446));
        line.add(new LngLatAlt(6_657_119.3981, 4_999_775.7118));
        line.add(new LngLatAlt(6_657_086.7804, 4_999_737.0965));
        line.add(new LngLatAlt(6_657_120.0176, 4_999_739.5487));
        line.add(new LngLatAlt(6_657_116.9792, 4_999_729.9531));
        line.add(new LngLatAlt(6_657_076.3706, 4_999_727.591));
        line.add(new LngLatAlt(6_657_076.6076, 4_999_740.1097));
        line.add(new LngLatAlt(6_657_109.5853, 4_999_775.1977));
        line.add(new LngLatAlt(6_657_078.7495, 4_999_774.9808));
        line.add(new LngLatAlt(6_657_080.1447, 4_999_784.8079));

        Feature feature = new Feature();
        feature.setGeometry(new MultiPolygon(new Polygon(line)));

        return feature;
    }
}
