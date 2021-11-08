import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { cn } from '@bem-react/classname';

import { Button } from '../../../Button/Button';
import { Loading } from '../../../Loading/Loading';
import { PseudoLink } from '../../../PseudoLink/PseudoLink';
import { HtmlContent } from '../../../HtmlContent/HtmlContent';
import { OldPropertySchemaUrl, ValueType } from '../../../../services/crg/schemaOld.models';
import { services } from '../../../../services/services';
import { Link } from '../../../Link/Link';

import { EditFeaturesControlProps, cnEditFeatureFieldControl } from '../EditFeatureField-Control';

import '!style-loader!css-loader!sass-loader!./EditFeatureField-Control_type_url.scss';

const cnEditFeatureField = cn('EditFeatureField');

interface PropertyTypeUrlValue {
  url?: string;
  text: string;
  disabled?: boolean;
}

@observer
class EditFeatureFieldControlTypeUrl extends Component<EditFeaturesControlProps> {
  @observable private isOpen = false;
  @observable private content = '';
  @observable private fetching = false;
  value: PropertyTypeUrlValue;

  constructor(props: EditFeaturesControlProps) {
    super(props);

    try {
      this.value = JSON.parse(props.field.value) as PropertyTypeUrlValue;
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
          <Link url={url} target='_blank'>
            {text}
          </Link>
        )}
      </div>
    );
  }

  private async fetchContent() {
    if (!this.content && !this.fetching) {
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

export const withTypeUrl = withBemMod<EditFeaturesControlProps, EditFeaturesControlProps>(
  cnEditFeatureFieldControl(),
  { type: ValueType.URL },
  () => EditFeatureFieldControlTypeUrl
);
