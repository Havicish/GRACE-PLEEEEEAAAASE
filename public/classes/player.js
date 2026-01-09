import * as THREE from "../../../node_modules/three/build/three.module.js";
import * as CANNON from "../../../node_modules/cannon-es/dist/cannon-es.js";
import { IsKeyDown, Mouse } from "../userInputManager.js";
import { PhysicsWorld, AddPhysicsBody } from "../physicsManager.js";
import { Camera3D } from "../render.js";
import { Canvas } from "../canvasManager.js";
import { MainConsole } from "../consoleManager.js";

export class Player {
  constructor(Position = new THREE.Vector3(0, 2, 0)) {
    this.Position = Position.clone();
    this.Speed = 0.3;
    this.JumpForce = 8;
    this.IsGrounded = false;
    this.MouseSensitivity = 0.002;
    this.JumpLastDown = false;

    this.MaxWallJumps = 2;
    this.WallJumpsDone = 0;
    
    // Camera setup
    this.Rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.Camera = Camera3D;
    this.Camera.position.copy(Position);
    
    // Physics body (invisible, just for collision)
    this.PhysicsBody = this.CreatePhysicsBody();
    this.PhysicsBody.position.set(Position.x, Position.y, Position.z);
    this.PhysicsBody.collisionFilterGroup = 1;
    this.PhysicsBody.collisionFilterMask = 2; // Can hit group 2 (static bodies)
    
    AddPhysicsBody(this.PhysicsBody);

    this.Light = new THREE.PointLight(0xffffff, 0.5);
    this.Light.position.set(0, 2, 0);
    this.Light2 = new THREE.PointLight(0xffffff, 0.5);
    this.Light2.position.set(0, 2, 0);
    this.Camera.add(this.Light);
    this.Time = 0;
    this.PerlinNoise = this.createPerlinNoise();
    this.Light.distance = 50;
    this.Light.decay = 1.7;
    this.Light.castShadow = true;
    this.Light.color = new THREE.Color(0xe88822);
    this.Light2.distance = 0.1;
    this.Light2.decay = 2;
    this.Light2.castShadow = true;
    this.Light2.color = new THREE.Color(0xe88822);
    this.ThingsToAddTo3DScene = [this.Light, this.Light2];
    
    // Request pointer lock on click
    document.addEventListener("mousedown", () => {
      Canvas.requestPointerLock();
    });
  }

  CreatePhysicsBody() {
    const Body = new CANNON.Body({
      mass: 1,
      linearDamping: 0.8,
      angularDamping: 1.0,
      fixedRotation: true
    });

    const Radius = 0.35;
    const SphereShape = new CANNON.Sphere(Radius);
    Body.addShape(SphereShape);
    
    return Body;
  }

