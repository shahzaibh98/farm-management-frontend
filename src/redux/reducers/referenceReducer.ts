import {
  SET_CROP_DATA,
  SET_Location_Data,
  SET_REFERENCE_DATA,
} from '../constants/reference';

const locationDataString = localStorage.getItem('locationData');
const locationData = locationDataString ? JSON.parse(locationDataString) : null;

const cropDataString = localStorage.getItem('cropData');
const cropData = cropDataString ? JSON.parse(cropDataString) : [];

const referenceDataString = localStorage.getItem('referenceData');
const referenceData = referenceDataString
  ? JSON.parse(referenceDataString)
  : null;

const initialState = {
  locationData,
  cropData,
  referenceData,
};

const referenceReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_Location_Data:
      localStorage.setItem(
        'locationData',
        JSON.stringify(action.payload.locationData)
      );
      return {
        ...state,
        locationData: action.payload.locationData,
      };

    case SET_CROP_DATA:
      localStorage.setItem('cropData', JSON.stringify(action.payload.cropData));
      return {
        ...state,
        cropData: action.payload.cropData,
      };

    case SET_REFERENCE_DATA:
      localStorage.setItem(
        'referenceData',
        JSON.stringify(action.payload.referenceData)
      );
      return {
        ...state,
        referenceData: action.payload.referenceData,
      };

    default:
      return state;
  }
};

export default referenceReducer;
