"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCampDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_camp_dto_1 = require("./create-camp.dto");
class UpdateCampDto extends (0, mapped_types_1.PartialType)(create_camp_dto_1.CreateCampDto) {
}
exports.UpdateCampDto = UpdateCampDto;
//# sourceMappingURL=update-camp.dto.js.map