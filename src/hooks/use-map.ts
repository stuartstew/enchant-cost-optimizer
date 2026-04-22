import { useState } from "react";

export const useMap = <T, V>(initialState?: [T, V][]): Map<T, V> => {
  const [map, setMap] = useState(() => new Map(initialState));

  map.set = (...args) => {
    const newMap = new Map(map);
    const ret = newMap.set(...args);
    setMap(newMap);
    return ret;
  };

  map.delete = (...args) => {
    const newMap = new Map(map);
    const ret = newMap.delete(...args);
    setMap(newMap);
    return ret;
  };

  map.clear = () => setMap(new Map());

  return map;
};
