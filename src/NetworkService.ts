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
import { Model } from 'spinal-core-connectorjs_type';

import {
  SPINAL_RELATION_PTR_LST_TYPE,
  SpinalContext,
  SpinalGraphService,
  SpinalNode,
  SpinalNodeRef,
} from 'spinal-env-viewer-graph-service';

import {
  SpinalDateValue,
  SpinalDateValueArray,
  SpinalServiceTimeseries,
  SpinalTimeSeries,
  SpinalTimeSeriesArchive,
  SpinalTimeSeriesArchiveDay,
} from 'spinal-model-timeseries';

import {
  InputDataDevice,
  InputDataEndpoint,
  InputDataEndpointDataType,
  InputDataEndpointGroup,
  InputDataEndpointType,
} from './InputDataModel/InputDataModel';

import {
  SpinalBmsDevice,
  SpinalBmsEndpoint,
  SpinalBmsEndpointGroup,
  SpinalBmsNetwork,
} from './SpinalBms';

import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';

import { ConfigService } from './Utils/ConfigService';
const throttle = require('lodash.throttle');


/**
 * @export
 * @class NetworkService
 */
export class NetworkService {
  private context: SpinalContext<any>;
  private contextId: string;
  private networkId: string;
  private spinalServiceTimeseries: SpinalServiceTimeseries;
  public useDelay: number;
  public useTimeseries: boolean;
  /**
   *Creates an instance of NetworkService.
   * @memberof NetworkService
   */
  constructor(useTimeseries = true) {
    this.spinalServiceTimeseries = new SpinalServiceTimeseries();
    this.useTimeseries = useTimeseries;
    this.useDelay = 0;
  }
  setupDelay(timeout: number): void {
    this.useDelay = timeout;
  }

