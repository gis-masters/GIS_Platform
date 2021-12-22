import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Container, Divider, Grid } from '@mui/material';

import { env } from '../../stores/Env.store';

import '!style-loader!css-loader!sass-loader!./Footer.scss';

const cnFooter = cn('Footer');

export const Footer: FC = observer(() => (
  <Container className={cnFooter()} maxWidth={false}>
    <Container className={cnFooter('Info')} maxWidth='md'>
      <Grid container spacing={2} justifyContent='center'>
        {env.description && (
          <Grid item xs={6}>
            <h2 className={cnFooter('Title')}>{env.title}:</h2>
            {env.description}
          </Grid>
        )}
        {(env.contactsPhone || env.contactsEmail) && (
          <Grid item xs={6}>
            <h2 className={cnFooter('Title')}>Контакты:</h2>
            <b>Телефон приемной:</b> {env.contactsPhone}
            <br />
            <b>E-mail:</b> {env.contactsEmail}
          </Grid>
        )}
      </Grid>
    </Container>

    <Divider color='#49a6ff' />

    <Grid className={cnFooter('Copyright')} container alignItems='center' justifyContent='center'>
      © {env.owner}
    </Grid>
  </Container>
));
