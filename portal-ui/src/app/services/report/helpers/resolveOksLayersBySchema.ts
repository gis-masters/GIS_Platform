import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { resolveSingleLayerBySchemaTemplate } from './resolveLayersBySchema';

export const OKS_AREAL_SCHEMA_NAME = 'oks_pro';
export const OKS_LINEAR_SCHEMA_NAME = 'oks_polyline_pro';
export const OKS_POINT_SCHEMA_NAME = 'oks_constructions_points';

type OksGeometrySlot = 'areal' | 'linear' | 'point';

export type ResolvedOksLayers = Record<OksGeometrySlot, CrgVectorLayer>;

type ResolveOksResult = { ok: true; layers: ResolvedOksLayers } | { ok: false; message: string };

/**
 * Слои ОКС в составе проекта по схемам oks_pro, oks_polyline_pro, oks_constructions_points (видимость не важна).
 */
export async function resolveOksLayersBySchema(): Promise<ResolveOksResult> {
  const [arealResolve, linearResolve, pointResolve] = await Promise.all([
    resolveSingleLayerBySchemaTemplate(OKS_AREAL_SCHEMA_NAME),
    resolveSingleLayerBySchemaTemplate(OKS_LINEAR_SCHEMA_NAME),
    resolveSingleLayerBySchemaTemplate(OKS_POINT_SCHEMA_NAME)
  ]);

  if (!arealResolve.ok) {
    return arealResolve;
  }

  if (!linearResolve.ok) {
    return linearResolve;
  }

  if (!pointResolve.ok) {
    return pointResolve;
  }

  return {
    ok: true,
    layers: {
      areal: arealResolve.layer,
      linear: linearResolve.layer,
      point: pointResolve.layer
    }
  };
}
