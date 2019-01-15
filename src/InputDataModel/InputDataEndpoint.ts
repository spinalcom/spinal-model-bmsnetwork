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

import { InputDataEndpointDataType } from './InputDataEndpointDataType';
import { InputDataEndpointType } from './InputDataEndpointType';

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
export interface InputDataEndpoint {
  id: string;
  name: string;
  path: string;
  currentValue: number|string;
  unit: string;
  dataType: InputDataEndpointDataType;
  type: InputDataEndpointType;
  nodeTypeName: string; // should be SpinalBmsEndpoint.nodeTypeName || 'BmsEndpoint'
}
