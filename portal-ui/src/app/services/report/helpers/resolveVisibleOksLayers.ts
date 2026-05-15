import { currentProject } from '../../../stores/CurrentProject.store';
import { GeometryType, type SupportedGeometryType } from '../../geoserver/wfs/wfs.models';
import { type CrgVectorLayer, isVectorLayer } from '../../gis/layers/layers.models';
import { getLayerSchema } from '../../gis/layers/layers.service';

export const OKS_LAYER_TITLE = 'Объекты капитального строительства';

type OksGeometrySlot = 'areal' | 'linear' | 'point';

export type ResolvedOksLayers = Record<OksGeometrySlot, CrgVectorLayer>;

type ResolveOksResult = { ok: true; layers: ResolvedOksLayers } | { ok: false; message: string };

function classifySchemaGeometry(gt: SupportedGeometryType | undefined): OksGeometrySlot | null {
  switch (gt) {
    case GeometryType.POLYGON:
    case GeometryType.MULTI_POLYGON: {
      return 'areal';
    }
    case GeometryType.LINE_STRING:
    case GeometryType.MULTI_LINE_STRING: {
      return 'linear';
    }
    case GeometryType.POINT:
    case GeometryType.MULTI_POINT: {
      return 'point';
    }
    default: {
      return null;
    }
  }
}

export async function resolveVisibleOksLayers(): Promise<ResolveOksResult> {
  const candidates = currentProject.visibleVectorLayers
    .map(({ payload }) => payload)
    .filter((layer): layer is CrgVectorLayer => layer.title === OKS_LAYER_TITLE && isVectorLayer(layer));

  if (!candidates.length) {
    return {
      ok: false,
      message: `Нет видимых слоев с названием "${OKS_LAYER_TITLE}". Включите полигональный, линейный и точечный слои ОКС.`
    };
  }

  const bySlot: Partial<Record<OksGeometrySlot, CrgVectorLayer[]>> = {};

  for (const layer of candidates) {
    const schema = await getLayerSchema(layer);

    if (!schema) {
      return { ok: false, message: `Не удалось загрузить схему слоя "${layer.title}" (id ${layer.id}).` };
    }

    const slot = classifySchemaGeometry(schema.geometryType);

    if (!slot) {
      return {
        ok: false,
        message: `Слой "${layer.title}" (id ${layer.id}) имеет неподдерживаемый geometryType в схеме.`
      };
    }

    bySlot[slot] = bySlot[slot] ?? [];
    bySlot[slot].push(layer);
  }

  const slots: OksGeometrySlot[] = ['areal', 'linear', 'point'];
  const layers = {} as ResolvedOksLayers;

  for (const slot of slots) {
    const list = bySlot[slot];

    if (!list?.length) {
      return {
        ok: false,
        message: `Нет видимого слоя "${OKS_LAYER_TITLE}" с геометрией ${slotDescription(slot)}.`
      };
    }

    if (list.length > 1) {
      return {
        ok: false,
        message: `Несколько видимых слоев "${OKS_LAYER_TITLE}" с геометрией ${slotDescription(slot)}. Оставьте по одному.`
      };
    }

    const only = list[0];

    if (!only?.complexName) {
      return { ok: false, message: `У слоя ОКС "${only?.title}" (id ${only?.id}) не задан complexName.` };
    }

    layers[slot] = only;
  }

  return { ok: true, layers };
}

function slotDescription(slot: OksGeometrySlot): string {
  switch (slot) {
    case 'areal': {
      return 'площадная (Polygon/MultiPolygon)';
    }
    case 'linear': {
      return 'линейная (LineString/MultiLineString)';
    }
    case 'point': {
      return 'точечная (Point/MultiPoint)';
    }
    default: {
      return slot;
    }
  }
}