  /**
   * @param {spinal.Model} forgeFile
   * @param {ConfigService} configService
   * @param {boolean} [autoCreate=true]
   * @returns {Promise<{contextId:string, networkId: string}>}
   * @memberof NetworkService
   */
  public async init(
    forgeFile: spinal.Model,
    configService: ConfigService,
    autoCreate: boolean = true,
  ): Promise<{ contextId: string; networkId: string }> {
    await SpinalGraphService.setGraph(<any>forgeFile);

    this.context = SpinalGraphService.getContext(configService.contextName);

    if (this.context === undefined) {
      if (autoCreate === true) {
        this.context = await SpinalGraphService.addContext(
          configService.contextName,
          configService.contextType,
          new Model(),
        );
      } else {
        throw Error(
          `Context named "${configService.contextName}" is not found in the graph.`,
        );
      }
    }
    this.contextId = this.context.getId().get();

    const childrenContext = await SpinalGraphService.getChildrenInContext(
      this.contextId,
      this.contextId,
    );

    let childFoundId: string = '';
    for (const childContext of childrenContext) {
      if (typeof childContext.networkName !== 'undefined' &&
        childContext.networkName.get() === configService.networkName) {
        childFoundId = childContext.id.get();
        break;
      }
    }
    if (childFoundId === '') {
      childFoundId = await this
        .createNewBmsNetwork(
          this.contextId,
          configService.networkType,
          configService.networkName,
        )
        .then(res => <string>res.id.get());
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
  public async createNewBmsNetwork(
    parentId: string,
    typeName: string,
    networkName: string,
  ): Promise<any> {
    const res = new SpinalBmsNetwork(networkName, typeName);
    const tmpInfo = {
      networkName,
      typeName,
      type: SpinalBmsNetwork.nodeTypeName,
      name: networkName,
      idNetwork: res.id.get(),
    };
    const childId = SpinalGraphService.createNode(tmpInfo, res);
    await SpinalGraphService.addChildInContext(
      parentId,
      childId,
      this.contextId,
      SpinalBmsNetwork.relationName,
      SPINAL_RELATION_PTR_LST_TYPE,
    );
    return SpinalGraphService.getInfo(childId);
  }

  /**
   * @param {string} parentId
   * @param {InputDataDevice} obj
   * @returns {Promise<any>}
   * @memberof NetworkService
   */
  public async createNewBmsDevice(
    parentId: string,
    obj: InputDataDevice,
  ): Promise<any> {
    const res = new SpinalBmsDevice(obj.name, obj.type, obj.path, obj.id);
    const tmpInfo = {
      type: SpinalBmsDevice.nodeTypeName,
      name: obj.name,
      idNetwork: obj.id,
    };
    const childId = SpinalGraphService.createNode(tmpInfo, res);
    await SpinalGraphService.addChildInContext(
      parentId,
      childId,
      this.contextId,
      SpinalBmsDevice.relationName,
      SPINAL_RELATION_PTR_LST_TYPE,
    );
    await this._createAttributes(childId, res);
    return SpinalGraphService.getInfo(childId);
  }

  /**
   * @param {string} parentId
   * @param {InputDataEndpointGroup} obj
   * @returns {Promise<any>}
   * @memberof NetworkService
   */
  public async createNewBmsEndpointGroup(
    parentId: string,
    obj: InputDataEndpointGroup,
  ): Promise<any> {
    const res = new SpinalBmsEndpointGroup(
      obj.name,
      obj.type,
      obj.path,
      obj.id,
    );
    const tmpInfo = {
      type: SpinalBmsEndpointGroup.nodeTypeName,
      name: obj.name,
      idNetwork: obj.id,
    };
    const childId = SpinalGraphService.createNode(tmpInfo, res);
    await SpinalGraphService.addChildInContext(
      parentId,
      childId,
      this.contextId,
      SpinalBmsEndpointGroup.relationName,
      SPINAL_RELATION_PTR_LST_TYPE,
    );

    await this._createAttributes(childId, res);

    return SpinalGraphService.getInfo(childId);
  }

  /**
   * @param {string} parentId
   * @param {InputDataEndpoint} obj
   * @returns {Promise<any>}
   * @memberof NetworkService
   */
  public async createNewBmsEndpoint(parentId: string, obj: InputDataEndpoint ): Promise<any> {
    const res = new SpinalBmsEndpoint(
      obj.name,
      obj.path,
      obj.currentValue,
      obj.unit,
      InputDataEndpointDataType[obj.dataType],
      InputDataEndpointType[obj.type],
      obj.id,
    );
    const tmpInfo = {
      type: SpinalBmsEndpoint.nodeTypeName,
      name: obj.name,
      idNetwork: obj.id,
    };

    const childId = SpinalGraphService.createNode(tmpInfo, res);

    await SpinalGraphService.addChildInContext(parentId, childId, this.contextId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);

    await this._createAttributes(childId, res);

    return SpinalGraphService.getInfo(childId);
  }

  public async createNewBmsEndpointWithoutContext(parentId: string, obj: InputDataEndpoint ): Promise<SpinalNodeRef> {
    const res = new SpinalBmsEndpoint(
      obj.name,
      obj.path,
      obj.currentValue,
      obj.unit,
      InputDataEndpointDataType[obj.dataType],
      InputDataEndpointType[obj.type],
      obj.id,
    );
    const tmpInfo = {
      type: SpinalBmsEndpoint.nodeTypeName,
      name: obj.name,
      idNetwork: obj.id,
    };

    const childId = SpinalGraphService.createNode(tmpInfo, res);

    await SpinalGraphService.addChild(parentId, childId, SpinalBmsEndpoint.relationName, SPINAL_RELATION_PTR_LST_TYPE);

    await this._createAttributes(childId, res);
    return SpinalGraphService.getInfo(childId);
  }

  /**
   * @param {InputDataDevice} obj
   * @param {*} [date=null]
   * @returns {Promise<void>}
   * @memberof NetworkService
   */
  public async updateData(obj: InputDataDevice, date: any = null): Promise<void> {
    const contextChildren = await SpinalGraphService.getChildrenInContext(
      this.networkId,
      this.contextId,
    );

    for (const child of contextChildren) {
      if (typeof child.idNetwork !== 'undefined' &&
        child.idNetwork.get() === obj.id) {
        return this.updateModel(child, obj, date);
      }
    }
    return this.createNewBmsDevice(this.networkId, obj).then((child) => {
      return this.updateModel(child, <InputDataDevice>obj, date);
    });
  }

  /**
   * @private
   * @param {*} node
   * @param {(InputDataDevice|InputDataEndpointGroup)} reference
   * @param {*} [date=null]
   * @returns {Promise<void>}
   * @memberof NetworkService
   */
  private async updateModel(
    node: any,
    reference: InputDataDevice | InputDataEndpointGroup,
    date: any = null,
  ): Promise<void> {
    const contextChildren = await SpinalGraphService.getChildrenInContext(
      node.id.get(),
      this.contextId,
    );
    const notPresent = [];
    const promises: Promise<void>[] = [];

    for (const refChild of reference.children) {
      let childFound = false;
      for (const child of contextChildren) {
        if (child.idNetwork.get() === refChild.id) {
          switch (child.type.get()) {
            case SpinalBmsDevice.nodeTypeName:
              promises.push(this.updateModel(child, <InputDataDevice>refChild, date));
              childFound = true;
              break;
            case SpinalBmsEndpointGroup.nodeTypeName:
              promises.push(
                this.updateModel(child, <InputDataEndpointGroup>refChild, date),
              );
              childFound = true;
              break;
            case SpinalBmsEndpoint.nodeTypeName:
              promises.push(
                this.updateEndpoint(child, <InputDataEndpoint>refChild, date),
              );
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
          prom = this.createNewBmsDevice(node.id.get(), <InputDataDevice>(item))
            .then((child) => {
              return this.updateModel(child, <InputDataDevice>item, date);
            });
          promises.push(prom);
          break;
        case SpinalBmsEndpointGroup.nodeTypeName:
          prom = this.createNewBmsEndpointGroup(
            node.id.get(), <InputDataEndpointGroup>item)
            .then((child) => {
              return this.updateModel(
                child, <InputDataEndpointGroup>item, date);
            });
          promises.push(prom);
          break;
        case SpinalBmsEndpoint.nodeTypeName:
          prom =
            this.createNewBmsEndpoint(
              node.id.get(), <InputDataEndpoint>(item))
              .then((child) => {
                return this.updateEndpoint(child, <InputDataEndpoint>item, date);
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
   * @param {*} [date=null]
   * @returns {Promise<void>}
   * @memberof NetworkService
   */
  async updateEndpoint(node: any, reference: InputDataEndpoint, date: any = null): Promise<void> {
    const element: SpinalBmsEndpoint = await node.element.load();

    // await this._createAttributes(node.id.get(), element);

    element.currentValue.set(reference.currentValue);

    if (typeof reference.currentValue === 'number' ||
      typeof reference.currentValue === 'boolean') {
      await this.setEndpointValue(node.id.get(), reference.currentValue, date);
    }
  }

  /**
   * @returns {Promise<string[]>}
   * @memberof NetworkService
   */
  async getNetworks(): Promise<string[]> {
    const childrenContext = await SpinalGraphService.getChildrenInContext(
      this.contextId,
      this.contextId,
    );
    return childrenContext.map(element => element.id.get());
  }

  /**
   * @private
   * @param {string} idElement
   * @param {string[]} relationNames
   * @returns {Promise<string[]>}
   * @memberof NetworkService
   */
  private async find(idElement: string, relationNames: string[], nodeTypeName: string)
    : Promise<string[]> {
    const node = SpinalGraphService.getRealNode(idElement);
    const childrenContext = await node.find(
      relationNames,
      (node: SpinalNode<any>) => {
        if (node.getType().get() === nodeTypeName) {
          return true;
        }
        return false;
      },
    );
    return childrenContext.map((element: SpinalNode<any>) => {
      // hack, call private method while 'find' is not in service
      const graphs: any = SpinalGraphService;
      graphs._addNode(element);
      return element.getId().get();
    });

  }

  /**
   * @param {string} idDevice
   * @returns {Promise<string[]>}
   * @memberof NetworkService
   */
  getEndpoint(idDevice: string): Promise<string[]> {
    const relationNames = [
      SpinalBmsEndpointGroup.relationName,
      SpinalBmsEndpoint.relationName,
    ];
    return this.find(idDevice, relationNames, SpinalBmsEndpoint.nodeTypeName);
  }

  getDevices(idNetwork: string): Promise<string[]> {
    const relationNames = [
      SpinalBmsDevice.relationName,
      SpinalBmsEndpointGroup.relationName,
      SpinalBmsEndpoint.relationName,
    ];
    return this.find(idNetwork, relationNames, SpinalBmsDevice.nodeTypeName);
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
  getTimeseries(idEndpoint: string): Promise<SpinalTimeSeries> {
    return this.spinalServiceTimeseries.getOrCreateTimeSeries(idEndpoint);
  }

  async getTimeseriesProm(endpoint: SpinalNode): Promise<SpinalNode> {
     const timeseriesLst = await endpoint.getChildren([SpinalTimeSeries.relationName ]);

    if (timeseriesLst.length === 0) return;
    return timeseriesLst[0];
  }

  /**
   * @param {string} idEndpoint
   * @param {(string|boolean|number)} value
   * @param {(number|string|Date)} [date=null]
   * @returns {Promise<void>}
   * @memberof NetworkService
   */
  async setEndpointValue(
    idEndpoint: string,
    value: string | boolean | number,
    date: number | string | Date = null,
  ): Promise<any> {
    const node = SpinalGraphService.getInfo(idEndpoint);
    const element: SpinalBmsEndpoint =
      <SpinalBmsEndpoint>(await node.element.load());
    element.currentValue.set(value);

    if (this.useTimeseries === true && (typeof value === 'number' || typeof value === 'boolean')) {
      if (this.useDelay === 0) {
        return pushData(this.spinalServiceTimeseries, idEndpoint,
          <spinal.Val>(element.currentValue), date);
      }
      if (dicEnd.has(idEndpoint)) {
        const fct = dicEnd.get(idEndpoint);
        fct(this.spinalServiceTimeseries, idEndpoint, element.currentValue, date);
      } else {
        const fct = throttle(pushData, 3 * 60 * 1000);
        dicEnd.set(idEndpoint, fct);
        fct(this.spinalServiceTimeseries, idEndpoint, element.currentValue, date);
      }

      // if (date === null) {
      //   return this.spinalServiceTimeseries.pushFromEndpoint(idEndpoint, value);
      // }
      // return this.spinalServiceTimeseries.insertFromEndpoint(
      //     idEndpoint,
      //     value,
      //     new Date(date),
      // );
    }
  }

  async linkControlEndpointToEndPoint(controlEndPoint: SpinalNode, endPoint: SpinalNode) {
    // @ts-ignore
    SpinalGraphService._addNode(endPoint);

    const [
    endpointTimeseries,
    endPointElement,
    controlEndPointTimeseries,
    controlEndPointElement,
    controlEndPointCatAttr
  ] = await Promise.all([
    this.getTimeseriesProm(endPoint),
    <Promise<SpinalBmsEndpoint>>endPoint.element.load(),
    this.getTimeseriesProm(controlEndPoint).catch(() => undefined),
    <Promise<SpinalBmsEndpoint>>controlEndPoint.element.load(),
    serviceDocumentation.getCategoryByName(controlEndPoint, 'default')])

    if (controlEndPointTimeseries) {
      await controlEndPoint.removeChild(controlEndPointTimeseries, SpinalTimeSeries.relationName, SPINAL_RELATION_PTR_LST_TYPE)
    }
    const endPointDataModel = endPointElement.currentValue;
    controlEndPointElement.mod_attr("currentValue", endPointDataModel)
    const [attrs] = await Promise.all([
      serviceDocumentation.getAttributesByCategory(controlEndPoint, controlEndPointCatAttr),
      controlEndPoint.addChild(endpointTimeseries, SpinalTimeSeries.relationName, SPINAL_RELATION_PTR_LST_TYPE),
    ]);

    for (const attr of attrs) {
      if (attr.label.get() === "currentValue") {
        attr.mod_attr("value", endPointDataModel)
        return
      }
    }
  }

  private _createAttributes(nodeId: string, elementModel: SpinalBmsEndpoint | SpinalBmsEndpointGroup | SpinalBmsDevice): Promise<any> {
    const categoryName: string = "default";
    const realNode = SpinalGraphService.getRealNode(nodeId);

    return serviceDocumentation.addCategoryAttribute(realNode, categoryName).then((attributeCategory) => {
      const promises = []

      for (const key of elementModel._attribute_names) {
        promises.push(serviceDocumentation.addAttributeByCategory(realNode, attributeCategory, key, elementModel[key]));
      }

      return Promise.all(promises);
    }).catch((err) => {

    });

  }

}

const dicEnd = new Map();

function pushData(spinalServiceTimeseries: SpinalServiceTimeseries, idEndpoint: string,
  value: spinal.Val, date?: number | string | Date): Promise<boolean> {
  if (date === null) {
    return spinalServiceTimeseries.pushFromEndpoint(idEndpoint, value.get());
  }
  return spinalServiceTimeseries.insertFromEndpoint(idEndpoint, value.get(), new Date(date));

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
