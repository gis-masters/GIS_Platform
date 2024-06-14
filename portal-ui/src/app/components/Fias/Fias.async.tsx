import React, { Component, SyntheticEvent } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Autocomplete, AutocompleteRenderInputParams, TextField } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { debounce, DebouncedFunc } from 'lodash';

import { FiasValue } from '../../services/data/fias/fias.models';
import { getFiasAddressItems, getFiasOktmoItems } from '../../services/data/fias/fias.service';
import { FiasCode } from './Code/Fias-Code';

const cnFias = cn('Fias');

export interface FiasProps extends IClassNameProps {
  value?: FiasValue;
  htmlId?: string;
  name?: string;
  searchMode?: 'address' | 'oktmo';
  fullWidth?: boolean;
  errors?: string[];
  variant?: 'outlined' | 'standard';
  readonly?: boolean;
  onChange?(value: FiasValue | undefined): void;
  onBlur?(): void;
}

@observer
export default class Fias extends Component<FiasProps> {
  @observable private options: FiasValue[] = [];
  private operationId?: symbol;
  private getFiasListDebounced: DebouncedFunc<(value: string) => Promise<void>>;

  constructor(props: FiasProps) {
    super(props);
    makeObservable(this);

    this.getFiasListDebounced = debounce(this.getFiasList, 666);
  }

  render() {
    const { value, fullWidth, className, htmlId, onBlur } = this.props;
    const { id, oktmo } = value || {};

    return (
      <div className={cnFias(null, [className])}>
        <Autocomplete
          id={htmlId}
          fullWidth={fullWidth}
          filterOptions={this.filterOptions}
          freeSolo
          disableClearable
          value={value}
          options={this.options}
          getOptionLabel={this.getOptionLabel}
          onBlur={onBlur}
          onInputChange={this.handleInputChange}
          onChange={this.selectItem}
          renderInput={this.renderInput}
        />

        {oktmo && <FiasCode title='ОКТМО' text={oktmo} />}
        {id && <FiasCode title='Код ФИАС' text={id} />}
      </div>
    );
  }

  @boundMethod
  private selectItem() {
    this.setOptions();
  }

  @boundMethod
  private async handleInputChange(event: SyntheticEvent, value: string) {
    if (!event) {
      return;
    }

    const { onChange } = this.props;
    const fias = this.options.find(option => option.address === value);

    if (onChange) {
      onChange({
        address: value,
        oktmo: fias?.oktmo,
        id: fias?.id
      });
    }

    await this.getFiasListDebounced(value);
  }

  private filterOptions(options: FiasValue[]): FiasValue[] {
    return options;
  }

  private async getFiasList(value: string): Promise<void> {
    const operationId = Symbol();
    this.operationId = operationId;

    const result =
      this.props.searchMode === 'oktmo' ? await getFiasOktmoItems(value) : await getFiasAddressItems(value);

    if (this.operationId === operationId) {
      this.setOptions(result);
    }
  }

  @action.bound
  private setOptions(options: FiasValue[] = []) {
    this.options = options;
  }

  @boundMethod
  private renderInput(params: AutocompleteRenderInputParams) {
    const { name, value, errors, variant = 'standard' } = this.props;

    return (
      <TextField
        {...params}
        value={value}
        name={name}
        variant={variant}
        fullWidth
        multiline
        minRows={1}
        maxRows={3}
        error={!!errors?.length}
        helperText={errors}
        size={variant === 'outlined' ? 'small' : 'medium'}
      />
    );
  }

  private getOptionLabel(option: FiasValue | string): string {
    if (typeof option === 'string') {
      return option;
    }

    return option?.address || '';
  }
}
