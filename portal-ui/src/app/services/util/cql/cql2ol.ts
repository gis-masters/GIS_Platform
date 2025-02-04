// https://github.com/openlayers/ol2/blob/master/lib/OpenLayers/Format/CQL.js

import { WKT } from 'ol/format';
import {
  and,
  bbox,
  between,
  contains,
  dwithin,
  equalTo,
  greaterThan,
  greaterThanOrEqualTo,
  intersects,
  isNull,
  lessThan,
  lessThanOrEqualTo,
  like,
  not,
  notEqualTo,
  or,
  within
} from 'ol/format/filter';
import Filter from 'ol/format/filter/Filter';
import { Geometry } from 'ol/geom';
import { Units } from 'ol/proj/Units';

type FilterFunc = (...args: Filter[]) => Filter;

interface TokenInfo {
  type: Token;
  text: string;
  remainder: string;
}

enum Token {
  PROPERTY = 'PROPERTY',
  COMPARISON = 'COMPARISON',
  IS_NULL = 'IS_NULL',
  COMMA = 'COMMA',
  LOGICAL = 'LOGICAL',
  VALUE = 'VALUE',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  SPATIAL = 'SPATIAL',
  NOT = 'NOT',
  IN = 'IN',
  BETWEEN = 'BETWEEN',
  GEOMETRY = 'GEOMETRY',
  END = 'END'
}

const patterns = {
  [Token.PROPERTY]: /^[_a-z]\w*/i,
  [Token.COMPARISON]: /^(=|<>|<=|<|>=|>|like|ilike)/i,
  [Token.IS_NULL]: /^is null/i,
  [Token.COMMA]: /^,/,
  [Token.LOGICAL]: /^(and|or)/i,
  [Token.VALUE]: /^('([^']|'')*'|-?\d+(\.\d*)?|\.\d+)/,
  [Token.LPAREN]: /^\(/,
  [Token.RPAREN]: /^\)/,
  [Token.SPATIAL]: /^(bbox|intersects|dwithin|within|contains)/i,
  [Token.NOT]: /^not/i,
  [Token.IN]: /^in/i,
  [Token.BETWEEN]: /^between/i,
  [Token.GEOMETRY]: (text: string) => {
    const type = /^(?:POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION)/.exec(text);
    if (type) {
      const len = text.length;
      let idx = text.indexOf('(', type[0].length);
      if (idx > -1) {
        let depth = 1;
        while (idx < len && depth > 0) {
          idx++;
          switch (text.charAt(idx)) {
            case '(': {
              depth++;
              break;
            }
            case ')': {
              depth--;
              break;
            }
            default:
            // in default case, do nothing
          }
        }
      }

      return [text.slice(0, Math.max(0, idx + 1))];
    }
  },
  [Token.END]: /^$/
};

const follows: Partial<Record<Token, Token[]>> = {
  [Token.LPAREN]: [Token.GEOMETRY, Token.SPATIAL, Token.PROPERTY, Token.VALUE, Token.LPAREN],
  [Token.RPAREN]: [Token.NOT, Token.LOGICAL, Token.END, Token.RPAREN],
  [Token.PROPERTY]: [Token.COMPARISON, Token.BETWEEN, Token.COMMA, Token.IS_NULL, Token.IN],
  [Token.BETWEEN]: [Token.VALUE],
  [Token.IS_NULL]: [Token.END, Token.RPAREN],
  [Token.COMPARISON]: [Token.VALUE],
  [Token.COMMA]: [Token.GEOMETRY, Token.VALUE, Token.PROPERTY],
  [Token.VALUE]: [Token.LOGICAL, Token.COMMA, Token.RPAREN, Token.END],
  [Token.SPATIAL]: [Token.LPAREN],
  [Token.LOGICAL]: [Token.NOT, Token.VALUE, Token.SPATIAL, Token.PROPERTY, Token.LPAREN],
  [Token.NOT]: [Token.PROPERTY, Token.LPAREN],
  [Token.IN]: [Token.LPAREN],
  [Token.GEOMETRY]: [Token.COMMA, Token.RPAREN]
};

function likeOperator(propertyName: string, expression: string) {
  return like(propertyName, expression, '%', '.', '!', true);
}

function ilikeOperator(propertyName: string, expression: string) {
  return like(propertyName, expression, '%', '.', '!', false);
}

function inOperator(propertyName: string, values: (string | number)[]) {
  return values.length > 1 ? or(...values.map(val => equalTo(propertyName, val))) : equalTo(propertyName, values[0]);
}

const numberOperators: Record<string, (propertyName: string, expression: number) => Filter> = {
  '<': lessThan,
  '<=': lessThanOrEqualTo,
  '>': greaterThan,
  '>=': greaterThanOrEqualTo
};

const stringOperators: Record<string, (propertyName: string, expression: string) => Filter> = {
  LIKE: likeOperator,
  ILIKE: ilikeOperator
};

const numberStringOperators: Record<string, (propertyName: string, expression: number | string) => Filter> = {
  '=': equalTo,
  '<>': notEqualTo,
  'IS NULL': isNull
};

