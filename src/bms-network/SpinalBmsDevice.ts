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
  constructor(name: string = '', type: string = '', path: string = '', address: String = '',
    id: string = genUID('SpinalBmsDevice')) {
    super();
    this.add_attr({
      id,
      name,
      type,
      address,
      path,
    });
  }
}
spinalCore.register_models(SpinalBmsDevice);

export default SpinalBmsDevice;
