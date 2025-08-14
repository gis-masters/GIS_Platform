import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { CreateOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Projection } from '../../../services/data/projections/projections.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { EditProjectionDialog } from '../../EditProjectionDialog/EditProjectionDialog';

const cnOrgProjectionsActionsEdit = cn('OrgProjectionsActions', 'Edit');

interface OrgProjectionsActionsEditProps {
  projection: Projection;
  as: ActionsItemVariant;
}

export const OrgProjectionsActionsEdit = observer(({ projection, as }: OrgProjectionsActionsEditProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return (
    <>
      <ActionsItem
        className={cnOrgProjectionsActionsEdit()}
        title='Редактировать'
        as={as}
        icon={<CreateOutlined />}
        onClick={openDialog}
      />

      <EditProjectionDialog projection={projection} open={dialogOpen} onClose={closeDialog} />
    </>
  );
});
