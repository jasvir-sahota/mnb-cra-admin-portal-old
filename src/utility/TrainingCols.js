import { AddCircle, Delete, DragIndicator } from '@mui/icons-material';

const training_item_cols = [
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
    Header: 'Excercise',
    accessor: 'excercise'
  },
  {
    Header: 'Stretching',
    accessor: 'stretching'
  },
  {
    Header: 'Set',
    accessor: 'set'
  },
  {
    Header: 'Rep',
    accessor: 'rep'
  },
  {
    Header: 'Tempo',
    accessor: 'tempo'
  },
  {
    Header: 'Rest',
    accessor: 'rest',
  },
  {
    Header: 'Day',
    accessor: 'day'
  },
  {
    Header: 'Instructions',
    accessor: 'instructions'
  },
  {
    id: 'add',
    Cell: ({ row }) => 
      row.depth === 0 ?
        (
          <span {...row.getToggleRowExpandedProps()}>
            <AddCircle style={{ color: "green" }} />
          </span> 
        ) : null
  }
];

export default training_item_cols;