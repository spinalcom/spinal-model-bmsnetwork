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

import { Model, spinalCore } from "spinal-core-connectorjs_type";
import { genUID } from "../Utils/genUID";

/**
 * @property {spinal.Str} id
 * @property {spinal.Str} path
 * @property {spinal.Str | spinal.Val} currentValue
 * @property {spinal.Str} unit
 * @property {spinal.Str} type
 * @property {spinal.Str} dataType
 * @export
 * @class SpinalBmsEndpoint
 * @extends {Model}
 */
export class SpinalBmsEndpoint extends Model {
  /**
   * @static
   * @type {string}
   * @memberof SpinalBmsEndpoint
   */
  public static relationName: string = "hasBmsEndpoint";
  /**
   * @static
   * @type {string}
   * @memberof SpinalBmsEndpoint
   */
  public static nodeTypeName: string = "BmsEndpoint";

  public id: spinal.Str;
  public path: spinal.Str;
  public currentValue: spinal.Str | spinal.Val;
  public unit: spinal.Str;
  public type: spinal.Str;
  public dataType: spinal.Str;

  /**
   *Creates an instance of SpinalBmsEndpoint.
   * @param {string} [name='']
   * @param {string} [path='']
   * @param {(string|number)} [currentValue='']
   * @param {string} [unit='']
   * @param {string} [dataType='']
   * @param {string} [type='']
   * @param {string} [id=genUID('SpinalBmsEndpoint')]
   * @memberof SpinalBmsEndpoint
   */
  constructor(
    name: string = "",
    path: string = "",
    currentValue: string | number | boolean = "",
    unit: string = "",
    dataType: string = "",
    type: string = "",
    id: string = genUID("SpinalBmsEndpoint")
  ) {
    super();
    this.add_attr({
      id,
      name,
      path,
      currentValue,
      unit,
      dataType,
      type
    });
  }
}

spinalCore.register_models(SpinalBmsEndpoint);

export default SpinalBmsEndpoint;
