// project import
import axios from 'utils/axios';
import { dispatch } from 'store';

// third-party
import { createSlice } from '@reduxjs/toolkit';

// types
import { CountryType, SkillSheetList, SkillSheetProps } from 'types/skillSheet';

const countries: CountryType[] = [
  { code: 'US', label: 'United States Dollar', currency: 'Dollar', prefix: '$' },
  { code: 'GB', label: 'United Kingdom Pound', currency: 'Pound', prefix: '£' },
  { code: 'IN', label: 'India Rupee', currency: 'Rupee', prefix: '₹' },
  { code: 'JP', label: 'Japan Yun', currency: 'Yun', prefix: '¥' }
];

const initialState: SkillSheetProps = {
  isOpen: false,
  isCustomerOpen: false,
  open: false,
  country: countries[0],
  countries: countries,
  lists: [],
  list: null,
  error: null,
  alertPopup: false
};

// ==============================|| skillSheet - SLICE ||============================== //

const skillSheet = createSlice({
  name: 'skillSheet',
  initialState,
  reducers: {
    // review skillSheet popup
    reviewSkillSheetPopup(state, action) {
      state.isOpen = action.payload.isOpen;
    },

    // is customer open
    customerPopup(state, action) {
      state.isCustomerOpen = action.payload.isCustomerOpen;
    },

    // handler customer form popup
    toggleCustomerPopup(state, action) {
      state.open = action.payload.open;
    },

    // handler customer form popup
    selectCountry(state, action) {
      state.country = action.payload.country;
    },

    hasError(state, action) {
      state.error = action.payload.error;
    },

    // get all skillSheet list
    getLists(state, action) {
      state.lists = action.payload;
    },

    // get skillSheet details
    getSingleList(state, action) {
      state.list = action.payload;
    },

    // create skillSheet
    createSkillSheet(state, action) {
      state.lists = [...state.lists, action.payload];
    },

    // update skillSheet
    UpdateSkillSheet(state, action) {
      const { NewSkillSheet } = action.payload;
      const SkillSheetUpdate = state.lists.map((item) => {
        if (item.id === NewSkillSheet.id) {
          return NewSkillSheet;
        }
        return item;
      });
      state.lists = SkillSheetUpdate;
    },

    // delete skillSheet
    deleteSkillSheet(state, action) {
      const { SkillSheetId } = action.payload;
      const deleteSkillSheet = state.lists.filter((list) => list.id !== SkillSheetId);
      state.lists = deleteSkillSheet;
    },

    //alert popup
    alertPopupToggle(state, action) {
      state.alertPopup = action.payload.alertToggle;
    }
  }
});

export default skillSheet.reducer;

export const { reviewSkillSheetPopup, customerPopup, toggleCustomerPopup, selectCountry, getLists, alertPopupToggle } = skillSheet.actions;

export function getSkillSheetList() {
  return async () => {
    try {
      const response = await axios.get('/api/skillSheet/list');
      dispatch(skillSheet.actions.getLists(response.data.skillSheet));
    } catch (error) {
      dispatch(skillSheet.actions.hasError(error));
    }
  };
}

export function getSkillSheetInsert(NewLists: SkillSheetList) {
  return async () => {
    try {
      const response = await axios.post('/api/skillSheet/insert', { list: NewLists });
      dispatch(skillSheet.actions.createSkillSheet(response.data));
    } catch (error) {
      dispatch(skillSheet.actions.hasError(error));
    }
  };
}

export function getSkillSheetUpdate(NewLists: SkillSheetList) {
  return async () => {
    try {
      const response = await axios.post('/api/skillSheet/update', NewLists);
      dispatch(skillSheet.actions.UpdateSkillSheet(response.data));
    } catch (error) {
      dispatch(skillSheet.actions.hasError(error));
    }
  };
}

export function getSkillSheetDelete(SkillSheetId: number) {
  return async () => {
    try {
      await axios.post('/api/skillSheet/delete', { SkillSheetId });
      dispatch(skillSheet.actions.deleteSkillSheet({ SkillSheetId }));
    } catch (error) {
      dispatch(skillSheet.actions.hasError(error));
    }
  };
}

export function getSkillSheetSingleList(SkillSheetId: any) {
  return async () => {
    try {
      const response = await axios.post('/api/skillSheet/single', { id: SkillSheetId });
      dispatch(skillSheet.actions.getSingleList(response.data));
    } catch (error) {
      dispatch(skillSheet.actions.hasError(error));
    }
  };
}
