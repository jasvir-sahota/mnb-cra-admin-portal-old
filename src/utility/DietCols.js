import moment from "moment";
import { AddCircle, Delete, DragIndicator } from '@mui/icons-material';


const diet_item_cols = [
  {
    Header: () => null,
    id: "move",
    accessor: "",
    Cell: ({ row }) => (
      <span {...row.getToggleRowExpandedProps()}>
        <DragIndicator />
      </span>
    ),
  },
  {
    Header: () => null, 
    id: "remove",
    accessor: "",
    Cell: ({ row }) => (
      <span {...row.getToggleRowExpandedProps()}>
        <Delete style={{ color: "red" }} />
      </span>
    ),
  },
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
    Cell: ({ value } ) => moment.unix(Number(value)).format("hh:mm a")
  }
];

export default diet_item_cols;