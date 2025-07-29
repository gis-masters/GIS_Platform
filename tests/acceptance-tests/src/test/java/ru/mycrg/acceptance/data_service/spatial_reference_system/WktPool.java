package ru.mycrg.acceptance.data_service.spatial_reference_system;

import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;

import java.util.Map;

public class WktPool {

    private static final Map<String, SpatialReferenceSystem> wktPool = Map.of(
            "Krasnodar",
            new SpatialReferenceSystem(
                    "PROJCS[\"Mestn_Krasnodar\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",21799.995],PARAMETER[\"False_Northing\",-4974499.819],PARAMETER[\"Central_Meridian\",39.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=39.0 +k_0=1.0 +x_0=21799.995 +y_0=-4974499.819 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs"),
            "MSK-23 zone 1",
            new SpatialReferenceSystem(
                    "PROJCS[\"MSK-23 zone 1\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",1300000.0],PARAMETER[\"False_Northing\",-4511057.628],PARAMETER[\"Central_Meridian\",37.98333333333],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=37.98333333333 +k_0=1.0 +x_0=1300000.0 +y_0=-4511057.628 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs"),
            "Sevastopol",
            new SpatialReferenceSystem(
                    "PROJCS[\"Sevastopol\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",-18001.8],PARAMETER[\"False_Northing\",-4915002.6],PARAMETER[\"Central_Meridian\",33.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=33.0 +k_0=1.0 +x_0=-18001.8 +y_0=-4915002.6 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs"),
            "ToDeleteProj",
            new SpatialReferenceSystem(
                    "PROJCS[\"ToDeleteProj\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",-18001.8],PARAMETER[\"False_Northing\",-4915002.6],PARAMETER[\"Central_Meridian\",33.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=33.0 +k_0=1.0 +x_0=-18001.8 +y_0=-4915002.6 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs"),
            "ToKeepProj",
            new SpatialReferenceSystem(
                    "PROJCS[\"ToKeepProj\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",-18001.8],PARAMETER[\"False_Northing\",-4915002.6],PARAMETER[\"Central_Meridian\",33.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=33.0 +k_0=1.0 +x_0=-18001.8 +y_0=-4915002.6 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs"),
            "DeleteEndProj",
            new SpatialReferenceSystem(
                    "PROJCS[\"DeleteEndProj\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",-18001.8],PARAMETER[\"False_Northing\",-4915002.6],PARAMETER[\"Central_Meridian\",33.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=33.0 +k_0=1.0 +x_0=-18001.8 +y_0=-4915002.6 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs"),
            "KeepStartProj",
            new SpatialReferenceSystem(
                    "PROJCS[\"KeepStartProj\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",-18001.8],PARAMETER[\"False_Northing\",-4915002.6],PARAMETER[\"Central_Meridian\",33.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=33.0 +k_0=1.0 +x_0=-18001.8 +y_0=-4915002.6 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs"),
            "ProjBeforeChange",
            new SpatialReferenceSystem(
                    "PROJCS[\"ProjBeforeChange\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",-18001.8],PARAMETER[\"False_Northing\",-4915002.6],PARAMETER[\"Central_Meridian\",33.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=33.0 +k_0=1.0 +x_0=-18001.8 +y_0=-4915002.6 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs"),
            "ProjAfterChange",
            new SpatialReferenceSystem(
                    "PROJCS[\"ProjAfterChange\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\",SPHEROID[\"Krasovsky_1940\",6378245.0,298.3],TOWGS84[-125,53,467,0,0,0,0]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",-18001.8],PARAMETER[\"False_Northing\",-4915002.6],PARAMETER[\"Central_Meridian\",33.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=33.0 +k_0=1.0 +x_0=-18001.8 +y_0=-4915002.6 +a=6378245.0 +b=6356863.018773047 +towgs84=-125,53,467,0,0,0,0 +units=m +no_defs"),
            "WithOutWgs84",
            new SpatialReferenceSystem(
                    "PROJCS[\"haveNoWgs\",GEOGCS[\"GCS_Pulkovo_1942\",DATUM[\"D_Pulkovo_1942\"," +
                            "SPHEROID[\"Krasovsky_1940\"," +
                            "6378245.0,298.3]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],PROJECTION[\"Gauss_Kruger\"],PARAMETER[\"False_Easting\",21799.995],PARAMETER[\"False_Northing\",-4974499.819],PARAMETER[\"Central_Meridian\",39.0],PARAMETER[\"Scale_Factor\",1.0],PARAMETER[\"Latitude_Of_Origin\",0.0],UNIT[\"Meter\",1.0]]",
                    "+proj=merc +lat_0=0.0 +lon_0=39.0 +k_0=1.0 +x_0=21799.995 +y_0=-4974499.819 +a=6378245.0 +b=6356863.018773047 +units=m +no_defs")
    );

    public static String getWkt(String key) {
        return wktPool.getOrDefault(key, new SpatialReferenceSystem())
                      .getSrtext();
    }

    public static SpatialReferenceSystem getSrs(String key) {
        return wktPool.getOrDefault(key, new SpatialReferenceSystem());
    }
}
