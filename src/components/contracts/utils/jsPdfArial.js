import jsPDF from 'jspdf';
import { ARIAL_BOLD, ARIAL_ITALIC, ARIAL_NORMAL } from './arialttf';

export const addFonts = (doc = jsPDF()) => {
    // Register fonts in VFS
    doc.addFileToVFS('ArialNormal.ttf', ARIAL_NORMAL);
    doc.addFont('ArialNormal.ttf', 'Arial', 'normal');
    
    doc.addFileToVFS('ArialBold.ttf', ARIAL_BOLD);
    doc.addFont('ArialBold.ttf', 'Arial', 'bold');
    
    doc.addFileToVFS('ArialItalic.ttf', ARIAL_ITALIC);
    doc.addFont('ArialItalic.ttf', 'Arial', 'italic');
  };