const operators = {
  ...numberOperators,
  ...stringOperators,
  ...numberStringOperators
};

const logicals: Record<string, FilterFunc> = {
  AND: and,
  OR: or
};

const precedence: Partial<Record<Token, number>> = {
  [Token.RPAREN]: 3,
  [Token.LOGICAL]: 2,
  [Token.COMPARISON]: 1
};

type PrecedenceKey = Token.RPAREN | Token.LOGICAL | Token.COMPARISON;

function tryToken(text: string, pattern: RegExp | ((t: string) => string[] | undefined)) {
  return pattern instanceof RegExp ? pattern.exec(text) : pattern(text);
}

function nextToken(text: string, tokens?: (keyof typeof patterns)[]): TokenInfo {
  for (const token of tokens || []) {
    const pat = patterns[token];
    const matches = tryToken(text, pat);
    if (matches) {
      const match = matches[0];
      const remainder = text.slice(match.length).replace(/^\s*/, '');

      return {
        type: token,
        text: match,
        remainder
      };
    }
  }

  let msg = `ERROR: In parsing: [${text}], expected one of: `;
  for (const token of tokens || []) {
    msg += `\n    ${token}: ${String(patterns[token])}`;
  }

  throw new Error(msg);
}

function tokenize(text: string) {
  const results: TokenInfo[] = [];
  let token: TokenInfo;
  let expect: Token[] | undefined = [Token.NOT, Token.GEOMETRY, Token.SPATIAL, Token.PROPERTY, Token.LPAREN];

  do {
    token = nextToken(text, expect);
    text = token.remainder;
    expect = follows[token.type];
    if (token.type !== Token.END && !expect) {
      throw new Error('No follows list for ' + token.type);
    }
    results.push(token);
  } while (token.type !== Token.END);

  return results;
}

function buildAst(tokens: TokenInfo[]) {
  const operatorStack: TokenInfo[] = [];
  const postfix: TokenInfo[] = [];

  while (tokens.length) {
    const tok = tokens.shift();
    switch (tok?.type) {
      case Token.PROPERTY:
      case Token.GEOMETRY:
      case Token.VALUE: {
        postfix.push(tok);
        break;
      }
      case Token.COMPARISON:
      case Token.BETWEEN:
      case Token.IS_NULL:
      case Token.LOGICAL: {
        while (
          operatorStack.length > 0 &&
          (precedence[operatorStack.at(-1)?.type as PrecedenceKey] as number) <=
            (precedence[tok?.type as PrecedenceKey] as number)
        ) {
          const operator = operatorStack.pop();
          if (operator) {
            postfix.push(operator);
          }
        }

        operatorStack.push(tok);
        break;
      }
      case Token.SPATIAL:
      case Token.NOT:
      case Token.IN:
      case Token.LPAREN: {
        operatorStack.push(tok);
        break;
      }
      case Token.RPAREN: {
        while (operatorStack.length > 0 && operatorStack.at(-1)?.type !== Token.LPAREN) {
          const operator = operatorStack.pop();
          if (operator) {
            postfix.push(operator);
          }
        }
        operatorStack.pop(); // toss out the LPAREN

        if (operatorStack.length > 0 && operatorStack.at(-1)?.type === Token.SPATIAL) {
          const operator = operatorStack.pop();
          if (operator) {
            postfix.push(operator);
          }
        }
        break;
      }
      case Token.COMMA:
      case Token.END: {
        break;
      }
      default: {
        throw new Error(`Unknown token type ${String(tok?.type)}`);
      }
    }
  }

  while (operatorStack.length > 0) {
    const operator = operatorStack.pop();
    if (operator) {
      postfix.push(operator);
    }
  }

  function buildTree(): Filter | string | number | Geometry | undefined {
    const tok = postfix.pop();
    let rhs: Filter | string;
    let lhs: Filter | string;
    let operand: Filter;
    let min: number;
    let max: number;
    let property: string;
    let value: string | number | Geometry;
    let match: string[];
    let maxy: number;
    let maxx: number;
    let miny: number;
    let minx: number;
    let distance: number;
    let unit: Units;
    let values: (string | number)[];

    switch (tok?.type) {
      case Token.LOGICAL: {
        rhs = buildTree() as Filter;
        lhs = buildTree() as Filter;

        return logicals[tok.text.toUpperCase()](lhs, rhs);
      }
      case Token.NOT: {
        operand = buildTree() as Filter;

        return not(operand);
      }
      case Token.IN: {
        values = [];

        do {
          values.push(buildTree() as string | number);
        } while (postfix.at(-1)?.type === Token.VALUE);

        property = buildTree() as string;

        return inOperator(property, values);
      }
      case Token.BETWEEN: {
        postfix.pop(); // unneeded AND token here
        max = buildTree() as number;
        min = buildTree() as number;
        property = buildTree() as string;

        return between(property, min, max);
      }
      case Token.COMPARISON: {
        value = buildTree() as string;
        property = buildTree() as string;

        return operators[tok.text.toUpperCase()](property, value as never); // ¯\_(ツ)_/¯
      }
      case Token.IS_NULL: {
        property = buildTree() as string;

        return isNull(property);
      }
      case Token.VALUE: {
        match = tok.text.match(/^'(.*)'$/) as string[];

        return match ? match[1].replaceAll("''", "'") : Number(tok.text);
      }
      case Token.SPATIAL: {
        // eslint-disable-next-line sonarjs/no-nested-switch
        switch (tok.text.toUpperCase()) {
          case 'BBOX': {
            maxy = buildTree() as number;
            maxx = buildTree() as number;
            miny = buildTree() as number;
            minx = buildTree() as number;
            property = buildTree() as string;

            return bbox(property, [minx, miny, maxx, maxy]);
          }
          case 'INTERSECTS': {
            value = buildTree() as Geometry;
            property = buildTree() as string;

            return intersects(property, value);
          }
          case 'WITHIN': {
            value = buildTree() as Geometry;
            property = buildTree() as string;

            return within(property, value);
          }
          case 'CONTAINS': {
            value = buildTree() as Geometry;
            property = buildTree() as string;

            return contains(property, value);
          }
          case 'DWITHIN': {
            unit = buildTree() as Units;
            distance = Number(buildTree());
            value = buildTree() as Geometry;
            property = buildTree() as string;

            return dwithin(property, value, distance, unit);
          }
        }
        break;
      }
      case Token.GEOMETRY: {
        return new WKT().readFeature(tok.text).getGeometry();
      }
      default: {
        return tok?.text;
      }
    }
  }

  const result = buildTree();
  if (postfix.length > 0) {
    let msg = 'Remaining tokens after building AST: \n';
    for (let i = postfix.length - 1; i >= 0; i--) {
      msg += postfix[i].type + ': ' + postfix[i].text + '\n';
    }
    throw new Error(msg);
  }

  return result;
}

