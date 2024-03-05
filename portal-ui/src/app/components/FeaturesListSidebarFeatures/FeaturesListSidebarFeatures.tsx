import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Close } from '@mui/icons-material';
import { IReactionDisposer, reaction } from 'mobx';

import { SelectedFeaturesList } from '../SelectedFeaturesList/SelectedFeaturesList';
import { SearchFeaturesList } from '../SearchFeaturesList/SearchFeaturesList';
import { communicationService } from '../../services/communication.service';
import { SearchInfo } from '../SearchField/SearchField';
import { sidebars } from '../../stores/Sidebars.store';
import { IconButton } from '../IconButton/IconButton';
import { mapStore } from '../../stores/Map.store';

import '!style-loader!css-loader!sass-loader!./FeaturesListSidebarFeatures.scss';

const cnFeaturesListSidebarFeatures = cn('FeaturesListSidebarFeatures');

interface FeaturesListSidebarFeaturesProps {
  singleTab?: boolean;
  searchValue?: SearchInfo;
}

@observer
export default class FeaturesListSidebarFeatures extends Component<FeaturesListSidebarFeaturesProps> {
  private reactionDisposer?: IReactionDisposer;

  componentDidMount() {
    communicationService.featuresUpdated.on(this.close, this);
    this.reactionDisposer = reaction(
      () => {
        return mapStore.selectedFeatures.length;
      },
      selectedFeaturesLength => {
        if (!selectedFeaturesLength && !this.props.searchValue) {
          this.close();
        }
      }
    );
  }

  componentWillUnmount() {
    communicationService.off(this);
    this.reactionDisposer?.();
  }

  render() {
    const { searchValue, singleTab } = this.props;

    return (
      <div className={cnFeaturesListSidebarFeatures('Inner', { multiTab: !singleTab })}>
        {singleTab && (
          <div className={cnFeaturesListSidebarFeatures('Header')}>
            {searchValue ? 'Результаты поиска' : 'Выделенные объекты'}
            <IconButton className={cnFeaturesListSidebarFeatures('Close')} onClick={this.close}>
              <Close />
            </IconButton>
          </div>
        )}
        {!searchValue && mapStore.selectedFeatures.length >= mapStore.selectingFeaturesLimit && (
          <div className={cnFeaturesListSidebarFeatures('Error')}>
            Максимальное количество выбираемых объектов — {mapStore.selectingFeaturesLimit}
          </div>
        )}
        {searchValue ? <SearchFeaturesList searchValue={searchValue} /> : <SelectedFeaturesList />}
      </div>
    );
  }

  @boundMethod
  private close() {
    if (this.props.searchValue) {
      sidebars.setSearchValue({});
    }

    if (this.props.singleTab) {
      sidebars.closeFeaturesSidebar();
    }

    if (!sidebars.searchValue) {
      sidebars.closeFeaturesSidebar();
    }
  }
}
