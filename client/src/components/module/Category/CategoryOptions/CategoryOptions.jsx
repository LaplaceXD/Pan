import { Options } from "@components/common";
import { useQuery } from "@hooks";
import { getAllCategories } from "@services/category";
import format from "@utils/format";

function CategoryOptions({ options, ...props }) {
  let { data: categories } = useQuery("categories", getAllCategories);

  return (
    <Options
      options={[
        { label: "All", value: 0 },
        ...(categories?.map(({ category_id, name }) => ({
          label: format.capitalize(name),
          value: category_id,
        })) ?? []),
        { label: "Others", value: null },
      ]}
      {...props}
    />
  );
}

export default CategoryOptions;
