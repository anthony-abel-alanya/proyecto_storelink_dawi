import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from 'src/app/service/customer/customer-service.service';
import { UserInfo } from 'src/app/model/user-info/user-info';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: UserInfo[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.customerService.getAllUsersExcludingAdmin().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.errorMessage = 'Error al cargar los usuarios.';
        this.loading = false;
      },
    });
  }

  toggleUserStatus(user: UserInfo): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    this.customerService.toggleUserStatus(user.id).subscribe({
      next: (updatedUser) => {
        // Actualizar el usuario en la lista local
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        
        const action = updatedUser.enabled ? 'habilitado' : 'bloqueado';
        this.successMessage = `Usuario ${updatedUser.email} ha sido ${action}.`;
      },
      error: (err) => {
        console.error('Error toggling user status', err);
        this.errorMessage = 'Error al cambiar el estado del usuario.';
      },
    });
  }

  getStatusText(enabled: boolean): string {
    return enabled ? 'Activo' : 'Bloqueado';
  }

  getStatusClass(enabled: boolean): string {
    return enabled ? 'status-active' : 'status-blocked';
  }
}