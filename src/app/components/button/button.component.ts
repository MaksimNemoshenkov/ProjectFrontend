import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() type: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() routerLink?: string;
  @Input() buttonType: 'button' | 'submit' = 'button';
  
  // Для обратной совместимости со старыми компонентами
  @Input() color?: string;
  @Output() btnClick = new EventEmitter<void>();
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
      this.btnClick.emit(); // Для обратной совместимости
    }
  }

  get buttonClasses(): string {
    const classes = ['app-button', `app-button--${this.type}`, `app-button--${this.size}`];
    
    if (this.fullWidth) {
      classes.push('app-button--full-width');
    }
    
    if (this.disabled) {
      classes.push('app-button--disabled');
    }
    
    return classes.join(' ');
  }

  get buttonStyles(): any {
    if (this.color) {
      return { 'background-color': this.color };
    }
    return {};
  }
}
