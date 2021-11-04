import moment from "moment";

const customer_cols = [
  {
    Header: 'ID',
    accessor: 'id'
  },
  {
    Header: 'First Name',
    accessor: 'first_name'
  },
  {
    Header: 'Last Name',
    accessor: 'last_name'
  },
  {
    Header: 'Date of Birth',
    accessor: 'date_of_birth',
    Cell: ({ value } : any) => moment.unix(Number(value)).format("MMMM Do YYYY")
  },
  {
    Header: 'Email',
    accessor: 'email'
  },
  {
    Header: 'Gender',
    accessor: 'gender'
  },
  {
    Header: 'Plan Type',
    accessor: 'product',
    Cell: ({ value } : any) => value === null || value === undefined ? "Incomplete" : value
  },
  {
    Header: 'Arms',
    accessor: 'profile.arms'
  },
  {
    Header: 'Bicep',
    accessor: 'profile.bicep'
  },
  {
    Header: 'Chest',
    accessor: 'profile.chest'
  },
  {
    Header: 'Heart Rate',
    accessor: 'profile.heart_rate'
  },
  {
    Header: 'Sleep Hours',
    accessor: 'profile.sleep_hours'
  },
  {
    Header: 'Body Metric',
    accessor: 'profile.body_metric'
  },
];



export default customer_cols;