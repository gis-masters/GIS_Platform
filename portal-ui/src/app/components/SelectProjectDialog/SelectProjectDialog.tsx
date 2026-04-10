import React, { type FC, type ReactNode, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { FileOpenOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';
import { RegistryConsumer } from '@bem-react/di';

import { type CommonDiRegistry } from '../../services/di-registry';
import { type CrgProject } from '../../services/gis/projects/projects.models';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button, type ButtonProps } from '../Button/Button';
import { type ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';

const cnSelectProjectDialog = cn('SelectProjectDialog');

type SelectProjectDialogProps = {
  open: boolean;
  title?: string;
  allowFolderSelection?: boolean;
  additionalActions?: ReactNode;
  actionButtonProps?: ButtonProps;
  disabledTester?(item: ExplorerItemData): boolean;
  onSubmit(project?: CrgProject): void;
  onClose(): void;
} & IClassNameProps;

type SelectProjectDialogStore = {
  selectedItem: ExplorerItemData | undefined;
  setSelectedItem(item: ExplorerItemData | undefined): void;
};

export const SelectProjectDialog: FC<SelectProjectDialogProps> = observer(
  ({
    open,
    title = 'Выбор проекта',
    allowFolderSelection = false,
    additionalActions,
    actionButtonProps,
    disabledTester,
    onClose,
    onSubmit,
    className
  }) => {
    const { selectedItem, setSelectedItem } = useLocalObservable<SelectProjectDialogStore>(() => ({
      selectedItem: undefined,
      setSelectedItem(item) {
        this.selectedItem = item;
      }
    }));

    const handleSelect = useCallback(
      (explorerItem: ExplorerItemData) => {
        if (explorerItem.type === ExplorerItemType.PROJECT) {
          setSelectedItem(explorerItem);
        } else if (allowFolderSelection && explorerItem.type === ExplorerItemType.PROJECT_FOLDER) {
          setSelectedItem(explorerItem);
        } else {
          setSelectedItem(undefined);
        }
      },
      [setSelectedItem, allowFolderSelection]
    );

    const handleOpen = useCallback(
      (explorerItem: ExplorerItemData) => {
        if (explorerItem.type === ExplorerItemType.PROJECT) {
          onSubmit(explorerItem.payload);
          onClose();
        }
      },
      [onSubmit, onClose]
    );

    const handleSubmit = useCallback(() => {
      const payload =
        selectedItem?.type === ExplorerItemType.PROJECT || selectedItem?.type === ExplorerItemType.PROJECT_FOLDER
          ? selectedItem.payload
          : undefined;
      onSubmit(payload);
      onClose();
    }, [selectedItem, onSubmit, onClose]);

    const isSubmitDisabled = !selectedItem || (disabledTester && disabledTester(selectedItem));

    const submitLabel = actionButtonProps?.children || 'Выбрать';

    return (
      <Dialog
        open={open}
        slotProps={{ paper: { className: cnSelectProjectDialog(null, [className]) } }}
        onClose={onClose}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <RegistryConsumer id='common'>
            {({ Explorer }: CommonDiRegistry) => (
              <Explorer
                adaptersOverride={{
                  [ExplorerItemType.PROJECT]: {
                    customOpenActionIcon: () => (
                      <Tooltip title={submitLabel}>
                        <FileOpenOutlined />
                      </Tooltip>
                    ),
                    customOpenAction: (explorerItem: ExplorerItemData) => {
                      if (explorerItem.type === ExplorerItemType.PROJECT) {
                        setSelectedItem(explorerItem);
                        onSubmit(explorerItem.payload);
                        onClose();
                      }
                    }
                  }
                }}
                className={cnSelectProjectDialog('Explorer')}
                explorerRole='SelectProjectDialog'
                preset={ExplorerItemType.PROJECTS_ROOT}
                onSelect={handleSelect}
                onOpen={handleOpen}
                disabledTester={disabledTester}
                hideToolbarActions
              />
            )}
          </RegistryConsumer>
        </DialogContent>
        <DialogActions>
          {additionalActions && <ActionsLeft>{additionalActions}</ActionsLeft>}
          <ActionsRight>
            <Button color='primary' disabled={isSubmitDisabled} onClick={handleSubmit} {...actionButtonProps}>
              {submitLabel}
            </Button>
            <Button onClick={onClose}>Отмена</Button>
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }
);
