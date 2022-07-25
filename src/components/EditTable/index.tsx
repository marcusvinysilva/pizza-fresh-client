import React, { useEffect, useState } from "react";
import { ReactComponent as Pencil } from "assets/icons/edit.svg";
import * as S from "./style";
import { TableResponse } from "types/api/table";

interface EditTableProps {
  table: TableResponse;
  onCancel: boolean;
  onDelete: (data: TableResponse) => void;
  onEdit: (data: TableResponse) => void;
}

const EditTable: React.FC<EditTableProps> = ({
  table,
  onCancel,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [onCancel]);

  const onEditClick = () => {
    setIsEditing(true);
    onEdit(table);
  };

  const onEditChange = (tableId: string) => {
    setIsEditing(true);
    onEdit({ ...table, number: Number(tableId) });
  };

  return (
    <S.EditTable role="listitem">
      {!isEditing ? (
        <>
          <S.EditTableDetails>
            <S.EditTableDetailsName> {table.number} </S.EditTableDetailsName>
          </S.EditTableDetails>

          <S.EditTableAction onClick={() => onEditClick()}>
            <Pencil /> Editar
          </S.EditTableAction>
        </>
      ) : (
        <>
          <label htmlFor="tableId">Número da Mesa</label>
          <S.EditForm
            id="talbeId"
            type="number"
            placeholder="01"
            onChange={({ target }) => onEditChange(target.value)}
          />

          <S.Deletar onClick={() => onDelete(table)}>Deletar Mesa</S.Deletar>
        </>
      )}
    </S.EditTable>
  );
};

export default EditTable;
