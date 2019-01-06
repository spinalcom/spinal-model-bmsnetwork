import { Model } from 'spinal-core-connectorjs_type';
declare class SpinalBmsDevice extends Model {
    static relationName: string;
    static nodeTypeName: string;
    id: spinal.Str;
    name: spinal.Str;
    type: spinal.Str;
    path: spinal.Str;
    constructor(name?: string, type?: string, path?: string, id?: string);
}
export default SpinalBmsDevice;
export { SpinalBmsDevice };
