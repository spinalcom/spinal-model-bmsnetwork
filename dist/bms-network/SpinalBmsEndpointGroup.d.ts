import { Model } from 'spinal-core-connectorjs_type';
declare class SpinalBmsEndpointGroup extends Model {
    static relationName: string;
    static nodeTypeName: string;
    id: spinal.Str;
    name: spinal.Str;
    type: spinal.Str;
    path: spinal.Str;
    constructor(name?: string, type?: string, path?: string, id?: string);
}
export default SpinalBmsEndpointGroup;
export { SpinalBmsEndpointGroup };