  Update(DT) {
    // Update camera rotation based on mouse movement
    this.Rotation.y -= Mouse.DeltaX * this.MouseSensitivity;
    this.Rotation.x -= Mouse.DeltaY * this.MouseSensitivity;
    this.Rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.Rotation.x));

    this.Position.set(this.PhysicsBody.position.x, this.PhysicsBody.position.y, this.PhysicsBody.position.z);
    this.Light.position.copy(this.Position.add(new THREE.Vector3(Math.sin(this.Camera.rotation.y + Math.PI * 0.8) * 0.5, 0.2 + Math.max(this.Camera.rotation.x, -0.3) * 0.5, Math.cos(this.Camera.rotation.y + Math.PI * 0.8) * 0.5)));
    this.Light2.position.copy(this.Light.position);
    let Brightness = 3;
    this.Light.intensity = Brightness * this.PerlinNoise(this.Time * 5) + Brightness;
    Brightness /= 10;
    this.Light2.intensity = Brightness * this.PerlinNoise(this.Time * 5) + Brightness;
    this.Time += DT;
    
    this.Camera.rotation.copy(this.Rotation);

    // Ground check
    this.CheckGrounded();

    // Handle input relative to camera direction
    let InputDirection = new THREE.Vector3(0, 0, 0);

    if (IsKeyDown("W")) InputDirection.z -= 1;
    if (IsKeyDown("S")) InputDirection.z += 1;
    if (IsKeyDown("A")) InputDirection.x -= 1;
    if (IsKeyDown("D")) InputDirection.x += 1;
    if (IsKeyDown("Shift")) this.Speed = 1.75;
    else this.Speed = 0.8;

    if (InputDirection.length() > 0) {
      InputDirection.normalize();
      
      // Apply camera rotation to input direction
      const quat = new THREE.Quaternion();
      quat.setFromEuler(new THREE.Euler(0, this.Rotation.y, 0));
      InputDirection.applyQuaternion(quat);
      
      let Normal = this.CheckCanWallJump(new THREE.Vector3(-Math.sin(this.Camera.rotation.y), 0, -Math.cos(this.Camera.rotation.y)));
      if (Normal && !this.IsGrounded && IsKeyDown(" ") && !this.JumpLastDown && this.WallJumpsDone < this.MaxWallJumps && IsKeyDown("Shift")) {
        this.PhysicsBody.velocity.y = this.JumpForce;
        this.IsGrounded = false;
        this.JumpLastDown = true;
        this.WallJumpsDone += 1;

        // Push off from wall
        MainConsole.Log(JSON.stringify(Normal));
        this.PhysicsBody.velocity.x += Normal.x * 3 + Normal.x * this.Speed * 2 - Math.sin(this.Camera.rotation.y) * this.Speed * 2.8;
        this.PhysicsBody.velocity.z += Normal.z * 3 + Normal.z * this.Speed * 2 - Math.cos(this.Camera.rotation.y) * this.Speed * 2.8;

        return;
      }
      
      if (!this.IsGrounded) {
        this.Speed *= 0.17;
      } else {
        this.WallJumpsDone = 0;
      }

      InputDirection.multiplyScalar(this.Speed);

      this.PhysicsBody.velocity.x += InputDirection.x;
      this.PhysicsBody.velocity.z += InputDirection.z;
    }
    if (this.IsGrounded) {
      this.PhysicsBody.velocity.x *= 0.8;
      this.PhysicsBody.velocity.z *= 0.8;
    } else {
      this.PhysicsBody.velocity.x *= 0.98;
      this.PhysicsBody.velocity.z *= 0.98;
    }

    if (this.PhysicsBody.position.y < -1) {
      this.PhysicsBody.position.set(0, 5, 0);
      this.PhysicsBody.velocity.set(0, 0, 0);
    }

    let RaycastResult = this.Raycast(
      new CANNON.Vec3(this.PhysicsBody.position.x, this.PhysicsBody.position.y + 0.2, this.PhysicsBody.position.z),
      new CANNON.Vec3(this.PhysicsBody.position.x, this.PhysicsBody.position.y - 1, this.PhysicsBody.position.z)
    );
    if (RaycastResult && RaycastResult.hasHit) {
      MainConsole.Log("Hit normal: " + JSON.stringify(RaycastResult.hitNormalWorld));
    }

    // Jump
    if (!IsKeyDown(" ") && this.JumpLastDown)
      this.JumpLastDown = false;
    if (IsKeyDown(" ") && this.IsGrounded) {
      this.PhysicsBody.velocity.y = this.JumpForce;
      this.IsGrounded = false;
      this.JumpLastDown = true;
    }

    this.Camera.position.set(
      this.PhysicsBody.position.x,
      this.PhysicsBody.position.y + 0.35,
      this.PhysicsBody.position.z
    );
  }

  Raycast(From, To) {
    const Direction = new CANNON.Vec3(To.x - From.x, To.y - From.y, To.z - From.z);
    Direction.normalize();
    const Ray = new CANNON.Ray(From, Direction);
    Ray.to = new CANNON.Vec3(To.x, To.y, To.z);

    let Filter = {};
    Filter.collisionFilterGroup = 3;
    Filter.collisionFilterMask = 2;
    Filter.skipBackfaces = true;

    const result = new CANNON.RaycastResult();
    PhysicsWorld.raycastClosest(From, Ray.to, Filter, result);
    
    if (result.hasHit) {
      let HitPoint = new THREE.Vector3(result.hitPointWorld.x, result.hitPointWorld.y, result.hitPointWorld.z);
      let Normal = new THREE.Vector3(result.hitNormalWorld.x, result.hitNormalWorld.y, result.hitNormalWorld.z).add(HitPoint);
      let InvertNormal = new THREE.Vector3(-result.hitNormalWorld.x, -result.hitNormalWorld.y, -result.hitNormalWorld.z).add(HitPoint);
      let Distance = Normal.distanceTo(From);
      let InvertDistance = InvertNormal.distanceTo(From);

      if (Distance > InvertDistance)
        result.hitNormalWorld.x *= -1, result.hitNormalWorld.y *= -1, result.hitNormalWorld.z *= -1;

      return result;
    }
    return null;
  }

  CheckGrounded() {
    const From = new CANNON.Vec3(
      this.PhysicsBody.position.x,
      this.PhysicsBody.position.y - 0.3,
      this.PhysicsBody.position.z
    );
    
    const Direction = new CANNON.Vec3(0, -1, 0);
    const Ray = new CANNON.Ray(From, Direction);
    Ray.to = new CANNON.Vec3(From.x, From.y - 0.2, From.z);

    this.IsGrounded = false;

    for (let Body of PhysicsWorld.bodies) {
      if (Body === this.PhysicsBody) continue;
      
      const Result = new CANNON.RaycastResult();
      Ray.intersectBody(Body, Result);
      
      if (Result.hasHit) {
        this.IsGrounded = true;
        break;
      }
    }
  }

  CheckCanWallJump(MoveDirection) {
    for (let i = -1; i <= 1; i+=2) {
      const SideDirection = new THREE.Vector3().copy(MoveDirection);
      const Angle = Math.atan2(MoveDirection.z, MoveDirection.x) + (Math.PI / 2) * i;
      SideDirection.x = Math.cos(Angle);
      SideDirection.z = Math.sin(Angle);
      
      let Normal = this.CheckWallInDirection(SideDirection)
      if (Normal) {
        return Normal;
      }
    }
    return null;
  }

  CheckWallInDirection(MoveDirection) {
    // Start the ray slightly behind the player in the opposite direction
    const From = new CANNON.Vec3(
      this.PhysicsBody.position.x - MoveDirection.x * 0.2,
      this.PhysicsBody.position.y,
      this.PhysicsBody.position.z - MoveDirection.z * 0.2
    );
    const To = new CANNON.Vec3(
      From.x + MoveDirection.x * 0.9,
      From.y,
      From.z + MoveDirection.z * 0.9
    );

    const Result = this.Raycast(From, To);
    if (Result && Result.hasHit) {
      return new THREE.Vector3(Result.hitNormalWorld.x, Result.hitNormalWorld.y, Result.hitNormalWorld.z);
    }
    return null;
  }

  createPerlinNoise() {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor(Math.random() * 256);
    }
    for (let i = 0; i < 256; i++) {
      p[256 + i] = p[i];
    }

    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t, a, b) => a + t * (b - a);
    const grad = (hash, x) => {
      const h = hash & 15;
      const u = h < 8 ? x : -x;
      return u;
    };

    return (x) => {
      x = x % 256;
      if (x < 0) x += 256;
      
      const xi = Math.floor(x) & 255;
      const xf = x - Math.floor(x);
      
      const u = fade(xf);
      
      const aa = p[p[xi]];
      const ab = p[p[xi + 1]];
      
      const g1 = grad(aa, xf);
      const g2 = grad(ab, xf - 1);
      
      const x1 = lerp(u, g1, g2);
      
      return Math.max(0, Math.min(1, (x1 + 1) / 2));
    };
  }
}