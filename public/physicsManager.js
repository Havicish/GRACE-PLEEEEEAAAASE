import * as CANNON from "../../node_modules/cannon-es/dist/cannon-es.js";

export let PhysicsWorld = new CANNON.World();
PhysicsWorld.gravity.set(0, -16, 0);
PhysicsWorld.defaultContactMaterial.friction = 0;
PhysicsWorld.defaultContactMaterial.restitution = 0;

let PhysicsBodies = [];
let MeshPhysicsMap = new Map(); // Track which meshes have physics bodies

export function AddPhysicsBody(Body) {
  PhysicsWorld.addBody(Body);
  PhysicsBodies.push(Body);
}

export function RemovePhysicsBody(Body) {
  PhysicsWorld.removeBody(Body);
  PhysicsBodies = PhysicsBodies.filter(b => b !== Body);
}

export function UpdatePhysics(DT) {
  PhysicsWorld.step(1 / 60, DT, 3);
  
  // Update mesh positions from physics bodies (only for dynamic bodies)
  for (let [Mesh, Body] of MeshPhysicsMap) {
    if (Body.mass > 0) {
      // Dynamic body - sync FROM physics TO mesh
      Mesh.position.set(Body.position.x, Body.position.y, Body.position.z);
      Mesh.quaternion.set(Body.quaternion.x, Body.quaternion.y, Body.quaternion.z, Body.quaternion.w);
    } else {
      // Static body - sync FROM mesh TO physics (for spinning/moving meshes)
      Body.position.set(Mesh.position.x, Mesh.position.y, Mesh.position.z);
      Body.quaternion.set(Mesh.quaternion.x, Mesh.quaternion.y, Mesh.quaternion.z, Mesh.quaternion.w);
    }
  }
}

export function AddMeshToPhysics(Mesh) {
  // Get geometry bounds
  if (!Mesh.geometry.boundingBox) {
    Mesh.geometry.computeBoundingBox();
  }
  
  const bb = Mesh.geometry.boundingBox;
  const halfExtents = new CANNON.Vec3(
    (bb.max.x - bb.min.x) * Mesh.scale.x * 0.5,
    (bb.max.y - bb.min.y) * Mesh.scale.y * 0.5,
    (bb.max.z - bb.min.z) * Mesh.scale.z * 0.5
  );

  const Shape = new CANNON.Box(halfExtents);

  const Body = new CANNON.Body({
    mass: 0, // Static
    shape: Shape
  });

  Body.collisionFilterGroup = 2; // Static bodies group
  Body.collisionFilterMask = 1;  // Can collide with group 1 (player)

  Body.position.set(Mesh.position.x, Mesh.position.y, Mesh.position.z);
  Body.quaternion.set(Mesh.quaternion.x, Mesh.quaternion.y, Mesh.quaternion.z, Mesh.quaternion.w);
  
  AddPhysicsBody(Body);
  MeshPhysicsMap.set(Mesh, Body);
  return Body;
}