import { Functions } from '../../../utils/functions'
import {
  defaultContractInfo,
  defaultContractInfoFinished,
  fontStyles,
  formatDateToYYYYMMDD
} from '../utilsAndConstants'
// FIXME  improve the names delete whitespaces on the names
export const contractInfo = (contractData = defaultContractInfoFinished) => {
  console.log('====================================')
  console.log('contractData', contractData)
  console.log('====================================')

  const todayDate = Functions.formatDateToMMDDYY(contractData.todayDate)
  const startDate = Functions.formatDateToMMDDYY(contractData.startDate)
  const endDate = Functions.formatDateToMMDDYY(contractData.endDate)
  const FATHER_GUARDIAN_TYPE_ID = 1
  const MOTHER_GUARDIAN_TYPE_ID = 2
  const GUARDIAN_TYPE_ID = 3

  const motherEmail =
    contractData.guardians.find(
      g => g.guardian_type_id === MOTHER_GUARDIAN_TYPE_ID
    )?.email || 'No registra'
  const fatherEmail =
    contractData.guardians.find(
      g => g.guardian_type_id === FATHER_GUARDIAN_TYPE_ID
    )?.email || 'No registra'
    
  const schedule = contractData.schedule
  console.log('schedule', schedule)
  const DAYS = {
    1: { name: 'Monday', translationLabel: 'Monday' },
    2: { name: 'Tuesday', translationLabel: 'Tuesday' },
    3: { name: 'Wednesday', translationLabel: 'Wednesday' },
    4: { name: 'Thursday', translationLabel: 'Thursday' },
    5: { name: 'Friday', translationLabel: 'Friday' },
    6: { name: 'Saturday', translationLabel: 'Saturday' },
    7: { name: 'Sunday', translationLabel: 'Sunday' }
  }

  // Initialize an object to hold the mapped data
  const scheduleFormatted = {}

  // Loop through contract data to map the check-in and check-out times
  contractData?.schedule?.forEach(entry => {
    const day = DAYS[entry.day_id].name.toLowerCase() // Get the day name from the DAYS object
    scheduleFormatted[`${day}.check_in`] = entry.check_in
    scheduleFormatted[`${day}.check_out`] = entry.check_out
  })

  console.log('scheduleFormatted', scheduleFormatted)
  const guardians = contractData.guardians.map(g => g.name).join(', ')
  const children = contractData.children
    .map(
      child =>
        `- Nombre del niño: ${
          child.first_name + ' ' + child.last_name
        }, fecha de nacimiento: ${Functions.formatDateToMMDDYY(child.born_date)}`
    )
    .join(`\n`)

  const programCounts = contractData.children.reduce((acc, child) => {
    acc[child.program] = (acc[child.program] || 0) + 1
    return acc
  }, {})

  const programPrices = {
    Infant: 275,
    Toddler: 250,
    Preschool: 225,
    'School age': 200
  }

  const registrationFee = 25
  const activityFee = 25
  const totalCost =
  registrationFee +
  activityFee * (programCounts['Toddler'] || 0) +
  activityFee * (programCounts['Preschool'] || 0) +
  activityFee * (programCounts['School age'] || 0) +
  Object.keys(programCounts).reduce((sum, program) => {
    const programPrice = programPrices[program] || 0; // Ensure programPrices[program] is not undefined
    const programCount = programCounts[program] || 0; // Ensure programCounts[program] is not undefined
    return sum + programPrice * programCount;
  }, 0);


  return {
    page1: {
      parr2: `Email de Mama: ${motherEmail} Email de Papa: ${fatherEmail}`,
      parr3: `\nHorarios en que vendrá(n) los Nino(s):                                          `,
      parr4: `\nLunes: ${scheduleFormatted['monday.check_in']} a ${scheduleFormatted['monday.check_out']}     Martes: ${scheduleFormatted['tuesday.check_in']} a ${scheduleFormatted['tuesday.check_out']}    Miércoles: ${scheduleFormatted['wednesday.check_in']} a ${scheduleFormatted['wednesday.check_out']}`,
      parr5: `\nJueves: ${scheduleFormatted['thursday.check_in']} a ${scheduleFormatted['thursday.check_out']}    Viernes: ${scheduleFormatted['friday.check_in']} a ${scheduleFormatted['friday.check_out']}`,
      parr6: `\nEl presente Contrato de servicio de guardería, entre los Padres/Apoderado de los niños y Educando Childcare Center, se realiza bajo los siguientes términos y condiciones:`,
      parr7: `\nEl servicio comenzara en la fecha arriba mencionada y terminara 5 días después del día de aviso de no continuación del servicio por cualquiera de las dos partes con su pago correspondiente hasta esa fecha.`,
      parr8: `\nLa Madre/Apoderado que vienen en persona a contratar el servicio de guardería para su(s) niño(s) es quien firma el Contrato y pólizas siguientes.`,
      parr9: `\nEl nombre del/los niño(s) a quien(es) Educando Childcare brindara el servicio de cuidado infantil es/son:\n\n${children}`,
      parr10: `\nEl servicio será por 5 días de a semana, de Lunes a Viernes, con asistencia no menos de 4 días y un máximo de 9 horas diarias, asegurando así el espacio para su niño(s) en Educando Childcare Center.`,
      parr11: `\nEl servicio de los Sábados es adicional al pago por asistencia semanal. Pero si desea puede cambiar un día de la semana (de Lunes a Viernes) por el Sábado. Cada Jueves termina el registro para los Sábados.`,
      parr12: `\n<strong>NO aceptamos</strong> niños part time y/o asistencia de pocos días o pocas horas por el bienestar de su niño(s) y los demás niños. Para que se acostumbre y le sea más fácil reconocer a diariamente a sus compañeritos, sus maestras y se ajuste a los horarios y rutinas diarias `
    },
    page2: {
      parr1: `\nComo horas de comer, hacer siesta, entrenamiento al baño y actividades de aprendizaje como parte de su desarrollo.`,
      parr2: `\nEducando Childcare provee un servicio de cuidado infantil y enseñanza de Calidad ayudando en el Desarrollo y aprendizaje durante los primeros años de infancia del. Para ello contamos con personal calificado y en constante entrenamiento y crecimiento profesional según las regulaciones del Departamento de Educación y el Departamento de Salud y Servicios Humanos de Nebraska (DHHS).`,
      parr3: `\nAdemás, proveemos alimentos saludables y nutritivos preparados diariamente bajo regulaciones de Programa de Comidas del Departamento de Salud y el DHHS.`,
      parr4: `\nLa alimentación correspondiente y horarios dependerá de lo acordado por el Programa de Comidas (por favor completar forma de comidas). Los Padres llenaran la forma en caso de alergias a comidas o algo mas. En el caso de bebes que comienzan a comer, los Padres adicionalmente indicaran que tipo de comida están ya listos a comer según indicaciones de su Pediatra (llenar la forma).`,
      parr5: `\nPara Educando Childcare son muy importantes los niños y sus familias, pero También su calificado personal, el cual tiene familia que las esperan en casa. Por eso el servicio de cuidado infantil de cada niño NO será más de 9 horas al día. Pasadas sus horas se le cargara costo adicional a los Padres, sea su pago a través del Programa de Subsidio o Titulo 20 o no.`,
      parr6: `\nAdemás, si fuera el caso el programa de subsidio podría ver la irregularidad en sus horas y recortarle la cantidad de horas aprobadas o retirarle ese beneficio a su niño.`,
      parr7: `\nPasada la hora de recojo de su niño es tardanza, a pesar de eso tendremos una tolerancia de 15 minutos. Pasado ese tiempo el pago por tardanza sera:`,
      parr8: `\n\n   -Pasados los 15 minutos de tardanza, el pago será de $8/hora dentro del horario de atención y después del horario de cerrar la guardería será de $30/hora.`,
      parr9: `\nLos pagos se realizan al terminar cada semana. Si no podrá cumplir con el pago, solicite conversar al respecto antes de cobrarle el pago de tardanza de $20 por día.`
    },
    page3: {
      parr1: `\nSi los Padres tienen que pagar un copay del programa de Subsidio o título 20, el pago será al daycare y durante los primeros 5 días del cada mes. Pasado este tiempo tendrá un cargo de $10 por día pasado.`,
      parr2: `\nEducando Childcare Center dedicara el tiempo necesario para la Registración de su(s) niño(s) ingresando a nuestro Programa especializado toda su información y la de su(s) niño(s), brindándole así las facilidades tecnológicas para el registro diario de ingreso y salida de su(s) niño(s), comunicación e información diaria de su niño(s, en caso de emergencia y agilidad en sus pagos.`,
      parr3: `\nEn Educando Childcare llevamos un Calendario de actividades y festividades con los niños fuera y dentro de nuestras instalaciones, los cuales tendrá un costo simbólico de $25 anuales por niño Toddler, Prescolar y Escolar. No se incluye a bebes hasta de 2 años.`,
      parr4: `\n<strong>                                                              NUESTRAS TARIFAS </strong>`,
      parr5: `\nNuestras tarifas están actualizadas bajo regulaciones del DHHS del Estado de Nebraska para todas las guarderías de servicio infantil y son las siguientes:`,
      separator: true,
      parr6: `\nPago por registración: ………………………………………………………………… $25.00`,
      parr7: `\nPago Anual por actividades (Toddlers, Prescolares y escolares) ……………….. $25.00`,
      parr8: `\nInfant (bebe 6 semanas a 18 meses)  ……………………………………………… $275.00 Total: ${
        programCounts['Infant'] || 0
      }`,
      parr9: `\nToddler (18 meses a 3 años) ………………………………………………………… $250.00 Total: ${
        programCounts['Toddler'] || 0
      }`,
      parr10: `\nPreschool (3 a 5 años) ………………………………………………………………… $225.00 Total: ${
        programCounts['Preschool'] || 0
      }`,
      parr11: `\nSchool (5 a 12 años) …………………………………………………………………… $200.00 Total: ${
        programCounts['School age'] || 0
      }`,
      parr12: `\nTransporte a la escuela (ida y Vuelta por semana) ………………………………….$50.00 __`,
      parr13: `\nMarque arriba lo que corresponda para su servicio y a la edad de su(s) niño(s). Su pago será de:`,
      parr14: `\nPago al momento de la registración: $${totalCost}`,
      parr15: `\n\n<strong> Pago seminal: …………………………………………………………………… </strong>`
    },
    // #region add medical information
    page4: {
      parr1: `\nSi los Padres tienen que pagar un copay del programa de Subsidio o título 20, el pago será al daycare y durante los primeros 5 días del cada mes. Pasado este tiempo tendrá un cargo de $10 por día pasado.`,
      parr2: `\nEducando Childcare Center dedicara el tiempo necesario para la Registración de su(s) niño(s) ingresando a nuestro Programa especializado toda su información y la de su(s) niño(s), brindándole así las facilidades tecnológicas para el registro diario de ingreso y salida de su(s) niño(s), comunicación e información diaria de su niño(s, en caso de emergencia y agilidad en sus pagos.`,
      parr3: `\nEn Educando Childcare llevamos un Calendario de actividades y festividades con los niños fuera y dentro de nuestras instalaciones, los cuales tendrá un costo simbólico de $25 anuales por niño Toddler, Prescolar y Escolar. No se incluye a bebes hasta de 2 años.`,
      parr4: `\n<strong>                                                              NUESTRAS TARIFAS </strong>`,
      parr5: `\nNuestras tarifas están actualizadas bajo regulaciones del DHHS del Estado de Nebraska para todas las guarderías de servicio infantil y son las siguientes:`,
      separator: true,
      parr6: `\nPago por registración: ………………………………………………………………… $25.00`,
      parr7: `\nPago Anual por actividades (Toddlers, Prescolares y escolares) ……………….. $25.00`,
      parr8: `\nInfant (bebe 6 semanas a 18 meses)  ……………………………………………… $275.00 Total: ${
        programCounts['Infant'] || 0
      }`,
      parr9: `\nToddler (18 meses a 3 años) ………………………………………………………… $250.00 Total: ${
        programCounts['Toddler'] || 0
      }`,
      parr10: `\nPreschool (3 a 5 años) ………………………………………………………………… $225.00 Total: ${
        programCounts['Preschool'] || 0
      }`,
      parr11: `\nSchool (5 a 12 años) …………………………………………………………………… $200.00 Total: ${
        programCounts['School age'] || 0
      }`,
      parr12: `\nTransporte a la escuela (ida y Vuelta por semana) ………………………………….$50.00 __`,
      parr13: `\nMarque arriba lo que corresponda para su servicio y a la edad de su(s) niño(s). Su pago será de:`,
      parr14: `\nPago al momento de la registración: $${totalCost}`,
      parr15: `\n\n<strong> Pago seminal: …………………………………………………………………… </strong>`
    }
  }
}

const firmSection = (contractData = defaultContractInfo) => {
  return {
    signSectionFirms: `\n\n                       ${
      contractData.guardians[0].name
    }                    ___________________________                     ${formatDateToYYYYMMDD(
      contractData.todayDate
    )}`,
    signSection: ` Nombre de Padre o Madre/Apoderado                     Firma                                                  Fecha`
  }
}
