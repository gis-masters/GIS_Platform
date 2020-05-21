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
    // name ILIKE %some%
    if (filterEvent.property.valueType === 'STRING') {
      return filterEvent.property.name.toLowerCase() + ' ILIKE \'%' + filterEvent.value + '%\'';
    }

    // area BETWEEN n AND n+1
    if (filterEvent.property.valueType === 'DOUBLE') {
      return filterEvent.property.name.toLowerCase() + ' BETWEEN ' + filterEvent.value + ' AND ' + this.upLastDigit(filterEvent.value[0]);
    }

    if (filterEvent.property.valueType === 'INT') {
      return filterEvent.property.name.toLowerCase() + ' BETWEEN ' + filterEvent.value + ' AND ' + Number(filterEvent.value) + 0.9;
    }

    // voltage IN(110)
    if (filterEvent.property.valueType === 'CHOICE') {
      return filterEvent.property.name.toLowerCase() + ' IN(' + filterEvent.value + ')';
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

}
