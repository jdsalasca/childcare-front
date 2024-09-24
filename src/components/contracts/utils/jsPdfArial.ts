import jsPDF from 'jspdf';
import { ARIAL_BOLD, ARIAL_ITALIC, ARIAL_NORMAL } from './arialttf';
import { MICR_NORMAL } from './micrenc';
import { VT_323_REGULAR } from './vt323';

export const addFonts = (doc : jsPDF = new jsPDF()): void => {
    // Register fonts in VFS
    doc.addFileToVFS('ArialNormal.ttf', ARIAL_NORMAL);
    doc.addFont('ArialNormal.ttf', 'Arial', 'normal');
    
    doc.addFileToVFS('ArialBold.ttf', ARIAL_BOLD);
    doc.addFont('ArialBold.ttf', 'Arial', 'bold');
    
    doc.addFileToVFS('ArialItalic.ttf', ARIAL_ITALIC);
    doc.addFont('ArialItalic.ttf', 'Arial', 'italic');
    doc.addFileToVFS('VT323.ttf', VT_323_REGULAR);
    doc.addFont('VT323.ttf', 'Vt323', 'normal');
    doc.addFileToVFS('MICR.ttf', MICR_NORMAL);
    doc.addFont('MICR.ttf', 'micrenc', 'normal');

  };
