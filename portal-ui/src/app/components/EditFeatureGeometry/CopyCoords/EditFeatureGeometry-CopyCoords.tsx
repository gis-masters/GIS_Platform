import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { clone } from 'lodash';
import { Coordinate } from 'ol/coordinate';

import { coordinateHighlightService } from '../../../services/map/coordinate-highlight/coordinate-highlight.service';
import { services } from '../../../services/services';
import { Toast } from '../../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-CopyCoords.scss';

const cnEditFeatureGeometryCopyCoords = cn('EditFeatureGeometry', 'CopyCoords');

interface EditFeatureGeometryCopyCoordsProps {
  coordinates: Coordinate[];
}

@observer
export class EditFeatureGeometryCopyCoords extends Component<EditFeatureGeometryCopyCoordsProps> {
  render() {
    return (
      <Tooltip title={'Копировать координаты контура в буфер обмена'}>
        <span>
          <IconButton
            className={cnEditFeatureGeometryCopyCoords()}
            onClick={this.handleCopy}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            size='small'
          >
            <ContentCopy />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private async handleCopy() {
    try {
      const coordsText = this.props.coordinates.map(this.formatCoordinate).join('\n');

      // Проверяем поддержку Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(coordsText);
        Toast.success('Координаты скопированы в буфер обмена');
      } else {
        // Fallback для старых браузеров или небезопасного контекста
        this.fallbackCopyToClipboard(coordsText);
      }
    } catch (error) {
      services.logger.error('Ошибка при копировании координат в буфер обмена:', {
        error,
        coordinatesCount: this.props.coordinates.length,
        component: 'EditFeatureGeometryCopyCoords',
        clipboardSupported: !!navigator.clipboard,
        isSecureContext: window.isSecureContext,
        userAgent: navigator.userAgent,
        protocol: window.location.protocol
      });

      Toast.error('Не удалось скопировать координаты');
    }
  }

  @boundMethod
  private handleMouseEnter(): void {
    coordinateHighlightService.setActiveGroup(this.props.coordinates);
  }

  @boundMethod
  private handleMouseLeave(): void {
    coordinateHighlightService.setActiveGroup(null);
  }

  /**
   * Fallback метод копирования для старых браузеров
   */
  private fallbackCopyToClipboard(text: string): void {
    // Создаем временный textarea элемент
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.append(textArea);

    // Выделяем и копируем текст
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');

    // Удаляем временный элемент
    textArea.remove();

    if (successful) {
      Toast.success('Координаты скопированы в буфер обмена');
    }
  }

  private formatCoordinate(coord: Coordinate): string {
    const newCoord = clone(coord);
    newCoord.reverse();

    return newCoord.join('\t');
  }
}
