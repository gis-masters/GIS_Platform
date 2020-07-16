import {FilterEvent, CrgModels} from '../crg/models';

export class Util {

  static generateSortParam(requestModel: CrgModels): string {
    if (!requestModel || !requestModel.sort || !requestModel.sort.column) {
      return '';
    }

    let order = '+A';
    if (requestModel.sort.newValue === 'desc') {
      order = '+D';
    }

    const columnName = requestModel.sort.column.prop.split('.')[1];

    return (columnName) ? columnName + order : '';
  }

  static generateFilter(requestModel: CrgModels): string | undefined {
    if (!requestModel) {
      return undefined;
    }

    const filter = requestModel.filter;
    if (!filter || !filter.length) {
      return undefined;
    }

    let filterString = '';
    filter.forEach((filterEvent: FilterEvent) => {
      if (filterString !== '') {
        filterString += ' AND ';
      }

      filterString = filterString + this.parseFilter(filterEvent);
    });

    return filterString;
  }

  private static parseFilter(filterEvent: FilterEvent): string {
    const { property, value } = filterEvent;

    // name ILIKE %some%
    if (property.valueType === 'STRING') {
      return property.name.toLowerCase() + ' ILIKE \'%' + value + '%\'';
    }

    // area BETWEEN n AND n+1
    if (property.valueType === 'DOUBLE') {
      return property.name.toLowerCase() + ' BETWEEN ' + value + ' AND ' + this.upLastDigit(value[0]);
    }

    if (filterEvent.property.valueType === 'INT') {
      return property.name.toLowerCase() + ' BETWEEN ' + value + ' AND ' + Number(value) + 0.9;
    }

    // foreignKeyType string => IN('110'), other => IN(110)
    if (property.valueType === 'CHOICE') {
      if (property.foreignKeyType === 'STRING') {
        return `${property.name.toLowerCase()} IN(${this.prepareChoiceValue(value)})`;
      } else {
        return filterEvent.property.name.toLowerCase() + ' IN(' + filterEvent.value + ')';
      }
    }

    return '';
  }

  private static upLastDigit(numberUsString: string) {
    if (numberUsString.slice(-1) === '0') {
      return numberUsString.replace(/.$/, '1');
    } else {
      const n = Number(numberUsString);
      const k = (n % 1 ? Math.pow(10, numberUsString.split('.')[1].length) : 1);

      return ((n * k) + 1) / k;
    }
  }

  private static prepareChoiceValue(value: string[]): string {
    return value.map(item => `'${item}'`)
                .join(',');
  }
}
