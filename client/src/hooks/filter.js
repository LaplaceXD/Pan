import { useMemo, useState } from "react";

function useFilter(data, filters) {
  const defaults = Object.fromEntries(Object.entries(filters).map(([k, { value }]) => [k, value]));
  const [filter, setFilter] = useState(defaults);

  const filteredData = useMemo(() => {
    let buffer = data;

    for (const [key, { filter: filterFunction }] of Object.entries(filters)) {
      const value = filter[key];

      if (buffer && value !== defaults[key]) {
        buffer = buffer.filter((item) => filterFunction(item, value));
      }
    }

    return buffer;
  }, [filter, data]);

  /* For each filter field, this creates a respective filterHandler function */
  const handlers = Object.fromEntries(
    Object.entries(filters).map(([key]) => {
      const capitalized = key.charAt(0).toUpperCase() + key.slice(1);

      return ["handle" + capitalized, (value) => setFilter({ ...filter, [key]: value })];
    })
  );

  return { data: filteredData, filter: { ...filter, ...handlers } };
}

export default useFilter;
