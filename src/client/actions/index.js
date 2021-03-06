import API from '../utils/API.js';

export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

export const SEARCH_SHOW_REQUEST = 'SEARCH_SHOW_REQUEST';
export const SEARCH_SHOW_SUCCESS = 'SEARCH_SHOW_SUCCESS';
export const SEARCH_SHOW_FAILURE = 'SEARCH_SHOW_FAILURE';

export const TRACK_SHOW = 'TRACK_SHOW';
export const UNTRACK_SHOW = 'UNTRACK_SHOW';
export const UPDATE_EPISODES_REQUEST = 'UPDATE_EPISODES_REQUEST';
export const UPDATE_EPISODES_SUCCESS = 'UPDATE_EPISODES_SUCCESS';
export const UPDATE_EPISODES_FAILURE = 'UPDATE_EPISODES_FAILURE';

export const MARK_EPISODE_SEEN = 'MARK_EPISODE_SEEN';
export const MARK_EPISODE_UNSEEN = 'MARK_EPISODE_UNSEEN';
export const TOGGLE_EPISODE = 'TOGGLE_EPISODE';
export const BULK_SET_EPISODES_SEEN = 'BULK_SET_EPISODES_SEEN';

export function getUserRequest() {
  return {
    type: GET_USER_REQUEST
  }
}

export function getUserSuccess(user) {
  return {
    type: GET_USER_SUCCESS,
    user
  }
}

export function getUserFailure(error) {
  return {
    type: GET_USER_FAILURE,
    error
  }
}

export function getUser() {
  return (dispatch, getState) => {
    if(getState().user.exists) { return; }
    dispatch(getUserRequest());
    API.getUser()
      .then(res => res.data)
      .then(user => dispatch(getUserSuccess(user)))
      .catch(err => dispatch(getUserFailure(err)));
    }
}

export function searchShowRequest(query) {
  return {
    type: SEARCH_SHOW_REQUEST,
    query
  }
}

export function searchShowSuccess(data) {
  return {
    type: SEARCH_SHOW_SUCCESS,
    data
  }
}

export function searchShowFailure(error) {
  return {
    type: SEARCH_SHOW_FAILURE,
    error
  }
}

function retryRateLimiting(retryDispatch, failureDispatch) {
  return err => {
    if(err.status === 429) {

    }
  }
}

// query is a string
export function searchShows(query) {
  return (dispatch) => {
    dispatch(searchShowRequest());
    return API.searchShows(query)
      .then(shows => dispatch(searchShowSuccess(shows)))
      .catch(err => dispatch(searchShowFailure(err)));
  }
}

export function trackShow(show) {
  return {
    type: TRACK_SHOW,
    id: show.id,
    show
  }
}

export function untrackShow({ id }) {
  return {
    type: UNTRACK_SHOW,
    id
  }
}

export function updateEpisodesRequest({ id }) {
  return {
    type: UPDATE_EPISODES_REQUEST,
    id
  }
}

export function updateEpisodesSuccess({ id, episodes }) {
  return {
    type: UPDATE_EPISODES_SUCCESS,
    id,
    episodes
  }
}

export function updateEpisodesFailure({ id, error }) {
  return {
    type: UPDATE_EPISODES_FAILURE,
    id,
    error
  }
}

export function trackNewShow({ id }) {
  return (dispatch, getState) => {
    return API.getShow({ id })
      .then(show => dispatch(trackShow(show)));
  }
}

export function markEpisodeSeen({ showId, episodeId }) {
  return {
    type: MARK_EPISODE_SEEN,
    showId,
    episodeId
  }
}

export function markEpisodeUnseen({ showId, episodeId }) {
  return {
    type: MARK_EPISODE_UNSEEN,
    showId,
    episodeId
  }
}

export function toggleEpisode({ showId, episodeId }) {
  return {
    type: TOGGLE_EPISODE,
    showId,
    episodeId
  }
}

export function bulkSetEpisodesSeen({ showId, data }) {
  return {
    type: BULK_SET_EPISODES_SEEN,
    showId,
    data
  }
}

export function syncAccount() {
  return async (dispatch, getState) => {
    const trackedShows = await API.getUserShows();
    const showIds = new Set();
    trackedShows.forEach(show => showIds.add(parseInt(show._id)));

    // untrack all shows not tracked on account
    Object.keys(getState().trackedShows).forEach(id => {
      id = parseInt(id);
      if(!showIds.has(id)) dispatch(untrackShow({ id }));
    });

    // update all tracked shows
    const promises = [...showIds].map(id =>
      dispatch(trackNewShow({ id })));
    await Promise.all(promises);

    // add watched episodes for each show
    trackedShows.forEach(show => {
      dispatch(bulkSetEpisodesSeen({
        showId: show._id,
        data: show.watchedEpisodes
      }));
    });
  }
}