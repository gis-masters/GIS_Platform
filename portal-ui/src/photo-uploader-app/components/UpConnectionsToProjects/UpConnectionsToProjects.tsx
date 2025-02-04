import React, { FC, useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { ConnectionsTableToProjectsWidget } from '../../../app/components/ConnectionsTableToProjectsWidget/ConnectionsTableToProjectsWidget';
import { FileConnection } from '../../../app/services/data/files/files.models';
import { getVectorTableConnections } from '../../../app/services/data/vectorData/vectorData.service';
import { photoUploaderStore } from '../../stores/PhotoUploader.store';

interface UpConnectionsToProjectsState {
  vectorTableConnections: FileConnection[] | null;
  setConnections(connections: FileConnection[]): void;
}

const cnUpConnectionsToProjects = cn('UpConnectionsToProjects');

export const UpConnectionsToProjects: FC = observer(() => {
  const state = useLocalObservable(
    (): UpConnectionsToProjectsState => ({
      vectorTableConnections: null,
      setConnections(this: UpConnectionsToProjectsState, connections: FileConnection[]): void {
        this.vectorTableConnections = connections;
      }
    })
  );

  const { vectorTableConnections, setConnections } = state;

  const fetchConnections = useCallback(async () => {
    const vectorTable = photoUploaderStore.checkedLayer?.data;
    photoUploaderStore.setBusy(true);

    if (!vectorTable) {
      return;
    }
    const currentVectorTableId = vectorTable.identifier;
    const vectorTableConnections = await getVectorTableConnections(vectorTable.identifier);
    if (vectorTableConnections.length && currentVectorTableId === vectorTable.identifier) {
      setConnections(vectorTableConnections);
    }

    photoUploaderStore.setBusy(false);
  }, [setConnections]);

  useEffect(() => {
    void (async () => {
      await fetchConnections();
    })();
  }, [fetchConnections]);

  return (
    <div className={cnUpConnectionsToProjects()}>
      {!!vectorTableConnections && !!photoUploaderStore.checkedLayer && (
        <ConnectionsTableToProjectsWidget vectorTable={photoUploaderStore.checkedLayer?.data} />
      )}
    </div>
  );
});
