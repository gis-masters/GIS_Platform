import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import FileSaver from 'file-saver';
import { Coordinate } from 'ol/coordinate';
import { v4 as uuid } from 'uuid';
import xmlbuilder from 'xmlbuilder';

import { GeometryType, WfsFeature, WfsGeometry } from '../../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';

const cnXmlDownload = cn('XmlDownload');

export interface XmlDownloadProps {
  feature: WfsFeature;
  layer: CrgVectorLayer;
}

@observer
export default class XmlDownload extends Component<XmlDownloadProps> {
  render() {
    const { feature } = this.props;

    return (
      feature.geometry?.type === GeometryType.MULTI_POLYGON && (
        <Tooltip title='Скачать XML межевого плана'>
          <span className={cnXmlDownload()}>
            <IconButton onClick={this.download}>
              <DownloadOutlined />
            </IconButton>
          </span>
        </Tooltip>
      )
    );
  }

  @boundMethod
  private download() {
    const { feature, layer } = this.props;
    const { properties, geometry } = feature;
    const guid = uuid().toUpperCase();

    if (!geometry) {
      throw new Error('Не удалось получить геометрию');
    }

    let cadastralBlock: string = '';
    if (typeof properties.cad_num === 'string') {
      cadastralBlock = properties.cad_num?.split(':').slice(0, -1).join(':');
    }

    const mp = {
      MP: {
        '@GUID': guid,
        '@Version': '06',
        Package: {
          FormParcels: {
            '@Method': '6',
            NewParcel: {
              '@Definition': properties.objecttype === 'Земельный участок' ? ':ЗУ2' : undefined,
              CadastralBlock: {
                '#text': properties.cad_num
              },
              Address: {
                '@AddressOrLocation': '0',
                Other: {
                  '#text': properties.raddress || properties.location || properties.address_no
                }
              },
              Category: {
                '@Category': properties.ccode
              },
              Utilization: {
                '@ByDoc': properties.usage
              },
              LandUse: {
                '@LandUse': properties.landuse
              },
              ...this.getContours(geometry),
              ObjectRealty: {
                InnerCadastralNumbers: {
                  CadastralNumber: {
                    '#text': properties.cad_num
                  }
                }
              },
              ProvidingPassCadastralNumbers: {
                Other: {
                  '#text': properties.category
                }
              },
              Area: {
                Area: {
                  '#text':
                    properties.shape_area ||
                    properties.area_doc ||
                    properties.insp_area ||
                    properties.floor_area ||
                    properties.aria_total
                }
              }
            },
            ChangeParcel: {
              '@CadastralNumber': properties.cad_num,
              CadastralBlock: {
                '#text': cadastralBlock
              }
            }
          }
        },
        CoordSystems: {
          CoordSystem: {
            '@Name': layer.nativeCRS
          }
        }
      }
    };

    const xml = xmlbuilder.create(mp).end({ pretty: true });
    const fileName = properties.shape_area || properties.area_doc || properties.cad_num || guid;
    const blob = new Blob([xml], { type: 'xml' });

    FileSaver.saveAs(blob, `${String(fileName)}.xml`);
  }

  private getContours(geometry: WfsGeometry) {
    if (geometry.type === GeometryType.POINT) {
      const pointGeometry = geometry;

      return {
        EntitySpatial: {
          SpatialElement: {
            SpelementUnit: {
              '@TypeUnit': 'Точка',
              Ordinate: {
                '@X': pointGeometry.coordinates[0],
                '@Y': pointGeometry.coordinates[1],
                '@NumGeopoint': 0,
                '@DeltaGeopoint': '0.10'
              }
            }
          }
        }
      };
    }

    if (geometry.type === GeometryType.MULTI_LINE_STRING) {
      const { coordinates } = geometry;

      return {
        Contours: {
          NewContour: coordinates.map(contour => {
            return {
              EntitySpatial: {
                SpatialElement: {
                  SpelementUnit: this.getUnitCoord(contour)
                }
              }
            };
          })
        }
      };
    }

    if (geometry.type === GeometryType.MULTI_POLYGON) {
      const geometryMultiPolygon = geometry;

      return {
        Contours: {
          NewContour: geometryMultiPolygon.coordinates.map(polygon => {
            return {
              EntitySpatial: {
                SpatialElement: polygon.map(contour => {
                  return {
                    SpelementUnit: this.getUnitCoord(contour)
                  };
                })
              }
            };
          })
        }
      };
    }
  }

  private getUnitCoord(contour: Coordinate[]) {
    return contour.map((coord, i) => {
      return {
        '@TypeUnit': 'Точка',
        Ordinate: {
          '@X': coord[1],
          '@Y': coord[0],
          '@NumGeopoint': i,
          '@DeltaGeopoint': '0.10'
        }
      };
    });
  }
}
