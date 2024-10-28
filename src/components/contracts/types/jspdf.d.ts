import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    form: {
      field(
        name: string,
        x: number,
        y: number,
        width: number,
        height: number,
        options?: {
          value?: string;
          multiline?: boolean;
          password?: boolean;
          required?: boolean;
        }
      ): void;
    };
  }
}
