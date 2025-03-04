import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent], // Declare components
  imports: [CommonModule],
  exports: [NavbarComponent, FooterComponent], // Export components
})
export class SharedModule {}
