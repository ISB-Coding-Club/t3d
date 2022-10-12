import { Class3D } from "./common";

export enum EulerOrder {
    XYZ,
    YZX,
    ZXY,
    XZY,
    YXZ,
    ZYX,
}

export const getEulerOrderIndex = (order: EulerOrder) => {
    switch (order) {
        case EulerOrder.XYZ:
            return 0;

        case EulerOrder.YZX:
            return 1;

        case EulerOrder.ZXY:
            return 2;

        case EulerOrder.XZY:
            return 3;

        case EulerOrder.YXZ:
            return 4;

        case EulerOrder.ZYX:
            return 5;

        default:
            return 0;
    }
};

export class Euler extends Class3D<Euler> {
    private _order: EulerOrder;

    public constructor(x?: number, y?: number, z?: number, order?: EulerOrder) {
        super(x, y, z);
        this._order = order || EulerOrder.XYZ;
    }

    public get order(): EulerOrder {
        return this._order;
    }

    public set order(order: EulerOrder) {
        this._order = order;
    }

    public setOrder(order: EulerOrder): Euler {
        this._order = order;
        return this;
    }

    public toArray(): number[] {
        return [this.x, this.y, this.z, getEulerOrderIndex(this.order)];
    }
}
