import { ReactComponent as Add } from "assets/icons/add.svg";
import EditProduct from "components/EditProduct";
import { HTMLAttributes, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProductService } from "services/ProductService";
import { ErrorResponse } from "types/api/error";
import { Product } from "types/api/product";
import { ProductResponse } from "types/Product";
import { QueryKey } from "types/QueryKey";
import * as S from "./style";

type ManageProductsType = HTMLAttributes<HTMLDivElement>;

type ManageProductsProps = {} & ManageProductsType;

const ManageProducts: React.FC<ManageProductsProps> = ({ ...props }) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const { data: productsData } = useQuery(
    [QueryKey.PRODUCTS],
    ProductService.getLista
  );

  const add = useMutation(ProductService.create, {
    onSuccess: (data: ProductResponse & ErrorResponse) => {
      if (data.statusCode) {
        return;
      }

      const productList = [...products, data as ProductResponse];
      setProducts(productList);
    },
    onError: () => {
      console.error("Erro ao adicionar um produto");
    },
  });

  const remove = useMutation(ProductService.deleteById, {
    onSuccess: (data: ProductResponse & ErrorResponse) => {
      if (data.statusCode) {
        return;
      }

      const editedProducts = products.filter((i) => data.id !== i.id);
      setProducts(editedProducts);
    },
    onError: () => {
      console.error("Erro ao remover o produto");
    },
  });

  const update = useMutation(ProductService.updateById, {
    onSuccess: (data: ProductResponse & ErrorResponse) => {
      if (data.statusCode) {
        return;
      }

      const editedUsers = products.map((i) =>
        data.id === i.id ? (data as ProductResponse) : i
      );
      setProducts(editedUsers);
    },
    onError: () => {
      console.error("Erro ao atualizar o produto");
    },
  });

  const [cancel, setCancel] = useState(false);

  let productsToEdit: ProductResponse[] = [];

  const form = {
    name: "",
    price: Number(""),
    image: "",
    description: "",
  };

  const [productToAdd, setProductToAdd] = useState(form);

  const handleAddChange = (name: string, value: string | number) => {
    setProductToAdd({ ...productToAdd, [name]: value });
  };

  const onEditProduct = (toEdit: ProductResponse) => {
    setCancel(false);
    const existing = productsToEdit.find((user) => user.id === toEdit.id);

    productsToEdit = existing
      ? productsToEdit.map((i) => (i.id === existing.id ? toEdit : i))
      : [...productsToEdit, toEdit];
  };

  const handleCancel = () => {
    setCancel(true);
    setIsAdding(false);
    setTimeout(() => setCancel(false));
    productsToEdit = [];
  };

  const handleDelete = (productToDelete: ProductResponse) => {
    remove.mutate(productToDelete.id);
    handleCancel();
  };

  const productIsValid = () =>
    Boolean(
      productToAdd.name.length &&
        productToAdd.price.toString().length &&
        productToAdd.description.length &&
        productToAdd.image.length
    );

  const productFormatter = (toFormat: typeof form): Product => ({
    name: toFormat.name,
    price: toFormat.price,
    description: toFormat.description,
    image: toFormat.image,
  });

  const handleSave = () => {
    const canAdd = productIsValid();
    const productFormatted = productFormatter(productToAdd);

    productsToEdit.forEach((product) =>
      update.mutate({ product, id: product.id })
    );

    if (canAdd) add.mutate(productFormatted);
    setTimeout(() => handleCancel(), 300);
    setProductToAdd(form);
    setIsAdding(false);
  };

  useEffect(() => {
    setProducts(productsData || []);
  }, [productsData]);

  const [isAdding, setIsAdding] = useState(false);

  return (
    <S.ManageProducts {...props}>
      <S.ManageProductsTitle>Gerenciar Produtos</S.ManageProductsTitle>
      <S.ManageProductsSub>
        <b>Pizzas</b>
      </S.ManageProductsSub>

      <S.ManageProductsContent>
        {!isAdding ? (
          <S.ManageProductsContentAdd onClick={() => setIsAdding(!isAdding)}>
            <Add />
            <span>Adicionar pizza</span>
          </S.ManageProductsContentAdd>
        ) : (
          <S.AddCard>
            <S.EditForm
              type="text"
              placeholder="Título"
              success={Boolean(productToAdd.name.length)}
              value={productToAdd.name}
              onChange={({ target }) => handleAddChange("name", target.value)}
            />
            <S.EditForm
              type="number"
              placeholder="Preço"
              success={Boolean(productToAdd.price)}
              value={productToAdd.price || ""}
              onChange={({ target }) => handleAddChange("price", +target.value)}
            />
            <S.EditForm
              type="text"
              placeholder="Descrição"
              success={Boolean(productToAdd.description.length)}
              value={productToAdd.description}
              onChange={({ target }) =>
                handleAddChange("description", target.value)
              }
            />
            <S.EditForm
              type="url"
              success={Boolean(productToAdd.image.length)}
              value={productToAdd.image}
              placeholder="Imagem"
              onChange={({ target }) => handleAddChange("image", target.value)}
            />
          </S.AddCard>
        )}

        {products.map((product, index) => (
          <EditProduct
            product={product}
            key={index}
            onEdit={onEditProduct}
            onCancel={cancel}
            onDelete={handleDelete}
          />
        ))}
      </S.ManageProductsContent>

      <S.ManageProductsActions>
        <S.ManageProductsActionsCancel onClick={handleCancel}>
          Cancelar
        </S.ManageProductsActionsCancel>
        <S.ManageProductsActionsSave onClick={handleSave}>
          Salvar Mudanças
        </S.ManageProductsActionsSave>
      </S.ManageProductsActions>
    </S.ManageProducts>
  );
};

export default ManageProducts;
