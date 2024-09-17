import { customLogger } from "../../../../configs/logger";

export class ContractUtils { 
        static  async formGobAsBits() {
        // Load the external PDF as ArrayBuffer
        const externalPdfBytes = await fetch('form_gob.pdf')
          .then(res => res.arrayBuffer())
          customLogger.debug('externalPdfBytes', externalPdfBytes);
          return externalPdfBytes;
        }
        
}
          