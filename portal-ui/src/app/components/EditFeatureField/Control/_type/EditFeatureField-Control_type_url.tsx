import * as React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { Dialog, DialogContent, DialogActions } from '@material-ui/core';
import { cn } from '@bem-react/classname';

import { Button } from '../../../Button/Button';
import { Loading } from '../../../Loading/Loading';
import { PseudoLink } from '../../../PseudoLink/PseudoLink';
import { HtmlContent } from '../../../HtmlContent/HtmlContent';

import { EditFeaturesControlProps, cnEditFeatureFieldControl } from '../EditFeatureField-Control';

import '!style-loader!css-loader!sass-loader!./EditFeatureField-Control_type_url.scss';

const cnEditFeatureField = cn('EditFeatureField');

@observer
class EditFeatureFieldControlTypeUrl extends React.Component<EditFeaturesControlProps> {
  @observable private isOpen = false;
  @observable private content = '';
  @observable private fetching = false;
  value: { url: string; text: string; };

  constructor (props: EditFeaturesControlProps) {
    super(props);

    this.value = JSON.parse(props.field.value);

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  render () {
    const { className } = this.props;

    return (
      <div className={className}>
        <PseudoLink onClick={this.openDialog}>
          {this.value.text}
        </PseudoLink>
        <Dialog open={this.isOpen}  PaperProps={{ className: cnEditFeatureField('TypeUrlDialog') }}>
          <DialogContent>
            <HtmlContent content={this.content} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} variant='outlined'>
              Закрыть
            </Button>
          </DialogActions>
          {this.content ? null : <Loading />}
        </Dialog>
      </div>
    );
  }

  private async fetchContent () {
    if (!this.content && !this.fetching) {
      this.setFetching(true);
      try {
        const responce = await fetch(this.value.url);
        const content = await responce.text();
        this.setContent(content);
      } catch (e) {
        this.setContent('Ошибка!');
      }
      this.setFetching(false);
    }
  }

  @action
  private setFetching (fetching: boolean) {
    this.fetching = fetching;
  }

  @action
  private setContent (content: string) {
    this.content = content;
  }

  @action
  private openDialog () {
    this.isOpen = true;
    this.fetchContent();
  }

  @action
  private closeDialog () {
    this.isOpen = false;
    location.hash = '';
  }
}

export const withTypeUrl = withBemMod<{}, EditFeaturesControlProps>(
  cnEditFeatureFieldControl(),
  { type: 'url' },
  () => EditFeatureFieldControlTypeUrl
);

