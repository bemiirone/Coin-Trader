import { Component, Input } from '@angular/core';
import { User } from '../users/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() user: User = {} as User;
}
