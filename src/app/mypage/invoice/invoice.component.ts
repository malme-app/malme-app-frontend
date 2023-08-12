import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface TableRow {
  paymentDay: string;
  plan: string;
  period: string;
  method: string;
  amount: string;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent {
  displayedColumns: string[] = [
    'paymentDay',
    'plan',
    'period',
    'method',
    'amount',
  ];
  dataSource: TableRow[] = [].constructor(10).fill({
    paymentDay: '2023/4/1',
    plan: 'エンタープライズ - 年額プラン',
    period: '02月分',
    method: '口座振替',
    amount: '50,000円',
  });

  constructor(private router: Router) {}

  goTo(target: string) {
    this.router.navigate([target]);
  }
}
