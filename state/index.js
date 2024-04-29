"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
var state;
(function (state) {
    state["DATA_STATE"] = "DATA_STATE";
    state["TAG_START_STATE"] = "TAG_START_STATE";
    state["TAG_END_STATE"] = "TAG_END_STATE";
    state["EOF"] = "EOF";
    state["TAG_NAME_STATE"] = "TAG_NAME_STATE";
    state["SELF_CLOSING_START_TAG_STATE"] = "SELF_CLOSING_START_TAG_STATE";
    state["END_TAG_OPEN_STATE"] = "END_TAG_OPEN_STATE";
    state["TAG_ATTR_START"] = "TAG_ATTR_START";
    state["ATTR_NAME_VALUE"] = "ATTR_NAME_VALUE";
    state["ATTR_NAME_VALUE_START"] = "ATTR_NAME_VALUE_START";
    state["ATTR_NAME_VALUE_END"] = "ATTR_NAME_VALUE_END";
})(state || (exports.state = state = {}));
