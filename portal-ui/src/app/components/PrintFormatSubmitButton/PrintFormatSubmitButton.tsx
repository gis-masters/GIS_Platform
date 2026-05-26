import React, { type FC, useCallback, useRef } from 'react';
import { cn } from '@bem-react/classname';

import { type CreateReportRequest } from '../../services/report/report.models';
import { isOutputFormat } from '../../services/report/report.typeguards';
import { type SubmitComponentProps } from '../../stores/AnswerModals.store';
import { SplitButton } from '../SplitButton/SplitButton';
import { PrintFormatSubmitButtonFormat } from './Format/PrintFormatSubmitButton-Format';

type OutputFormat = CreateReportRequest['outputFormat'];

const cnPrintFormatSubmitButton = cn('PrintFormatSubmitButton');

const allOutputFormats: OutputFormat[] = ['PDF', 'DOCX', 'ODT', 'JPEG'];

export const PrintFormatSubmitButton: FC<SubmitComponentProps> = ({ formId, submit, submitData }) => {
  const defaultOutputFormatRef = useRef<OutputFormat>(
    isOutputFormat(submitData.outputFormat) ? submitData.outputFormat : 'PDF'
  );

  const primaryFormat = defaultOutputFormatRef.current;

  const alternativeFormats = allOutputFormats
    .filter(format => format !== primaryFormat)
    .map(format => ({ format, label: format }));

  const handleMainClick = useCallback(() => {
    submitData.outputFormat = defaultOutputFormatRef.current;
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
      Печать ({primaryFormat})
    </SplitButton>
  );
};
