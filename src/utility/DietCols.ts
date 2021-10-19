import moment from "moment";

const diet_item_cols : any = [
  {
    Header: 'Food Item',
    accessor: 'food_item'
  },
  {
    Header: 'Instructions',
    accessor: 'instructions'
  },
  {
    Header: 'Day',
    accessor: 'day'
  },
  {
    Header: 'Time of Day',
    accessor: 'time',
    Cell: ({ value } : any) => moment.unix(Number(value)).format("hh:mm a")
  }
];

export default diet_item_cols;