import { observer } from "mobx-react-lite";
import { useStore } from "../App";
import plan_cols from "../utility/planCols";
import { useTable, useExpanded } from 'react-table'
import MaUTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { toJS } from 'mobx'
import React, { useEffect, useState } from 'react';
import Header from "./Header";
import { makeStyles } from "@mui/styles";
import { Chip, Stack, Theme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add } from "@material-ui/icons";


const useStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  container: {
    textAlign: "left",
    padding: "1% 10% 0 10%",
  },
}));

const PlanView = (props: {plans: any}) => {
  const cols = plan_cols;
  const { plans } = props;
  const [planState, setPlans] = useState<any>(plans);
  const classes = useStyles();

  useEffect(() => {
    setPlans(plans);
  }, [plans])

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({columns: cols, data: planState }, useExpanded);
  
  const [selectedCust, setSelectedCust] = useState<any>();
  const navigate = useNavigate();

  const onPlanSelect = ((plan: any) => {
    navigate('/workout-plan', { state: { plan }})
  });

  return (
    <div className={classes.container}>
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map((row : any, i) => {
          prepareRow(row)
          return (
            <TableRow {...row.getRowProps()}>
            {row.cells.map((cell : any)=> {
              return (
                <TableCell {...cell.getCellProps()} onClick={() => {
                  onPlanSelect(row.original);
                }}>
                  {cell.render('Cell')}
                </TableCell>
              )
            })}
          </TableRow>
          )
        })}
      </TableBody>
    </MaUTable>
    </div>
  );
}

const WorkoutPlans = observer(() => {
  const store = useStore();
  const workout_plans = toJS(store.workoutStore.plans);
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <div>
      <Header />
      <div className={classes.container}>
      <Stack style={{ margin: '0 0 0 0' }} direction="row" spacing={1} onClick={() => navigate('/add-workout-plan')}>
          <Chip icon={<Add />} label="Create a new Plan" />
        </Stack>
      </div>
      <PlanView plans={workout_plans} />
    </div>
  )
})

export default WorkoutPlans;