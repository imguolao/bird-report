import { useContext } from 'react';
import { Button, ButtonProps } from '@nextui-org/react';
import { TaxonDataContext } from '../../context/taxon';

export default function EmptyDataButton(props: ButtonProps) {
  const { taxonData, setTaxonData } = useContext(TaxonDataContext);

  function handleClick() {
    setTaxonData([]);
  }

  return (
    <Button
      {...props}
      isDisabled={!taxonData.length}
      onClick={handleClick}
    >
      清空数据
    </Button>
  );
}
