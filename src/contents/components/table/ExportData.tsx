import { useContext } from 'react';
import { Button } from '@nextui-org/react';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { TaxonDataContext } from '../../context/taxon';

export default function ExportDataButton() {
  const { taxonData } = useContext(TaxonDataContext);

  function handleDownload() {
    const csvConfig = mkConfig({
      filename: new Date().getTime().toString(),
      columnHeaders: [
        {
          key: 'taxon_id',
          displayLabel: '鸟种编号',
        },
        {
          key: 'taxonname',
          displayLabel: '中文名',
        },
        {
          key: 'englishname',
          displayLabel: '英文名称',
        },
        {
          key: 'latinname',
          displayLabel: '拉丁学名',
        },
        {
          key: 'taxonordername',
          displayLabel: '目',
        },
        {
          key: 'taxonfamilyname',
          displayLabel: '科',
        },
        {
          key: 'recordcount',
          displayLabel: '记录次数',
        },
      ]
    });
    const csv = generateCsv(csvConfig)(taxonData);
    download(csvConfig)(csv);
  }

  return (
    <Button isDisabled={!taxonData.length} onClick={handleDownload}>导出数据</Button>
  );
}
