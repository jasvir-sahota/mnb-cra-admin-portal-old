import _ from 'lodash';

const days = [
  {
    value: 'Monday',
    label: 'Monday',
  },
  {
    value: 'Tuesday',
    label: 'Tuesday',
  },
  {
    value: 'Wednesday',
    label: 'Wednesday',
  },
  {
    value: 'Thursday',
    label: 'Thursday',
  },
  {
    value: 'Friday',
    label: 'Friday',
  },
  {
    value: 'Saturday',
    label: 'Saturday',
  },
  {
    value: 'Sunday',
    label: 'Sunday',
  },
];

const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result : any = Array.from(list);
  let regexPattern = /^-?[0-9]+$/;

  if (!regexPattern.test(startIndex.toString())) {
    const subRows = startIndex.toString().split('.');
    const parentRowIndex = subRows[0];
    const si = subRows[1];
    const ei = endIndex.toString().split('.')[1];

    const [removed] = result[parentRowIndex].subRows.splice(si, 1);
    result[parentRowIndex].subRows.splice(ei, 0, removed);

    result[parentRowIndex].subRows.map((item: any, index: number) => item.item_id = index);

  } else {
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    result.map((item: any, index: number) => item.item_id = index);
  }

  return result;
};

const removeSubElement = (workout_items: any, index: number) => {
  const items = _.cloneDeep(workout_items);
  let regexPattern = /^-?[0-9]+$/;

  if (!regexPattern.test(index.toString())) {
    const el = index.toString().split('.');
    const parentIndex = el[0];
    const subIndex = el[1];

    items[parentIndex].subRows.splice(subIndex, 1);
    items[parentIndex].subRows.map((item: any, index: number) => item.item_id = index + 1);
  } else {
    items.splice(index, 1);
    items.map((item: any, index: number) => item.item_id = index + 1);
  }

  return items;
}

const updateCell = (items: any, index: any, column_id: string, value: any) => {
  const itemsLocal = _.cloneDeep(items);
  let regexPattern = /^-?[0-9]+$/;

  if (!regexPattern.test(index.toString())) {
    const el = index.toString().split('.');
    const parentIndex = el[0];
    const subIndex = el[1];

    itemsLocal[parentIndex].subRows[subIndex][column_id] = value;
  } else {
    itemsLocal[index][column_id] = value;
  }

  return itemsLocal;

}

export {
  days,
  reorder,
  removeSubElement,
  updateCell
}