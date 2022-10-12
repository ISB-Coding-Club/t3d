import { Class3D } from "./common";
import { Euler } from "./euler";
import { Quaternion } from "./quaternion";

export class Vector3 extends Class3D<Vector3> {
    public constructor(x?: number, y?: number, z?: number) {
        super(x, y, z);
    }

    public applyEuler(euler: Euler): Vector3 {
        return this.applyQuaternion(Quaternion.fromEuler(euler));
    }

    public applyQuaternion(quaternion: Quaternion): Vector3 {
        const { x, y, z } = this;
        const { x: qx, y: qy, z: qz, w: qw } = quaternion;

        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;

        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    }

    public toArray(): number[] {
        return [this.x, this.y, this.z];
    }
}
