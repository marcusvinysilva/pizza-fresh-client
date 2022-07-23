import * as S from "./style";
import ButtonToggle from "components/ButtonToggle";

const OrderDetails = () => {
  return (
    <S.OrderDetails>
      <S.OrderDetailsTitle>Detalhes do Pedido</S.OrderDetailsTitle>
      <S.OrderDetailsButtonGroup>
        <ButtonToggle active={false} value="Comer no Local" />
        <ButtonToggle active={false} value="P/ Viagem" />
        <ButtonToggle active={false} value="Delivery" />
      </S.OrderDetailsButtonGroup>
      <S.OrderDetailsList>
        <p>Itens do pedido</p>
      </S.OrderDetailsList>
    </S.OrderDetails>
  );
};

export default OrderDetails;
