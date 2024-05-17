import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { SpatialReferenceSystem } from '../../../server-types/common-contracts';
import { Projection, projectionXTableCols } from '../../services/data/projection/projection.models';
import { getProjection, registerProjectionArrayInProj4 } from '../../services/data/projection/projection.service';
import { PageOptions } from '../../services/models';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./SelectProjection.scss';

const cnSelectProjection = cn('SelectProjection');

const selectAnother = 'Выбрать другую';

interface SelectProjectionProps {
  onSelect: (projection: Projection) => void;
  formView?: boolean;
  fullWidth?: boolean;
  defaultProjection?: Projection;
}

@observer
export class SelectProjection extends Component<SelectProjectionProps> {
  @observable private dialogOpen = false;
  @observable private projections: Projection[] = [];
  @observable private selectedProjection?: Projection;

  async componentDidMount(): Promise<void> {
    await this.init();
  }

  constructor(props: SelectProjectionProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { formView = false, fullWidth } = this.props;

    return (
      this.projections.length > 1 && (
        <div className={cnSelectProjection()}>
          <FormControl
            fullWidth={fullWidth}
            variant='standard'
            className={cnSelectProjection('Control', { formView })}
            size='small'
          >
            {formView ? (
              <FormLabel className={cnSelectProjection('Label')} color='secondary' htmlFor='projSelector'>
                Система координат
              </FormLabel>
            ) : (
              <InputLabel id='projectionSelectLabel'>Система координат</InputLabel>
            )}
            <Select
              className={cnSelectProjection('Select', { formView })}
              size='small'
              autoWidth
              labelId='projectionSelectLabel'
              fullWidth={fullWidth}
              value={this.selectedProjection?.title}
              variant='standard'
              onChange={this.handleChange}
            >
              {this.projections.map((item, key) => (
                <MenuItem value={item.title} key={key}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ChooseXTableDialog<Projection>
            data={[]}
            getData={this.getProjection}
            selectedItems={[this.selectedProjection]}
            title={'Выбор системы координат'}
            open={this.dialogOpen}
            cols={projectionXTableCols}
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
    this.setProjections(organizationSettings.orgFavoriteProjections);
    const projection = organizationSettings.orgDefaultProjection;

    if (projection) {
      this.setSelectedProjection(projection);
    }

    const { defaultProjection } = this.props;

    if (defaultProjection) {
      const pageOptions: PageOptions = {
        page: 0,
        pageSize: 1,
        filter: { auth_srid: defaultProjection.authSrid }
      };
      const [projections] = await getProjection(pageOptions);

      this.setProjections([projections[0], ...this.projections]);
      this.setSelectedProjection(projections[0]);
    }

    this.addProjection({
      title: selectAnother,
      authSrid: 0,
      authName: selectAnother,
      auth_srid: 0,
      srtext: '',
      auth_name: '',
      proj4Text: ''
    });

    for (const item of this.projections) {
      if (item.authName !== selectAnother) {
        registerProjectionArrayInProj4([item]);
      }
    }
  }

  @action.bound
  private async handleChange(e: SelectChangeEvent) {
    if (e.target.value === selectAnother) {
      this.openDialog();
    } else {
      const projection = await this.getProjectionByTitle(e.target.value);

      if (projection) {
        this.setSelectedProjection(projection);
        this.props.onSelect(projection);
      } else {
        Toast.error('Не найдена выбранная система координат ' + e.target.value);
      }
    }
  }

  @action.bound
  private select(items: Projection[]) {
    const selectedProjection = items[0];
    registerProjectionArrayInProj4([selectedProjection]);

    this.setProjections([selectedProjection, ...this.projections]);
    this.setSelectedProjection(selectedProjection);

    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(selectedProjection);
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
  private setSelectedProjection(selectedProjection: Projection) {
    this.selectedProjection = selectedProjection;
  }

  @action.bound
  private addProjection(projection: Projection) {
    const isExist = this.projections.find(proj => proj.title === projection.title);
    if (!isExist) {
      this.projections.push(projection);
    }
  }

  @action.bound
  private setProjections(proj: Projection[]) {
    this.projections = proj;
  }

  private getRowId(srs: SpatialReferenceSystem) {
    return srs.authName + String(srs.authSrid);
  }

  private async getProjection(pageOptions: PageOptions): Promise<[Projection[], number]> {
    const [proj, totalPages] = await getProjection(pageOptions);

    return [proj, totalPages];
  }

  private async getProjectionByTitle(projectionTitle: string): Promise<Projection | undefined> {
    const pageOptions: PageOptions = {
      page: 0,
      pageSize: 1,
      filter: { auth_srid: projectionTitle.split(':')[1].split(',')[0] }
    };

    const [proj] = await getProjection(pageOptions);

    return proj.find(({ title }) => title === projectionTitle);
  }
}
