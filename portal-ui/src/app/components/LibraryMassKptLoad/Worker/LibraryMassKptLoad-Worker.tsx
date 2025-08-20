import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { FileInput } from '../../FileInput/FileInput';
import { LibraryMassKptLoadNotice } from '../Notice/LibraryMassKptLoad-Notice';

import '!style-loader!css-loader!sass-loader!./LibraryMassKptLoad-Worker.scss';

const cnLibraryMassKptLoad = cn('LibraryMassKptLoad');

interface LibraryMassKptLoadWorkerProps {
  onChange(files: FileList | null): void;
}

export const LibraryMassKptLoadWorker: FC<LibraryMassKptLoadWorkerProps> = observer(({ onChange }) => (
  <div className={cnLibraryMassKptLoad('Worker')}>
    <FileInput onChange={onChange} multiple />
    <LibraryMassKptLoadNotice />
  </div>
));
