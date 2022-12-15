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

  return { data: filteredData, filter, setFilter: (data) => setFilter({ ...filter, ...data }) };
}

export default useFilter;
