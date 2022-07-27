import { HTMLAttributes, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKey } from "types/QueryKey";
import { TableService } from "services/TableService";
import { ReactComponent as Add } from "assets/icons/add.svg";
import EditTable from "components/EditTable";
import * as S from "./style";
import { Table, TableResponse } from "types/api/table";
import { ErrorResponse } from "types/api/error";

type ManageTablesType = HTMLAttributes<HTMLDivElement>;

type ManageTablesProps = {} & ManageTablesType;

const ManageTables: React.FC<ManageTablesProps> = ({ ...props }) => {
  const [tables, setTables] = useState<TableResponse[]>([]);

  const add = useMutation(TableService.create, {
    onSuccess: (data: TableResponse & ErrorResponse) => {
      if (data.statusCode) {
        return;
      }

      const tableList = [...tables, data as TableResponse];
      setTables(tableList);
    },
    onError: () => {
      console.error("Erro ao adicionar a mesa");
    },
  });

  const remove = useMutation(TableService.deleteById, {
    onSuccess: (data: TableResponse & ErrorResponse) => {
      if (data.statusCode) {
        return;
      }

      const editedTables = tables.filter((i) => data.id !== i.id);
      setTables(editedTables);
    },
    onError: () => {
      console.error("Erro ao remover a mesa");
    },
  });

  const handleDelete = (table: TableResponse) => {
    remove.mutate(table.id);
  };

  const update = useMutation(TableService.updateById, {
    onSuccess: (data: TableResponse & ErrorResponse) => {
      if (data.statusCode) {
        return;
      }

      const editedTables = tables.map((i) =>
        data.id === i.id ? (data as TableResponse) : i
      );
      setTables(editedTables);
    },
    onError: () => {
      console.error("Erro ao atualizar a mesa");
    },
  });

  const handleSave = () => {
    tablesToEdit.forEach((table) => update.mutate(table));
    if (tableToAdd) add.mutate(tableToAdd);
    setTimeout(() => handleCancel(), 300);
    tableToAdd = null;
    setIsAdding(false);
  };

  const { data: tablesData } = useQuery([QueryKey.TABLES], TableService.getLista);

  const [cancel, setCancel] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  let tablesToEdit: TableResponse[] = [];
  let tableToAdd: Table | null = null;

  const handleCancel = () => {
    setCancel(true);
    setIsAdding(false);
    setTimeout(() => setCancel(false));
    tablesToEdit = [];
  };

  const onEditTable = (toEdit: TableResponse) => {
    setCancel(false);
    const existing = tablesToEdit.find((table) => table.id === toEdit.id);

    tablesToEdit = existing
      ? tablesToEdit.map((i) => (i.id === existing.id ? toEdit : i))
      : [...tablesToEdit, toEdit];
  };

  const onAddChange = (number: string) => {
    tableToAdd = { number: Number(number) };
  };

  useEffect(() => {
    setTables(tablesData || []);
  }, [tablesData]);

  return (
    <S.ManageTables {...props}>
      <S.ManageTablesTitle>Gerenciar Mesas</S.ManageTablesTitle>
      <S.ManageTablesSub>
        <b> Mesas </b>
      </S.ManageTablesSub>

      <S.ManageTablesContent>
        {!isAdding ? (
          <S.ManageTablesContentAdd onClick={() => setIsAdding(true)}>
            <Add />
            <span>Adicionar mesa</span>
          </S.ManageTablesContentAdd>
        ) : (
          <S.ManageTablesContentAdd>
            <label htmlFor="tableId">Número da Mesa</label>
            <S.EditForm
              id="talbeId"
              type="number"
              placeholder="01"
              onChange={({ target }) => onAddChange(target.value)}
            />
          </S.ManageTablesContentAdd>
        )}

        {tables.map((table, index) => (
          <EditTable
            table={table}
            key={index}
            onCancel={cancel}
            onEdit={onEditTable}
            onDelete={handleDelete}
          />
        ))}
      </S.ManageTablesContent>

      <S.ManageTablesActions>
        <S.ManageTablesActionsCancel onClick={handleCancel}>
          Cancelar
        </S.ManageTablesActionsCancel>
        <S.ManageTablesActionsSave onClick={handleSave}>
          Salvar Mudanças
        </S.ManageTablesActionsSave>
      </S.ManageTablesActions>
    </S.ManageTables>
  );
};

export default ManageTables;
