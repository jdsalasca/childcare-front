/* eslint-disable no-unused-vars */
import { Functions } from '../../../utils/functions';
import { ContractInfo, defaultContractInfoFinished, Language } from '../types/ContractInfo';
import { fontStyles } from '../utilsAndConstants';
export const contractInfo = (contractData: ContractInfo= defaultContractInfoFinished, language:Language = Language.English) => {
  const todayDate = Functions.formatDateToMMDDYY(contractData.todayDate);
  const startDate = Functions.formatDateToMMDDYY(contractData.start_date!);
  const endDate = Functions.formatDateToMMDDYY(contractData.end_date!);
  const FATHER_GUARDIAN_TYPE_ID = 1;
  const MOTHER_GUARDIAN_TYPE_ID = 2;
  const GUARDIAN_TYPE_ID = 3;

  const motherEmail =
    contractData.guardians.find(g => g.guardian_type_id === MOTHER_GUARDIAN_TYPE_ID)?.email || 'No registra';
  const fatherEmail =
    contractData.guardians.find(g => g.guardian_type_id === FATHER_GUARDIAN_TYPE_ID)?.email || 'No registra';

  const schedule = contractData.schedule;
  console.log('schedule', schedule);
  
  const DAYS: Record<number, { name: string; translationLabel: string }> = {
    1: { name: 'Monday', translationLabel: 'Monday' },
    2: { name: 'Tuesday', translationLabel: 'Tuesday' },
    3: { name: 'Wednesday', translationLabel: 'Wednesday' },
    4: { name: 'Thursday', translationLabel: 'Thursday' },
    5: { name: 'Friday', translationLabel: 'Friday' },
    6: { name: 'Saturday', translationLabel: 'Saturday' },
    7: { name: 'Sunday', translationLabel: 'Sunday' }
  };

  // Initialize an object to hold the mapped data
  const scheduleFormatted: Record<string, string> = {};

  // Loop through contract data to map the check-in and check-out times
  contractData?.schedule?.forEach(entry => {
    const day = DAYS[entry.day_id].name.toLowerCase(); // Get the day name from the DAYS object
    scheduleFormatted[`${day}.check_in`] = entry.check_in;
    scheduleFormatted[`${day}.check_out`] = entry.check_out;
  });

  const guardians = contractData.guardians.map(g => g.name).join(', ');
  const children = contractData.children
    .map(child =>
      `- Nombre del niño: ${child.first_name} ${child.last_name}, fecha de nacimiento: ${Functions.formatDateToMMDDYY(child.born_date)}`
    )
    .join('\n');

  const programCounts = contractData.children.reduce<Record<string, number>>((acc, child) => {
    acc[child.program!] = (acc[child.program!] || 0) + 1;
    return acc;
  }, {});

  const programPrices: Record<string, number> = {
    Infant: 275,
    Toddler: 250,
    Preschool: 225,
    'School age': 200
  };

  const registrationFee = 25;
  const activityFee = 25;
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

  const contractSpanish = {
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
      parr8: `\nInfant (bebe 6 semanas a 18 meses)  ……………………………………………… $275.00 ____` ,
      parr9: `\nToddler (18 meses a 3 años) …………………………………………………………$250.00 ____`,
      parr10: `\nPreschool (3 a 5 años)…………………………………………………………………$225.00 ____`,
      parr11: `\nSchool (5 a 12 años)……………………………………………………………………$200.00 ____`,
      // parr8: `\nInfant (bebe 6 semanas a 18 meses)  ……………………………………………… $275.00  Total: ${programCounts['Infant'] || 0}`,
      // parr9: `\nToddler (18 meses a 3 años) ………………………………………………………… $250.00  Total: ${programCounts['Toddler'] || 0}`,
      // parr10: `\nPreschool (3 a 5 años) ………………………………………………………………… $225.00  Total: ${programCounts['Preschool'] || 0}`,
      // parr11: `\nSchool (5 a 12 años) …………………………………………………………………… $200.00 Total: ${programCounts['School age'] || 0}`,
      parr12: `\nTransporte a la escuela (ida y Vuelta por semana)………………………………….$50.00`,
      parr13: `\nMarque arriba lo que corresponda para su servicio y a la edad de su(s) niño(s).\nSu pago será de:_________`,
      // parr14: `\nPago al momento de la registración: $${totalCost}`,
      parr14: `\nPago al momento de la registración: $_________________`,
      parr15: `\n<strong> Pago seminal: ____________________ </strong>`,
      signSection: true,
      parr16: `\n`,
      signSectionEducando:true
    },
    page4: {
      parr0: `\n<strong> Información Médica de su niño </strong>`,
      separator: true,
      parr1:
        '\n<strong>Nombre del niño ____________________________  </strong> . Estado actual de salud de su niño o  algo que debamos saber al respecto: ________________________________________',
      'parr2.1':
        '\n¿Está teniendo algún tratamiento? ¿Cual?: ____________________________________________',
      parr3:
        '\nTiene alguna alergia y/o intolerancia a alguna comida, picadura de insectos, crema de rozaduras, repelente de insectos, bloqueador solar o cualquier otra cosa que desencadene una reacción alérgica? _________________________________________________',
      parr4:
        '\nFavor de darnos instrucciones claras de cómo ayudar a su niño si se diera el caso: _______________________________________________________________________________________________________________________________________',
      parr6:
        '\nYo certifico que la información proporcionada es correcta y basada en mi conocimiento.',
      signSection: true,
      yPlus: 12,
      separator2: true,
      parr8:
        '\nNombre del niño: _______________________________. Estado actual de salud de su niño o algo que debamos saber al respecto: ________________________________________',
      parr9:
        '\n¿Está teniendo algún tratamiento? ¿Cual?: ____________________________________________',
      parr10:
        '\nTiene alguna alergia y/o intolerancia a alguna comida, picadura de insectos, crema de rozaduras, repelente de insectos, bloqueador solar o cualquier otra cosa que desencadene una reacción alérgica?',
      parr11:
        '\nFavor de darnos instrucciones claras de cómo ayudar a su niño si se diera el caso: _______________________________________________________________________________________________________________________________________',
      parr13:
        '\nYo certifico que la información proporcionada es correcta y basada en mi conocimiento.',
      signSection2: true
    },
    page5: {
      parr0: `\n<strong> Fórmula de bebé y horarios de comidas </strong>`,
      separator: true,
      parr1:
        '\nNombre del niño: _______________________________ Fecha de Nacimiento: ________',
      parr2:
        '\n<strong>                                                              Instrucciones  </strong>',
      parr3:
        '\no Leche maternal o formula: _____________________________________________________',
      parr4:
        '\no Aproximada horas de comer: _________   _________    _________    _______',
      parr5:
        '\no Máximo tiempo entre botellas: _______________Mínimo (si se diera el caso): ________',
      parr6: '\no Cantidad aproximada (onzas): _______________',
      parr7:
        '\no Instrucciones para dar de comer: ________________________________________________________________________________________________________________________',
      parr8:
        '\no Otra información de comida (cereal, comida de bebe, comida preparade, jugos, etc.) \n_____________________________________________________________________________________________________________________________________________________',
      parr9:
        '\no Alergias a alguna comida o alguna comida que no debe comer: ________________________________________________________________________________________________',
      parr10:
        '\no Sigue el Programa de Comidas de niños y adultos: (póngale un circulo)',
      parr11:
        '\n                  Si                                           No',
      signSection2: true
    },
    page6: {
      parr0:
        '\n<strong> Permiso para administración de algunos productos </strong>',
      separator: true,
      parr1:
        '\nDoy mi permiso a Educando Childcare a que administre a mi hijo(a) lo siguiente:',
      parr2: '\n(Marcar con un check o palomita)',
      parr3: '\no Jabón de manos líquido o en barra',
      parr4: '\no Sanitizador de manos',
      parr5: '\no Crema para rozaduras',
      parr6: '\no Medicamento para dentición',
      parr7: '\no Protector solar',
      parr8: '\no Repelente de insectos',
      parr9: '\no Otros: ________________________________',
      signSection2: true
    },
    page7: {
      parr0: '\n<strong> Acuerdo de Transporte </strong>',
      separator: true,
      parr1:
        '\nProveemos el servicio de transporte de niños siguiendo regulaciones de seguridad para el transporte de niños en Nebraska. Utilizamos sillas de acuerdo con las regulaciones según peso y edad del niño. Los niños menores de 40 lb o menores de 4 años serán colocados en un asiento aprobado y proporcionado por sus Padres o Tutores.',
      parr2:
        '\nBrindamos el servicio de transporte desde Educando Childcare Center hacia la escuela de su niño de ida/vuelta según establecido en el Contrato.',
      parr3:
        '\nTambién, basados en las actividades preparadas para los niños en días en que no haya clases en la escuela o que estén de vacaciones, transportamos a los niños a actividades fuera de Educando Childcare según programación (Museo de niños, Zoo, Librería, Parque de Agua y/o arena, algún lugar de brincolines, Pumpkin Patch, etc.). A estas actividades asisten Toddlers, Prescolares y escolares.',
      parr4: '\nLas escuelas a las que van mis niños(s) son:',
      parr5:
        '\nNombre del niño: __________________________ a la Escuela _____________________',
      parr6:
        '\nNombre del niño: __________________________ a la Escuela _____________________',
      parr7:
        '\nNombre del niño: __________________________ a la Escuela _____________________',
      parr8:
        '\nNombre del niño: __________________________ a la Escuela _____________________',
      parr9:
        '\nYo, _______________________________________ autorizo a mi niño(s) a viajar en el vehículo de Educando Childcare Center autorizado.',
      signSection2: true
    },
    page8: {
      parr0: '\n<strong> Exclusión de los niños que estén enfermos </strong>',
      separator: true,
      parr1:
        '\nLos padres con un niño enfermo deberán mantenerlo en casa si no se siente bien o puede contagiar a los otros niños.',
      parr2:
        '\nEducando Childcare se reserva el derecho de no proveer servicio a un niño, si piensa que el niño está enfermo o puede contagiar a otros niños.',
      parr3:
        '\nSi el niño comienza a enfermarse durante su día en la guardería, los Padres serán notificados para recoger a su niño lo más pronto posible.',
      parr4:
        '\nSi el niño se enfermó, golpeó o accidentó y a pesar de que se trató de contactar a los Padres no fue posible encontrarlos, el doctor de emergencia será contactado.',
      parr5:
        '\nLos Padres podrían firmar una forma de consentimiento al médico de su niño en caso sea necesario ser atendido con algún procedimiento de emergencia.',
      parr6:
        '\n<strong> Síntomas de enfermedad por los cuales los Padres serán contactados para recoger de inmediato a su niño:</strong> ',
      parr7:
        '\n- Temperatura alta de 100 grados; según sea el caso del niño se le comunicará a los Padres desde que el niño tenga 99 grados de temperatura para evitar el niño colapse y quede inconsciente, si la temperatura subiera muy rápido.',
      parr8:
        '\n- Si es la segunda vez en el mismo día que el niño presenta vómitos o diarrea.',
      parr9:
        '\n- Si es el caso de que el niño presenta infecciones como: paperas, varicela, sarampión, infección a los ojos y piojos.',
      parr10:
        '\nEn todos estos casos, una nota del médico diciendo que el niño es lo suficientemente saludable para regresar al daycare será requerida.',
      signSection: true
    },
    page9: {
      parr0: '\n<strong> Terminación del Servicio de Educando </strong>',
      separator: true,
      parr1:
        '\nEl Servicio en Educando podrá ser terminado por ambas partes, por los Padres, apoderado o por Educando Childcare, con un previo aviso de 10 días. El pago de esos 10 días será realizado inmediatamente después de haber dado la noticia.',
      parr2:
        '\nEducando Childcare podría terminar sus servicios por las siguientes razones:',
      parr3:
        '\n- Si el niño no se acostumbra, sigue molesto o llora continuamente, después de haber tratado con los Padres o apoderado que el niño asista diariamente y durante horas consideradas día completo para que el niño se acostumbre.',
      parr4:
        '\n- Si el niño está constantemente pegándose a sí mismo o a otros niños en Educando Childcare o a sus empleados.',
      parr5:
        '\n- Si el niño tiene mal comportamiento continuo, a pesar de haber tratado de ayudarlo a cambiar.',
      parr6:
        '\n- Si los Padres no respetan las horas y horarios acordados en el Contrato.',
      parr7:
        '\n- Si los Padres o Apoderados no están al día o no son puntuales con los pagos a Educando por el servicio a su niño, incluyendo el Co-pago del Programa de Subsidio o Título 20 si fuera el caso.',
      parr8:
        '\n- Si los Padres o Apoderados de niño(s) muestran mal comportamiento, gritos, insultos, malos tratos o ataques hacia los empleados, directora de Educando o hacia otros Padres o niños en servicio de Educando.',
      parr9:
        '\n- Si los Padres o apoderados no trabajan junto a Educando Childcare para proporcionar al niño consistente disciplina, no realizan la misma práctica del entrenamiento al baño en casa, no proveen cambios de ropa, pañales, leche para su bebé y todo lo necesario para la buena salud de su niño o no atienden a reuniones o conferencias con la Directora o maestra encargada de su niño para trabajar juntos por el bienestar de su niño.',
      parr10:
        '\n- Si los Padres no obedecen las pólizas y procedimientos establecidos por Educando Childcare y el Departamento de Servicios Humanos de Nebraska, inclusive las establecidas por el programa de Subsidio antes llamado Título 20 y Programa de Comidas.',
      parr11:
        '\nAl momento de la noticia de terminación del servicio de Educando Childcare al niño, ambas partes acordarán cuál será el último día de servicio y el pago final correspondiente al daycare.',
      signSection: true
    },
    page10: {
      parr0: '\n<strong> Autorización de Uso de Fotografía y Media </strong>',
      separator: true,
      parr1:
        '\nYo, _______________________________ Madre/Padre o Apoderado de mi niño(s) llamado(s) ___________________________________________, estoy de acuerdo que Educando Childcare: (Por favor marque lo que desee)',
      parr2:
        '\n____ Comparta fotos, videos, media con mi niño(s) allí con otras familias de niños registrados en el daycare para propósito solo familiar y personal (vía email, foto de grupo, Evento de Navidad, Thanksgiving, Field trip o paseos de actividades de su aula o impresión de fotos).',
      parr3:
        '\n____ Permiso a otros Padres de los niños registrados en Educando Childcare para tomar fotografías, videos y media con mis niños allí, si están de acuerdo otros Padres para uso solamente personal y familiar como Celebraciones de cumpleaños, festividades celebradas en el daycare.',
      parr4:
        '\n____ Uso de fotografías de mi niño para trabajos de artes manuales y actividades para familias de niños registrados en el daycare.',
      parr5:
        '\n____ Uso de fotografías, video, media con mi niño allí para promover Educando Childcare Center. Yo doy mi consentimiento firmando abajo:',
      signSection: true
    },
    page11: {
      parr0: '\n<strong> Autorización para Salir a Caminar </strong>',
      separator: true,
      parr1:
        '\nComo parte del programa de Educando Childcare, incluye algunos paseos fuera de nuestras instalaciones como parte de la estimulación en contacto con la naturaleza, la Comunidad y el sano desarrollo físico. Los niños serán llevados de la mano con cintas de seguridad y acompañados de sus maestras y personal a cargo.',
      parr2:
        '\nLos lugares típicos para caminar podrían incluir, pero no limitarse a:',
      parr3: '\n_____ Caminar alrededor del vecindario de Educando Childcare.',
      parr4:
        '\n_____ Caminar hacia parque del vecindario o quizás ir en el transporte de la guardería.',
      parr5: `\n _____ Caminar en la escuela del vecindario.`,
      parr6:
        '\nAutorizo a Educando Childcare llevar a mi(s) niño(s) a los paseos mencionados y que yo marque más arriba.',
      parr7:
        '\nComprendo que para otros paseos se me dará un calendario de días y horas y lugares a visitar fuera del daycare como parte del programa de enriquecimiento educativo de mi(s) niño(s).',
      signSection: true
    },
    page12: {
      parr0:
        '\n<strong> RECIBO DEL MANUAL DE PADRES DE EDUCANDO CHILDCARE </strong>',
      separator: true,
      parr1:
        '\nConfirmo que he recibido una copia del Manual para Padres/Apoderados de Educando Childcare Center, de acuerdo con las normas del Departamento de Salud y Servicios Humanos del Estado de Nebraska, los procedimientos y las expectativas de la guardería que leeré, conoceré y cumpliré en beneficio de mi(s) hijo(s).',
      parr2:
        '\nEntiendo que estas Políticas y reglamentos están sujetos a cambios, de los cuales recibiré y los pondré en práctica.',
      signSection: true
    },
    //region Cotract starts here
    page13: {
      title: {
        text: `<i>Manual de Padres de Educando Childcare Center</i>`,
        fontStyle: fontStyles.ITALIC
      },
      separator: true,
      subtitle: { text: `Nuestro Programa`, fontStyle: fontStyles.BOLD },
      parr1: `Creemos que los niños aprenden jugando y explorando, por eso creamos un ambiente de aprendizaje divertido donde los niños son motivados a participar en actividades de aprendizaje que ayuden en su desarrollo. Sabemos que es importante trabajar con los Padres, siendo fundamental nuestra mutua comunicación para criar a sus hijos sanos y felices.`,
      parr2: `/nNuestro Programa promueve el Desarrollo emocional, Cognitivo y de Aprendizaje, Social y Físico. Esto lo realizamos mediante diversas actividades de aprendizaje divertidas, siempre buscando involucrar al niño en el descubrimiento y la exploración como herramientas importantes para el aprendizaje.`,
      parr3: `/n<strong>En el Desarrollo Emocional</strong>, estimulamos a los niños a que realicen cosas por sí mismos y promovemos la autoestima a través de actividades de aprendizaje en grupo. Ayudarlos a lidiar con sus emociones intensas es la clave para regularse a sí mismos. Un desarrollo emocional saludable les permite sentirse seguros y ser parte de un grupo, aprendiendo a trabajar con él, facilitando así su integración al mundo real que comienza en la escuela.`,
      parr4: `/n<strong>En el Desarrollo Cognitivo y de Aprendizaje</strong>, las diversas actividades de exploración y creatividad pondrán en marcha experiencias que serán la base del conocimiento que los niños pondrán en práctica al enfrentar futuros retos.`,
      parr5: `/n<strong>Desarrollo Social</strong>, la interacción de actividades con otros niños les ayudará a desarrollar empatía y amistades, compartir, dar y recibir. Todo esto es necesario para el sano desarrollo del niño. Como guía de la interacción entre niños, será práctica de actitudes positivas, respeto, amor y buenos modales.`,
      parr6: `/n<strong>Desarrollo Físico</strong>: oportunidades de actividades de movimiento los ayuda a desarrollar su motricidad fina, tan necesaria para la escuela. Así ellos aprenderán a seguir instrucciones, prestar atención, sostener el lápiz, etc.`,
      parr7: `/n Las actividades de los niños como saltar, correr, columpiarse y deslizarse ayudan a estirar y fortalecer sus músculos para un crecimiento saludable, y desarrollar habilidades de coordinación, fuerza y destreza. Además, el movimiento gradual, velocidad o lentitud les ayudará a manejar sus emociones. El baile y la música les ayudarán a desarrollar coordinación, pero también en el aprendizaje del lenguaje, escritura y el comportamiento positivo.`
    },
    page14: {
      title: {
        text: `Educando Childcare Center`,
        fontStyle: fontStyles.ITALIC
      },
      separator: true,
      parr1: `\n<em>#<strong>Misión</strong>##</em>\n\nEstamos comprometidos en brindar el más alto nivel de educación y crianza infantil, asegurando así el éxito escolar y un buen desarrollo académico, y un futuro prometedor./n/nTodo dentro de un ambiente seguro, cómodo y rodeado de amor, mientras velamos por la salud física y emocional de nuestros niños.`,
      parr2: `\n<em>#<strong>Visión</strong>##</em>\n\nNos aseguramos de fomentar el aprendizaje temprano a través de actividades educativas divertidas que ayudarán en las diversas etapas del desarrollo infantil. La práctica de valores y buenas costumbres, llevadas siempre con amor, son parte de nuestro servicio.`,
      parr3: `\n<em>#<strong>Objetivos</strong>##</em>\n\nNuestro objetivo es elevar el nivel de crianza y educación temprana en nuestra comunidad, brindando el servicio que los niños merecen en un ambiente seguro y confortable, asegurando su buen desarrollo escolar.`
    },
    page15: {
      title: {
        text: `Educando Childcare Center - Pólizas`,
        fontStyle: fontStyles.ITALIC
      },
      separator: true,
      parr1: `\n\n\n<strong>Inclusión</strong>\n\nNuestro Programa da la bienvenida a todos los niños. Y como todos somos únicos al igual que nuestras familias, las acogemos sin distinción de sexo, raza, color, religión, nacionalidad, o la diversa conformación de las familias o tutores.\n\nSiguiendo con las regulaciones del Departamento de Educación y del DHHS, los niños trabajarán en la multiculturalidad, compartirán sus costumbres y aprenderán de los demás.\n\nDebido a la diversidad familiar, es necesario trabajar en conjunto con los padres o tutores en constante comunicación para ayudar adecuadamente a su hijo con los diferentes cambios o malestares en el hogar que pudieran afectarlo directamente y monitorear su comportamiento.`,
      parr2: `\n\n\n<strong>Confidencialidad</strong>\n\nToda información que se nos proporcione es tratada con especial atención, respeto y total discreción. Esto quiere decir que no compartiremos su información con terceros o cualquier institución a menos que exista un documento legal que nos obligue a hacerlo.`,
      parr3: `\n\n\n<strong>Ética Profesional</strong>\n\nNuestro servicio se basa en el respeto por los niños y sus familias. Valoramos y respetamos sus ideas y opiniones, y nuestro personal solo brindará sugerencias cuando estas sean requeridas por padres o tutores, siempre tratadas con respeto y confidencialidad.`,
      parr4: `\n\n\n<strong>Horario de Siesta</strong>\n\nEl horario de siesta es una de las rutinas importantes para la salud y descanso del niño, ayudando a prevenir enfermedades relacionadas con el estrés. Así es que el horario es después de la hora de comer (11:30 aproximadamente) y hasta las 2 pm.`
    },
    page16: {
      parr1: `<strong>Alimentación</strong>\n\n\n\nLos niños reciben alimentos nutritivos y saludables, preparados diariamente bajo regulaciones del Programa de Comidas del Departamento de Agricultura de los Estados Unidos y el Departamento de Salud y Servicios Humanos del Estado de Nebraska para Guarderías y Centros de Cuidado de Ancianos. Los Padres o tutores deberán firmar una solicitud para que sus niños participen y sin pago extra.\n\nLos niños recibirán comidas balanceadas, incluyendo las que son sus favoritas, solo que preparadas de forma saludable. Por eso pedimos a los Padres o tutores mantengan sus horarios de sus Contratos para que sus niños tomen las comidas que les corresponden en casa antes de venir a la guardería, de forma que no traigan la comida de casa, para que no se dé el caso de que otros niños les apetezca o provoquen y tal vez sean alérgicos a ese alimento. Si su niño es alérgico a algún alimento, medicamento o algo, por favor llene la forma de alergias.\n\nA todos los niños se les servirá la comida y se les animara a comer, porque sabemos que la alimentación adecuada y a sus horas es muy necesaria para su salud y crecimiento. Y los padres serán notificados en caso su niño no comiera bien cada día.`,
      parr2: `\n\n<strong>Disciplina Positiva</strong>\n\n\n\nCreemos en los elogios que alientan al niño a comportarse positivamente y desarrollarse mejor. Parte de nuestro objetivo es ayudar al niño en el autocontrol y el respeto a si mismos y a los demás niños y adultos.\n\nNuestros empleados usaran solo técnicas positivas para disciplinar. Esto incluye redirección, anticipación, consecuencias naturales y ensenar a los niños a resolver conflictos de manera adecuada. El “time-out” o tiempo fuera será de 1 minutos por ano de edad del niño y cuenta desde que el niño ya esta calmado para comprender lo que conversemos con él acerca de lo que hizo.\n\nDespués de algunas de esas medidas disciplinarias lo abrazamos y sonreímos al niño para demostrarle que sigue siendo un niño querido y siempre alabamos su buen comportamiento.\n\nPara disciplinar necesitamos estar en comunicación con los Padres o tutores para asegurarnos de utilizar las mismas técnicas para evitar la confusión en su niño. Y si el comportamiento de su niño no mejora será necesario tener conferencias para ver de qué forma podemos ayudar a su niño. Y si aun así no hubiese una mejora, talvez sea mejor para el niño coordinar con ellos el cambio y tiempo de cambio hacia otro Childcare.`
    },
    page17: {
      parr1: `<strong>Entrenamiento para el baño</strong>\n\nEs necesario trabajar en coordinación con los Padres para poner en práctica la misma forma de entrenamiento al baño de su niño en el daycare que en casa para que el niño no se confunda y sea de forma más natural posible y su niño no sienta que es un drama el ir al baño porque estará solo en el baño. Si su niño tiene algún accidente en el baño como el ensuciarse por no saber aun, no será castigado de ninguna forma. Para el entrenamiento del baño necesitaremos traiga a diario una muda extra de ropa adecuada a la temporada de clima y pull-ups o pañales especiales.`,
      parr2: `\n<strong>Cambio de Pañal</strong>\n\nEl procedimiento de cambio de panal según regulaciones del DHHS es:\n\n         -   Los pañales se revisan con frecuencia y regularidad. Si están mojados o sucios se cambian inmediatamente utilizando toallitas desechables.\n         -   Los pañales mojados y sucios se almacenan y desechan.\n         -   Las superficies para cambiar pañal se limpian y desinfectan después de cada cambio.\n         -   Se realiza el lavado de manos adecuado al niño y el cuidador después de cada cambio de                  pañal y se ayuda a un niño a ir al baño.`,
      parr3: `\n<strong>Lavarse las manos</strong>\n\nLas enfermedades e infecciones suelen transmitirse a través de las manos. Por eso es indispensable el lavarse las manos con jabón constantemente, sobre todo antes de comer cualquier alimento y después de ir al baño. Por eso pedimos a los Padres o tutores sigan el mismo procedimiento de lavado de manos de la guardería en casa para que su niño se acostumbre a hacerlo por sí mismo y podamos mantenerlo saludable.`,
      parr4: `\n<strong>Días Feriados</strong>\n\nEducando Childcare tendrá los siguientes días Feriados nacionales: Año Nuevo, 4 de Julio, Memorial Day, Dia del Trabajo, Dia de Acción de Gracias, Navidad. El día 24 de diciembre se atenderá hasta el 12 del día. Para saber si abriremos o no el día anterior o después del día festivo, se preguntará a los Padres para saber si asistirán la cantidad suficiente de niños.`,
      parr5: `\n<strong>Inclemencia del Clima</strong>\n\nPor seguridad de sus niños y nuestro personal, en caso de clima severo estaremos al tanto de las noticias locales para notificar a los Padres via Procare de si no abriremos o cerraremos temprano o tal vez abramos tarde.`
     },
    page18: {
      parr1: `<strong>Plan de Preparación para Desastres</strong>\n\nEn caso de desastre: Incendio, tornado e inundación u otro desastre natural o provocado por el hombre, evacuaremos la guardería y nos trasladaremos a un lugar seguro con todos los niños para la reunificación con sus Padres. Ese lugar será <strong>“Supermercado Nuestra Familia”, Ubicado en la esquina de la calle 36 y la Q, Omaha, NE 68107.</strong>\n\nPreviamente nos aseguraremos de que no quede ningún niño dentro de la guardería y los niños con necesidades especiales serán llevados de la mano en todo momento durante el tiempo de evacuación.\n\nEstando ya en el lugar de evacuación, contactaremos a los Padres para coordinar la reunificación con sus niños. Y si no se encontrara a los Padres se contactarán a las personas autorizadas por ellos. Y de no ser posible encontrarlos o los teléfonos celulares no funcionen contactaremos a la policía.`,
      parr2: `\n\n<strong>Llegada y Recogida de niños</strong>\n\nPor motivos de seguridad, al llegar a Educando Childcare, recomendamos a los Padres sacar a sus niños, apagar el motor de sus vehículos, asegurar los artículos de valor y asegurar sus puertas.\n\nPor favor registre el ingreso de su niño en las pantallas digitales que se encuentran en el hall de ingreso antes de entregar a su niño a su maestra encargada de su salón.\n\nAl final del día, no olvide coordinar con la maestra encargada si su niño necesita algo en el daycare o para saber cómo le fue en el día. No olvide registrar la salida de su niño en la pantalla digital y recuerde no dejarlos desatendidos en ningún momento. Todos los niños deberán salir acompañados de sus Padres <strong> o una persona adulta autorizada por ellos.</strong>\n\nNingún niño será entregado a otra persona que no sean los Padres, a no ser que sean los autorizados por los Padres por escrito y si fuera el caso deberán presentar un ID con foto al momento de recoger al niño.`,
      parr3: `\n\n<strong>Custodia</strong>\n\nNuestro deber es entregar a los niños a sus Padres biológicos y a las personas autorizadas por ellos.<strong> Solo si hay un documento con orden del juez</strong> dejaremos de entregar a los niños a alguno o ambos Padres biológicos. Si ese fuera el caso por favor déjenos saber cuál es el caso y entregarnos una copia del documento.`
     }
  }
  const contractEnglish = {
    page1: {
      parr2: `Mother's Email: ${motherEmail} Father's Email: ${fatherEmail}`,
      parr3: `\nSchedules when the Child(ren) will come:                                          `,
      parr4: `\nMonday: ${scheduleFormatted['monday.check_in']} to ${scheduleFormatted['monday.check_out']}     Tuesday: ${scheduleFormatted['tuesday.check_in']} to ${scheduleFormatted['tuesday.check_out']}    Wednesday: ${scheduleFormatted['wednesday.check_in']} to ${scheduleFormatted['wednesday.check_out']}`,
      parr5: `\nThursday: ${scheduleFormatted['thursday.check_in']} to ${scheduleFormatted['thursday.check_out']}    Friday: ${scheduleFormatted['friday.check_in']} to ${scheduleFormatted['friday.check_out']}`,
      parr6: `\nThis Childcare Service Contract, between the Parents/Guardians of the children and Educando Childcare Center, is made under the following terms and conditions:`,
      parr7: `\nThe service will begin on the aforementioned date and will end 5 days after the notice of non-continuation of the service by either party with the corresponding payment until that date.`,
      parr8: `\nThe Mother/Guardian who comes in person to contract the childcare service for their child(ren) is the one who signs the following Contract and policies.`,
      parr9: `\nThe name of the child(ren) for whom Educando Childcare will provide childcare service is/are:\n\n${children}`,
      parr10: `\nThe service will be for 5 days a week, from Monday to Friday, with attendance of no less than 4 days and a maximum of 9 hours per day, thus ensuring the space for their child(ren) at Educando Childcare Center.`,
      parr11: `\nThe service on Saturdays is additional to the payment for weekly attendance. However, if desired, you can change one day of the week (from Monday to Friday) for Saturday. Every Thursday ends the registration for Saturdays.`,
      parr12: `\n<strong>WE do NOT accept</strong> part-time children and/or attendance of few days or few hours for the well-being of your child(ren) and the other children. This is to help them get used to and easily recognize their peers, their teachers, and adjust to the daily schedules and routines.`
    },
    page2: {
      parr1: `\nAs meal times, naptime, potty training, and learning activities as part of their development.`,
      parr2: `\nEducando Childcare provides a quality childcare and teaching service, helping in the development and learning during the early childhood years. For this, we have qualified staff who are constantly trained and professionally growing according to the regulations of the Department of Education and the Department of Health and Human Services of Nebraska (DHHS).`,
      parr3: `\nAdditionally, we provide healthy and nutritious meals prepared daily under the regulations of the Department of Health's Food Program and the DHHS.`,
      parr4: `\nThe corresponding feeding and schedules will depend on what is agreed upon by the Food Program (please complete the meal form). Parents will fill out the form in case of food allergies or anything else. In the case of babies starting to eat, parents will additionally indicate what type of food they are ready to eat according to their Pediatrician's instructions (fill out the form).`,
      parr5: `\nChildren and their families are very important to Educando Childcare, but so is our qualified staff, who have families waiting for them at home. Therefore, the childcare service for each child will NOT exceed 9 hours a day. After their hours, additional costs will be charged to the parents, whether their payment is through the Subsidy Program or Title 20 or not.`,
      parr6: `\nAdditionally, if applicable, the subsidy program may see irregularities in your hours and reduce the approved hours or withdraw that benefit from your child.`,
      parr7: `\nAfter the pickup time for your child, it is considered tardiness; however, we will have a tolerance of 15 minutes. After that time, the payment for tardiness will be:`,
      parr8: `\n\n   -After 15 minutes of tardiness, the payment will be $8/hour within operating hours, and after the daycare closes, it will be $30/hour.`,
      parr9: `\nPayments are made at the end of each week. If you are unable to make the payment, please request to discuss this before charging you the tardiness fee of $20 per day.`,
      parr10: `\nIf parents have to pay a copay for the Subsidy program or Title 20, payment will be made to the daycare during the first 5 days of each month. After this time, there will be a charge of $10 for each day late.`,
     
    },
    page3: {
   parr2: `\nEducando Childcare Center will dedicate the necessary time for the registration of your child(ren), entering all their information and that of your child(ren) into our specialized program, thus providing technological facilities for the daily check-in and check-out of your child(ren), communication and daily information about your child(ren), in case of emergencies, and facilitating your payments.`,
      parr3: `\nAt Educando Childcare, we maintain a calendar of activities and festivities with the children both outside and inside our facilities, which will have a symbolic cost of $25 per year per Toddler, Preschool, and School-aged child. Infants up to 2 years old are not included.`,
      parr4: `\n<strong>                                                              OUR RATES </strong>`,
      parr5: `\nOur rates are updated according to the DHHS regulations of the State of Nebraska for all childcare services and are as follows:`,
      separator: true,
      parr6: `\nRegistration fee: …………………………………………………………………… $25.00`,
      parr7: `\nAnnual fee for activities (Toddlers, Preschool, and School-aged) ……………….. $25.00`,
      parr8: `\nInfant (6 weeks to 18 months)  ……………………………………………… $275.00 ____`,
      parr9: `\nToddler (18 months to 3 years) ………………………………………………$250.00 ____`,
      parr10: `\nPreschool (3 to 5 years)……………………………………………………… $225.00 ____`,
      parr11: `\nSchool (5 to 12 years)………………………………………………………… $200.00 ____`,
      parr12: `\nTransportation to school (round trip per week)…………………………………….$50.00`,
      parr13: `\nMark above what corresponds to your service and the age of your child(ren).\nYour payment will be:_________`,
      parr14: `\nPayment at the time of registration: $_________________`,
      parr15: `\n<strong> Seminal payment: ____________________ </strong>`,
      signSection: true,
      parr16: `\n`,
      signSectionEducando: true
    },
    page4: {
      parr0: `\n<strong> Medical Information of your child </strong>`,
      separator: true,
      parr1:
        '\n<strong>Child’s name ____________________________  </strong> . Current health status of your child or something we should know about: ________________________________________',
      'parr2.1':
        '\nIs your child undergoing any treatment? What?: ____________________________________________',
      parr3:
        '\nDoes your child have any allergies and/or intolerances to any food, insect bites, diaper rash cream, insect repellent, sunscreen, or anything else that triggers an allergic reaction? _________________________________________________',
      parr4:
        '\nPlease give us clear instructions on how to help your child if the case arises: _______________________________________________________________________________________________________________________________________',
      parr6:
        '\nI certify that the information provided is correct and based on my knowledge.',
      signSection: true,
      yPlus: 12,
      separator2: true,
      parr8:
        '\nChild’s name: _______________________________. Current health status of your child or something we should know about: ________________________________________',
      parr9:
        '\nIs your child undergoing any treatment? What?: ____________________________________________',
      parr10:
        '\nDoes your child have any allergies and/or intolerances to any food, insect bites, diaper rash cream, insect repellent, sunscreen, or anything else that triggers an allergic reaction?',
      parr11:
        '\nPlease give us clear instructions on how to help your child if the case arises: _______________________________________________________________________________________________________________________________________',
      parr13:
        '\nI certify that the information provided is correct and based on my knowledge.',
      signSection2: true
    },
    page5: {
      parr0: `\n<strong> Baby Formula and Meal Schedule </strong>`,
      separator: true,
      parr1:
        '\nChild’s name: _______________________________ Date of Birth: ________',
      parr2:
        '\n<strong>                                                              Instructions  </strong>',
      parr3:
        '\no Breast milk or formula: _____________________________________________________',
      parr4:
        '\no Approximate meal times: _________   _________    _________    _______',
      parr5:
        '\no Maximum time between bottles: _______________Minimum (if applicable): ________',
      parr6: '\no Approximate amount (ounces): _______________',
      parr7:
        '\no Instructions for feeding: ________________________________________________________________________________________________________________________',
      parr8:
        '\no Other food information (cereal, baby food, prepared food, juices, etc.) \n_____________________________________________________________________________________________________________________________________________________',
      parr9:
        '\no Allergies to any food or any food that should not be eaten: ________________________________________________________________________________________________',
      parr10:
        '\no Follows the Meals Program for children and adults: (circle one)',
      parr11:
        '\n                  Yes                                           No',
      signSection2: true
    },
    page6: {
      parr0:
        '\n<strong> Permission for Administration of Certain Products </strong>',
      separator: true,
      parr1:
        '\nI give my permission to Educando Childcare to administer the following to my child:',
      parr2: '\n(Check with a checkmark)',
      parr3: '\no Liquid or bar hand soap',
      parr4: '\no Hand sanitizer',
      parr5: '\no Diaper rash cream',
      parr6: '\no Teething medication',
      parr7: '\no Sunscreen',
      parr8: '\no Insect repellent',
      parr9: '\no Others: ________________________________',
      signSection2: true
    },
    page7: {
      parr0: '\n<strong> Transportation Agreement </strong>',
      separator: true,
      parr1:
        '\nWe provide transportation services for children following safety regulations for transporting children in Nebraska. We use seats according to regulations based on the child’s weight and age. Children under 40 lb or under 4 years old will be placed in a seat approved and provided by their Parents or Guardians.',
      parr2:
        '\nWe provide transportation service from Educando Childcare Center to your child’s school for round trips as established in the Contract.',
      parr3:
        '\nAlso, based on the activities prepared for the children on days when there are no classes or they are on vacation, we transport the children to activities outside of Educando Childcare according to the schedule (Children’s Museum, Zoo, Library, Water and/or sand park, a bounce place, Pumpkin Patch, etc.). Toddlers, Preschool, and School-aged children attend these activities.',
      parr4: '\nThe schools my child(ren) attend are:',
      parr5:
        '\nChild’s name: __________________________ to School _____________________',
      parr6:
        '\nChild’s name: __________________________ to School _____________________',
      parr7:
        '\nChild’s name: __________________________ to School _____________________',
      parr8:
        '\nChild’s name: __________________________ to School _____________________',
      parr9:
        '\nI, _______________________________________ authorize my child(ren) to travel in the authorized vehicle of Educando Childcare Center.',
      signSection2: true
    },
    page8: {
      parr0: '\n<strong> Exclusion of Sick Children </strong>',
      separator: true,
      parr1:
        '\nParents with a sick child must keep them at home if they are not feeling well or may infect other children.',
      parr2:
        '\nEducando Childcare reserves the right not to provide service to a child if it believes the child is sick or may infect others.',
      parr3:
        '\nIf a child begins to feel ill during their day at daycare, Parents will be notified to pick up their child as soon as possible.',
      parr4:
        '\nIf the child becomes sick, hurt, or has an accident and efforts to contact the Parents are unsuccessful, the emergency doctor will be contacted.',
      parr5:
        '\nParents may sign a consent form for their child’s doctor in case emergency treatment is needed.',
      parr6:
        '\n<strong> Symptoms of illness for which Parents will be contacted to pick up their child immediately:</strong>',
      parr7:
        '\n- High temperature of 100 degrees; depending on the child’s situation, Parents will be notified if the child has a temperature of 99 degrees to prevent the child from collapsing and becoming unconscious if the temperature rises too quickly.',
      parr8:
        '\n- If the child vomits or has diarrhea for the second time on the same day.',
      parr9:
        '\n- If the child shows symptoms of infections such as: mumps, chickenpox, measles, eye infections, and lice.',
      parr10:
        '\nIn all these cases, a doctor’s note stating that the child is healthy enough to return to daycare will be required.',
      signSection: true
    },
    page9: {
      parr0: '\n<strong> Termination of Educando Services </strong>',
      separator: true,
      parr1:
        '\nService at Educando may be terminated by either party, by the Parents, guardian, or by Educando Childcare, with a prior notice of 10 days. Payment for those 10 days will be made immediately after the notice is given.',
      parr2:
        '\nEducando Childcare may terminate its services for the following reasons:',
      parr3:
        '\n- If the child does not adjust, continues to be upset, or cries continuously, after efforts have been made with the Parents or guardian for the child to attend daily during full-day hours to help the child adjust.',
      parr4:
        '\n- If the child is constantly hitting themselves or other children at Educando Childcare or its employees.',
      parr5:
        '\n- If the child has ongoing behavioral issues, despite attempts to help them change.',
      parr6:
        '\n- If the Parents do not respect the hours and schedules agreed upon in the Contract.',
      parr7:
        '\n- If the Parents or Guardians are not up to date or are not punctual with payments to Educando for their child’s service, including the Co-payment of the Subsidy Program or Title 20 if applicable.',
      parr8:
        '\n- If the Parents or Guardians of child(ren) display inappropriate behavior, yelling, insults, mistreatment, or attacks toward employees, the director of Educando, or other Parents or children in Educando’s service.',
      parr9:
        '\n- If the Parents or guardians do not work with Educando Childcare to provide the child with consistent discipline, do not practice the same potty training methods at home, do not provide changes of clothes, diapers, milk for their baby, and everything necessary for the good health of their child, or do not attend meetings or conferences with the Director or teacher responsible for their child to work together for their child’s well-being.',
      parr10:
        '\n- If the Parents do not comply with the policies and procedures established by Educando Childcare and the Nebraska Department of Human Services, including those established by the previously known Subsidy Program Title 20 and Meals Program.',
      parr11:
        '\nUpon notification of termination of service to the child by Educando Childcare, both parties will agree on what the last day of service will be and the final payment due to daycare.',
      signSection: true
    },
    page10: {
      parr0: '\n<strong> Authorization for Use of Photographs and Media </strong>',
      separator: true,
      parr1:
        '\nI, _______________________________ Mother/Father or Guardian of my child(ren) named ___________________________________________, agree that Educando Childcare: (Please mark what you wish)',
      parr2:
        '\n____ Share photos, videos, media with my child(ren) there with other families of children registered at the daycare for family and personal purposes only (via email, group photo, Christmas Event, Thanksgiving, Field trip, or classroom activity outings, or photo printing).',
      parr3:
        '\n____ Permission for other Parents of children registered at Educando Childcare to take photographs, videos, and media with my children there, if other Parents agree, for personal and family use only such as Birthday celebrations, festivities held at the daycare.',
      parr4:
        '\n____ Use of photographs of my child for arts and crafts projects and activities for families of children registered at the daycare.',
      parr5:
        '\n____ Use of photographs, videos, media with my child there to promote Educando Childcare Center. I give my consent by signing below:',
      signSection: true
    },
    page11: {
      parr0: '\n<strong> Authorization to Go for Walks </strong>',
      separator: true,
      parr1:
        '\nAs part of the Educando Childcare program, some walks outside our facilities are included as part of the stimulation in contact with nature, the community, and healthy physical development. Children will be held by the hand with safety straps and accompanied by their teachers and responsible staff.',
      parr2:
        '\nTypical places for walks may include, but are not limited to:',
      parr3: '\n_____ Walking around the Educando Childcare neighborhood.',
      parr4:
        '\n_____ Walking to the neighborhood park or perhaps taking the daycare transportation.',
      parr5: `\n_____ Walking at the neighborhood school.`,
      parr6:
        '\nI authorize Educando Childcare to take my child(ren) on the walks mentioned above.',
      parr7:
        '\nI understand that for other walks, I will be given a schedule of days, times, and places to visit outside the daycare as part of my child(ren)’s educational enrichment program.',
      signSection: true
    },
    page12: {
      parr0:
        '\n<strong> RECEIPT OF THE PARENT MANUAL OF EDUCANDO CHILDCARE </strong>',
      separator: true,
      parr1:
        '\nI confirm that I have received a copy of the Parent/Guardian Manual of Educando Childcare Center, according to the rules of the Nebraska Department of Health and Human Services, the procedures, and the expectations of the daycare that I will read, understand, and comply with for the benefit of my child(ren).',
      parr2:
        '\nI understand that these Policies and regulations are subject to change, of which I will be informed and will implement.',
      signSection: true
    },
    //region Contract starts here
    page13: {
      title: {
        text: `<i>Parent Manual of Educando Childcare Center</i>`,
        fontStyle: fontStyles.ITALIC
      },
      separator: true,
      subtitle: { text: `Our Program`, fontStyle: fontStyles.BOLD },
      parr1: `We believe that children learn through play and exploration, which is why we create a fun learning environment where children are encouraged to participate in learning activities that aid their development. We know it is important to work with Parents, and our mutual communication is essential in raising healthy and happy children.`,
      parr2: `/nOur Program promotes Emotional, Cognitive, and Learning, Social and Physical Development. We achieve this through various fun learning activities, always seeking to involve the child in discovery and exploration as important tools for learning.`,
      parr3: `/n<strong>In Emotional Development</strong>, we encourage children to do things for themselves and promote self-esteem through group learning activities. Helping them deal with their intense emotions is key to self-regulation. Healthy emotional development allows them to feel secure and be part of a group, learning to work with it, thus facilitating their integration into the real world that begins at school.`,
      parr4: `/n<strong>In Cognitive and Learning Development</strong>, various exploration and creativity activities will initiate experiences that will form the knowledge base children will apply when facing future challenges.`,
      parr5: `/n<strong>Social Development</strong>: the interaction of activities with other children will help them develop empathy and friendships, share, give, and receive. All of this is necessary for the healthy development of the child. As a guide for interaction among children, positive attitudes, respect, love, and good manners will be practiced.`,
      parr6: `/n<strong>Physical Development</strong>: opportunities for movement activities help them develop fine motor skills, which are essential for school. They will learn to follow instructions, pay attention, hold a pencil, etc.`,
      parr7: `/n Activities such as jumping, running, swinging, and sliding help stretch and strengthen their muscles for healthy growth, and develop coordination, strength, and dexterity skills. Additionally, gradual movement, speed, or slowness will help them manage their emotions. Dance and music will help them develop coordination, as well as in language learning, writing, and positive behavior.`
    },
    page14: {
      title: {
        text: `Educando Childcare Center`,
        fontStyle: fontStyles.ITALIC
      },
      separator: true,
      parr1: `\n<em>#<strong>Mission</strong>##</em>\n\nWe are committed to providing the highest level of education and childcare, ensuring academic success and good development, and a promising future./n/nEverything within a safe, comfortable environment surrounded by love while we look after the physical and emotional health of our children.`,
      parr2: `\n<em>#<strong>Vision</strong>##</em>\n\nWe ensure the promotion of early learning through fun educational activities that will aid in the various stages of child development. The practice of values and good customs, always carried out with love, are part of our service.`,
      parr3: `\n<em>#<strong>Objectives</strong>##</em>\n\nOur goal is to elevate the level of early childhood care and education in our community, providing the service that children deserve in a safe and comfortable environment, ensuring their good academic development.`
    },
    page15: {
      title: {
        text: `Educando Childcare Center - Policies`,
        fontStyle: fontStyles.ITALIC
      },
      separator: true,
      parr1: `\n\n\n<strong>Inclusion</strong>\n\nOur Program welcomes all children. And since we are all unique just like our families, we embrace them regardless of gender, race, color, religion, nationality, or the diverse composition of families or guardians.\n\nFollowing the regulations of the Department of Education and DHHS, children will work on multiculturalism, sharing their customs and learning from others.\n\nDue to family diversity, it is necessary to work together with parents or guardians in constant communication to adequately assist their child with any changes or discomforts at home that may directly affect them and monitor their behavior.`,
      parr2: `\n\n\n<strong>Confidentiality</strong>\n\nAll information provided to us is treated with special attention, respect, and total discretion. This means that we will not share your information with third parties or any institution unless there is a legal document obligating us to do so.`,
      parr3: `\n\n\n<strong>Professional Ethics</strong>\n\nOur service is based on respect for children and their families. We value and respect their ideas and opinions, and our staff will only offer suggestions when requested by parents or guardians, always treated with respect and confidentiality.`,
      parr4: `\n\n\n<strong>Nap Time</strong>\n\nNap time is one of the important routines for the child's health and rest, helping to prevent stress-related illnesses. Thus, nap time is after lunchtime (approximately 11:30) until 2 PM.`
    },
    page16: {
      parr1: `<strong>Nutrition</strong>\n\n\n\nChildren receive nutritious and healthy meals, prepared daily under the regulations of the Child Nutrition Program of the U.S. Department of Agriculture and the Nebraska Department of Health and Human Services for Daycares and Elderly Care Centers. Parents or guardians must sign a request for their children to participate at no extra charge.\n\nChildren will receive balanced meals, including their favorites, but prepared healthily. Therefore, we ask parents or guardians to maintain their Contract schedules so that their children have the meals they need at home before coming to daycare, ensuring they do not bring food from home, to avoid cases where other children may desire or provoke, and perhaps be allergic to that food. If your child is allergic to any food, medication, or anything else, please fill out the allergy form.\n\nAll children will be served food and encouraged to eat, as we know that proper and timely nutrition is essential for their health and growth. Parents will be notified if their child does not eat well each day.`,
      parr2: `\n\n<strong>Positive Discipline</strong>\n\n\n\nWe believe in praise that encourages the child to behave positively and develop better. Part of our goal is to help the child in self-control and respect for themselves and others, including other children and adults.\n\nOur staff will only use positive techniques for discipline. This includes redirection, anticipation, natural consequences, and teaching children to resolve conflicts appropriately. The “time-out” will be 1 minute for each year of the child's age and will count from the moment the child is calm enough to understand what we discuss with them about what they did.\n\nAfter some of these disciplinary measures, we hug and smile at the child to show them they are still a loved child, and we always praise their good behavior.\n\nTo discipline, we need to be in communication with the parents or guardians to ensure we use the same techniques to avoid confusion for the child. If the behavior of the child does not improve, it will be necessary to have conferences to see how we can help the child. If there is still no improvement, it may be best for the child to coordinate a change with them to another childcare.`
    },
    page17: {
      parr1: `<strong>Toilet Training</strong>\n\nIt is necessary to work in coordination with the parents to implement the same toilet training approach for their child at daycare as at home, so the child does not get confused and it becomes as natural as possible, without feeling that going to the bathroom is a drama because they will be alone. If your child has any accidents in the bathroom, such as soiling themselves because they still do not know, they will not be punished in any way. For toilet training, please bring an extra set of appropriate clothing for the weather and pull-ups or special diapers every day.`,
      parr2: `\n<strong>Diaper Changing</strong>\n\nThe diaper changing procedure according to DHHS regulations is:\n\n         -   Diapers are checked frequently and regularly. If they are wet or soiled, they are changed immediately using disposable wipes.\n         -   Wet and soiled diapers are stored and disposed of properly.\n         -   Surfaces for changing diapers are cleaned and disinfected after each change.\n         -   Proper handwashing is performed for both the child and the caregiver after each diaper change, and the child is assisted in going to the bathroom.`,
      parr3: `\n<strong>Handwashing</strong>\n\nIllnesses and infections are often transmitted through hands. Therefore, it is essential to wash hands with soap regularly, especially before eating any food and after using the bathroom. We ask parents or guardians to follow the same handwashing procedures at home as at daycare, so their child gets used to doing it by themselves, helping us keep them healthy.`,
      parr4: `\n<strong>Holidays</strong>\n\nEducando Childcare will observe the following national holidays: New Year's Day, July 4th, Memorial Day, Labor Day, Thanksgiving Day, and Christmas. On December 24th, we will close at 12 PM. To find out if we will open or not the day before or after the holiday, we will ask parents to determine if there will be a sufficient number of children attending.`,
      parr5: `\n<strong>Inclement Weather</strong>\n\nFor the safety of your children and our staff, in case of severe weather, we will keep an eye on local news to notify parents via Procare if we will not open, close early, or perhaps open late.`
    },
    page18: {
      parr1: `<strong>Disaster Preparedness Plan</strong>\n\nIn the event of a disaster: fire, tornado, flood, or other natural or man-made disaster, we will evacuate the daycare and move to a safe location with all the children for reunification with their parents. That location will be <strong>“Supermercado Nuestra Familia,” located at the corner of 36th Street and Q, Omaha, NE 68107.</strong>\n\nWe will ensure that no child is left inside the daycare, and children with special needs will be assisted at all times during the evacuation process.\n\nOnce at the evacuation site, we will contact parents to coordinate reunification with their children. If parents cannot be found, we will contact the individuals authorized by them. If it is not possible to locate them, or if cell phones do not work, we will contact the police.`,
      parr2: `\n\n<strong>Arrival and Pickup of Children</strong>\n\nFor safety reasons, upon arriving at Educando Childcare, we recommend that parents turn off their vehicle engines, secure valuables, and lock their doors when picking up their children.\n\nPlease register your child's arrival on the digital screens located in the entrance hall before handing them over to their assigned teacher.\n\nAt the end of the day, do not forget to coordinate with the assigned teacher if your child needs anything at daycare or to find out how their day went. Remember to register your child's departure on the digital screen, and do not leave them unattended at any time. All children must leave accompanied by their parents <strong>or an adult authorized by them.</strong>\n\nNo child will be released to anyone other than their parents, unless authorized in writing by the parents, and in such cases, they must present a photo ID at the time of pickup.`,
      parr3: `\n\n<strong>Custody</strong>\n\nOur duty is to deliver children to their biological parents and individuals authorized by them. <strong>Only if there is a court order will we stop delivering children to one or both biological parents.</strong> If this is the case, please let us know the situation and provide us with a copy of the document.`
    },
    
    
  };

  const contract = language === Language.English ? contractEnglish : contractSpanish;

  return contract;
}
