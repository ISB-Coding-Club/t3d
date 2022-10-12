import { Class3D } from "./common";
import { Euler, EulerOrder } from "./euler";

export class Quaternion extends Class3D<Quaternion> {
    private _w: number;

    public constructor(x?: number, y?: number, z?: number, w?: number) {
        super(x, y, z);

        this._w = w || 1;
    }

    public get w() {
        return this._w;
    }

    public set w(w: number) {
        this._w = w;
    }

    public setW(w: number): Quaternion {
        this._w = w;
        return this;
    }

    public static fromEuler(euler: Euler): Quaternion {
        const { x, y, z, order } = euler;

        const cos = Math.cos;
        const sin = Math.sin;

        const c1 = cos(x / 2);
        const c2 = cos(y / 2);
        const c3 = cos(z / 2);

        const s1 = sin(x / 2);
        const s2 = sin(y / 2);
        const s3 = sin(z / 2);

        const quaternion = new Quaternion(0, 0, 0, 1);

        switch (order) {
            case EulerOrder.XYZ:
                quaternion.x = s1 * c2 * c3 + c1 * s2 * s3;
                quaternion.y = c1 * s2 * c3 - s1 * c2 * s3;
                quaternion.z = c1 * c2 * s3 + s1 * s2 * c3;
                quaternion.w = c1 * c2 * c3 - s1 * s2 * s3;

                break;

            case EulerOrder.YXZ:
                quaternion.x = s1 * c2 * c3 + c1 * s2 * s3;
                quaternion.y = c1 * s2 * c3 - s1 * c2 * s3;
                quaternion.z = c1 * c2 * s3 - s1 * s2 * c3;
                quaternion.w = c1 * c2 * c3 + s1 * s2 * s3;

                break;

            case EulerOrder.ZXY:
                quaternion.x = s1 * c2 * c3 - c1 * s2 * s3;
                quaternion.y = c1 * s2 * c3 + s1 * c2 * s3;
                quaternion.z = c1 * c2 * s3 + s1 * s2 * c3;
                quaternion.w = c1 * c2 * c3 - s1 * s2 * s3;

                break;

            case EulerOrder.ZYX:
                quaternion.x = s1 * c2 * c3 - c1 * s2 * s3;
                quaternion.y = c1 * s2 * c3 + s1 * c2 * s3;
                quaternion.z = c1 * c2 * s3 - s1 * s2 * c3;
                quaternion.w = c1 * c2 * c3 + s1 * s2 * s3;

                break;

            case EulerOrder.YZX:
                quaternion.x = s1 * c2 * c3 + c1 * s2 * s3;
                quaternion.y = c1 * s2 * c3 + s1 * c2 * s3;
                quaternion.z = c1 * c2 * s3 - s1 * s2 * c3;
                quaternion.w = c1 * c2 * c3 - s1 * s2 * s3;

                break;

            case EulerOrder.XZY:
                quaternion.x = s1 * c2 * c3 - c1 * s2 * s3;
                quaternion.y = c1 * s2 * c3 - s1 * c2 * s3;
                quaternion.z = c1 * c2 * s3 + s1 * s2 * c3;
                quaternion.w = c1 * c2 * c3 + s1 * s2 * s3;

                break;

            default:
                console.warn(
                    `Quaternion fromEuler() encountered an unknown order: ${order}`
                );
        }

        return quaternion;
    }

    public toArray(): number[] {
        return [this.x, this.y, this.z, this.w];
    }
}
