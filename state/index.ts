export enum state {
  DATA_STATE = "DATA_STATE",
  TAG_START_STATE = "TAG_START_STATE",
  TAG_END_STATE = "TAG_END_STATE",
  EOF = "EOF",
  TAG_NAME_STATE='TAG_NAME_STATE',
  SELF_CLOSING_START_TAG_STATE="SELF_CLOSING_START_TAG_STATE",
  END_TAG_OPEN_STATE="END_TAG_OPEN_STATE",
  TAG_ATTR_START="TAG_ATTR_START",
  ATTR_NAME_VALUE="ATTR_NAME_VALUE",
  ATTR_NAME_VALUE_START="ATTR_NAME_VALUE_START",
  ATTR_NAME_VALUE_END="ATTR_NAME_VALUE_END"
}
