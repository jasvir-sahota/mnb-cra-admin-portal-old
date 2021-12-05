import { FilterAlt } from "@mui/icons-material";
import { Divider, IconButton, InputBase, List, ListItem, ListItemText, Paper, Theme, Typography, Box, ListItemButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState, useEffect } from "react";

const useStyles = makeStyles((theme: Theme) => ({
  chipContainer: {
    display: 'flex',
    alignItems: 'center',
    height: 24,
    margin: '2px',
    padding: '0 0.2% 0 0.2%', 
    lineHeight: 22,
    border: `1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"}`,
  },
  deleteChip: {
    marginLeft: '2px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  filterContainer: {
    border: `1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"}`,
  }
}));

const Chip = (props: {
  label: string,
}) => {
  const { label } = props;
  const classes = useStyles();

  return (
    <div className={classes.chipContainer}>
      <Typography variant={'body1'}>{label}</Typography>
    </div>
  )
}

interface Column {
  Header: string,
  accessor: string
}

const FilterBar = ({
  label,
  onChange,
  columns,
  defaultFilter,
}: {
  label: string,
  onChange: any,
  columns: any[],
  defaultFilter?: Column
}) => {
  const classes = useStyles();
  const [filter, toggleFilter] = useState<boolean>();
  
  const [filterItems, setFilterItems] = useState<typeof columns>([]);

  const [filterName, setFilterName] = useState<Column | undefined>();

  const changeFilterItem = (item: Column) => {
    setFilterName(item);
    toggleFilter(false);
  }

  useEffect(() => {
    setFilterItems(columns.filter(tr => tr.accessor !== undefined && tr.accessor !== ''));
    setFilterName(defaultFilter ? defaultFilter : columns[0])
  }, [columns, defaultFilter])

  return (
    <div>
      <Paper
        elevation={3}
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {filterName ? (
          <Chip
            label={filterName.Header}
            key={1}
          />
        ) : null}
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={label}
          inputProps={{ "aria-label": "filter exercises" }}
          onChange={(event) => onChange(event, filterName?.accessor)}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
          <FilterAlt onClick={() => toggleFilter(filter ? false : true)}/>
        </IconButton>
      </Paper>
      {filter ? (
        <Box
          sx={{
            width: "100%",
            position: "relative",
            bgcolor: "background.paper",
            zIndex: 3,
          }}
          className={classes.filterContainer}
        >
          <nav>
            <List component="nav">
              {filterItems.map((item) => (
                <ListItem key={item.accessor}>
                  <ListItemButton onClick={() => changeFilterItem(item)}>
                    <ListItemText>{item.Header}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </nav>
        </Box>
      ) : null}
    </div>
  );
}

export default FilterBar;