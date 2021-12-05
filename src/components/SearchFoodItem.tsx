import { observer } from "mobx-react";
import {
  useAutocomplete,
  AutocompleteGetTagProps,
  createFilterOptions,
} from "@mui/core/AutocompleteUnstyled";
import { styled } from "@mui/material/styles";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import MuiTableRow from "@mui/material/TableRow";
import {
  Paper,
  TableContainer,
} from "@mui/material";
import { useState } from 'react';
import { Close } from "@material-ui/icons";
import { useStore } from "../App";
import { toJS } from "mobx";

const Root = styled("div")(
  ({ theme }) => `
  color: ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,.85)"
  };
  font-size: 14px;
`
);

const InputWrapper = styled("div")(
  ({ theme }) => `
  margin: '1% 0 0 0'
  width: 100%;
  border: 1px solid grey;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  border-radius: 1px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
  }

  &.focused {
    border-color: grey;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
    color: ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.65)"
        : "rgba(0,0,0,.85)"
    };
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 36px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

function Tag(props: TagProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <Close onClick={onDelete} />
    </div>
  );
}

const StyledTag = styled(Tag)<TagProps>(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;

  border: 1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff"};
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled("ul")(
  ({ theme }) => `
  width: 100%%;
  margin: 2px 0 0;
  padding: 0;
  position: relative;
  list-style: none;
  background-color: ${theme.palette.mode === "dark" ? "#141414" : "#fff"};
  overflow: auto;
  max-height: 800px;
  border-radius: 1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#2b2b2b" : "#fafafa"};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus='true'] {
    background-color: ${theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff"};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

const SearchFoodItem = observer(({
  callback
} : {
  callback: Function
}) => {
  const filter = createFilterOptions<typeof diets>();
  const [option, setOption] = useState<any>([]);

  const { dietStore } = useStore();
  const diets : any = toJS(dietStore.diets);

  const onChange = (event: any, newValue: any) => {
    if (newValue.find((el: any) => el.food_item.startsWith("Add"))) {
      const el = newValue[newValue.length - 1].inputValue;
      const obj = {
        food_item: el
      }
      dietStore.saveDiet(obj);
    } else if(newValue.length !== 0){
      callback(newValue[newValue.length - 1].food_item);
      setOption([]);
    }
  };

  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "search-food-item",
    multiple: true,
    options: diets,
    value: option,
    getOptionLabel: (option: any) => option.food_item,
    filterOptions: (options, params) => {
      const filtered = filter(options, params);

      if (params.inputValue !== "") {
        filtered.push({
          inputValue: params.inputValue,
          food_item: `Add "${params.inputValue}"`,
        });
      }

      return filtered;
    },
    onChange: onChange,
  });


  return (
    <Root>
      <div {...getRootProps()}>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          {value.map((option: typeof diets, index: number) => (
            <StyledTag label={option.food_item} {...getTagProps({ index })} />
          ))}
          <input {...getInputProps()} placeholder={"Search Food Item"} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          <TableContainer component={Paper}>
            <MuiTable>
              <MuiTableBody>
                {(groupedOptions as typeof diets).map(
                  (option: any, index: any) => (
                    <MuiTableRow key={index}>
                      <MuiTableCell>
                        <li {...getOptionProps({ option, index })}>
                          {" "}
                          {option.food_item}
                        </li>
                      </MuiTableCell>
                    </MuiTableRow>
                  )
                )}
              </MuiTableBody>
            </MuiTable>
          </TableContainer>
        </Listbox>
      ) : null}
    </Root>
  )
});

export default SearchFoodItem;