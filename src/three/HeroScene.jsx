import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT = 40;
const SPHERE_RADIUS = 2.2;
const RING_SEGMENTS = 128;

// Heartbeat: slow sine base plus a sharp "lub-dub" accent.
function heartbeat(t) {
  const phase = (t * 0.9) % (Math.PI * 2);
  const lub = Math.pow(Math.max(0, Math.sin(phase)), 10);
  const dub = 0.55 * Math.pow(Math.max(0, Math.sin(phase - 0.55)), 14);
  return 0.35 + 0.25 * Math.sin(t * 0.6) + lub + dub;
}

function NetworkNodes({ nodes }) {
  const cyanRef = useRef();
  const violetRef = useRef();
  const cyanMat = useRef();
  const violetMat = useRef();

  const [cyanNodes, violetNodes] = useMemo(() => {
    const cyan = [];
    const violet = [];
    nodes.forEach((n, i) => (i % 2 === 0 ? cyan : violet).push(n));
    return [cyan, violet];
  }, [nodes]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const beat = heartbeat(clock.elapsedTime);
    const scale = 1 + 0.08 * beat;
    for (const [ref, list] of [
      [cyanRef, cyanNodes],
      [violetRef, violetNodes],
    ]) {
      if (!ref.current) continue;
      list.forEach((pos, i) => {
        dummy.position.copy(pos);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
    if (cyanMat.current) cyanMat.current.color.set('#22d3ee').multiplyScalar(0.7 + 0.5 * beat);
    if (violetMat.current) violetMat.current.color.set('#a78bfa').multiplyScalar(0.7 + 0.5 * beat);
  });

  return (
    <>
      <instancedMesh ref={cyanRef} args={[null, null, cyanNodes.length]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial ref={cyanMat} color="#22d3ee" toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={violetRef} args={[null, null, violetNodes.length]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial ref={violetMat} color="#a78bfa" toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function NetworkLines({ nodes }) {
  const matRef = useRef();

  const geometry = useMemo(() => {
    const positions = [];
    const threshold = 1.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < threshold) {
          positions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          positions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes]);

  useFrame(({ clock }) => {
    const beat = heartbeat(clock.elapsedTime);
    if (matRef.current) matRef.current.opacity = 0.12 + 0.18 * beat;
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        ref={matRef}
        color="#22d3ee"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function WaveformRing() {
  const geoRef = useRef();
  const matRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(new Float32Array(RING_SEGMENTS * 3), 3)
    );
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const beat = heartbeat(t);
    const attr = geoRef.current?.getAttribute('position');
    if (!attr) return;
    for (let i = 0; i < RING_SEGMENTS; i++) {
      const angle = (i / RING_SEGMENTS) * Math.PI * 2;
      const r = 3.1 + 0.22 * Math.sin(angle * 8 + t * 2.5) * (0.5 + 0.6 * beat);
      attr.setXYZ(i, Math.cos(angle) * r, 0.15 * Math.sin(angle * 3 + t), Math.sin(angle) * r);
    }
    attr.needsUpdate = true;
    if (matRef.current) matRef.current.opacity = 0.25 + 0.35 * beat;
  });

  return (
    <lineLoop ref={geoRef} geometry={geometry}>
      <lineBasicMaterial
        ref={matRef}
        color="#fbbf24"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineLoop>
  );
}

function SceneContents() {
  const groupRef = useRef();

  const nodes = useMemo(() => {
    const list = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      // Evenly-ish distributed points on a sphere (Fibonacci lattice).
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = i * 2.399963; // golden angle
      list.push(
        new THREE.Vector3(
          Math.cos(theta) * radiusAtY * SPHERE_RADIUS,
          y * SPHERE_RADIUS,
          Math.sin(theta) * radiusAtY * SPHERE_RADIUS
        )
      );
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0001) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <NetworkNodes nodes={nodes} />
      <NetworkLines nodes={nodes} />
      <WaveformRing />
    </group>
  );
}

export default function HeroScene({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.8, 7], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}
