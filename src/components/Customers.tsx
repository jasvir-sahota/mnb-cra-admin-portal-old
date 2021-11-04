import { observer } from "mobx-react";
import { useStore } from "../App";
import customer_cols from "../utility/CustomerCols";
import { useTable, useExpanded } from 'react-table'
import MaUTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { toJS } from 'mobx'
import React, { useState } from 'react';
import EditProfile, { EditProfileWithDialog } from "./EditProfile";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

type cust = {
  id: string,
  first_name: string,
  last_name: string
}

const Customers = (props: {customers: any}) => {
  const cols = customer_cols;
  const { customers } = props;
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({columns: cols, data: customers }, useExpanded);
  
  const [open, setOpen] = useState<any>(false);
  const [selectedCust, setSelectedCust] = useState<any>();

  return (
    <div>
      {
        open && selectedCust ?
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)}
          maxWidth={"lg"}
          fullWidth={true}
        >
        <DialogTitle>{selectedCust.first_name} {selectedCust.last_name}</DialogTitle>
        <DialogContent>
          <br />
          <EditProfile 
            id = {selectedCust.id}
          />
        </DialogContent>
      </Dialog> : null
      }
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
                  setOpen(true);
                  setSelectedCust({
                    id: row.original.id,
                    first_name: row.original.first_name,
                    last_name: row.original.last_name
                  });
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

const CustomersView = observer(() => {
  const store = useStore();
  const customers = toJS(store.customerStore.customers);

  return (
    <div>
      <Customers customers={customers}/>
    </div>
  )
})

export { Customers };
export default CustomersView; 