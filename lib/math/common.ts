export class Class3D<T extends Class3D = any> {
    private _x: number;
    private _y: number;
    private _z: number;

    public constructor(x?: number, y?: number, z?: number) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get z(): number {
        return this._z;
    }

    public set x(x: number) {
        this._x = x;
    }

    public set y(y: number) {
        this._y = y;
    }

    public set z(z: number) {
        this._z = z;
    }

    public setX(x: number): T {
        this.x = x;
        return this as unknown as T;
    }

    public setY(y: number): T {
        this.y = y;
        return this as unknown as T;
    }

    public setZ(z: number): T {
        this.z = z;
        return this as unknown as T;
    }

    public set(x: number | T, y?: number, z?: number) {
        if (x instanceof Class3D) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x;
            this.y = y || this.y;
            this.z = z || this.z;
        }
    }
}
