import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { projectionsClient } from '../../services/data/projections/projections.client';
import { CreateProjectionModel } from '../../services/data/projections/projections.models';
import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { generateRandomId } from '../../services/util/randomId';
import { achtung } from '../../services/utility-dialogs.service';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { FormViewValue } from '../Form/ViewValue/Form-ViewValue';
import { Link } from '../Link/Link';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./CreateProjection.scss';

const cnCreateProjection = cn('CreateProjection');

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

interface CreateProjectionProps {
  open: boolean;
  onClose(): void;
}

@observer
export class CreateProjection extends Component<CreateProjectionProps> {
  @observable private busy = false;

  constructor(props: CreateProjectionProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const htmlId = generateRandomId();

    return (
      <Dialog className={cnCreateProjection()} maxWidth={'lg'} fullWidth open={this.props.open}>
        <DialogTitle className={cnCreateProjection('Title')}>Создать пользовательскую систему координат</DialogTitle>

        <DialogContent>
          Пример пользовательской системы координат в формате WKT (
          <PseudoLink onClick={this.getWktExample}>подробнее</PseudoLink>
          )
          <Form<CreateProjectionModel>
            className={cnCreateProjection('Form')}
            schema={schema}
            auto
            id={htmlId}
            labelInField
            actionFunction={this.save}
          />
        </DialogContent>

        <DialogActions>
          <ActionsRight>
            <Button type='submit' disabled={this.busy} form={htmlId} color='primary'>
              Создать
            </Button>
            <Button onClick={this.props.onClose}>Отмена</Button>
          </ActionsRight>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private async save(value: CreateProjectionModel) {
    this.setBusy(true);

    try {
      const customCrs = await projectionsClient.createCustomProjection(value);
      Toast.success(`Добавлена новая система координат CRG:${customCrs.authSrid}`, { duration: 15_000 });
    } catch (error) {
      const err = error as AxiosError<{ errors: Record<string, unknown>[]; message?: string }>;
      this.setBusy(false);
      throw new Error(err.response?.data.message);
    }

    this.setBusy(false);
    this.props.onClose();
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  private getWktExample() {
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
      dialogProps: { maxWidth: 'lg', fullWidth: true, className: cnCreateProjection('WktCodeExample') }
    });
  }
}
