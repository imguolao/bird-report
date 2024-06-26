import { useState, useMemo, useContext } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  type TableProps,
} from '@nextui-org/react';
import { TaxonDataContext } from '../../context/taxon';

const columns = [
  {
    key: 'taxon_id',
    label: '鸟种编号',
  },
  {
    key: 'taxonname',
    label: '中文名',
  },
  {
    key: 'englishname',
    label: '英文名称',
  },
  {
    key: 'latinname',
    label: '拉丁学名',
  },
  {
    key: 'taxonordername',
    label: '目',
  },
  {
    key: 'taxonfamilyname',
    label: '科',
  },
  {
    key: 'recordcount',
    label: '记录次数',
  },
];

export default function DataGrid(props: TableProps) {
  const { taxonData } = useContext(TaxonDataContext);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil(taxonData.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return taxonData.slice(start, end);
  }, [page, taxonData]);

  return (
    <Table
      {...props}
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={items} emptyContent={'No Data'}>
        {(item) => (
          <TableRow key={item.taxon_id}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}