import axios from 'axios';

export const onInput = (fn) => (e) => fn(e.target.value);

export const fetcher = async (path) => {
  const { data } = await axios.get(path);
  return data;
};