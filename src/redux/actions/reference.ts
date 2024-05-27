import { fetchData } from '../../api/api';
import {
  SET_CROP_DATA,
  SET_Location_Data,
  SET_REFERENCE_DATA,
} from '../constants/reference';

export function setLocationData(locationData: any) {
  return {
    type: SET_Location_Data,
    payload: {
      locationData,
    },
  };
}

export function setCropData(cropData: any) {
  return {
    type: SET_CROP_DATA,
    payload: {
      cropData,
    },
  };
}

export function setReferenceData(referenceData: any) {
  return {
    type: SET_REFERENCE_DATA,
    payload: {
      referenceData,
    },
  };
}

export const fetchAllData = async (dispatch: any) => {
  try {
    const [locationData, referenceData, cropData]: [any, any, any] =
      await Promise.all([
        fetchData('location'),
        fetchData('refs'),
        fetchData('crop'),
      ]);

    dispatch(setLocationData(locationData));
    dispatch(setReferenceData(referenceData));
    dispatch(setCropData(cropData.data)); // Assuming cropData contains a `data` field
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
