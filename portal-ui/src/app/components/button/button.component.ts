import { Component, Input } from '@angular/core';

@Component({
  selector: 'crg-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() icon: string;
  @Input() checked: boolean;
}
