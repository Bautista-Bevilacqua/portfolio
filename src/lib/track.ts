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

/**
 * Mapea el progreso de scroll (0..1) a la posición en la curva (0..1), con una
 * "meseta" alrededor de cada estación: al llegar a un proyecto, t casi no avanza
 * → la cámara frena y se queda un rato, y después retoma la marcha.
 */
export function makeProgressToT(count: number) {
  const anchors: Array<[number, number]> = [[0, 0]];
  for (let i = 0; i < count; i++) {
    const center = (i + 0.5) / count;
    const band = 0.5 / count;
    anchors.push([center - band * 0.9, center - 0.02]); // acercándose
    anchors.push([center - band * 0.28, center]); // llega
    anchors.push([center + band * 0.28, center]); // frena/estaciona (t constante)
    anchors.push([center + band * 0.9, center + 0.02]); // retoma
  }
  anchors.push([1, 1]);

  return (p: number): number => {
    const x = clamp01(p);
    for (let i = 0; i < anchors.length - 1; i++) {
      const [p0, t0] = anchors[i];
      const [p1, t1] = anchors[i + 1];
      if (x >= p0 && x <= p1) {
        if (p1 === p0) return t1;
        const local = smooth((x - p0) / (p1 - p0));
        return t0 + (t1 - t0) * local;
      }
    }
    return 1;
  };
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
