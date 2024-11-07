import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TradeFormComponent implements OnInit {
  tradeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.tradeForm = this.fb.group({
      coin_id: ['', Validators.required],
      order: ['buy', Validators.required],
      currencyAmount: [0, [Validators.required, Validators.min(1)]],
      volume: [{ value: 0, disabled: true }], // Calculated based on currency amount
      price: [{ value: 0, disabled: true }]   // Set this based on selected coin
    });
  }

  // Function to calculate volume when currency amount or price changes
  calculateVolume(): void {
    const currencyAmount = this.tradeForm.get('currencyAmount')?.value;
    const price = this.tradeForm.get('price')?.value;
    if (price > 0) {
      this.tradeForm.get('volume')?.setValue(currencyAmount / price);
    }
  }

  onSubmit(): void {
    if (this.tradeForm.valid) {
      const tradeData = this.tradeForm.getRawValue();  // Get form data
      console.log('Trade submitted:', tradeData);
      // Submit the trade data to the backend here
    }
  }
}
