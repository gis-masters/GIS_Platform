package unit._import;

class MatchingSamples {

    static String commonCase = "[\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"the_geom\",\n" +
            "                        \"binding\": \"org.locationtech.jts.geom.MultiLineString\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"shape\",\n" +
            "                        \"type\": \"FromSchema\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"objectid\",\n" +
            "                        \"binding\": \"java.lang.Integer\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"objectid\",\n" +
            "                        \"type\": \"NotImport\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"classid\",\n" +
            "                        \"binding\": \"java.lang.Integer\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"CLASSID\",\n" +
            "                        \"type\": \"FromSchema\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"number\",\n" +
            "                        \"binding\": \"java.lang.String\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"NUMBER\",\n" +
            "                        \"type\": \"FromSchema\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"feature_le\",\n" +
            "                        \"binding\": \"java.lang.Integer\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"feature_le\",\n" +
            "                        \"type\": \"AsIs\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"szz_size\",\n" +
            "                        \"binding\": \"java.lang.Double\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"SZZ_SIZE\",\n" +
            "                        \"type\": \"FromSchema\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"status\",\n" +
            "                        \"binding\": \"java.lang.Integer\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"STATUS\",\n" +
            "                        \"type\": \"FromSchema\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"reg_status\",\n" +
            "                        \"binding\": \"java.lang.Integer\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"REG_STATUS\",\n" +
            "                        \"type\": \"FromSchema\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"globalid\",\n" +
            "                        \"binding\": \"java.lang.String\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"GLOBALID\",\n" +
            "                        \"type\": \"FromSchema\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"feature__1\",\n" +
            "                        \"binding\": \"java.lang.String\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"feature__1\",\n" +
            "                        \"type\": \"AsIs\"\n" +
            "                    }\n" +
            "                }\n" +
            "            ]";

    static String asIs = "[\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"classid\",\n" +
            "                        \"binding\": \"java.lang.Integer\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"CLASSID\",\n" +
            "                        \"type\": \"AsIs\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"number\",\n" +
            "                        \"binding\": \"java.lang.String\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"NUMBER\",\n" +
            "                        \"type\": \"AsIs\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"feature_le\",\n" +
            "                        \"binding\": \"java.lang.Integer\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"feature_le\",\n" +
            "                        \"type\": \"AsIs\"\n" +
            "                    }\n" +
            "                },\n" +
            "                {\n" +
            "                    \"source\": {\n" +
            "                        \"name\": \"status\",\n" +
            "                        \"binding\": \"java.lang.Integer\"\n" +
            "                    },\n" +
            "                    \"target\": {\n" +
            "                        \"name\": \"STATUS\",\n" +
            "                        \"type\": \"AsIs\"\n" +
            "                    }\n" +
            "                }\n" +
            "            ]";

    static String collisionWithSchemaAttributes = "[\n" +
            "    {\n" +
            "        \"source\": {\n" +
            "            \"name\": \"OBJECTID\",\n" +
            "            \"binding\": \"java.lang.Integer\"\n" +
            "        },\n" +
            "        \"target\": {\n" +
            "            \"name\": \"OBJECTID\",\n" +
            "            \"type\": \"AsIs\"\n" +
            "        }\n" +
            "    },\n" +
            "    {\n" +
            "        \"source\": {\n" +
            "            \"name\": \"SZZ_SIZE\",\n" +
            "            \"binding\": \"java.lang.String\"\n" +
            "        },\n" +
            "        \"target\": {\n" +
            "            \"name\": \"SZZ_SIZE\",\n" +
            "            \"type\": \"AsIs\"\n" +
            "        }\n" +
            "    }\n" +
            "]";

    static String the_geom = "[\n" +
            "    {\n" +
            "        \"source\": {\n" +
            "            \"name\": \"the_geom\",\n" +
            "            \"binding\": \"org.locationtech.jts.geom.MultiPolygon\"\n" +
            "        },\n" +
            "        \"target\": {\n" +
            "            \"name\": \"the_geom\",\n" +
            "            \"type\": \"AsIs\"\n" +
            "        }\n" +
            "    },\n" +
            "    {\n" +
            "        \"source\": {\n" +
            "            \"name\": \"POPULATION\",\n" +
            "            \"binding\": \"java.lang.Long\"\n" +
            "        },\n" +
            "        \"target\": {\n" +
            "            \"name\": \"POPULATION\",\n" +
            "            \"type\": \"AsIs\"\n" +
            "        }\n" +
            "    },\n" +
            "    {\n" +
            "        \"source\": {\n" +
            "            \"name\": \"GlobalID\",\n" +
            "            \"binding\": \"java.lang.String\"\n" +
            "        },\n" +
            "        \"target\": {\n" +
            "            \"name\": \"GlobalID\",\n" +
            "            \"type\": \"AsIs\"\n" +
            "        }\n" +
            "    }\n" +
            "]";

}