export function cql2ol(text: string): Filter {
  return buildAst(tokenize(text)) as Filter;
}

// TODO: реализовать обратное преобразование на основе этого:
// function inverseObject(o: object): object {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- в нашей версии TS этот тип описать невозможно
//   return Object.fromEntries(Object.entries(o).map(([key, value]) => [value, key]));
// }
//
// const operatorReverse = inverseObject(operators);
// const logicalReverse = inverseObject(logicals);
//
// export function ol2cql(filter: Filter): string {
//   if (filter instanceof Geometry) {
//     return filter.toString();
//   }
//   switch (filter.CLASS_NAME) {
//     case 'OpenLayers.Filter.Spatial':
//       switch (filter.type) {
//         case OpenLayers.Filter.Spatial.BBOX:
//           return 'BBOX(' + filter.property + ',' + filter.value.toBBOX() + ')';
//         case OpenLayers.Filter.Spatial.DWITHIN:
//           return 'DWITHIN(' + filter.property + ', ' + this.write(filter.value) + ', ' + filter.distance + ')';
//         case OpenLayers.Filter.Spatial.WITHIN:
//           return 'WITHIN(' + filter.property + ', ' + this.write(filter.value) + ')';
//         case OpenLayers.Filter.Spatial.INTERSECTS:
//           return 'INTERSECTS(' + filter.property + ', ' + this.write(filter.value) + ')';
//         case OpenLayers.Filter.Spatial.CONTAINS:
//           return 'CONTAINS(' + filter.property + ', ' + this.write(filter.value) + ')';
//         default:
//           throw new Error('Unknown spatial filter type: ' + filter.type);
//       }
//     case 'OpenLayers.Filter.Logical':
//       if (filter.type == OpenLayers.Filter.Logical.NOT) {
//         // TODO: deal with precedence of logical operators to
//         // avoid extra parentheses (not urgent)
//         return 'NOT (' + this.write(filter.filters[0]) + ')';
//       }
//       let res = '(';
//       var first = true;
//       for (let i = 0; i < filter.filters.length; i++) {
//         if (first) {
//           first = false;
//         } else {
//           res += ') ' + logicalReverse[filter.type] + ' (';
//         }
//         res += this.write(filter.filters[i]);
//       }

//       return res + ')';

//     case 'OpenLayers.Filter.Comparison':
//       if (filter.type == OpenLayers.Filter.Comparison.BETWEEN) {
//         return (
//           filter.property + ' BETWEEN ' +
//                     this.write(filter.lowerBoundary) + ' AND ' + this.write(filter.upperBoundary)
//         );
//       }

//       return filter.value !== null
//         ? filter.property + ' ' + operatorReverse[filter.type] + ' ' + this.write(filter.value)
//         : filter.property + ' ' + operatorReverse[filter.type];

//     case undefined:
//       if (typeof filter === 'string') {
//         return "'" + filter.replace(/'/g, "''") + "'";
//       } else if (typeof filter === 'number') {
//         return String(filter);
//       }
//     default:
//       throw new Error("Can't encode: " + filter.CLASS_NAME + ' ' + filter);
//   }
// }
