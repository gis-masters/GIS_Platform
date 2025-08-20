import { describe, expect, test } from '@jest/globals';

import { CustomStyleDescription } from './styles.models';
import { buildCustomSld, parseCustomStyle } from './styles.utils';

const pointRedCircle: CustomStyleDescription = {
  type: 'point',
  rule: {
    markColor: '#ff0000',
    markSize: 10,
    markType: 'circle',
    strokeColor: '#0f5c1a',
    strokeWidth: 2
  }
};

const lineBlue: CustomStyleDescription = {
  type: 'line',
  rule: {
    strokeColor: '#0000ff',
    strokeWidth: 2
  }
};

const lineDashed: CustomStyleDescription = {
  type: 'line',
  rule: {
    strokeColor: '#00ff00',
    strokeWidth: 2,
    strokeDashArray: [4, 4]
  }
};

const redPolygon: CustomStyleDescription = {
  type: 'polygon',
  rule: {
    strokeColor: '#0000bb',
    strokeWidth: 2,
    fillColor: '#ff5555'
  }
};

const checkeredOrangePolygon: CustomStyleDescription = {
  type: 'polygon',
  rule: {
    strokeColor: '#0000bb',
    strokeWidth: 2,
    strokeDashArray: [4, 4],
    fillColor: '#0000bb',
    fillGraphic: {
      type: 'times',
      strokeWidth: 2,
      size: 6
    }
  }
};

const polygonWithoutFill: CustomStyleDescription = {
  type: 'polygon',
  rule: {
    strokeColor: '#0000bb',
    strokeWidth: 2,
    fillColor: '#ffffffff'
  }
};

const allTypesDefault: CustomStyleDescription = {
  type: 'all',
  rule: [
    {
      markType: 'circle',
      markSize: 20,
      markColor: '#ed5c57',
      strokeColor: '#0f5c1a',
      strokeWidth: 2
    },
    {
      strokeColor: '#0f5c1a',
      strokeWidth: 2
    },
    {
      fillColor: '#80ff80',
      strokeColor: '#0f5c1a',
      strokeWidth: 2
    }
  ]
};

const pointRedCircleSld =
  '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"><NamedLayer><Name>dummy:complex_name</Name><UserStyle><FeatureTypeStyle><Rule><ElseFilter></ElseFilter><PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellKnownName><Fill><SvgParameter name="fill">#ff0000</SvgParameter></Fill><Stroke><SvgParameter name="stroke">#0f5c1a</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter></Stroke></Mark><Size>10</Size></Graphic></PointSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

const lineBlueSld =
  '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"><NamedLayer><Name>dummy:complex_name</Name><UserStyle><FeatureTypeStyle><Rule><Filter><PropertyIsEqualTo><Function name="dimension"><Function name="geometry"></Function></Function><Literal>1</Literal></PropertyIsEqualTo></Filter><LineSymbolizer><Stroke><SvgParameter name="stroke">#0000ff</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter><SvgParameter name="stroke-linejoin">bevel</SvgParameter></Stroke></LineSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

const lineDashedSld =
  '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"><NamedLayer><Name>dummy:complex_name</Name><UserStyle><FeatureTypeStyle><Rule><Filter><PropertyIsEqualTo><Function name="dimension"><Function name="geometry"></Function></Function><Literal>1</Literal></PropertyIsEqualTo></Filter><LineSymbolizer><Stroke><SvgParameter name="stroke">#00ff00</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter><SvgParameter name="stroke-linejoin">bevel</SvgParameter><SvgParameter name="stroke-dasharray">4 4</SvgParameter></Stroke></LineSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

const redPolygonSld =
  '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"><NamedLayer><Name>dummy:complex_name</Name><UserStyle><FeatureTypeStyle><Rule><Filter><PropertyIsEqualTo><Function name="dimension"><Function name="geometry"></Function></Function><Literal>2</Literal></PropertyIsEqualTo></Filter><PolygonSymbolizer><Fill><SvgParameter name="fill">#ff5555</SvgParameter></Fill><Stroke><SvgParameter name="stroke">#0000bb</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter></Stroke></PolygonSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

