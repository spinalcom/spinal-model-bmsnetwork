import { InputDataEndpointDataType } from "./InputDataEndpointDataType";
import { InputDataEndpointType } from "./InputDataEndpointType";
/**
 * @property {string} id
 * @property {string} name
 * @property {string} path
 * @property {number|string} currentValue;
 * @property {string} unit
 * @property {InputDataEndpointDataType} dataType
 * @property {InputDataEndpointType} type
 * @property {string} nodeTypeName should be SpinalBmsEndpoint.nodeTypeName || 'BmsEndpoint'
 * @export
 * @class InputDataEndpoint
 */
export declare class InputDataEndpoint {
    id: string;
    name: string;
    path: string;
    unit: string;
    dataType: InputDataEndpointDataType;
    type: InputDataEndpointType;
    nodeTypeName: string;
    private _modifiedValue;
    private _currentValue;
    get currentValue(): number | string | boolean;
    set currentValue(v: number | string | boolean);
    resetModifiedValue(): void;
    get modifiedValue(): boolean;
}
