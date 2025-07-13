// jspdf-autotable.d.ts
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof import('jspdf-autotable').autoTable;
  }
}
