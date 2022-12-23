import { Options } from "@components/common";

import { useCategories } from "@hooks/services/category";
import format from "@utils/format";

function CategoryOptions({ options, ...props }) {
  const {
    payload: { data: categories },
  } = useCategories();

  let opts = categories?.map(({ category_id, name }) => ({
    label: format.capitalize(name),
    value: category_id,
  }));

  opts = opts ? [{ label: "All", value: 0 }, ...opts, { label: "Others", value: null }] : [];
  return <Options options={opts} {...props} />;
}

export default CategoryOptions;
