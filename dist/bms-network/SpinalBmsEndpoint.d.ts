import { Model } from 'spinal-core-connectorjs_type';
declare class SpinalBmsEndpoint extends Model {
    static relationName: string;
    static nodeTypeName: string;
    id: spinal.Str;
    path: spinal.Str;
    currentValue: spinal.Str | spinal.Val;
    unit: spinal.Str;
    type: spinal.Str;
    dataType: spinal.Str;
    constructor(name?: string, path?: string, currentValue?: string | number, unit?: string, dataType?: string, type?: string, id?: string);
}
export default SpinalBmsEndpoint;
export { SpinalBmsEndpoint };
