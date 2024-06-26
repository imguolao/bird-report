import { useState, useContext } from 'react';
import {
  type Selection,
  Accordion,
  AccordionItem,
  Button,
} from '@nextui-org/react';
import AreaSelect, { type Area } from './AreaSelect';
import DateSelect, { type RangeDate } from './DateSelect';
import CloseIcon from './CloseIcon';
import { getTaxon } from '../../request/iframe_api';
import { TaxonDataContext } from '../../context/taxon';
import { log } from '../../../utils';
import { TaxonData } from '../../request';
import ExportDataButton from '../table/ExportData';
import EmptyDataButton from '../table/EmptyData';

type QueryParam = {
  key: string;
  area?: Area;
  rangeDate?: RangeDate;
}

export default function MultipleSearch() {
  const { setTaxonData } = useContext(TaxonDataContext);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['0']));
  const [params, setParams] = useState<QueryParam[]>([{
    key: '0',
  }]);
  const filterParams = params.filter(({ area, rangeDate }) => {
    const hasArea = !!area && !!Object.keys(area).length;
    const hasDate = !!rangeDate;
    return hasArea || hasDate;
  });

  const handleAreaSelect = (area: Area, index: number) => {
    const newParams = params.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          area,
        }
      }

      return item;
    });
    setParams(newParams);
  }

  const handleRangeDateSelect = (rangeDate: RangeDate, index: number) => {
    const newParams = params.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          rangeDate,
        }
      }

      return item;
    });

    setParams(newParams);
  }

  const handleParamDelete = (index: number) => {
    const newParams = params.filter((_, i) => i !== index);
    setParams(newParams);
  }

  const handleParamAdd = () => {
    const key = new Date().getTime().toString();
    setParams([...params, { key }]);
    setSelectedKeys(new Set([key]));
  }

  const handleQuery = async () => {
    try {
      const result = await getTaxon(params);
      const dataMap = result.reduce((ret, response) => {
        const { data: taxonDataList } = response;
        for (const taxonData of taxonDataList) {
            if (ret.has(taxonData.taxon_id)) {
                const value = ret.get(taxonData.taxon_id)!;
                value.recordcount += taxonData.recordcount;
                ret.set(taxonData.taxon_id, value);
            } else {
                ret.set(taxonData.taxon_id, { ...taxonData });
            }
        }

        return ret;
      }, new Map<TaxonData['taxon_id'], TaxonData>());
      setTaxonData(Array.from(dataMap.values()));
    } catch (e) {
      log(e);
    }    
  }

  return (
    <div>
      <Accordion
        selectionMode="multiple"
        variant="bordered"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys: Selection) => setSelectedKeys(keys)}
      >
        {params.map((p, index) => (
          <AccordionItem key={p.key} title={`查询参数-${index + 1}`} subtitle={(<Subtitle param={p} />)}>
            <div className="flex items-center">
              <div className="flex-1">
                <AreaSelect
                  className="mb-[10px]"
                  area={p.area}
                  onSelectChange={(area: Area) => handleAreaSelect(area, index)} 
                />
                <DateSelect
                  rangeDate={p.rangeDate}
                  onSelectChange={(rangeDate: RangeDate) => handleRangeDateSelect(rangeDate, index)}
                />
              </div>
              <span 
                title="删除"
                className="cursor-pointer"
                onClick={() => handleParamDelete(index)}
              >
                <CloseIcon className="text-[24px]" />
              </span>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-[10px] flex justify-between">
        <div>
          <Button color="default" onClick={handleParamAdd}>增加参数</Button>
          <Button
            className="ml-[10px]"
            color="primary"
            isDisabled={!filterParams.length}
            onClick={handleQuery}
          >
            聚合查询
          </Button>
        </div>
        <div>
          <EmptyDataButton className="mr-[10px]" />
          <ExportDataButton />
        </div>
      </div>
    </div>
  );
}

function Subtitle(props: { param: QueryParam }) {
  const { param: { area, rangeDate } } = props;
  const province = area?.province?.province_name ?? '';
  const city = area?.city?.city_name ?? '';
  const district = area?.district?.district_name ?? '';
  const startTime = rangeDate?.start ?? '';
  const endTime = rangeDate?.end ?? '';
  const sep = startTime ? ' - ': '';
  return (
    <div>
      <span>{`${province} ${city} ${district} `}</span>
      <span>{`${startTime}${sep}${endTime}`}</span>
    </div>
  )
}
