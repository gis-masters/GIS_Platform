import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { withBemMod } from '@bem-react/core';

import { OldPropertySchemaUrl, ValueType } from '../../../../services/data/schema/schemaOld.models';
import { services } from '../../../../services/services';
import { Button } from '../../../Button/Button';
import { HtmlContent } from '../../../HtmlContent/HtmlContent';
import { Link } from '../../../Link/Link';
import { Loading } from '../../../Loading/Loading';
import { PseudoLink } from '../../../PseudoLink/PseudoLink';
import { cnEditFeatureFieldControl, EditFeatureFieldControlProps } from '../EditFeatureField-Control.base';

import '!style-loader!css-loader!sass-loader!./EditFeatureField-Control_type_url.scss';

const cnEditFeatureField = cn('EditFeatureField');

interface PropertyTypeUrlValue {
  url?: string;
  text: string;
  disabled?: boolean;
}

@observer
class EditFeatureFieldControlTypeUrl extends Component<EditFeatureFieldControlProps> {
  @observable private isOpen = false;
  @observable private content = '';
  @observable private fetching = false;
  value?: PropertyTypeUrlValue;

  constructor(props: EditFeatureFieldControlProps) {
    super(props);

    makeObservable(this);

    try {
      this.value = JSON.parse(props.field.value || '') as PropertyTypeUrlValue;
    } catch {
      services.logger.warn('Incorrect url value: ', props.field.value);
    }
  }

  render() {
    if (!this.value) {
      return null;
    }

    const { text, disabled, url } = this.value;
    const { className, field } = this.props;
    const property = field.property as OldPropertySchemaUrl;
    const inPopup = property.displayMode === 'in_popup';

    return (
      <div className={className}>
        {inPopup ? (
          <>
            <PseudoLink onClick={this.openDialog} disabled={disabled}>
              {text}
            </PseudoLink>
            <Dialog
              open={this.isOpen}
              onClose={this.closeDialog}
              PaperProps={{ className: cnEditFeatureField('TypeUrlDialog') }}
            >
              <DialogContent>
                <HtmlContent content={this.content} />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.closeDialog}>Закрыть</Button>
              </DialogActions>
              {this.content ? null : <Loading />}
            </Dialog>
          </>
        ) : (
          url && (
            <Link href={url} target='_blank'>
              {text}
            </Link>
          )
        )}
      </div>
    );
  }

  private async fetchContent() {
    if (!this.content && !this.fetching && this.value?.url) {
      this.setFetching(true);
      try {
        const response = await fetch(this.value.url);
        const content = await response.text();
        this.setContent(content);
      } catch {
        this.setContent('Ошибка!');
      }
      this.setFetching(false);
    }
  }

  @action
  private setFetching(fetching: boolean) {
    this.fetching = fetching;
  }

  @action
  private setContent(content: string) {
    this.content = content;
  }

  @action.bound
  private openDialog() {
    this.isOpen = true;
    void this.fetchContent();
  }

  @action.bound
  private closeDialog() {
    this.isOpen = false;
    location.hash = '';
  }
}

export const withTypeUrl = withBemMod<EditFeatureFieldControlProps, EditFeatureFieldControlProps>(
  cnEditFeatureFieldControl(),
  { type: ValueType.URL },
  () => EditFeatureFieldControlTypeUrl
);
