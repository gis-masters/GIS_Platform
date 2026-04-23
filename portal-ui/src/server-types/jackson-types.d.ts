export interface JsonNode extends Base, TreeNode, Iterable<JsonNode> {
  empty: boolean;
  float: boolean;
  number: boolean;
  nodeType: JsonNodeType;
  pojo: boolean;
  integralNumber: boolean;
  floatingPointNumber: boolean;
  short: boolean;
  int: boolean;
  long: boolean;
  double: boolean;
  bigDecimal: boolean;
  bigInteger: boolean;
  /**
   * @deprecated
   */
  textual: boolean;
  boolean: boolean;
  binary: boolean;
  string: boolean;
}

export interface Base extends JacksonSerializable {}

export interface TreeNode {
  array: boolean;
  null: boolean;
  object: boolean;
  valueNode: boolean;
  missingNode: boolean;
  container: boolean;
  embeddedValue: boolean;
}

export interface JacksonSerializable {}

export interface Iterable<T> {}

export type JsonNodeType =
  | 'ARRAY'
  | 'BINARY'
  | 'BOOLEAN'
  | 'MISSING'
  | 'NULL'
  | 'NUMBER'
  | 'OBJECT'
  | 'POJO'
  | 'STRING';
