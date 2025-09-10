import React, { FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Projection } from '../../../services/data/projections/projections.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { OrgProjectionsChangeConfirm } from '../../OrgProjectionsChangeConfirm/OrgProjectionsChangeConfirm';

const cnOrgProjectionsActionsDelete = cn('OrgProjectionsActions', 'Delete');

interface OrgProjectionsActionsDeleteProps {
  projection: Projection;
  as: ActionsItemVariant;
}

export const OrgProjectionsActionsDelete: FC<OrgProjectionsActionsDeleteProps> = observer(({ projection, as }) => {
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
        className={cnOrgProjectionsActionsDelete()}
        title='Удалить'
        as={as}
        icon={<DeleteOutlined />}
        onClick={openDialog}
      />

      <OrgProjectionsChangeConfirm
        type='deletion'
        open={dialogOpen}
        closeDialog={closeDialog}
        projection={projection}
      />
    </>
  );
});
