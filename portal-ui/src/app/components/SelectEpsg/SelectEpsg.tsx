import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { EpsgModel } from '../../../server-types/common-contracts';
import { Epsg } from '../../services/data/epsg/epsg.models';
import { getEpsg, registerEpsgArrayInProj4 } from '../../services/data/epsg/epsg.service';
import { PageOptions } from '../../services/models';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { Toast } from '../Toast/Toast';
import { XTableColumn, XTableExtraColumnType } from '../XTable/XTable.models';

import '!style-loader!css-loader!sass-loader!./SelectEpsg.scss';

const cnSelectEpsg = cn('SelectEpsg');

const selectAnother = 'Выбрать другую';

interface SelectEpsgProps {
  onSelect: (epsg: Epsg) => void;
  formView?: boolean;
  fullWidth?: boolean;
  defaultEpsg?: Epsg;
}

@observer
export class SelectEpsg extends Component<SelectEpsgProps> {
  @observable private dialogOpen = false;
  @observable private epsg: Epsg[] = [];
  @observable private selectedEPSG?: Epsg;

  private cols: XTableColumn<Epsg>[] = [
    {
      field: 'title',
      title: 'Система координат',
      minWidth: 300
    },
    {
      field: 'authName',
      title: 'Тип SRID'
    },
    {
      field: 'auth_srid',
      title: 'Код SRID',
      type: XTableExtraColumnType.ID,
      filterable: true,
      sortable: true
    },
    {
      field: 'srtext',
      title: 'srtext',
      filterable: true,
      minWidth: 300
    },
    {
      field: 'proj4Text',
      title: 'proj4Text',
      filterable: true,
      minWidth: 300
    }
  ];

  async componentDidMount(): Promise<void> {
    await this.init();
  }

  constructor(props: SelectEpsgProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { formView = false, fullWidth } = this.props;

    return (
      this.epsg.length > 1 &&
      this.selectedEPSG && (
        <div className={cnSelectEpsg()}>
          <FormControl
            fullWidth={fullWidth}
            variant='standard'
            className={cnSelectEpsg('Control', { formView })}
            size='small'
          >
            {formView ? (
              <FormLabel className={cnSelectEpsg('Label')} color='secondary' htmlFor='projSelector'>
                Система координат
              </FormLabel>
            ) : (
              <InputLabel id='epsgSelectLabel'>Система координат</InputLabel>
            )}
            <Select
              className={cnSelectEpsg('Select', { formView })}
              size='small'
              autoWidth
              labelId='epsgSelectLabel'
              fullWidth={fullWidth}
              value={this.selectedEPSG?.title}
              variant='standard'
              onChange={this.handleChange}
            >
              {this.epsg.map((item, key) => (
                <MenuItem value={item.title} key={key}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ChooseXTableDialog<Epsg>
            data={[]}
            getData={this.getEpsg}
            selectedItems={[this.selectedEPSG]}
            title={'Выбор системы координат'}
            open={this.dialogOpen}
            cols={this.cols}
            getRowId={this.getRowId}
            onClose={this.closeDialog}
            onSelect={this.select}
            withoutSelectAll
            single
          />
        </div>
      )
    );
  }

  @boundMethod
  private async init() {
    this.setEpsgArray(organizationSettings.orgFavoritesEPSG);
    const epsg = organizationSettings.orgDefaultEPSG;

    if (epsg) {
      this.setSelectedEPSG(epsg);
    }

    const { defaultEpsg } = this.props;

    if (defaultEpsg) {
      const pageOptions: PageOptions = {
        page: 0,
        pageSize: 1,
        filter: { auth_srid: defaultEpsg.authSrid }
      };
      const [epsg] = await getEpsg(pageOptions);

      this.setEpsgArray([epsg[0], ...this.epsg]);
      this.setSelectedEPSG(epsg[0]);
    }

    this.addEpsg({
      title: selectAnother,
      authSrid: 0,
      authName: selectAnother,
      auth_srid: 0,
      srtext: '',
      proj4Text: ''
    });

    for (const item of this.epsg) {
      if (item.authName !== selectAnother) {
        registerEpsgArrayInProj4([item]);
      }
    }
  }

  @action.bound
  private async handleChange(e: SelectChangeEvent) {
    if (e.target.value === selectAnother) {
      this.openDialog();
    } else {
      const epsg = await this.getEPSGByTitle(e.target.value);

      if (epsg) {
        this.setSelectedEPSG(epsg);
        this.props.onSelect(epsg);
      } else {
        Toast.error('Не найдена выбранная EPSG ' + e.target.value);
      }
    }
  }

  @action.bound
  private select(items: Epsg[]) {
    const selectedEpsg = items[0];
    registerEpsgArrayInProj4([selectedEpsg]);

    this.setEpsgArray([selectedEpsg, ...this.epsg]);
    this.setSelectedEPSG(selectedEpsg);

    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(selectedEpsg);
    }

    this.closeDialog();
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private setSelectedEPSG(selectedEPSG: Epsg) {
    this.selectedEPSG = selectedEPSG;
  }

  @action.bound
  private addEpsg(epsg: Epsg) {
    const isExist = this.epsg.find(proj => proj.title === epsg.title);
    if (!isExist) {
      this.epsg.push(epsg);
    }
  }

  @action.bound
  private setEpsgArray(epsg: Epsg[]) {
    this.epsg = epsg;
  }

  private getRowId(rowData: EpsgModel) {
    return rowData.authName + String(rowData.authSrid);
  }

  private async getEpsg(pageOptions: PageOptions): Promise<[Epsg[], number]> {
    const [epsg, totalPages] = await getEpsg(pageOptions);

    return [epsg, totalPages];
  }

  private async getEPSGByTitle(epsgTitle: string): Promise<Epsg | undefined> {
    const pageOptions: PageOptions = {
      page: 0,
      pageSize: 1,
      filter: { auth_srid: epsgTitle.split('EPSG:')[1].split(',')[0] }
    };

    const [epsg] = await getEpsg(pageOptions);

    return epsg.find(({ title }) => title === epsgTitle);
  }
}
