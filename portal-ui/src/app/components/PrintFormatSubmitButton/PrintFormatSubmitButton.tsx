import React, { type FC, useCallback } from 'react';
import { cn } from '@bem-react/classname';

import { type CreateReportRequest } from '../../services/print/print.models';
import { type SubmitComponentProps } from '../../stores/UtilityDialogs.store';
import { SplitButton } from '../SplitButton/SplitButton';
import { PrintFormatSubmitButtonFormat } from './Format/PrintFormatSubmitButton-Format';

type OutputFormat = CreateReportRequest['outputFormat'];

const cnPrintFormatSubmitButton = cn('PrintFormatSubmitButton');

const alternativeFormats: { format: OutputFormat; label: string }[] = [
  { format: 'DOCX', label: 'DOCX' },
  { format: 'ODT', label: 'ODT' },
  { format: 'JPEG', label: 'JPEG' }
];

export const PrintFormatSubmitButton: FC<SubmitComponentProps> = ({ formId, submit, submitData }) => {
  const handleMainClick = useCallback(() => {
    submitData.outputFormat = 'PDF';
  }, [submitData]);

  const handleFormatSelect = useCallback(
    (format: OutputFormat) => {
      submitData.outputFormat = format;
      submit();
    },
    [submit, submitData]
  );

  return (
    <SplitButton
      className={cnPrintFormatSubmitButton()}
      color='primary'
      form={formId}
      type='submit'
      onClick={handleMainClick}
      menu={
        <>
          {alternativeFormats.map(({ format, label }) => (
            <PrintFormatSubmitButtonFormat key={format} format={format} label={label} onSelect={handleFormatSelect} />
          ))}
        </>
      }
    >
      Печать (PDF)
    </SplitButton>
  );
};
