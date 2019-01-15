/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
import {
  SpinalGraphService,
  SpinalContext,
  SPINAL_RELATION_TYPE,
} from 'spinal-env-viewer-graph-service';
import {
  InputDataDevice,
  InputDataEndpoint,
  InputDataEndpointGroup,
  InputDataEndpointType,
  InputDataEndpointDataType,
} from './InputDataModel/InputDataModel';
import {
  SpinalBmsDevice,
  SpinalBmsNetwork,
  SpinalBmsEndpoint,
  SpinalBmsEndpointGroup,
} from './SpinalBms';
import { ConfigService } from './Utils/ConfigService';
import { Model } from 'spinal-core-connectorjs_type';

import {
  SpinalServiceTimeseries,
  SpinalTimeSeries,
  SpinalTimeSeriesArchive,
  SpinalTimeSeriesArchiveDay,
  SpinalDateValue,
  SpinalDateValueArray,
} from 'spinal-model-timeseries';

/**
 * @export
 * @class NetworkService
 */
export class NetworkService {
  private context: SpinalContext<any>;
  private contextId: string;
  private networkId: string;
  private spinalServiceTimeseries: SpinalServiceTimeseries;

  /**
   *Creates an instance of NetworkService.
   * @memberof NetworkService
   */
  constructor() {
    this.spinalServiceTimeseries = new SpinalServiceTimeseries();
  }

  /**
   * @param {spinal.Model} forgeFile
   * @param {ConfigService} configService
   * @returns {Promise<{contextId:string, networkId: string}>}
   * @memberof NetworkService
   */
  public async init(forgeFile: spinal.Model, configService: ConfigService)
  : Promise<{contextId:string, networkId: string}> {
    await SpinalGraphService.setGraphFromForgeFile(forgeFile);

    this.context = SpinalGraphService.getContext(configService.contextName);
    if (this.context === undefined) {
      this.context =
        await SpinalGraphService.addContext(configService.contextName,
                                            configService.contextType,
                                            new Model(),
          );
    }
    this.contextId = this.context.getId().get();

    const childrenContext =
      await SpinalGraphService.getChildrenInContext(this.contextId, this.contextId);
    let childFoundId: string = '';
    for (const childContext of childrenContext) {
      if (typeof childContext.networkName !== 'undefined' &&
      childContext.networkName.get() === configService.networkType) {
        childFoundId = childContext.id.get();
        break;
      }
    }
    if (childFoundId === '') {
      childFoundId = await this.createNewBmsNetwork(
          this.contextId,
          configService.networkType,
          configService.networkName,
          ).then(res => <string>res.id.get());
    }
    this.networkId = childFoundId;
    return { contextId: this.contextId, networkId: childFoundId };
  }

  /**
   * @param {string} parentId
   * @param {string} typeName
   * @param {string} networkName
   * @returns {Promise<any>}
   * @memberof NetworkService
   */
  public async createNewBmsNetwork(parentId: string, typeName: string, networkName: string)
  : Promise<any> {
    const res = new SpinalBmsNetwork(
      networkName,
      typeName,
    );
    const tmpInfo = {
      networkName,
      typeName,
      type: SpinalBmsNetwork.nodeTypeName,
      name: typeName,
      idNetwork: res.id.get(),
    };
    const childId = SpinalGraphService.createNode(tmpInfo, res);
    await SpinalGraphService.addChildInContext(
      parentId,
      childId,
      this.contextId,
      SpinalBmsDevice.relationName,
      SPINAL_RELATION_TYPE,
      );
    return SpinalGraphService.getInfo(childId);
  }

  /**
   * @param {string} parentId
   * @param {InputDataDevice} obj
   * @returns {Promise<any>}
   * @memberof NetworkService
   */
  public async createNewBmsDevice(parentId: string, obj: InputDataDevice): Promise<any> {
    const res = new SpinalBmsDevice(
      obj.name,
      obj.type,
      obj.path,
      obj.id,
    );
    const tmpInfo = { type: SpinalBmsDevice.nodeTypeName, name: obj.name, idNetwork: obj.id };
    const childId = SpinalGraphService.createNode(tmpInfo, res);
    await SpinalGraphService.addChildInContext(
      parentId,
      childId,
      this.contextId,
      SpinalBmsDevice.relationName,
      SPINAL_RELATION_TYPE,
      );
    return SpinalGraphService.getInfo(childId);
  }

