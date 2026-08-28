import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TeamMember {
  id: number;
  name: string;
  age: number | null;
  department: string;
  available: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  // Team members
  members: TeamMember[] = [
    {
      id: 1,
      name: 'Ahmed',
      age: 28,
      department: 'Development',
      available: true,
    },
    {
      id: 2,
      name: 'Esraa',
      age: 24,
      department: 'Marketing',
      available: false,
    },
    {
      id: 3,
      name: 'Sara',
      age: 26,
      department: 'Design',
      available: true,
    },
  ];

  // Departments
  departments: string[] = [
    'Development',
    'Marketing',
    'Design',
  ];

  // Selected department for filtering
  selectedDepartment = 'All Departments';

  // Current view mode
  viewMode = 'card';

  // Form data
  newMember = {
    name: '',
    age: null as number | null,
    department: '',
    available: true,
  };

  // Error message
  errorMessage = '';

  // Add new member
  addMember() {
    // Validate form
    if (
      !this.newMember.name.trim() ||
      !this.newMember.age ||
      !this.newMember.department
    ) {
      this.errorMessage =
        'Please fill in all required fields.';
      return;
    }

    // Add member to array
    this.members.push({
      id: Date.now(),
      name: this.newMember.name,
      age: this.newMember.age,
      department: this.newMember.department,
      available: this.newMember.available,
    });

    // Clear error
    this.errorMessage = '';

    // Clear form
    this.newMember = {
      name: '',
      age: null,
      department: '',
      available: true,
    };
  }

  // Toggle member availability
  toggleAvailability(member: TeamMember) {
    member.available = !member.available;
  }

  // Get filtered members
  get filteredMembers(): TeamMember[] {
    if (this.selectedDepartment === 'All Departments') {
      return this.members;
    }

    return this.members.filter(
      (member) =>
        member.department === this.selectedDepartment
    );
  }
}