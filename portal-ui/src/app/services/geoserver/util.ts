import {FilterEvent, RequestModel} from '../models/requestModel';

export class Util {

  static generateSortParam(requestModel: RequestModel): string {
    if (!requestModel || !requestModel.sort || !requestModel.sort.column) {
      return '';
    }

    let order = '+A';
    if (requestModel.sort.newValue === 'desc') {
      order = '+D';
    }

    return (requestModel.sort.column.name) ? requestModel.sort.column.name + order : '';
  }

  static generateFilter(requestModel: RequestModel): string | undefined {
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

      filterString = filterString + this.parseFilter(filterString, filterEvent);
    });

    console.log('CQL: ', filterString);

    return filterString;
  }

  private static parseFilter(filterString: string, filterEvent: FilterEvent): string {
    if (filterEvent.property.valueType === 'STRING') {
      return filterEvent.property.name.toLowerCase() + ' LIKE \'%' + filterEvent.value + '%\'';
    }
  }
}