  /**
   * @param {string} parentId
   * @param {InputDataEndpointGroup} obj
   * @returns {Promise<any>}
   * @memberof NetworkService
   */
  public async createNewBmsEndpointGroup(parentId: string, obj: InputDataEndpointGroup)
  : Promise<any> {
    const res = new SpinalBmsEndpointGroup(
      obj.name,
      obj.type,
      obj.path,
      obj.id,
    );
    const tmpInfo = { type:SpinalBmsEndpointGroup.nodeTypeName, name: obj.name, idNetwork: obj.id };
    const childId = SpinalGraphService.createNode(tmpInfo, res);
    await SpinalGraphService.addChildInContext(
      parentId,
      childId,
      this.contextId,
      SpinalBmsEndpointGroup.relationName,
      SPINAL_RELATION_TYPE,
      );
    return SpinalGraphService.getInfo(childId);

  }

  /**
   * @param {string} parentId
   * @param {InputDataEndpoint} obj
   * @returns {Promise<any>}
   * @memberof NetworkService
   */
  public async createNewBmsEndpoint(parentId: string, obj: InputDataEndpoint)
  : Promise<any> {
    const res = new SpinalBmsEndpoint(
      obj.name,
      obj.path,
      obj.currentValue,
      obj.unit,
      InputDataEndpointDataType[obj.dataType],
      InputDataEndpointType[obj.type],
      obj.id,
    );
    const tmpInfo = { type: SpinalBmsEndpoint.nodeTypeName, name: obj.name, idNetwork: obj.id };
    const childId = SpinalGraphService.createNode(tmpInfo, res);
    await SpinalGraphService.addChildInContext(
      parentId,
      childId,
      this.contextId,
      SpinalBmsEndpoint.relationName,
      SPINAL_RELATION_TYPE,
      );
    return SpinalGraphService.getInfo(childId);
  }

  /**
   * @param {InputDataDevice} obj
   * @returns {Promise<void>}
   * @memberof NetworkService
   */
  public async updateData(obj: InputDataDevice): Promise<void> {
    const contextChildren =
      await SpinalGraphService.getChildrenInContext(this.networkId, this.contextId);

    for (const child of contextChildren) {
      if (typeof child.idNetwork !== 'undefined' && child.idNetwork.get() === obj.id) {
        return this.updateModel(child, obj);
      }
    }
    return this.createNewBmsDevice(this.networkId, obj).then((child) => {
      return this.updateModel(child, <InputDataDevice>obj);
    });
  }

  /**
   * @private
   * @param {*} node
   * @param {(InputDataDevice | InputDataEndpointGroup)} reference
   * @returns {Promise<void>}
   * @memberof NetworkService
   */
  private async updateModel(node: any,
                            reference: InputDataDevice | InputDataEndpointGroup,
    ): Promise<void> {
    const contextChildren =
      await SpinalGraphService.getChildrenInContext(node.id.get(), this.contextId);
    const notPresent = [];
    const promises : Promise<void>[] = [];

    for (const refChild of reference.children) {
      let childFound = false;
      for (const child of contextChildren) {
        if (child.idNetwork.get() === refChild.id) {
          switch (child.type.get()) {
            case SpinalBmsDevice.nodeTypeName:
              promises.push(this.updateModel(child, <InputDataDevice>refChild));
              childFound = true;
              break;
            case SpinalBmsEndpointGroup.nodeTypeName:
              promises.push(this.updateModel(child, <InputDataEndpointGroup>refChild));
              childFound = true;
              break;
            case SpinalBmsEndpoint.nodeTypeName:
              promises.push(this.updateEndpoint(child, <InputDataEndpoint>refChild));
              childFound = true;
              break;
            default:
              break;
          }
        }
      }
      if (!childFound) {
        notPresent.push(refChild);
      }
    }

    let prom: Promise<any>;
    for (const item of notPresent) {
      switch (item.nodeTypeName) {
        case SpinalBmsDevice.nodeTypeName:
          prom = this.createNewBmsDevice(node.id.get(), item).then((child) => {
            return this.updateModel(child, <InputDataDevice>item);
          });
          promises.push(prom);
          break;
        case SpinalBmsEndpointGroup.nodeTypeName:
          prom = this.createNewBmsEndpointGroup(node.id.get(), item).then((child) => {
            return this.updateModel(child, <InputDataEndpointGroup>item);
          });
          promises.push(prom);
          break;
        case SpinalBmsEndpoint.nodeTypeName:
          prom = this.createNewBmsEndpoint(node.id.get(), item).then((child) => {
            return this.updateEndpoint(child, <InputDataEndpoint>item);
          });
          promises.push(prom);
          break;
        default:
          break;
      }
    }
    await Promise.all(promises);
  }

