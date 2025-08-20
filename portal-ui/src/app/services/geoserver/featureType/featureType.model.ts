export interface FeatureTypeHref {
  name: string;
  href: string;
}

export interface BBOX {
  minx: number;
  maxx: number;

  miny: number;
  maxy: number;

  crs: string | { '@class': string; $: string };
}

export interface NameHrefProjection {
  name: string;
  href: string;
}

export interface ValueTitleProjection {
  value: string;
  title: string;
}

export interface Attributes {
  attribute: Attribute[];
}

export interface Attribute {
  name: string;
  minOccurs: number;
  maxOccurs: number;

  // Flag indicating if null is an acceptable value for the attribute.
  nillable: boolean;

  // The java class that values of this attribute are bound to.
  binding: string;

  // Returns the length of this attribute. It's usually non null only for string and numeric types
  length: number;
}

export interface FeatureType {
  // This name corresponds to the "published" name of the resource.
  name: string;

  // This name corresponds to the physical resource that feature type is derived from -- a shapefile name, a database
  // table, etc...
  nativeName: string;

  // This is usually something that is meant to be displayed in a user interface.
  title: string;

  namespace: NameHrefProjection;

  // This is usually something that is meant to be displayed in a user interface.
  abstract: string;

  // A collection of keywords associated with the resource.
  keywords: string[];

  metadatalinks: unknown;
  dataLinks: unknown;

  // The native coordinate reference system object of the resource.
  nativeCRS: string;

  // Returns the identifier of coordinate reference system of the resource.
  srs: string;

  // Returns the bounds of the resource in its declared CRS.
  nativeBoundingBox: BBOX;
  latLonBoundingBox: BBOX;
  metadata: unknown;

  store: NameHrefProjection;

  // The ECQL string used as default feature type filter
  cqlFilter: string;

  // A cap on the number of features that a query against this type can return.
  maxFeatures: number;

  // The number of decimal places to use when encoding floating point numbers from data of this feature type.
  numDecimals: number;

  // The srs's that the WFS service will advertise in the capabilities document for this feature type
  // (overriding the global WFS settings).
  responseSRS: {
    // The value of srs
    string: string;
  };

  // True if this feature type info is overriding the WFS global SRS list
  overridingServiceSRS: boolean;

  // True if this feature type info is overriding the counting of numberMatched.
  skipNumberMatched: boolean;

  circularArcPresent: boolean;

  // Tolerance used to linearize this feature type, as an absolute value expressed in the geometries own CRS
  linearizationTolerance: number;

  attributes: Attributes;
}
