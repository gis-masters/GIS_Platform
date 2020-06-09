import { action, observable } from 'mobx';
import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { observer } from 'mobx-react';
import { setPermission } from '../../../services/crg/data.service';

import { projectsService } from '../../../services/crg/projects.service';
import { CrgUser, usersService } from '../../../services/crg/users.service';
import { localStorageService } from '../../../services/local-storage.service';
import { projectsList } from '../../../stores/ProjectsList.store';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./Manager-Body.scss';

const cnManager = cn('Manager');

@observer
export class ManagerBody extends Component<{}> {
  @observable private dialogOpen = false;

  constructor(props: Readonly<{}>) {
    super(props);

    this.dialogKeyHandler = this.dialogKeyHandler.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.iDisagree = this.iDisagree.bind(this);
    this.iAgree = this.iAgree.bind(this);
  }

  async componentDidMount() {
    await projectsService.fetchProjects();
  }

  render() {
    return (
      <div className={cnManager('Body')}>
        <Button variant='outlined' color='secondary' onClick={this.openDialog} className={cnManager('Button')}>
          Раздать всем на право и на лево
        </Button>

        <Dialog onKeyDown={this.dialogKeyHandler}
          open={this.dialogOpen}
          onClose={this.iDisagree}
        >
          <DialogContent>
            <DialogContentText>
              Раздавалка не сломается ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.iDisagree} color='primary' variant='outlined'>
              Да
            </Button>
            <Button onClick={this.iAgree} autoFocus variant='outlined'>
              Нет
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  @action
  private iDisagree() {
    this.dialogOpen = false;
  }

  @action
  private iAgree() {
    this.dialogOpen = false;

    this.setPermissions();
  }

  @action
  private openDialog() {
    this.dialogOpen = true;
  }

  private async setPermissions() {
    const currentUser = localStorageService.getUserInfo();

    const users: CrgUser[] = (await usersService.getAll())._embedded.users;
    const filteredUsers = users.filter(user => user.username !== currentUser.userName);

    console.log('users: ', filteredUsers);

    if (filteredUsers.length) {
      for (const project of projectsList.list) {
        const { internalName } = project;
        if (project.layers) {
          console.log('handle project: ', internalName);

          for (const layer of project.layers) {
            for (const user of filteredUsers) {
              console.log('for user ' + user.username + ' to: ' + internalName + ':' + layer.internalName);

              await setPermission(internalName, layer.internalName, {
                principalId: user.id,
                principalType: 'user',
                role: 'VIEWER'
              });
            }
          }
        }
      }
    } else {
      console.log('No any users');
    }
  }

  private dialogKeyHandler (e: React.KeyboardEvent<HTMLDivElement>) {
    e.preventDefault();

    if (e.key === 'Enter') {
      this.iAgree();
    }
    if (e.key === 'Escape') {
      this.iDisagree();
    }
  }
}
