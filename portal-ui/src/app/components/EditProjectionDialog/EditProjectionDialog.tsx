import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { communicationService } from '../../services/communication.service';
import { projectionsClient } from '../../services/data/projections/projections.client';
import { EditProjectionModel, Projection } from '../../services/data/projections/projections.models';
import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { generateRandomId } from '../../services/util/randomId';
import { achtung } from '../../services/utility-dialogs.service';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { FormViewValue } from '../Form/ViewValue/Form-ViewValue';
import { Link } from '../Link/Link';
import { OrgProjectionsChangeConfirm } from '../OrgProjectionsChangeConfirm/OrgProjectionsChangeConfirm';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./EditProjectionDialog.scss';

const cnEditProjectionDialog = cn('EditProjectionDialog');

const schema: SimpleSchema = {
  properties: [
    {
      name: 'srtext',
      title: 'Текст WKT',
      required: true,
      display: 'multiline',
      propertyType: PropertyType.STRING
    }
  ]
};

interface EditProjectionDialogProps {
  open: boolean;
  projection?: Projection;

  onClose(): void;
}

interface EditProjectionDialogState {
  formValue?: EditProjectionModel;
  value?: EditProjectionModel;
  dialogOpen: boolean;
  busy: boolean;
  setFormValue(value?: EditProjectionModel): void;
  setValue(value?: EditProjectionModel): void;
  setDialogOpen(open: boolean): void;
  setBusy(busy: boolean): void;
}

export const EditProjectionDialog: FC<EditProjectionDialogProps> = observer(({ open, projection, onClose }) => {
  const state = useLocalObservable(
    (): EditProjectionDialogState => ({
      formValue: undefined,
      value: undefined,
      dialogOpen: false,
      busy: false,
      setFormValue(value?: EditProjectionModel) {
        this.formValue = value;
      },
      setValue(value?: EditProjectionModel) {
        this.value = value;
      },
      setDialogOpen(open: boolean) {
        this.dialogOpen = open;
      },
      setBusy(busy: boolean) {
        this.busy = busy;
      }
    })
  );

  const { formValue, value, dialogOpen, busy, setFormValue, setValue, setDialogOpen, setBusy } = state;

  const htmlId = generateRandomId();

  const initialValue = useMemo(
    () => (projection ? { srtext: projection.srtext, proj4Text: projection.proj4Text } : undefined),
    [projection]
  );

  const hasChanges = () => {
    if (!projection) {
      return true;
    }

    if (!formValue) {
      return false;
    }

    return formValue.srtext !== initialValue?.srtext || formValue.proj4Text !== initialValue?.proj4Text;
  };

  const openDialog = useCallback(() => {
    setDialogOpen(true);
  }, [setDialogOpen]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, [setDialogOpen]);

  const handleClose = useCallback(() => {
    setFormValue(undefined);
    onClose();
  }, [setFormValue, onClose]);

  const save = useCallback(
    async (value: EditProjectionModel) => {
      if (projection) {
        setValue(value);

        openDialog();
      } else {
        setBusy(true);

        try {
          const customCrs = await projectionsClient.createCustomProjection(value);

          const message = `Добавлена новая система координат CRG:${customCrs.authSrid}`;

          Toast.success(message, { duration: 10_000 });

          communicationService.projectionUpdated.emit({
            type: 'update'
          });
        } catch (error) {
          const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;
          throw new Error(err.response?.data.message);
        } finally {
          setBusy(false);
        }

        handleClose();
      }
    },
    [projection, setValue, openDialog, setBusy, handleClose]
  );

  const getWktExample = () => {
    const wktCodeExample = `
PROJCS["Local_SK-42_to_WGS84",                  // Название проекционной системы
GEOGCS["GCS_Krasovsky_1940",                    // Географическая СК на эллипсоиде Красовского
    DATUM["D_Krasovsky_1940",                   // Датум, ассоциированный с эллипсоидом Красовского
      SPHEROID["Krasovsky_1940",6378245,298.3], // Эллипсоид Красовский, с параметрами: полуось=6378245, сжатие=298.3
      TOWGS84[24, -123, -94, 0, 0, 0, 0]        // Параметры трансформации в WGS 84: смещения по X, Y, Z и угловые повороты
    ],
    PRIMEM["Greenwich",0],                      // Нулевой меридиан (Гринвич)
    UNIT["Degree",0.017453292519943295]         // Единицы измерения в градусах
],
PROJECTION["Transverse_Mercator"],              // Тип проекции - трансверсальная Меркатора
PARAMETER["latitude_of_origin",0],              // Широта начала координат
PARAMETER["central_meridian",45],               // Центральный меридиан
PARAMETER["scale_factor",1],                    // Масштабный коэффициент
PARAMETER["false_easting",500000],              // Смещение по оси X для создания положительных значений координат
PARAMETER["false_northing",0],                  // Смещение по оси Y
UNIT["Meter",1]                                 // Единица измерения результатов в метрах
]`;

    return achtung({
      title: 'Пример системы координат в формате WKT',
      okText: 'Закрыть',
      message: (
        <>
          <FormViewValue code>{wktCodeExample}</FormViewValue>В описании системы координат WKT важно обеспечить точное
          указание названий и параметров (регистр, пунктуацию и вложенность):
          <ul>
            <li>
              <Link href='https://gis-lab.info/qa/msk-wkt2.html' target='_blank'>
                Как конструировать описание местных систем координат в формате WKT 2
              </Link>
            </li>
            <li>
              <Link href='https://epsg.io/' target='_blank'>
                Поиск и просмотр мировых систем координат
              </Link>
            </li>
            <li>
              <Link href='https://prj2epsg.azimap.com/search' target='_blank'>
                Конвертор и валидатор систем координат в WKT
              </Link>
            </li>
          </ul>
        </>
      ),
      dialogProps: { maxWidth: 'lg', fullWidth: true, className: cnEditProjectionDialog('WktCodeExample') }
    });
  };

  useEffect(() => {
    if (open && projection) {
      setFormValue(initialValue);
    } else if (open && !projection) {
      setFormValue(undefined);
    }
  }, [open, projection, setFormValue, initialValue]);

  return (
    <>
      <Dialog className={cnEditProjectionDialog()} maxWidth={'lg'} fullWidth open={open}>
        <DialogTitle className={cnEditProjectionDialog('Title')}>
          {projection
            ? 'Редактировать пользовательскую систему координат'
            : 'Создать пользовательскую систему координат'}
        </DialogTitle>

        <DialogContent>
          Пример пользовательской системы координат в формате WKT (
          <PseudoLink onClick={getWktExample}>подробнее</PseudoLink>
          )
          <Form<EditProjectionModel>
            className={cnEditProjectionDialog('Form')}
            schema={schema}
            value={initialValue}
            auto
            id={htmlId}
            labelInField
            actionFunction={save}
            onFormChange={setFormValue}
          />
        </DialogContent>

        <DialogActions>
          <ActionsRight>
            <Button
              loading={busy}
              type='submit'
              disabled={busy || (projection && !hasChanges())}
              form={htmlId}
              color='primary'
            >
              {projection ? 'Сохранить' : 'Создать'}
            </Button>
            <Button onClick={handleClose}>Отмена</Button>
          </ActionsRight>
        </DialogActions>
      </Dialog>

      {projection && (
        <OrgProjectionsChangeConfirm
          type='edit'
          open={dialogOpen}
          closeDialog={closeDialog}
          closeParentDialog={handleClose}
          projection={projection}
          editValue={value}
        />
      )}
    </>
  );
});
