import { useState, useMemo } from 'react';
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
import { TaxonData } from '../../request';

// const rows = [
//   {
//     englishname: 'Koklass Pheasant',
//     latinname: 'Pucrasia macrolopha',
//     recordcount: 3,
//     taxon_id: 4022,
//     taxonfamilyname: '雉科',
//     taxonname: '勺鸡',
//     taxonordername: '鸡形目',
//   }
// ];

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

export default function DataGrid(props: {
  data?: TaxonData[],
} & TableProps) {
  const { data = [], ...restProps } = props;
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil(data.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  return (
    <Table
      {...restProps}
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