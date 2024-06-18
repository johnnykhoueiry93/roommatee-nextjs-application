import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

//@ts-ignore
const MultiSelect = ({ state, setState, options, label }) => {
  //@ts-ignore
  const handleChange = (event) => {
    const { target: { value } } = event;
    setState(Array.isArray(value) ? value : [value]);
  };

  return (
    <div>
      <FormControl sx={{ width: '100%' }} className='mb-3'>
        <InputLabel id={`demo-multiple-checkbox-label-${label}`}>{label}</InputLabel>
        <Select
          labelId={`demo-multiple-checkbox-label-${label}`}
          id={`demo-multiple-checkbox-${label}`}
          multiple
          value={state}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {/* @ts-ignore */}
          {options.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={state.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultiSelect;
