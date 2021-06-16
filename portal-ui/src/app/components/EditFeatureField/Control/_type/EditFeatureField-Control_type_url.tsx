import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { Dialog, DialogContent, DialogActions } from '@material-ui/core';
import { cn } from '@bem-react/classname';

import { Button } from '../../../Button/Button';
import { Loading } from '../../../Loading/Loading';
import { PseudoLink } from '../../../PseudoLink/PseudoLink';
import { HtmlContent } from '../../../HtmlContent/HtmlContent';
import { ValueType } from '../../../../services/crg/schema.models';
import { services } from '../../../../services/services';
import { Link } from '../../../Link/Link';

import { EditFeaturesControlProps, cnEditFeatureFieldControl } from '../EditFeatureField-Control';

import '!style-loader!css-loader!sass-loader!./EditFeatureField-Control_type_url.scss';

const cnEditFeatureField = cn('EditFeatureField');

interface FieldTypeUrlValue {
  url?: string;
  text: string;
  disabled?: boolean;
}

@observer
class EditFeatureFieldControlTypeUrl extends Component<EditFeaturesControlProps> {
  @observable private isOpen = false;
  @observable private content = '';
  @observable private fetching = false;
  value: FieldTypeUrlValue;

  constructor(props: EditFeaturesControlProps) {
    super(props);

    try {
      this.value = JSON.parse(props.field.value);
    } catch (e) {
      services.logger.warn('Incorrect url value: ', props.field.value);
    }
  }

  render() {
    if (!this.value) {
      return null;
    }

    const { text, disabled, url } = this.value;
    const { className, field } = this.props;
    const inPopup = field.property.displayMode === 'in_popup';

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
      } catch (e) {
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
    this.fetchContent();
  }

  @action.bound
  private closeDialog() {
    this.isOpen = false;
    location.hash = '';
  }
}

export const withTypeUrl = withBemMod<{}, EditFeaturesControlProps>(
  cnEditFeatureFieldControl(),
  { type: ValueType.URL },
  () => EditFeatureFieldControlTypeUrl
);
