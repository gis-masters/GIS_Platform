import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Autocomplete, AutocompleteRenderInputParams, TextField } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { withBemMod } from '@bem-react/core';
import { debounce } from 'lodash';

import { Fias, getFiasAddress, getFiasOktmoAddress } from '../../../../services/data/fias.service';
import { PropertySchemaFias, PropertyType } from '../../../../services/data/schema.models';

import { FormInfo } from '../../Info/Form-Info';
import { cnFormControl, FormControlProps } from '../Form-Control';

import '!style-loader!css-loader!sass-loader!./Form-Control_type_fias.scss';

const FiasMod = {
  ADDRESS: 'address',
  OKTMO: 'oktmo'
};

@observer
class FormControlTypeFias extends Component<FormControlProps> {
  @observable private optionsList: Fias[] = [];

  constructor(props: FormControlProps) {
    super(props);

    makeObservable(this);

    this.getFiasList = debounce(this.getFiasList, 666);
  }

  render() {
    const { htmlId, className, fieldValue = {}, inSet, fullWidthForOldForm } = this.props;
    const { objectId, oktmo } = (fieldValue as { oktmo: string; objectId: number }) || {};

    return (
      <div className={cnFormControl({ inSet, fullWidthForOldForm }, [className])}>
        <Autocomplete
          id={htmlId}
          fullWidth={!inSet}
          filterOptions={this.filterOptions}
          freeSolo
          disableClearable
          value={fieldValue}
          options={this.optionsList}
          getOptionLabel={this.getOptionLabel}
          onBlur={this.handleBlur}
          onInputChange={this.handleChange}
          onChange={this.selectItem}
          renderInput={this.renderInput}
        />

        {oktmo && <FormInfo title='ОКТМО' text={String(oktmo)} />}
        {objectId && <FormInfo title='Код ФИАС' text={String(objectId)} />}
      </div>
    );
  }

  @boundMethod
  private async handleChange(event: React.SyntheticEvent, value: string) {
    if (!event) {
      return;
    }

    const { onChange, property } = this.props;
    const fias = this.optionsList.find(option => {
      const address = option.fullAddress || option.locality;

      return address === value;
    });

    if (onChange) {
      onChange({
        value: {
          fullAddress: value,
          oktmo: fias?.oktmo,
          objectId: fias?.objectId
        },
        propertyName: property.name
      });
    }

    this.setOptionList();
    await this.getFiasList(value);
  }

  @boundMethod
  private handleBlur() {
    const { onNeedValidate, fieldValue, property } = this.props;

    if (onNeedValidate) {
      onNeedValidate({
        value: fieldValue,
        propertyName: property.name
      });
    }
  }

  @boundMethod
  private selectItem() {
    this.setOptionList();
  }

  private filterOptions(options: Fias[]): Fias[] {
    return options;
  }

  private async getFiasList(value: string): Promise<void> {
    const result =
      (this.props.property as PropertySchemaFias)?.searchMode === FiasMod.OKTMO
        ? await getFiasOktmoAddress(value)
        : await getFiasAddress(value);

    this.setOptionList(result);
  }

  @action.bound
  private setOptionList(list?: Fias[]) {
    this.optionsList = list || [];
  }

  @boundMethod
  private renderInput(params: AutocompleteRenderInputParams) {
    const { fieldValue = {}, errors, property, variant = 'standard' } = this.props;
    const { name } = property as PropertySchemaFias;

    return (
      <TextField
        {...params}
        value={fieldValue}
        name={name}
        variant={variant}
        fullWidth
        multiline
        minRows={1}
        maxRows={3}
        error={!!errors.length}
        helperText={errors}
        size={variant === 'outlined' ? 'small' : 'medium'}
      />
    );
  }

  private getOptionLabel(option: Fias): string {
    return option?.fullAddress || option?.locality || '';
  }
}

export const withTypeFias = withBemMod<FormControlProps, FormControlProps>(
  cnFormControl(),
  { type: PropertyType.FIAS },
  () => FormControlTypeFias
);
