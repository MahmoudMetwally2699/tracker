import axiosInstance from './axiosInstance';

export const fetchTracks = async () => {
  try {
    const response = await axiosInstance.get('/tracks');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tracks');
  }
};

export const saveTrack = async (track) => {
  try {
    const response = await axiosInstance.post('/track', track);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save track');
  }
};

export const deleteTrack = async (id) => {
  try {
    const response = await axiosInstance.delete(`/track/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete track');
  }
};
