import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Container, Divider, Grid } from '@mui/material';
import { cn } from '@bem-react/classname';

import { environment } from '../../services/environment';

import '!style-loader!css-loader!sass-loader!./Footer.scss';

const cnFooter = cn('Footer');

export const Footer: FC = observer(() => (
  <Container className={cnFooter()} maxWidth={false}>
    <Container className={cnFooter('Info')} maxWidth='md'>
      <Grid container spacing={2} justifyContent='center'>
        {environment.description && (
          <Grid item xs={6}>
            <h2 className={cnFooter('Title')}>{environment.title}:</h2>
            {environment.description}
          </Grid>
        )}
        {(environment.contactsPhone || environment.contactsEmail) && (
          <Grid item xs={6}>
            <h2 className={cnFooter('Title')}>Контакты:</h2>
            <b>Телефон приемной:</b> {environment.contactsPhone}
            <br />
            <b>E-mail:</b> {environment.contactsEmail}
          </Grid>
        )}
      </Grid>
    </Container>

    <Divider color='#49a6ff' />

    <Grid className={cnFooter('Copyright')} container alignItems='center' justifyContent='center'>
      © {environment.owner}
    </Grid>
  </Container>
));
