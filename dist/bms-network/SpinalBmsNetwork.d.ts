import { Model } from 'spinal-core-connectorjs_type';
declare class SpinalBmsNetwork extends Model {
    static relationName: string;
    static nodeTypeName: string;
    id: spinal.Str;
    name: spinal.Str;
    constructor(name?: string, type?: string, id?: string);
}
export default SpinalBmsNetwork;
export { SpinalBmsNetwork };
