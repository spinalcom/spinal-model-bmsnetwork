import { InputDataDevice, InputDataEndpoint, InputDataEndpointGroup, InputDataEndpointType, InputDataEndpointDataType } from './InputDataModel/InputDataModel';
import { SpinalBmsDevice, SpinalBmsNetwork, SpinalBmsEndpoint, SpinalBmsEndpointGroup } from './SpinalBms';
import { ConfigService } from './Utils/ConfigService';
import { SpinalServiceTimeseries, SpinalTimeSeries, SpinalTimeSeriesArchive, SpinalTimeSeriesArchiveDay, SpinalDateValue, SpinalDateValueArray } from 'spinal-model-timeseries';
/**
 * @export
 * @class NetworkService
 */
export declare class NetworkService {
    private context;
    private contextId;
    private networkId;
    private spinalServiceTimeseries;
    /**
     *Creates an instance of NetworkService.
     * @memberof NetworkService
     */
    constructor();
    /**
     * @param {spinal.Model} forgeFile
     * @param {ConfigService} configService
     * @returns {Promise<{contextId:string, networkId: string}>}
     * @memberof NetworkService
     */
    init(forgeFile: spinal.Model, configService: ConfigService): Promise<{
        contextId: string;
        networkId: string;
    }>;
    /**
     * @param {string} parentId
     * @param {string} typeName
     * @param {string} networkName
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsNetwork(parentId: string, typeName: string, networkName: string): Promise<any>;
    /**
     * @param {string} parentId
     * @param {InputDataDevice} obj
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsDevice(parentId: string, obj: InputDataDevice): Promise<any>;
    /**
     * @param {string} parentId
     * @param {InputDataEndpointGroup} obj
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsEndpointGroup(parentId: string, obj: InputDataEndpointGroup): Promise<any>;
    /**
     * @param {string} parentId
     * @param {InputDataEndpoint} obj
     * @returns {Promise<any>}
     * @memberof NetworkService
     */
    createNewBmsEndpoint(parentId: string, obj: InputDataEndpoint): Promise<any>;
    /**
     * @param {InputDataDevice} obj
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    updateData(obj: InputDataDevice): Promise<void>;
    /**
     * @private
     * @param {*} node
     * @param {(InputDataDevice | InputDataEndpointGroup)} reference
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    private updateModel;
    /**
     * @param {*} node
     * @param {InputDataEndpoint} reference
     * @returns {Promise<void>}
     * @memberof NetworkService
     */
    updateEndpoint(node: any, reference: InputDataEndpoint): Promise<void>;
    /**
     * @returns {Promise<string[]>}
     * @memberof NetworkService
     */
    getNetworks(): Promise<string[]>;
    /**
     * @param {string} idNetwork
     * @returns {Promise<string[]>}
     * @memberof NetworkService
     */
    getDevices(idNetwork: string): Promise<string[]>;
    /**
     * @param {string} idNode
     * @returns {spinal.Model}
     * @memberof NetworkService
     */
    getInfo(idNode: string): spinal.Model;
    /**
     * @param {string} idNode
     * @returns {Promise<spinal.Model>}
     * @memberof NetworkService
     */
    getData(idNode: string): Promise<spinal.Model>;
    /**
     * @param {string} idEndpoint
     * @returns {Promise<SpinalTimeSeries>}
     * @memberof NetworkService
     */
    getTimeseries(idEndpoint: string): Promise<SpinalTimeSeries>;
    /**
     * @param {string} idEndpoint
     * @param {(string|boolean|number)} value
     * @param {(number|string|Date)} [date=null]
     * @returns {Promise<boolean>}
     * @memberof NetworkService
     */
    setEndpointValue(idEndpoint: string, value: string | boolean | number, date?: number | string | Date): Promise<boolean>;
}
export default NetworkService;
export { ConfigService };
export { InputDataDevice, InputDataEndpoint, InputDataEndpointGroup, InputDataEndpointType, InputDataEndpointDataType, };
export { SpinalBmsDevice, SpinalBmsNetwork, SpinalBmsEndpoint, SpinalBmsEndpointGroup, };
export { SpinalServiceTimeseries, SpinalTimeSeries, SpinalTimeSeriesArchive, SpinalTimeSeriesArchiveDay, SpinalDateValue, SpinalDateValueArray, };
