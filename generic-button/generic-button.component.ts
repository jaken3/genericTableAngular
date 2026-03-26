import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Boton generico
 * 
 * 
 * @author Luis Felipe Fernandez QVISION
 */
@Component({
  selector: 'app-generic-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgClass],
  templateUrl: './generic-button.component.html',
  styleUrl: './generic-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    button[disabled] {
      opacity: 0.6;
      pointer-events: none;
    }
  `]
})
export class GenericButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() class: string = '';
  @Input() type: string = 'button';
  @Output() buttonClick: EventEmitter<void> = new EventEmitter();
  @Input() disabled: boolean = false;
  execute() {
    this.buttonClick.emit();
  }
}
