import * as THREE from "three";

// Puntos de control de la pista: avanza hacia -Z con curvas a los costados
// y ondulaciones suaves de altura, para que la conducción se sienta viva.
const CONTROL_POINTS: [number, number, number][] = [
  [0, 0, 4],
  [3.5, 0, -12],
  [-3, 0.4, -28],
  [2.5, 0, -44],
  [-4, 0.5, -60],
  [1.5, 0, -76],
  [-2, 0.3, -92],
  [0, 0, -108],
];

export function createTrackCurve(): THREE.CatmullRomCurve3 {
  const points = CONTROL_POINTS.map((p) => new THREE.Vector3(...p));
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
}

export const EYE_HEIGHT = 1.15;
export const ROAD_WIDTH = 7;

// Centro (en t de curva) de cada estación/proyecto, repartidos parejo.
export function stationCenters(count: number): number[] {
  return Array.from({ length: count }, (_, i) => (i + 0.5) / count);
}

// Construye la cinta de asfalto siguiendo la curva. Devuelve una BufferGeometry
// con uv.x a lo ancho (0..1) y uv.y a lo largo (para dashes/líneas en el shader).
export function buildRoadGeometry(
  curve: THREE.CatmullRomCurve3,
  width: number,
  segments: number,
): THREE.BufferGeometry {
  const half = width / 2;
  const up = new THREE.Vector3(0, 1, 0);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();

    const left = p.clone().addScaledVector(right, -half);
    const rightEdge = p.clone().addScaledVector(right, half);

    positions.push(left.x, left.y, left.z, rightEdge.x, rightEdge.y, rightEdge.z);
    // uv.y crece con la distancia recorrida para que los dashes queden parejos.
    const along = t * segments * 0.5;
    uvs.push(0, along, 1, along);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = i * 2 + 2;
    const d = i * 2 + 3;
    indices.push(a, b, d, a, d, c);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (e: number) => e * e * (3 - 2 * e);

export interface TrackMapping {
  // Progreso de scroll (0..1) → posición en la curva (0..1).
  t: (p: number) => number;
  // Velocidad normalizada 0..1 (0 = frenado en un proyecto, 1 = crucero).
  speedNorm: (p: number) => number;
}

const V_MIN = 0.16;
const V_MAX = 1;
const SAMPLES = 256;

/**
 * Mapea el scroll a la posición en la pista integrando un PERFIL DE VELOCIDAD
 * suave: la velocidad baja de forma gradual (gaussiana) al acercarse a cada
 * proyecto y sube al alejarse. Al integrar y normalizar, t(p) queda monótona y
 * sin discontinuidades → la cámara frena y acelera como un auto, sin saltos.
 */
export function makeProgressToT(count: number): TrackMapping {
  const stations = stationCenters(count);
  const sigma = (0.5 / count) * 0.7;

  const slowness = (p: number) => {
    let s = 0;
    for (const c of stations) {
      const d = (p - c) / sigma;
      s = Math.max(s, Math.exp(-0.5 * d * d));
    }
    return s;
  };
  const speed = (p: number) => V_MAX - (V_MAX - V_MIN) * slowness(p);

  const cumulative = new Float64Array(SAMPLES + 1);
  const dp = 1 / SAMPLES;
  for (let i = 1; i <= SAMPLES; i++) {
    cumulative[i] = cumulative[i - 1] + speed((i - 0.5) * dp) * dp;
  }
  const total = cumulative[SAMPLES];

  return {
    t: (p: number) => {
      const f = clamp01(p) * SAMPLES;
      const i = Math.min(SAMPLES - 1, Math.floor(f));
      const frac = f - i;
      const c = cumulative[i] + (cumulative[i + 1] - cumulative[i]) * frac;
      return c / total;
    },
    speedNorm: (p: number) => (speed(clamp01(p)) - V_MIN) / (V_MAX - V_MIN),
  };
}

// Posición (en t de curva) donde la cámara frena para cada proyecto. Los gates
// se colocan acá para que coincidan exactamente con el frenado y el panel.
export function stationTrackTs(count: number): number[] {
  const mapping = makeProgressToT(count);
  return stationCenters(count).map((c) => mapping.t(c));
}

/**
 * Muro/barrera vertical siguiendo la curva a un costado. `side` = -1 (izq) / +1
 * (der). uv.x recorre el largo, uv.y va de la base (0) al tope (1).
 */
export function buildBarrierGeometry(
  curve: THREE.CatmullRomCurve3,
  side: number,
  offset: number,
  height: number,
  segments: number,
): THREE.BufferGeometry {
  const up = new THREE.Vector3(0, 1, 0);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const lengthU = curve.getLength() / 6;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const base = p.clone().addScaledVector(right, side * offset);

    positions.push(base.x, base.y, base.z, base.x, base.y + height, base.z);
    const u = t * lengthU;
    uvs.push(u, 0, u, 1);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = i * 2 + 2;
    const d = i * 2 + 3;
    indices.push(a, b, d, a, d, c);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Para cada estación, cuán "activa" está según el progreso de scroll (0..1).
 * Sirve para el fade de los paneles: 1 = estacionado justo en el proyecto.
 */
export function stationActivation(p: number, index: number, count: number): number {
  const center = (index + 0.5) / count;
  const half = (0.5 / count) * 0.7;
  const d = Math.abs(p - center);
  if (d >= half) return 0;
  return smooth(1 - d / half);
}