const checkeredOrangePolygonSld =
  '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"><NamedLayer><Name>dummy:complex_name</Name><UserStyle><FeatureTypeStyle><Rule><Filter><PropertyIsEqualTo><Function name="dimension"><Function name="geometry"></Function></Function><Literal>2</Literal></PropertyIsEqualTo></Filter><PolygonSymbolizer><Fill><GraphicFill><Graphic><Mark><WellKnownName>shape://times</WellKnownName><Stroke><SvgParameter name="stroke">#0000bb</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter></Stroke></Mark><Size>6</Size></Graphic></GraphicFill></Fill><Stroke><SvgParameter name="stroke">#0000bb</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter><SvgParameter name="stroke-dasharray">4 4</SvgParameter></Stroke></PolygonSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

const withoutFillPolygonSld =
  '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"><NamedLayer><Name>dummy:complex_name</Name><UserStyle><FeatureTypeStyle><Rule><Filter><PropertyIsEqualTo><Function name="dimension"><Function name="geometry"></Function></Function><Literal>2</Literal></PropertyIsEqualTo></Filter><PolygonSymbolizer><Fill><SvgParameter name="fill">#ffffffff</SvgParameter></Fill><Stroke><SvgParameter name="stroke">#0000bb</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter></Stroke></PolygonSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

const allTypesDefaultSld =
  '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"><NamedLayer><Name>dummy:complex_name</Name><UserStyle><FeatureTypeStyle><Rule><Filter><PropertyIsEqualTo><Function name="dimension"><Function name="geometry"></Function></Function><Literal>2</Literal></PropertyIsEqualTo></Filter><PolygonSymbolizer><Fill><SvgParameter name="fill">#80ff80</SvgParameter></Fill><Stroke><SvgParameter name="stroke">#0f5c1a</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter></Stroke></PolygonSymbolizer></Rule><Rule><Filter><PropertyIsEqualTo><Function name="dimension"><Function name="geometry"></Function></Function><Literal>1</Literal></PropertyIsEqualTo></Filter><LineSymbolizer><Stroke><SvgParameter name="stroke">#0f5c1a</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter><SvgParameter name="stroke-linejoin">bevel</SvgParameter></Stroke></LineSymbolizer></Rule><Rule><ElseFilter></ElseFilter><PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellKnownName><Fill><SvgParameter name="fill">#ed5c57</SvgParameter></Fill><Stroke><SvgParameter name="stroke">#0f5c1a</SvgParameter><SvgParameter name="stroke-width">2</SvgParameter></Stroke></Mark><Size>20</Size></Graphic></PointSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

const dummyComplexName = 'dummy:complex_name';

describe('утилита создания SLD-стилей buildCustomSld', () => {
  test('красная круглая точка', () => {
    expect(buildCustomSld(dummyComplexName, pointRedCircle)).toEqual(pointRedCircleSld);
  });

  test('синяя линия', () => {
    expect(buildCustomSld(dummyComplexName, lineBlue)).toEqual(lineBlueSld);
  });

  test('прерывистая линия', () => {
    expect(buildCustomSld(dummyComplexName, lineDashed)).toEqual(lineDashedSld);
  });

  test('красный полигон', () => {
    expect(buildCustomSld(dummyComplexName, redPolygon)).toEqual(redPolygonSld);
  });

  test('оранжевый полигон в клеточку', () => {
    expect(buildCustomSld(dummyComplexName, checkeredOrangePolygon)).toEqual(checkeredOrangePolygonSld);
  });

  test('полигон без заливки', () => {
    expect(buildCustomSld(dummyComplexName, polygonWithoutFill)).toEqual(withoutFillPolygonSld);
  });

  test('все типы', () => {
    expect(buildCustomSld(dummyComplexName, allTypesDefault)).toEqual(allTypesDefaultSld);
  });
});

describe('утилита чтения SLD-стилей parseCustomStyle', () => {
  test('красная круглая точка', () => {
    expect(parseCustomStyle(pointRedCircleSld)).toEqual(pointRedCircle);
  });

  test('синяя линия', () => {
    expect(parseCustomStyle(lineBlueSld)).toEqual(lineBlue);
  });

  test('прерывистая линия', () => {
    expect(parseCustomStyle(lineDashedSld)).toEqual(lineDashed);
  });

  test('красный полигон', () => {
    expect(parseCustomStyle(redPolygonSld)).toEqual(redPolygon);
  });

  test('оранжевый полигон в клеточку', () => {
    expect(parseCustomStyle(checkeredOrangePolygonSld)).toEqual(checkeredOrangePolygon);
  });

  test('полигон без заливки', () => {
    expect(parseCustomStyle(withoutFillPolygonSld)).toEqual(polygonWithoutFill);
  });

  test('все типы', () => {
    expect(parseCustomStyle(allTypesDefaultSld)).toEqual(allTypesDefault);
  });
});