  /**
   * @param {*} node
   * @param {InputDataEndpoint} reference
   * @returns {Promise<void>}
   * @memberof NetworkService
   */
  async updateEndpoint(node: any, reference: InputDataEndpoint): Promise<void> {
    const element: SpinalBmsEndpoint = await node.element.load();

    element.currentValue.set(reference.currentValue);
    if (typeof reference.currentValue === 'number' || typeof reference.currentValue === 'boolean') {
      await this.spinalServiceTimeseries.pushFromEndpoint(node.id.get(),
                                                          reference.currentValue);
    }
  }

  /**
   * @returns {Promise<string[]>}
   * @memberof NetworkService
   */
  async getNetworks(): Promise<string[]> {
    const childrenContext =
      await SpinalGraphService.getChildrenInContext(this.contextId, this.contextId);
    return childrenContext.map(element => element.id.get());
  }

  /**
   * @param {string} idNetwork
   * @returns {Promise<string[]>}
   * @memberof NetworkService
   */
  async getDevices(idNetwork: string): Promise<string[]> {
    const networkNode = SpinalGraphService.getRealNode(idNetwork);
    const relationNames = [
      SpinalBmsDevice.relationName,
      SpinalBmsEndpointGroup.relationName,
      SpinalBmsEndpoint.relationName,
    ];
    const childrenContext = await networkNode.find(relationNames, (node) => {
      if (node.getType().get() === SpinalBmsDevice.nodeTypeName) {
        return true;
      }
      return false;
    });
    return childrenContext.map(element => element.id.get());
  }

  /**
   * @param {string} idNode
   * @returns {spinal.Model}
   * @memberof NetworkService
   */
  getInfo(idNode: string): spinal.Model {
    return SpinalGraphService.getInfo(idNode);
  }

  /**
   * @param {string} idNode
   * @returns {Promise<spinal.Model>}
   * @memberof NetworkService
   */
  getData(idNode: string): Promise<spinal.Model> {
    return SpinalGraphService.getInfo(idNode).element.load();
  }
  /**
   * @param {string} idEndpoint
   * @returns {Promise<SpinalTimeSeries>}
   * @memberof NetworkService
   */
  getTimeseries(idEndpoint: string): Promise<SpinalTimeSeries>  {
    return this.spinalServiceTimeseries.getOrCreateTimeSeries(idEndpoint);
  }

  /**
   * @param {string} idEndpoint
   * @param {(string|boolean|number)} value
   * @param {(number|string|Date)} [date=null]
   * @returns {Promise<boolean>}
   * @memberof NetworkService
   */
  async setEndpointValue(idEndpoint: string,
                         value: string|boolean|number,
                         date: number|string|Date = null): Promise<boolean> {
    const node = SpinalGraphService.getInfo(idEndpoint);
    const element: SpinalBmsEndpoint =  <SpinalBmsEndpoint> await node.element.load();
    element.currentValue.set(value);

    if (typeof value === 'number' || typeof value === 'boolean') {
      if (date === null) {
        return this.spinalServiceTimeseries.pushFromEndpoint(idEndpoint, value);
      }
      return this.spinalServiceTimeseries.insertFromEndpoint(idEndpoint, value, date);
    }
  }
}

export default NetworkService;
export { ConfigService };
export {
  InputDataDevice,
  InputDataEndpoint,
  InputDataEndpointGroup,
  InputDataEndpointType,
  InputDataEndpointDataType,
};
export {
  SpinalBmsDevice,
  SpinalBmsNetwork,
  SpinalBmsEndpoint,
  SpinalBmsEndpointGroup,
};

export {
  SpinalServiceTimeseries,
  SpinalTimeSeries,
  SpinalTimeSeriesArchive,
  SpinalTimeSeriesArchiveDay,
  SpinalDateValue,
  SpinalDateValueArray,
};
