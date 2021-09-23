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

import { Model, spinalCore } from 'spinal-core-connectorjs_type';
import { genUID } from '../Utils/genUID';
import { InputDataDevice } from "../InputDataModel/InputDataDevice";
/**
 * @property {spinal.Str} id;
 * @property {spinal.Str} name;
 * @property {spinal.Str} type;
 * @property {spinal.Str} path;
 * @export
 * @class SpinalBmsDevice
 * @extends {Model}
 */
export class SpinalBmsDevice extends Model {
  /**
   * @static
   * @type {string}
   * @memberof SpinalBmsDevice
   */
  public static relationName: string = 'hasBmsDevice';
  /**
   * @static
   * @type {string}
   * @memberof SpinalBmsDevice
   */
  public static nodeTypeName: string = 'BmsDevice';

  public id: spinal.Str;
  public name: spinal.Str;
  public type: spinal.Str;
  public path: spinal.Str;
  public address: spinal.Str;

  /**
   *Creates an instance of SpinalBmsDevice.
   * @param {string} [name='']
   * @param {string} [type='']
   * @param {string} [path='']
   * @param {string} [id=genUID('SpinalBmsDevice')]
   * @memberof SpinalBmsDevice
   */
  constructor(info?: InputDataDevice) {
    super();
    if (!info) info = <any>{};

    if (typeof info.id === "undefined") info.id = genUID('SpinalBmsDevice');
    if (typeof info.name === "undefined") info.name = "";
    if (typeof info.type === "undefined") info.type = "";
    if (typeof info.path === "undefined") info.path = "";

    this.add_attr(info);
  }
}
spinalCore.register_models(SpinalBmsDevice);

export default SpinalBmsDevice;
