"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const genUID_1 = require("../Utils/genUID");
class SpinalBmsEndpointGroup extends spinal_core_connectorjs_type_1.Model {
    constructor(name = '', type = '', path = '', id = genUID_1.genUID('SpinalBmsNetwork')) {
        super();
        this.add_attr({
            id,
            name,
            type,
            path,
        });
    }
}
SpinalBmsEndpointGroup.relationName = 'hasBmsEndpointGroup';
SpinalBmsEndpointGroup.nodeTypeName = 'BmsEndpointGroup';
exports.SpinalBmsEndpointGroup = SpinalBmsEndpointGroup;
spinal_core_connectorjs_type_1.spinalCore.register_models(SpinalBmsEndpointGroup);
exports.default = SpinalBmsEndpointGroup;
//# sourceMappingURL=SpinalBmsEndpointGroup.js.map