import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import empImg from "@assets/imgs/emp-img.jpg";
import { Product } from "@components/module";
import { useMutation, useQuery } from "@hooks";
import { editProductById, getProductById, toggleProductStatusById } from "@services/product";

import styles from "./ProductPreview.module.css";

const pages = {
  PRODUCT_FORM: Symbol(0),
  PRODUCT_DETAIL: Symbol(1),
};

function ProductPreview({ productId, showProductEditButtons = false }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(pages.PRODUCT_DETAIL);

  const editProduct = useMutation(
    async ({ product_id, ...body }) => await editProductById(product_id, body)
  );
  const toggleProductStatus = useMutation(toggleProductStatusById);
  const { data: product } = useQuery(["product", productId], ({ signal }) =>
    productId ? getProductById(productId, { signal }) : null
  );

  useEffect(() => setPage(pages.PRODUCT_DETAIL), [productId]);

  async function handleEditSubmit(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await editProduct.execute({
      product_id: productId,
      name: values.name,
      category_id: values.category,
      description: values.description,
      unit_price: values.price,
    });

    setSubmitting(false);
    if (isRedirect) return;
    if (error) return toast.error(error);

    queryClient.invalidateQueries("products");
    queryClient.invalidateQueries(["product", productId]);

    setPage(pages.PRODUCT_DETAIL);
    toast.success("Product edited successfully.");
  }

  async function handleStatusChange() {
    const { error, isRedirect } = await toggleProductStatus.execute(productId);
    if (isRedirect) return;
    if (error) return toast.error(error);

    queryClient.invalidateQueries("products");
    queryClient.invalidateQueries(["product", productId]);
    toast.success("Product status toggled successfully.");
  }

  const pageDetails = {
    [pages.PRODUCT_DETAIL]: (
      <Product.Detail
        name={product?.name}
        description={product?.description}
        category={product?.category_name}
        img={empImg}
        stock={product?.available_stock}
        isAvailable={product?.is_available}
        price={product?.unit_price}
        onEdit={() => setPage(pages.PRODUCT_FORM)}
        onStatusChange={handleStatusChange}
        statusChangeDisabled={toggleProductStatus.isLoading}
        showProductEditButtons={showProductEditButtons}
      />
    ),
    [pages.PRODUCT_FORM]: (
      <Product.Form
        name={product?.name}
        description={product?.description}
        categoryId={product?.category_id}
        img={empImg}
        price={product?.unit_price}
        onCancel={() => setPage(pages.PRODUCT_DETAIL)}
        onSubmit={handleEditSubmit}
      />
    ),
  };

  return <div className={styles.container}>{product ? pageDetails[page] : null}</div>;
}

export default ProductPreview;
