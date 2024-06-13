import { type ComponentProps } from 'react';

export default function Field(props: ComponentProps<'div'> & {
  label?: string;
}) {
  const { label, children, className = '', ...restProps } = props;
  return (
    <div className={`flex items-center ${className}`} {...restProps}>
      <div className="basis-[48px] text-[16px]">{label}</div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

