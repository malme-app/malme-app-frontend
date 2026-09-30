import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

export interface TableRow {
  paymentDay: string;
  plan: string;
  period: string;
  method: string;
  amount: string;
}
export interface SaleInfo {
  name: string;
  expirationStart: Date;
  expirationEnd: Date;
  paymentMethod: string;
  contractTitle: string;
  contractContent: string;
  contractUrl: string;
  paymentStatus: number;
}
export interface RemindTestCase {
  id: string;
  label: string;
  daysLeft: number[];
  expected: string;
  sql: string | null;
}
export interface RemindTestLicenseRow {
  license: string;
  saleId: number;
  expirationEnd: string;
  daysLeft: number;
  reminderDay: boolean;
  picked: boolean;
  action: 'send' | 'skip' | 'none';
  reason: string;
}
export interface RemindTestResult {
  caseId: string;
  label: string;
  today: string;
  runAt: string;
  licenses: RemindTestLicenseRow[];
  pickedLicense: string | null;
  willSend: boolean;
  summary: string;
  mailExpirationDate: string | null;
  recipients: string[];
  expected: string;
  pass: boolean;
  slackSent: boolean;
  slackError: string | null;
}
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  currentSaleInfo: SaleInfo = {
    name: '',
    expirationStart: new Date(),
    expirationEnd: new Date(),
    paymentMethod: '',
    contractTitle: '',
    contractContent: '',
    contractUrl: '',
    paymentStatus: 0
  };
  displayedColumns: string[] = ['paymentDay', 'plan', 'period', 'method', 'amount'];
  dataSource: TableRow[] = [];
  activePlans: TableRow[] = [];
  hasExpirationDate = true;

  // Dev-only reminder test panel (local + staging builds only, see environment.remindTestPanel).
  remindTestCases: RemindTestCase[] = [];
  remindTestRunning: string | null = null;
  remindTestResult: RemindTestResult | null = null;
  remindTestPassByCase: Record<string, boolean> = {};
  remindTestError = '';
  remindTestNow = new Date();
  remindTestCopiedCaseId: string | null = null;
  readonly remindTestLicenses = ['A', 'B', 'C'];
  readonly remindTestColumns = ['license', 'expirationEnd', 'daysLeft', 'reminderDay', 'picked', 'action', 'reason'];
  readonly remindTestActionLabels = { send: '📧 SEND', skip: '⏭ SKIP', none: '🚫 NO MAIL' };

  constructor(public dialog: MatDialog, private http: HttpClient) {}

  ngOnInit() {
    this.loadSales();
    // Only environment.ts / environment.stg.ts define the flag; other builds leave it undefined.
    if ((environment as { remindTestPanel?: boolean }).remindTestPanel) {
      this.http.get<{ enabled: boolean; cases: RemindTestCase[] }>(`${environment.apiBaseUrl}/dev/remind-test/cases`).subscribe({
        next: (data) => {
          this.remindTestCases = data.enabled ? data.cases : [];
        },
        error: () => {
          this.remindTestCases = [];
        }
      });
    }
  }

  runRemindTest(caseId: string) {
    this.remindTestNow = new Date();
    this.remindTestRunning = caseId;
    this.remindTestError = '';
    this.remindTestResult = null;
    this.http.post<RemindTestResult>(`${environment.apiBaseUrl}/dev/remind-test/run`, { caseId }).subscribe({
      next: (result) => {
        this.remindTestResult = result;
        this.remindTestPassByCase[caseId] = result.pass;
        this.remindTestRunning = null;
        this.loadSales();
      },
      error: (error) => {
        this.remindTestError = error?.error?.message ?? 'Remind test failed';
        this.remindTestRunning = null;
      }
    });
  }

  async copyRemindTestSql(testCase: RemindTestCase) {
    if (!testCase.sql) return;
    try {
      await navigator.clipboard.writeText(testCase.sql);
    } catch {
      // Fallback for browsers that block the async clipboard API.
      const textarea = document.createElement('textarea');
      textarea.value = testCase.sql;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    this.remindTestCopiedCaseId = testCase.id;
    setTimeout(() => {
      if (this.remindTestCopiedCaseId === testCase.id) this.remindTestCopiedCaseId = null;
    }, 2000);
  }

  loadSales() {
    this.http.get(`${environment.apiBaseUrl}/sale/list-active`).subscribe({
      next: (data: any) => {
        const paymentHistories: any[] = [];
        data.forEach((sale: any) => {
          paymentHistories.push({
            payDate: new Date(sale.payAt),
            plan: sale?.plan?.name ?? '',
            closingDate: new Date(sale.expirationEnd),
            paymentMethod: sale?.paymentMethod?.name ?? '',
            amount: sale.price
          });
        });
        this.activePlans = paymentHistories;
      },
      error: (_error) => {
        this.currentSaleInfo.name = '';
        this.hasExpirationDate = false;
      }
    });
    this.http.get(`${environment.apiBaseUrl}/sale/list-expired`).subscribe({
      next: (data: any) => {
        const paymentHistories: any[] = [];
        data.forEach((sale: any) => {
          paymentHistories.push({
            payDate: new Date(sale.payAt),
            plan: sale?.plan?.name ?? '',
            closingDate: new Date(sale.expirationEnd),
            paymentMethod: sale?.paymentMethod?.name ?? '',
            amount: sale.price
          });
        });
        this.dataSource = paymentHistories;
      },
      error: (_error) => {
        this.currentSaleInfo.name = '';
        this.hasExpirationDate = false;
      }
    });
  }

  openDialog(templateRef: any) {
    const dialogRef = this.dialog.open(templateRef, {});
  }
}
