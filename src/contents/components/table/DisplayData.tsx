import { ComponentProps } from 'react';
import DataGrid from './DataGrid';
import ExportData from './ExportData';

export default function DisplayData(props: ComponentProps<'div'>) {
  return (
    <div {...props}>
      <ExportData />
      <DataGrid />
    </div>
  );
}
