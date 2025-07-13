/* eslint-disable no-unused-vars */
import { Functions } from '../../../utils/functions';
import { PRICES } from '../data/prices';
import { ContractInfo, Language } from '../types/ContractInfo';
import {
  calculateWeeksOld,
  determineProgram,
  fontStyles,
} from '../utilsAndConstants';
import { mockContract } from '../../../data/mockContract';
export const contractInfo = (
  contractData: ContractInfo = mockContract,
  language: Language = Language.English
) => {
  // Removed unused variables: _todayDate, _startDate, _endDate
  const _GUARDIAN_TYPE_ID = 1;
  let { weekly_payment } = contractData;
  const MOTHER_GUARDIAN_TYPE_ID = 2;
  const motherEmail =
    contractData.guardians.find(
      g => g.guardian_type_id === MOTHER_GUARDIAN_TYPE_ID
    )?.email ||
    (language === Language.English ? 'Not registered' : 'No registra');
  const fatherEmail =
    contractData.guardians.find(g => g.guardian_type_id === _GUARDIAN_TYPE_ID)
      ?.email ||
    (language === Language.English ? 'Not registered' : 'No registra');
  const schedule = contractData.schedule;

  const DAYS: Record<number, { name: string; translationLabel: string }> = {
    1: { name: 'Monday', translationLabel: 'Monday' },
    2: { name: 'Tuesday', translationLabel: 'Tuesday' },
    3: { name: 'Wednesday', translationLabel: 'Wednesday' },
    4: { name: 'Thursday', translationLabel: 'Thursday' },
    5: { name: 'Friday', translationLabel: 'Friday' },
    6: { name: 'Saturday', translationLabel: 'Saturday' },
    7: { name: 'Sunday', translationLabel: 'Sunday' },
  };

  // Initialize an object to hold the mapped data
  const scheduleFormatted: Record<string, string> = {};

  // Loop through contract data to map the check-in and check-out times
  contractData?.schedule?.forEach(entry => {
    const day = DAYS[entry.day_id].name.toLowerCase(); // Get the day name from the DAYS object
    scheduleFormatted[`${day}.check_in`] = entry.check_in;
    scheduleFormatted[`${day}.check_out`] = entry.check_out;
  });
  contractData.children.forEach(child => {
    child.classroom = determineProgram(calculateWeeksOld(child.born_date!));
    child.program = determineProgram(calculateWeeksOld(child.born_date!));
  });

  // Removed unused variable: _guardians
  const children = contractData.children
    .map(child =>
      Language.Spanish === language
        ? `- Nombre del niño: ${child.first_name} ${child.last_name}, fecha de nacimiento: ${Functions.formatDateToMMDDYY(child.born_date!)}`
        : `- Child's name: ${child.first_name} ${child.last_name}, birth date: ${Functions.formatDateToMMDDYY(child.born_date!)}`
    )
    .join('\n');
  const transportChildren = contractData.children
    .map(child =>
      Language.Spanish === language
        ? `\nNombre del niño: ${child.first_name} ${child.last_name} al salón ${child.classroom || '_________________'}`
        : `\nChild's name: ${child.first_name} ${child.last_name} to classroom ${child.classroom || '_________________'}`
    )
    .join('\n');

  const programCounts = contractData.children.reduce<Record<string, number>>(
    (acc, child) => {
      acc[child.program!] = (acc[child.program!] || 0) + 1;
      return acc;
    },
    {}
  );
  const startDateLabel: string =
    language === Language.English
      ? `Start Date ${Functions.formatDateToMMDDYY(contractData.start_date!)}`
      : `Fecha de Comienzo ${Functions.formatDateToMMDDYY(contractData.start_date!)}`;

  const programPrices: Record<string, number> = {
    Infant: 275,
    Toddler: 250,
    Preschool: 225,
    'School age': 200,
  };

  const registrationFee = 25;
  const activityFee = 25;
  // Removed unused variable: _totalCost
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
      parr2: `<strong>Email de Mama: ${motherEmail}               Email de Papa: ${fatherEmail}</strong>`,
      parr3: `\n<strong>Horarios en que vendrá(n) los Niño(s):                          ${startDateLabel}</strong>   `,
      parr4: `\nLunes: ${scheduleFormatted['monday.check_in']} a ${scheduleFormatted['monday.check_out']}     Martes: ${scheduleFormatted['tuesday.check_in']} a ${scheduleFormatted['tuesday.check_out']}    Miércoles: ${scheduleFormatted['wednesday.check_in']} a ${scheduleFormatted['wednesday.check_out']}`,
      parr5: `\nJueves: ${scheduleFormatted['thursday.check_in']} a ${scheduleFormatted['thursday.check_out']}    Viernes: ${scheduleFormatted['friday.check_in']} a ${scheduleFormatted['friday.check_out']}`,
      parr6: `\nEl presente Contrato de servicio de guardería, entre los Padres/Apoderado de los niños y Educando Childcare Center, se realiza bajo los siguientes términos y condiciones:`,
      parr7: `\nEl servicio comenzara en la fecha arriba mencionada y terminara 5 días después del día de aviso de <strong>no continuación</strong> del servicio por cualquiera de las dos partes con su pago correspondiente hasta esa fecha.`,
      parr8: `\nLa Madre/Apoderado que vienen en persona a contratar el servicio de guardería para su(s) niño(s) es quien firma el Contrato y pólizas siguientes.`,
      parr9: `\nEl nombre del/los niño(s) a quien(es) Educando Childcare brindara el servicio de cuidado infantil es/son:\n\n${children}`,
      parr10: `\nEl servicio será por 5 días de a semana, de Lunes a Viernes, con asistencia <strong>no menos</strong> de <strong>4 </strong>días y un máximo de 9 horas diarias, asegurando así el espacio para su niño(s) en Educando Childcare Center.`,
      parr11: `\nEl servicio de los Sábados es adicional al pago por asistencia semanal. Pero si desea puede cambiar un día de la semana (de Lunes a Viernes) por el Sábado. Cada Jueves termina el registro para los Sábados.`,
      parr12: `\n<strong>NO aceptamos</strong> niños part time y/o asistencia de pocos días o pocas horas por el bienestar de su niño(s) y los demás niños. Para que se acostumbre y le sea más fácil reconocer a diariamente a sus compañeritos, sus maestras y se ajuste a los horarios y rutinas diarias `,
    },
    page2: {
      parr1: `\nComo horas de comer, hacer siesta, entrenamiento al baño y actividades de aprendizaje como parte de su desarrollo.`,
      parr2: `\nEducando Childcare provee un servicio de cuidado infantil y enseñanza de Calidad ayudando en el Desarrollo y aprendizaje durante los primeros años de infancia. Para ello contamos con personal calificado y en constante entrenamiento y crecimiento profesional según las regulaciones del Departamento de Educación y el Departamento de Salud y Servicios Humanos de Nebraska (DHHS).`,
      parr3: `\nAdemás, proveemos alimentos saludables y nutritivos preparados diariamente bajo regulaciones de Programa de Comidas del Departamento de Salud y el DHHS.`,
      parr4: `\nLa alimentación correspondiente y horarios dependerá de lo acordado por el Programa de Comidas (por favor completar forma de comidas). Los Padres llenarán la forma en caso de alergias a comidas o algo más. En el caso de bebés que comienzan a comer, los Padres adicionalmente indicarán qué tipo de comida están ya listos para comer según indicaciones de su Pediatra (llenar la forma).`,
      parr5: `\nPara Educando Childcare son muy importantes los niños y sus familias, pero también su calificado personal, el cual tiene familia que los espera en casa. Por eso el servicio de cuidado infantil de cada niño NO será más de 9 horas al día. Pasadas sus horas, se le cargará un costo adicional a los Padres, sea su pago a través del Programa de Subsidio o Título 20, o no.`,
      parr6: `\nAdemás, si fuera el caso, el programa de subsidio podría ver la irregularidad en sus horas y recortarle la cantidad de horas aprobadas o retirarle ese beneficio a su niño.`,
      parr7: `\nPasada la hora de recojo de su niño es tardanza. A pesar de eso, tendremos una tolerancia de 15 minutos. Pasado ese tiempo, el pago por tardanza será:`,
      parr8: `\n\n   -Pasados los 15 minutos de tardanza, el pago será de $8/hora dentro del horario de atención, y después del horario de cierre de la guardería será de $30/hora.`,
      parr9: `\nLos pagos se realizan al terminar cada semana. Si no podrá cumplir con el pago, solicite conversar al respecto antes de cobrarle el pago de tardanza de $20 por día.`,
      parr10: `\nSi los Padres tienen que pagar un copay del programa de Subsidio o título 20, el pago será al daycare y durante los <strong>primeros 5 días</strong> del cada mes. Pasado este tiempo tendrá un cargo de $10 por día pasado.`,
    },
    page3: {
      parr4:
        '\n<strong>                                                              NUESTRAS TARIFAS </strong>',
      parr5:
        '\nNuestras tarifas están actualizadas bajo regulaciones del DHHS del Estado de Nebraska para todas las guarderías de servicio infantil y son las siguientes:',
      separator: true,
      parr6: `\nPago por registración (${contractData.serviceCounts?.registrationCount || 0} niños) ........................... $${(contractData.serviceCounts?.registrationCount || 0) * PRICES.REGISTRATION_FEE}`,
      parr7: `\nPago Anual por actividades (${contractData.serviceCounts?.activityCount || 0} niños) ................ $${(contractData.serviceCounts?.activityCount || 0) * PRICES.ACTIVITY_FEE}`,
      parr8: `\nInfant (${contractData.serviceCounts?.infantCount || 0} niños) .................................................. $${(contractData.serviceCounts?.infantCount || 0) * PRICES.RATES.INFANT}`,
      parr9: `\nToddler (${contractData.serviceCounts?.toddlerCount || 0} niños) ............................................... $${(contractData.serviceCounts?.toddlerCount || 0) * PRICES.RATES.TODDLER}`,
      parr10: `\nPreschool (${contractData.serviceCounts?.preschoolCount || 0} niños) .......................................... $${(contractData.serviceCounts?.preschoolCount || 0) * PRICES.RATES.PRESCHOOL}`,
      parr11: `\nSchool (${contractData.serviceCounts?.schoolCount || 0} niños) ............................................... $${(contractData.serviceCounts?.schoolCount || 0) * PRICES.RATES.SCHOOL}`,
      parr12: `\nTransporte (${contractData.serviceCounts?.transportationCount || 0} niños) ...................................... $${(contractData.serviceCounts?.transportationCount || 0) * PRICES.TRANSPORTATION}`,
      parr14: `\n\n                                     Pago al momento de la registración: $${contractData.total_to_pay || 0}`,
      parr15: `\n                                                                    <strong>Pago semanal: $${weekly_payment}</strong>`,
      signSection: true,
      parr16: '\n',
      signSectionEducando: true,
    },
    page4: {
      parr0: '\n<strong>Información Médica de su niño</strong>',
      childIteration: {
        separator: true,
        start: true,
        content: {
          parr1:
            '\nNombre del niño: {{childName}}. Estado actual de salud de su niño o algo que debamos saber al respecto: {{healthStatus}}',
          parr2: '\n¿Está teniendo algún tratamiento? ¿Cuál?: {{treatment}}',
          parr3:
            '\n¿Tiene alguna alergia y/o intolerancia a alguna comida, picadura de insectos, crema de rozaduras, repelente de insectos, bloqueador solar o cualquier otra cosa que desencadene una reacción alérgica? {{allergies}}',
          parr4:
            '\nFavor de darnos instrucciones claras de cómo ayudar a su niño si se diera el caso: {{instructions}}',
          parr5:
            '\nYo certifico que la información proporcionada es correcta y basada en mi conocimiento.',
          signSection: true,
        },
        end: true,
      },
    },

    page5: {
      childIteration: {
        content: {
          parr0: `\n<strong>Fórmula de bebé y horarios de comidas</strong>`,
          separator: true,
          parr1: `\nNombre del niño: {{childName}}                                        Fecha de Nacimiento: {{childBornDate}}`,
          parr2: `\n<strong>                                                                   Instrucciones</strong>`,
          parr3: `\n- Leche maternal o fórmula: {{formula}}`,
          parr4: `\n- Horas aproximadas de comer: {{feedingTimes}}`,
          parr5: `\n- Máximo tiempo entre biberones: {{maxBottleTime}} Mínimo (si se diera el caso): {{minBottleTime}}`,
          parr6: `\n- Cantidad aproximada (onzas): {{bottleAmount}}`,
          parr7: `\n- Instrucciones para dar de comer: \n{{feedingInstructions}}`,
          parr8: `\n- Otra información de comida (cereal, comida de bebé, comida preparada, jugos, etc.): \n{{otherFood}}`,
          parr9: `\n- Alergias a alguna comida o alguna comida que no debe comer: \n{{foodAllergies}}`,
          parr10: `\n- Sigue el Programa de Comidas de niños y adultos (póngale un círculo):`,
          parr11: `\n                  {{followMealProgramYes}} Si                                           {{followMealProgramNo}} No`,
          signSection: true,
        },
      },
    },
    page6: {
      childIteration: {
        content: {
          parr0:
            '\n<strong>Permiso para administración de algunos productos</strong>',
          separator: true,
          parr1: '\nNombre del niño: {{childName}}',
          parr2:
            '\nDoy mi permiso a Educando Childcare de administrar a mi hijo(a) lo siguiente:',
          parr3: '\n(Marcar con una X)',
          parr4: '\n- Jabón de manos líquido o en barra {{soap}}',
          parr5: '\n- Sanitizador de manos {{sanitizer}}',
          parr6: '\n- Crema para rozaduras {{rashCream}}',
          parr7: '\n- Medicamento para denticion {{teethingMedicine}}',
          parr8: '\n- Protector solar {{sunscreen}}',
          parr9: '\n- Repelente de insectos {{insectRepellent}}',
          parr10: '\n- Otros: ________________________________',
          signSection: true,
        },
      },
    },

    page7: {
      parr0: '\n<strong> Acuerdo de Transporte </strong>',
      separator: true,
      parr1:
        '\nProveemos el servicio de transporte de niños siguiendo regulaciones de seguridad para el transporte de niños en Nebraska. Utilizamos sillas de acuerdo con las regulaciones según peso y edad del niño. Los niños menores de 40 Lb o menores de 4 años serán colocados en un asiento aprobado y proporcionado por sus Padres o Tutores.',
      parr2:
        '\nBrindamos el servicio de transporte desde Educando Childcare Center hacia la escuela de su niño de ida/vuelta según establecido en el Contrato.',
      parr3:
        '\nTambién basados en las actividades preparadas para los niños en días en que no hayan clases en la escuela o que estén de vacaciones, transportamos a los niños a actividades fuera de Educando Childcare según programación (Museo de niños, Zoo, Librería, Parque de Agua y/o arena, algún lugar de brincolines, Pumpkin Pach, etc.). A estas actividades asisten Toddlers, Prescolares y escolares.',
      parr4: '\nLas escuelas las que van mis niño(s) son:',
      parr5: transportChildren,
      parr9: `\nYo, ${contractData.titularName} autorizo a mi niño(s) a viajar en el vehículo de Educando Childcare Center autorizado.`,
      signSection2: true,
    },

    page8: {
      parr0: '\n<strong> Exclusión de los niños que estén enfermos </strong>',
      separator: true,
      parr1:
        '\nLos padres con un niño enfermo deberán mantenerlo en casa si no se siente bien o puede contagiar a los otros niños.',
      parr2:
        '\nEducando Childcare se reserva el derecho de no proveer servicio a un niño, si piensa que el niño este enfermo o puede contagiar a otros niños.',
      parr3:
        '\nSi el niño comienza a enfermarse durante su día en la guardería, los Padres serán notificados para recoger a su niño lo más pronto posible.',
      parr4:
        '\nSi el niño se enfermó, golpeo o accidento y a pesar de que se trató de contactar a los Padres no fue posible encontrarlos, el doctor de emergencia será contactado.',
      parr5:
        '\nLos Padres podrían firmar una forma de consentimiento al médico de su niño en caso sea necesario ser atendido con algún procedimiento de emergencia.',
      parr6:
        '\n<strong> Síntomas de enfermedad por los cuales los Padres serán contactados para recoger de inmediato a su niño:</strong> ',
      parr7:
        '\n- Temperatura alta de 100 grados, según sea el caso del niño se le comunicara a los Padres desde que el niño tenga 99 grados de temperatura para evitar el niño colapse y quede inconsciente, si la temperatura subiera muy rápido.',
      parr8:
        '\n- Si es la Segunda vez en el mismo día que el niño presenta Vómitos o diarrea.',
      parr9:
        '\n- Si es el caso de que el niño presenta infecciones como: Paperas, Varicela, sarampión, infección a los ojos y piojos.',
      parr10:
        '\nEn todos estos casos una nota del médico diciendo de que el niño es lo suficientemente saludable para regresar al daycare será requerida.',
      signSection: true,
    },

    page9: {
      parr0: '\n<strong> Terminación del Servicio de Educando </strong>',
      separator: true,
      parr1:
        '\nEl Servicio en Educando podrá ser terminado por ambas partes, por los Padres, apoderado o por Educando childcare, con un previo aviso de 10 días. El pago de esos 10 días será realizado inmediatamente después de haber dado la noticia.',
      parr2:
        '\nEducando Childcare podría terminar sus servicios por las siguientes razones:',
      parr3:
        '\n- Si el niño no se acostumbra, sigue molesto o llora continuamente, después de haber tratado con los Padres o apoderado que el niño asista diariamente y horas consideradas día completo para que el niño se acostumbre.',
      parr4:
        '\n- Si el niño está constantemente pegándose a sí mismo o a otros niños en Educando Childcare o a sus empleados.',
      parr5:
        '\n- Si el niño tiene mal comportamiento continuo, a pesar de haber tratado de ayudarlo a cambiar.',
      parr6:
        '\n- Si los Padres no respetan las horas y horarios acordados en el Contrato.',
      parr7:
        '\n- Si los Padres o Apoderados no están al día o no son puntuales con los pagos a Educando por el servicio a su niño, incluyendo el Co-pago del Programa de Subsidio o Titulo 20 si fuera el caso.',
      parr8:
        '\n- Si los Padres o Apoderados de niño(s) muestran mal comportamiento, gritos, insultos, malos tratos o ataques hacia los empleados, directora de Educando o hacia otros Padres o niños en servicio de Educando.',
      parr9:
        '\n- Si los Padres o apoderados no trabajan junto a Educando Childcare para proporcionar al niño consistente disciplina, no realizan la misma práctica del entrenamiento al baño en casa, no provee cambios de ropa, pañales, leche para su bebé y todo lo necesario para la buena salud de su niño o no atiende a reuniones o conferencias con la Directora o maestra encargada de su niño para trabajar juntos por el bienestar de su niño.',
      parr10:
        '\n- Si los Padres no obedecen las pólizas y procedimientos de establecidas por Educando Childcare y el Departamento de Servicios Humanos de Nebraska, inclusive las establecidas por el programa de Subsidio antes llamado Titulo 20 y Programa de Comidas.',
      parr11:
        '\nAl momento de la noticia de terminación del servicio de Educando Childcare al niño, ambas partes acordarán cual será el último día de servicio y el pago final correspondiente al daycare.',
      signSection: true,
    },

    page10: {
      parr0: '\n<strong> Autorización de Uso de Fotografía y Media </strong>',
      separator: true,
      parr1: `\nYo, ${contractData.titularName} Madre/Padre o Apoderado de mi niño(s) llamado(s) ${contractData.children.map(child => child.first_name + ' ' + child.last_name).join(', ')}, estoy de acuerdo que Educando Childcare: (Por favor marque lo que desee)`,
      parr2: `\n${contractData.terms?.share_photos_with_families ? 'Apruebo' : 'Desapruebo'} Comparta fotos, videos, media con mi niño(s) allí con otras familias de niños registrados en el daycare para propósito solo familiar y personal <strong>(vía email, foto de grupo, Evento de Navidad, Thanksgiving, Field trip o paseos de actividades de su aula o impresión de fotos)</strong>.`,
      parr3: `\n${contractData.terms?.allow_other_parents_to_take_photos ? 'Apruebo' : 'Desapruebo'} Permiso a otros Padres de los niños registrados en Educando Childcare para tomar fotografías, videos y media con mis niños allí, si están de acuerdo otros Padres para uso solamente personal y familiar como <strong>Celebraciones de cumpleaños, festividades celebradas en el daycare.</strong>`,
      parr4: `\n${contractData.terms?.use_photos_for_art_and_activities ? 'Apruebo' : 'Desapruebo'} Uso de fotografías de mi niño para <strong>trabajos de artes manuales y actividades para familias de niños registrados en el daycare.</strong>`,
      parr5: `\n${contractData.terms?.use_photos_for_promotion ? 'Apruebo' : 'Desapruebo'} Uso de fotografías, video, media con mi niño allí para promover Educando Childcare Center.`,
      signSection: true,
    },

    page11: {
      parr0: '\n<strong> Autorización para Salir a Caminar </strong>',
      separator: true,
      parr1:
        '\nComo parte del programa de Educando Childcare, incluye algunos paseos fuera de nuestras instalaciones como parte de la estimulación en contacto con la naturaleza, la Comunidad y el sano desarrollo físico. Los niños serán llevados de la mano con cintas de seguridad y acompañados de sus maestras y personal a cargo.',
      parr2:
        '\nLos lugares típicos para caminar podrían incluir, pero no limitarse a:',
      parr3: `\n${contractData.terms?.walk_in_school ? 'Apruebo' : 'Desapruebo'} Caminar alrededor del vecindario de Educando Childcare.`,
      parr4: `\n${contractData.terms?.walk_to_park_or_transport ? 'Apruebo' : 'Desapruebo'} Caminar hacia el parque del vecindario o quizás ir en el transporte de la guardería.`,
      parr5: `\n${contractData.terms?.walk_around_neighborhood ? 'Apruebo' : 'Desapruebo'} Caminar en la escuela del vecindario.`,
      parr6:
        '\nAutorizo a Educando Childcare llevar a mi(s) niño(s) a los paseos mencionados y que yo marque más arriba.',
      parr7:
        '\nComprendo que para otros paseos se me dará un calendario de días y horas y lugares a visitar fuera del daycare como parte del programa de enriquecimiento educativo de mi(s) niño(s).',
      signSection: true,
    },

    page12: {
      parr0:
        '\n<strong> RECIBO DEL MANUAL DE PADRES DE EDUCANDO CHILDCARE </strong>',
      separator: true,
      parr1:
        '\nConfirmo que he recibido una copia del Manual para Padres/Apoderados de Educando Childcare Center, de acuerdo con las normas del Departamento de Salud y Servicios Humanos del Estado de Nebraska, los procedimientos y las expectativas de la guardería que leeré, conoceré y cumpliré en beneficio de mi(s) hijo(s).',
      parr2:
        '\nEntiendo que estas Políticas y reglamentos están sujetos a cambios, de los cuales recibiré y los pondré en práctica.',
      signSection: true,
    },

    page13: {
      title: {
        text: '<i>Manual de Padres de Educando Childcare Center</i>',
        fontStyle: 'ITALIC',
      },
      separator: true,
      subtitle: { text: 'Nuestro Programa', fontStyle: 'BOLD' },
      parr1:
        'Creemos que los niños aprenden jugando y explorando, por eso creamos un ambiente seguro y de aprendizaje divertido donde los niños son motivados a participar en actividades que ayuden en su desarrollo. Sabemos que es importante trabajar con los Padres, siendo fundamental nuestra mutua comunicación para criar a sus hijos sanos y felices.',
      parr2:
        'Nuestro Programa promueve el Desarrollo emocional, Cognitivo y de Aprendizaje, Social y Físico. Esto lo realizamos mediante diversas actividades de aprendizaje divertidas, siempre buscando involucrar al niño en el descubrimiento y la exploración como herramientas importantes para el aprendizaje.',
      parr3:
        '<strong>En el Desarrollo Emocional</strong>, estimulamos a los niños a que realicen cosas por sí mismos y promovemos la autoestima a través de actividades de aprendizaje en grupo. Ayudarlos a conocer y lidiar con sus emociones intensas es la clave para regularse a sí mismos. Un desarrollo emocional saludable les permite sentirse seguros siendo parte de un grupo y aprendiendo a trabajar con él, facilitando así su integración al mundo real que comienza en la escuela.',
      parr4:
        '<strong>En el Desarrollo Cognitivo y de Aprendizaje</strong>, las diversas actividades de exploración y creatividad pondrán en marcha experiencias que serán la base del conocimiento que los niños pondrán en práctica al enfrentar futuros retos.',
      parr5:
        '<strong>Desarrollo Social</strong>: la interacción de actividades con otros niños les ayudará a desarrollar empatía y amistades, compartir, dar y recibir. Todo esto es necesario para el sano desarrollo del niño. Como guía de la interacción entre niños, será práctica de actitudes positivas, respeto, amor y buenos modales.',
      parr6:
        '<strong>Desarrollo Físico</strong>; el movimiento físico los ayuda a desarrollar su motricidad gruesa. Además, aprenderán a seguir instrucciones, prestar atención, sostener el lápiz, etc.',
      parr7:
        'Las actividades de los niños como saltar, correr, columpiarse y deslizarse ayudan a estirar y fortalecer sus músculos para un crecimiento saludable. Desarrollan habilidades de coordinación, fuerza y destreza. El movimiento gradual, velocidad o lentitud les ayudará a manejar sus emociones. El baile y la música les ayudarán a desarrollar coordinación, pero también en el aprendizaje del lenguaje, escritura y el comportamiento positivo.',
    },

    page14: {
      title: {
        text: `Educando Childcare Center`,
        fontStyle: fontStyles.ITALIC,
      },
      separator: true,
      parr1: `\n<em>#<strong>Misión</strong>##</em>\n\nEstamos comprometidos en brindar el más alto nivel de educación y crianza infantil, asegurando así el éxito escolar y un buen desarrollo académico, y un futuro prometedor./n/nTodo dentro de un ambiente seguro, cómodo y rodeado de amor, mientras velamos por la salud física y emocional de nuestros niños.`,
      parr2: `\n<em>#<strong>Visión</strong>##</em>\n\nNos aseguramos de fomentar el aprendizaje temprano a través de actividades educativas divertidas que ayudarán en las diversas etapas del desarrollo infantil. La práctica de valores y buenas costumbres, llevadas siempre con amor, son parte de nuestro servicio.`,
      parr3: `\n<em>#<strong>Objetivos</strong>##</em>\n\nNuestro objetivo es elevar el nivel de crianza y educación temprana en nuestra comunidad, brindando el servicio que los niños merecen en un ambiente seguro y confortable, asegurando su buen desarrollo escolar.`,
    },

    page15: {
      title: {
        text: `Educando Childcare Center - Pólizas`,
        fontStyle: fontStyles.ITALIC,
      },
      separator: true,
      parr1: `\n\n\n<strong>Inclusión</strong>\n\nNuestro Programa da la bienvenida a todos los niños. Y como todos somos únicos al igual que nuestras familias, las acogemos sin distinción de sexo, raza, color, religión, nacionalidad, o la diversa conformación de las familias o tutores.\n\nSiguiendo con las regulaciones del Departamento de Educación y del DHHS, los niños trabajarán en la multiculturalidad, compartirán sus costumbres y aprenderán de los demás.\n\nDebido a la diversidad familiar, es necesario trabajar en conjunto con los padres o tutores en constante comunicación para ayudar adecuadamente a su hijo con los diferentes cambios o malestares en el hogar que pudieran afectarlo directamente y monitorear su comportamiento.`,
      parr2: `\n\n\n<strong>Confidencialidad</strong>\n\nToda información que se nos proporcione es tratada con especial atención, respeto y total discreción. Esto quiere decir que no compartiremos su información con terceros o cualquier institución a menos que exista un documento legal que nos obligue a hacerlo.`,
      parr3: `\n\n\n<strong>Ética Profesional</strong>\n\nNuestro servicio se basa en el respeto por los niños y sus familias. Valoramos y respetamos sus ideas y opiniones, y nuestro personal solo brindará sugerencias cuando estas sean requeridas por padres o tutores, siempre tratadas con respeto y confidencialidad.`,
      parr4: `\n\n\n<strong>Horario de Siesta</strong>\n\nEl horario de siesta es una de las rutinas importantes para la salud y descanso del niño, ayudando a prevenir enfermedades relacionadas con el estrés. Así es que el horario es después de la hora de comer (11:30 aproximadamente) y hasta las 2 pm.`,
    },
    page16: {
      parr1: `\n\n<strong>Libre de Alcohol, drogas y tabaco</strong>\n\nComprometidos en brindar un ambiente seguro para su niño y nuestros empleados, prohibimos cualquier tipo de substancia o producto alucinógeno que sea fumado o ingerido en nuestras instalaciones, área de estacionamiento o alrededores de Educando Childcare.\n\nSiguiendo con las regulaciones del DHHS, si se diera el caso de que alguno de los padres, familiares o tutores de los niños llegara a Educando Childcare bajo influencia de alcohol o drogas, se le invitará a retirarse de nuestras instalaciones. Si viene a recoger a su niño(s), no se le entregará al niño y se procederá a comunicarnos con el otro padre o madre o familiar de la lista de contacto de personas autorizadas a recoger a su niño. Si no quisiera retirarse de nuestras instalaciones y se pusiera agresivo(a), nos veremos en la obligación de contactar a la policía por la seguridad de los niños y de nuestro personal.`,
      parr2: `\n\n\n<strong>Simulacros de incendio y de tornado</strong>\n\nComo siempre debemos estar listos en caso de incendio o tornado, debemos realizar simulacros de incendio cada mes y de tornado cuatro veces al año y sin previo aviso. De esta manera, tanto los niños como el personal sabrán a dónde dirigirse en cada caso si fuese real.`,
      parr3: `\n\n\n<strong>Pertenencias</strong>\n\nPedimos a los padres o tutores que marquen con nombre las pertenencias de su niño. Educando Childcare no se responsabiliza por pérdidas. Por todo esto, no es permitido traer a la guardería objetos de casa, aparatos electrónicos, celulares, tabletas, videojuegos, dinero, juguetes. Si se diera el caso, serán guardados en la oficina para ser entregados antes de que se vaya a casa.`,
      parr4: `\n\n\n<strong>Cambios de ropa</strong>\n\nSolicitamos a los padres o apoderados que traigan mínimo una muda de ropa diariamente para su niño, por si tiene la necesidad de cambiarse en caso de ensuciarse realizando actividades diarias en la guardería o de que tuviera algún incidente en el baño. Si el niño no tiene una muda en el momento de que la necesite, se proporcionará lo que tengamos disponible en la guardería, que tal vez no sea de la talla de su niño, y se le cargará el cobro en su pago semanal. En el caso de los bebés, los padres son responsables de traer los necesarios pañales, toallitas húmedas, crema de escaldaduras, biberones y leche.`,
    },

    page17: {
      parr1: `\n\n\n<strong>Alimentación</strong>\n\nLos niños reciben alimentos nutritivos y saludables, preparados diariamente bajo regulaciones del Programa de Comidas del Departamento de Agricultura de los Estados Unidos y el Departamento de Salud y Servicios Humanos del Estado de Nebraska para Guarderías y Centros de Cuidado de Ancianos. Los padres o tutores deberán firmar una solicitud para que sus niños participen sin pago extra.\n\nLos niños recibirán comidas balanceadas, incluyendo sus platos favoritos, pero preparadas de forma saludable. Por eso pedimos a los padres o tutores que mantengan los horarios establecidos en sus contratos, asegurando que los niños consuman las comidas que les corresponden en casa antes de llegar a la guardería, evitando así que traigan comida de casa, lo que podría provocar que otros niños se sientan tentados a probarla o que se expongan a alérgenos. Si su niño es alérgico a algún alimento, medicamento u otro, por favor, complete el formulario de alergias correspondiente.\n\nA todos los niños se les servirá la comida y se les animará a comer, ya que sabemos que una alimentación adecuada y a sus horas es esencial para su salud y crecimiento. Los padres serán notificados en caso de que su niño no coma bien cada día.`,
      parr2: `\n\n\n<strong>Disciplina Positiva</strong>\n\nCreemos en los elogios que motivan al niño a comportarse positivamente y a desarrollarse mejor. Parte de nuestro objetivo es ayudar al niño en el autocontrol y en el respeto hacia sí mismo, así como hacia los demás niños y adultos.\n\nNuestro personal utilizará únicamente técnicas positivas para la disciplina. Esto incluye redirección, anticipación, consecuencias naturales y enseñar a los niños a resolver conflictos de manera adecuada. El "time-out" o tiempo fuera será de 1 minuto por cada año de edad del niño, y comenzará a contar desde que el niño esté calmado, permitiéndole comprender lo que hablamos sobre su conducta.\n\nDespués de estas medidas disciplinarias, abrazamos y sonreímos al niño para demostrarle que sigue siendo querido, siempre reconociendo su buen comportamiento. Para garantizar una disciplina efectiva, necesitamos mantener una comunicación constante con los padres o tutores, asegurando que se utilicen las mismas técnicas y evitando confusiones en el niño. Si el comportamiento del niño no mejora, será necesario realizar conferencias para determinar cómo podemos ayudarlo. Si aún así no se observa mejora, puede ser más beneficioso para el niño coordinar con ustedes un cambio a otro childcare.`,
    },

    page18: {
      parr1: `<strong>Entrenamiento para el baño</strong>\n\nEs necesario trabajar en coordinación con los padres para poner en práctica la misma forma de entrenamiento al baño de su niño en el daycare que en casa para que el niño no se confunda y sea lo más natural posible y su niño no sienta que es un drama el ir al baño porque estará solo en el baño. Si su niño tiene algún accidente, como ensuciarse por no saber aún, no será castigado de ninguna forma. Para el entrenamiento del baño, necesitaremos que traiga a diario una muda extra de ropa adecuada a la temporada de clima y pull-ups o pañales especiales.`,

      parr2: `\n<strong>Cambio de pañal</strong>\n\nEl procedimiento de cambio de pañal, según regulaciones del DHHS, es:\n\n         -   Los pañales se revisan con frecuencia y regularidad. Si están mojados o sucios, se cambian inmediatamente utilizando toallitas desechables.\n         -   Los pañales mojados y sucios se almacenan y desechan.\n         -   Las superficies para cambiar pañal se limpian y desinfectan después de cada cambio.\n         -   Se realiza el lavado de manos adecuado para el niño y el cuidador después de cada cambio de pañal, y se ayuda al niño a ir al baño.`,

      parr3: `\n<strong>Lavarse las manos</strong>\n\nLas enfermedades e infecciones suelen transmitirse a través de las manos. Por eso es indispensable lavarse las manos con jabón constantemente, sobre todo antes de comer cualquier alimento y después de ir al baño. Pedimos a los padres o tutores que sigan el mismo procedimiento de lavado de manos de la guardería en casa, para que su niño se acostumbre a hacerlo por sí mismo y podamos mantenerlo saludable.`,

      parr4: `\n<strong>Días feriados</strong>\n\nEducando Childcare tendrá los siguientes días feriados nacionales: Año Nuevo, 4 de Julio, Memorial Day, Día del Trabajo, Día de Acción de Gracias y Navidad. El día 24 de diciembre se atenderá hasta las 12 del día. Para saber si abriremos o no el día anterior o después del día festivo, se preguntará a los padres para saber si asistirán la cantidad suficiente de niños.`,

      parr5: `\n<strong>Inclemencia del clima</strong>\n\nPor seguridad de sus niños y nuestro personal, en caso de clima severo, estaremos al tanto de las noticias locales para notificar a los padres vía Procare si no abriremos, cerraremos temprano o tal vez abramos tarde.`,
    },

    page19: {
      parr1:
        '<strong>Plan de Preparación para Desastres</strong>\n\nEn caso de desastre: Incendio, tornado e inundación u otro desastre natural o provocado por el hombre, evacuaremos la guardería y nos trasladaremos a un lugar seguro con todos los niños para la reunificación con sus Padres. Ese lugar será <strong>"Supermercado Nuestra Familia", Ubicado en la esquina de la calle 36 y la Q, Omaha, NE 68107.</strong>\n\nPreviamente nos aseguraremos de que no quede ningún niño dentro de la guardería y los niños con necesidades especiales serán llevados de la mano en todo momento durante el tiempo de evacuación.\n\nEstando ya en el lugar de evacuación, contactaremos a los Padres para coordinar la reunificación con sus niños. Y si no se encontrara a los Padres se contactarán a las personas autorizadas por ellos. Y de no ser posible encontrarlos o los teléfonos celulares no funcionen contactaremos a la policía.',
      parr2:
        '\n\n<strong>Llegada y Recogida de niños</strong>\n\nPor motivos de seguridad, al llegar a Educando Childcare, recomendamos a los Padres sacar a sus niños, apagar el motor de sus vehículos, asegurar los artículos de valor y asegurar sus puertas.\n\nPor favor registre el ingreso de su niño en las pantallas digitales que se encuentran en el hall de ingreso antes de entregar a su niño a su maestra encargada de su salón.\n\nAl final del día, no olvide coordinar con la maestra encargada si su niño necesita algo en el daycare o para saber cómo le fue en el día. No olvide registrar la salida de su niño en la pantalla digital y recuerde no dejarlos desatendidos en ningún momento. Todos los niños deberán salir acompañados de sus Padres <strong> o una persona adulta autorizada por ellos.</strong>\n\nNingún niño será entregado a otra persona que no sean los Padres, a no ser que sean los autorizados por los Padres por escrito y si fuera el caso deberán presentar un ID con foto al momento de recoger al niño.',
      parr3:
        '\n\n<strong>Custodia</strong>\n\nNuestro deber es entregar a los niños a sus Padres biológicos y a las personas autorizadas por ellos.' +
        '<strong> Solo si hay un documento con orden del juez</strong> dejaremos de entregar a los niños a alguno o ambos Padres biológicos. ' +
        'Si ese fuera el caso por favor déjenos saber cuál es la situación y déjenos una copia del documento.',
    },
  };

  const contractEnglish = {
    page1: {
      parr2: `Mother's Email: ${motherEmail}       Father's Email: ${fatherEmail}`,
      parr3: `\n\n<strong>Times/schedule:                                                                       ${startDateLabel}</strong>   `,
      parr4: `\nMonday: ${scheduleFormatted['monday.check_in']} to ${scheduleFormatted['monday.check_out']}     Tuesday: ${scheduleFormatted['tuesday.check_in']} to ${scheduleFormatted['tuesday.check_out']}    Wednesday: ${scheduleFormatted['wednesday.check_in']} to ${scheduleFormatted['wednesday.check_out']}`,
      parr5: `\nThursday: ${scheduleFormatted['thursday.check_in']} to ${scheduleFormatted['thursday.check_out']}    Friday: ${scheduleFormatted['friday.check_in']} to ${scheduleFormatted['friday.check_out']}`,
      parr6: `\nThis daycare service Contract, between the Parents/Guardians of the child(ren) and Educando Childcare Center, is made under the following terms and conditions:`,
      parr7: `\nThe service will begin on the date mentioned above and will end 5 days after the day of notice of non-continuation of the service by either party with its corresponding payment until that date.`,
      parr8: `\nThe Parent/Guardian whose are coming in person to contract the daycare service for their child(ren) are who signs the contract and the following policies.`,
      parr9: `\nThe names of the child(ren) to whom Educando Childcare Center will provide the childcare service is/are:\n\n${children}`,
      parr10: `\nThe service will be for 5 days a week, from Monday to Friday, with assistance no less than 4 days and a maximum of 9 hours a day, thus ensuring space for your child(ren) at Educando Childcare Center.`,
      parr11: `\nSaturday service is in addition to the weekly attendance payment. But if you want you can change the day of the week (Monday to Friday) to Saturdays.`,
      parr12: `\n\nWe do not accept part-time children and/or attendance for a few days or few hours for the well-being of your child(ren) and the other children. So that they get used to it and it's easier for them to recognize their classmates and teachers on a daily basis and adjust to their daily schedules and routines. Such as meal-times, nap time, toilet training and learning activities as part of their development. `,
    },
    page2: {
      parr2: `\nEducando Childcare Center provides a quality childcare and teaching service helping in development and learning during the first years of childhood. To do this, we have a qualified staff in constant training and professional growth according to the regulations of the Department of Health and Human Services (DHHS).`,
      parr3: `\nAdditionally, we provide healthy and nutritious meals prepared daily under DHHS and Food Program regulations.`,
      parr4: `\nThe corresponding food and schedules will depend on what is agreed by the Food Program (please complete the Meal form). \n\nParents will fill out the form in case of food allergies or something else. In case of babies who are beginning to eat, the Parents additionally indicate what kind of food they are ready to eat according to their pediatrician instructions.`,
      parr5: `\nFor Educando Childcare, children and their families are very important, but so is our qualified staff, who have families waiting for them at home. That is why the childcare service for each child will NOT be more than 9 hours a day. After their hours have passed, whether their payment is through the Subsidy Program (Title 20) or not.`,
      parr6: `\nFurthermore, if this were the case, the subsidy program could see the irregularity in your hours and reduce your approved hours or cancel them.`,
      parr7: `\nAfter your child's pick-up time it is late, despite that we will have a tolerance of 15 minutes. After that time the payment for lateness will be $8/hour during opening hours and after daycare closing hours, it will be $30/hour.`,
      parr8: `\nPayments are made at the end of each week. If you won't be able to make the payment, ask to talk about before charging you the $20/day late fee.`,
      parr9: `\nIf Parents pay a copay for the Subsidy or Title 20 program, the payment will be at daycare and during the first 5 days of each month. After this time there will be a charge of $10 per day spent.`,
      parr10: `\nEducando Childcare Center will dedicate the necessary time to the Registration of your child(ren) into our specialized program, thus providing you with the technological facilities for daily in and out of your child(ren), daily communication, communication in case of emergency, and agility in your payments.`,
      parr11: `\nAt Educando Childcare, we have an Activity Calendar and festivities celebrations with your children outside and inside our facilities, which will have a symbolic cost of $25 <strong>per year</strong> per Toddler, Preschool and school child. Babies less than 2 years old are not included.`,
    },
    page3: {
      parr4:
        '\n<strong>                                                              OUR RATES</strong>',
      separator: true,
      parr5: `\nRegistration fee (${contractData.serviceCounts?.registrationCount || 0} children) ................... $${(contractData.serviceCounts?.registrationCount || 0) * PRICES.REGISTRATION_FEE}`,
      parr6: `\nActivity fee (${contractData.serviceCounts?.activityCount || 0} children) ........................ $${(contractData.serviceCounts?.activityCount || 0) * PRICES.ACTIVITY_FEE}`,
      parr7: `\nInfant (${contractData.serviceCounts?.infantCount || 0} children) ............................... $${(contractData.serviceCounts?.infantCount || 0) * PRICES.RATES.INFANT}`,
      parr8: `\nToddler (${contractData.serviceCounts?.toddlerCount || 0} children) ............................. $${(contractData.serviceCounts?.toddlerCount || 0) * PRICES.RATES.TODDLER}`,
      parr9: `\nPreschool (${contractData.serviceCounts?.preschoolCount || 0} children) ......................... $${(contractData.serviceCounts?.preschoolCount || 0) * PRICES.RATES.PRESCHOOL}`,
      parr10: `\nSchool (${contractData.serviceCounts?.schoolCount || 0} children) .............................. $${(contractData.serviceCounts?.schoolCount || 0) * PRICES.RATES.SCHOOL}`,
      parr11: `\nTransportation (${contractData.serviceCounts?.transportationCount || 0} children) ............... $${(contractData.serviceCounts?.transportationCount || 0) * PRICES.TRANSPORTATION}`,
      parr12: `\n\n                                     Your payment at registration time: $${contractData.total_to_pay || 0}`,
      parr121: `\n                                                               <strong>Weekly payment: $${weekly_payment}\n\n </strong>`,
      signSection: true,
      parr16: '\n',
      signSectionEducando: true,
    },
    page4: {
      parr0: '\n<strong>Medical Information</strong>',
      childIteration: {
        separator: true,
        start: true,
        content: {
          parr1:
            "\nChild's name: {{childName}}. Current health status or anything we should know: {{healthStatus}}",
          parr2: '\nIs he/she under any treatment? Which?: {{treatment}}',
          parr3:
            '\nDoes he/she have any allergies and/or intolerance to any food, insect bites, rash cream, insect repellent, sunscreen, or anything else that triggers an allergic reaction? {{allergies}}',
          parr4:
            '\nPlease give us clear instructions on how to help your child if the case arises: {{instructions}}',
          parr5:
            '\nI certify that the information provided is correct and based on my knowledge.',
          signSection: true,
        },
        end: true,
      },
    },
    page5: {
      childIteration: {
        content: {
          parr0: `\n<strong>Baby Formula and Meals Time</strong>`,
          separator: true,
          parr1: `\nChild's Name: {{childName}}                                        Date of Birth: {{childBornDate}}`,
          parr2: `\n<strong>                                                                   Instructions</strong>`,
          parr3: `\n- Breast milk or formula: {{formula}}`,
          parr4: `\n- Approximate meal times: {{feedingTimes}}`,
          parr5: `\n- Maximum time between bottles: {{maxBottleTime}} Minimum (if applicable): {{minBottleTime}}`,
          parr6: `\n- Approximate amount (ounces): {{bottleAmount}}`,
          parr7: `\n- Feeding instructions: \n{{feedingInstructions}}`,
          parr8: `\n- Other food information (cereal, baby food, prepared food, juices, etc.): \n{{otherFood}}`,
          parr9: `\n- Allergies to any food or anything that the baby should not eat: \n{{foodAllergies}}`,
          parr10: `\n- Follow the Food Program for children and adults (X):`,
          parr11: `\n                  {{followMealProgramYes}} Yes        {{followMealProgramNo}} No`,
          signSection: true,
        },
      },
    },
    page6: {
      childIteration: {
        content: {
          parr0:
            '\n<strong>Permission for Administration of Certain Products</strong>',
          separator: true,
          parr1: "\nChild's name: {{childName}}",
          parr2:
            '\nI give my permission to Educando Childcare to administer the following to my child:',
          parr3: '\n(Mark with a X)',
          parr4: '\n- Liquid or bar hand soap {{soap}}',
          parr5: '\n- Hand sanitizer {{sanitizer}}',
          parr6: '\n- Chafing cream {{rashCream}}',
          parr7: '\n- Teething medication {{teethingMedicine}}',
          parr8: '\n- Sunscreen {{sunscreen}}',
          parr9: '\n- Insect repellent {{insectRepellent}}',
          parr10: '\n- Others: ________________________________',
          signSection: true,
        },
      },
    },
    page7: {
      parr0: '\n<strong>Transportation Agreement</strong>',
      separator: true,
      parr1: `\nWe provide child transportation service following safety regulations for the transportation of children in Nebraska. We use chairs in accordance with the regulation according to the weight and age of the child. Children under 40 lb. or under 4 years old will be placed in an approved seat provided by their Parents or Guardians.`,
      parr2: `\nWe provide transportation service from Educando Childcare Center to/from your child's school as established in the Contract.`,
      parr3: `\nAlso based on the activities prepared for the children on days when there are no classes at school or when they are on vacation, we transport the children to activities outside of Educando Childcare according to the schedule (Children's Museum, Zoo, Library, Water Park and/or sand, some bounce house, Pumpkin Patch, etc.). Toddlers, Preschoolers, and School children attend these activities.`,
      parr4: `\nThe school that my child(ren) attend is/are:`,
      parr5: transportChildren,
      parr10: `\nI, ${contractData.titularName} authorize that my child(ren) travel in the authorized Educando Childcare Center vehicle.`,
      signSection: true,
    },
    page8: {
      parr0: '\n<strong>Sick Children</strong>',
      separator: true,
      parr1: `\nParents with a sick child should keep them home if they are not feeling well or may infect other children.`,
      parr2: `\nEducando Childcare reserves the right not to provide services to a child if it believes that the child is sick or may infect other children.`,
      parr3: `\nIf the child begins to get sick during their day at daycare, Parents will be notified to pick up their child as soon as possible.`,
      parr4: `\nIf the child became ill, hit, or had an accident and although attempts were made to contact the Parents it was not possible to find them, the emergency doctor will be contacted.`,
      parr5: `\nParents could sign a consent form to their child's doctor in case it is necessary to undergo an emergency procedure.`,
      parr6: `\n<strong>Symptoms of illness for which Parents will be contacted to immediately pick up their child:</strong>`,
      parr7: `\n- High temperature of 100 degrees, depending on the case of the child, the Parents will be informed as soon as the child has a temperature of 99 degrees to prevent the child from collapsing and becoming unconscious if the temperature rises very quickly.`,
      parr8: `\n- If it is the second time in the same day that the child has vomiting or diarrhea.`,
      parr9: `\n- If it is the case that the child has infections such as: Mumps, Chickenpox, measles, eye infection, and lice.`,
      parr10: `\nIn all these cases a doctor's note stating that the child is healthy enough to return to daycare will be required.`,
      signSection: true,
    },
    page9: {
      parr0: '\n<strong>Service Termination</strong>',
      separator: true,
      parr1: `\nThe service at Educando Childcare may be terminated by both parties, by Parent/Legal Guardian or by Educando Childcare. With a prior notice of 10 days, termination will be made immediately after giving the news.`,
      parr2: `\nEducando Childcare may terminate your services for the following reasons:`,
      parr3: `\n- If the child does not get used to it, continues to be upset or cries continuously, after having discussed with the Parents that the child needs consistency in attending full time to the daycare to feel comfortable with daily routines, friends, and teachers.`,
      parr4: `\n- If the child is constantly hitting themselves or other children or teachers.`,
      parr5: `\n- If the child has continuous bad behavior, despite attempts to help them change.`,
      parr6: `\n- If the Parents do not respect the hours and schedules agreed upon in the Contract.`,
      parr7: `\n- If the Parents or Guardians are not up to date or are not punctual with payments to Educando Childcare for the service to their child, including the Subsidy program co-payments if it is applicable.`,
      parr8: `\n- If the Parents/Guardians show bad behavior, shouting, insults, mistreatment or attacks towards the employees, director, staff of Educando or towards other Parents or children in the service of Educando Childcare.`,
      parr9: `\n- If the Parents or guardians do not work together with Educando Childcare to provide their child with consistent discipline, do not carry out the same practice of toilet training at home, do not provide extra clothes, diapers, milk for their baby and everything necessary for good health of their child(ren). Or does not attend meetings or conferences with director or teachers in charge of your child to work together for the well-being of your child.`,
      parr10: `\n-If the Parents do not obey the policies and procedures established by Educando Childcare Center and the Nebraska Department of Human Health services, including those established by the Subsidy Program and Food Program.`,
      parr11: `\nAt the time of the notification of termination of the service to the child, both parties will agree on what will be the last day of service and the final payment corresponding to the daycare.`,
      signSection: true,
    },

    page10: {
      parr0:
        '\n<strong>Authorization for use of Photography and Media</strong>',
      separator: true,
      parr1: `\nI, ${contractData.titularName} Mother/Father or Guardian of my child(ren) ${contractData.children.map(child => child.first_name + ' ' + child.last_name).join(', ')}, I agree that Educando Childcare Center: (Please check what you want)`,
      parr2: `\n${contractData.terms?.share_photos_with_families ? 'Approve' : 'Disapprove'} Share photos, videos, media with my child(ren) there with other families of children registered in daycare for family and personal purposes only <strong>(via email, group photo, Christmas Event, Thanksgiving, Field trip activities from your child(ren) classroom or \nphoto printing)</strong>.`,
      parr3: `\n${contractData.terms?.allow_other_parents_to_take_photos ? 'Approve' : 'Disapprove'} Permission to other Parents of children registered in Educando Childcare to take photographs, videos and media with my children there, if other Parents agree for personal and family use only <strong>such as birthday celebrations, festivities celebrated in the daycare</strong>.`,
      parr4: `\n${contractData.terms?.use_photos_for_art_and_activities ? 'Approve' : 'Disapprove'} Using photographs of my child <strong>for crafts and activities for families of children enrolled in daycare</strong>.`,
      parr5: `\n${contractData.terms?.use_photos_for_promotion ? 'Approve' : 'Disapprove'} Use of photographs, video, media with my child there to promote Educando Childcare Center.`,
      parr6: `\nI give my consent by signing below:`,
      signSection: true,
    },
    page11: {
      parr0: '\n<strong> Authorization to go for a walk </strong>',
      separator: true,
      parr1: `\nAs part of the Educando Childcare center program, it includes some walks outside our facilities as part of stimulation in contact with nature, the Community and healthy physical development.`,
      parr12: `\nChildren will be led by the hand with safety belts and accompanied by their teachers and staff in charge.`,
      parr2: `\nTypical walking locations could include, but are not limited to:`,
      parr3: `\n${contractData.terms?.walk_in_school ? 'Approve' : 'Disapprove'} Walk around the Educando Childcare neighborhood.`,
      parr4: `\n${contractData.terms?.walk_to_park_or_transport ? 'Approve' : 'Disapprove'} Walk to a neighborhood park or maybe ride the daycare transportation.`,
      parr5: `\n${contractData.terms?.walk_around_neighborhood ? 'Approve' : 'Disapprove'} Walk to the neighborhood school.`,
      parr6: `\nI authorize Educando Childcare center to take my child(ren) on the field trip mentioned and that I check above.`,
      parr7: `\nI understand that for other field trips I will be given a schedule of days and times and places to visit outside of daycare as part of my child(ren)'s educational enrichment program.`,
      signSection: true,
    },
    page12: {
      parr0:
        '\n<strong> RECEIPT OF THE EDUCANDO CHILDCARE PARENT HANDBOOK </strong>',
      separator: true,
      parr1: `\nI confirm that I received a copy of the Educando Childcare Center Parent/Guardian Handbook, in accordance with the regulations of the State of Nebraska Department of Health and Human Services, procedures and expectations of the childcare center thar I will read, know and follow for the benefit of my child(ren).`,
      parr2: `\nI understand that these Policies and regulations are subject to change, of which I will receive and implement them.`,
      signSection: true,
    },
    page13: {
      title: {
        text: `<i>Parent Handbook - Educando Childcare Center</i>`,
        fontStyle: fontStyles.ITALIC,
      },
      separator: true,
      subtitle: { text: `Our Program`, fontStyle: fontStyles.BOLD },
      parr1: `We believe that children learn by playing and exploring, that is why we create a safe and fun learning environment where children are motivated to participate in activities that help in their development. That is why Educando was designed as a place especially for children and with educational materials around them.`,
      parr2: `/nWe know that it is important to work with parents, and our mutual communication is essential to raise healthy and happy children.`,
      parr3: `/nOur Program promotes emotional, cognitive and approach to learning, social and physical development. We do this through various fun learning activities, always seeking to involve the child in discovery and exploration as important tools for learning.`,
      parr4: `/n<strong>In emotional Development</strong>, we encourage children to do things for themselves and promote self-esteem through group learning activities. Helping them understand and deal with their intense emotions is the key to regulating themselves. Healthy emotional development allows to feel safe being part of a group and learning to work with it, so they can face the bulling, and it will be easier to integrate into the real world that begins at school.`,
      parr5: `/n<strong>In Cognitive and Learning Development</strong>, the various exploration and creativity activities will launch experiences which will be the basis of knowledge and that children will put into practice when facing future challenges.`,
      parr6: `/n<strong>Social Development</strong>: the interaction of activities with other children will help them develop empathy and friendships, share, give and receive. All this is necessary for the healthy development of the child. And as a guide to the interaction between children, it will be the practice of positive attitudes, respect, love and good manners.`,
      parr7: `/n<strong>Physical Development</strong>: physical movement helps them develop their gross motor skills. They will also learn to follow instructions, pay attention, hold a pencil, etc. Activities such as jumping, running, swinging and sliding help stretch and strengthen their muscles for healthy grow. They develop coordination, strength and dexterity skills. Gradual movement, speed or slowness will help them manage their emotions. Dance and music will help them develop coordination, but also the learning of language, writing and positive behavior.`,
    },
    page14: {
      title: {
        text: `Educando Childcare Center`,
        fontStyle: fontStyles.ITALIC,
      },
      separator: true,
      parr1: `\n<em>#<strong>Mission</strong>##</em>\n\nWe are committed to providing the highest level of education and child caring, thus ensuring school success, good academic development, and a promising future./n/nAll within a safe, comfortable environment surrounded by love. While we ensure the physical and emotional health of our children.`,
      parr2: `\n<em>#<strong>Vision</strong>##</em>\n\nWe made sure to encourage early learning through fun educational activities that will help in the various stages of child development. The practice of values and manners, always carried out with love, are part of our service.`,
      parr3: `\n<em>#<strong>Goals</strong>##</em>\n\nOur objective is to rise the level of parenting and early education in our community, providing the service that children deserve in a safe and comfortable environment, ensuring their good academic development.`,
    },
    page15: {
      title: {
        text: `Educando Childcare Center - Policies`,
        fontStyle: fontStyles.ITALIC,
      },
      separator: true,
      parr1: `\n\n\n<strong>Inclusion</strong>\n\nOur Program welcomes all children. And since we are all unique, just like our families, we welcome them, without distinction of sex, race, color, religion, nationality, the diverse makeup families or guardians, etc.\n\nAnd following the regulations of the Department of Education and DHHS, the children will in turn work on multiculturalism, share their customs and learn from others.\n\nDue to family diversity, it is necessary to work together with parents or guardians in constant communication to be able to adequately help your child with different changes or discomforts at home that could directly affect them and monitor their behavior.`,
      parr2: `\n\n\n<strong>Confidentiality</strong>\n\nAll information provided to us is treated with special attention, respect and total discretion. This means that we will not share your information with third parties or any institution unless there is a legal document that requires us to do so.`,
      parr3: `\n\n\n<strong>Professional Ethics</strong>\n\nOur service is based on respect for children and their families. And because we value and respect your ideas and opinions, our staff will only provide suggestions when they are requested by Parents or guardians and always treated with respect and confidentiality.`,
      parr4: `\n\n\n<strong>Nap Time</strong>\n\nNap time is one of the important routines for the child's health and rest so that he is not prone to illness through stress. So, the hours are after lunchtime (approximately 11:30 am) and until 2pm. (snack time).`,
    },
    page16: {
      parr1: `\n<strong>Free of Alcohol, Drugs, and Tobacco</strong>\n\nCommitted to providing a safe environment for your child and our employees, we prohibit any type of hallucinogenic substance or product that is smoked or ingested in our facilities, parking area or around Educando Childcare.\n\nAnd continuing with DHHS regulations, if it were the case that any of the Parents, relatives or guardians of the children arrived at Educando Childcare under the influence of alcohol, drugs, they would be invited to leave our facilities and if they come to pick up your child(ren) will not be handed over to you and we will proceed to contact the other Parent or family member on the Contact list of people authorized to pick up your child. And if it were the case that he/she did not want to leave our facilities and became aggressive, we would be forced to contact the police for the safety of the children and our staff.`,
      parr2: `\n<strong>Fire and Tornado Drills</strong>\n\nAs we must always be ready in case of fire or tornado, we must carry out fire drills every month and tornado drills four times a year and without prior notice, this way both the children and the staff will know where to go in each case if it were real.`,
      parr3: `\n<strong>Belongings</strong>\n\nWe ask parents or guardians to label their child's belongings. Educando Childcare is not responsible for losses. For all this, it is not allowed to bring home objects, electronic devices, cell phones, tablets, video games, money, toys, etc. to the daycare. If necessary, they will keep in the office to be delivered before you go home.`,
      parr4: `\n<strong>Clothing Changes</strong>\n\nWe ask parents or guardians to bring at least one change of clothes daily for their child, in case they need to change in case they get dirty doing daily activities in the daycare or if they have an incident in the bathroom. And if the child does not have a change of clothes at the time they need it, what we have available will be provided and that may not be for your child's size and the charge will be charged to your weekly payment. In the case of babies. Parents are responsible for bringing the necessary diapers, wet wipes, scald cream, bottles and milk.`,
    },
    page17: {
      parr1: `<strong>Feeding</strong>\n\nChildren receive nutritious and healthy meals, prepared daily under regulations of the Food Program of the United States Department of Agriculture and the State of Nebraska Department of Health and Human Services for Day Care centers and Senior Care Centers. Parents or guardians must sign an application for their children to participate without extra payment.\n\nChildren will receive balanced meals, including their favorites, just prepared in a healthy way. That is why we ask parents or guardians to maintain their Contract schedules so that their children eat their corresponding meals at home before coming to daycare, so they do not bring food from home, so that this does not happen. If other children crave or provoke it and may be allergic to that food, medication or anything, please fill out the allergy form.\n\nAll children will be served food and encouraged to eat, because we know that adequate and timely feeding is very necessary for their health and growth. And parents will be notified if their child does not eat well each day.`,
      parr2: `\n\n<strong>Positive Discipline</strong>
  \n\nWe believe in praise that encourages the child to behave positively and develop better. Part of our goal is to help the child with self-control and respect for themselves and other children and adults.
  \n\nOur employees will use only positive techniques to discipline. This includes redirection, anticipation, natural consequences, and teaching children to resolve conflicts appropriately. The "time-out" or time-out will be 1 minute per year of age of the child and counts from when the child is clam to understand what we are talking to him about what he did.
  \n\nAfter some of those disciplinary measures we hug him and smile at the child to show him that he is still a loved child, and we always praise his good behavior.
  \n\nTo discipline we need to be in communication with the Parents or guardians to ensure we use the same techniques to avoid confusion in their child. And if your child's behavior does not improve, conferences will be necessary to see how we can help your child. 
  \n\nAnd if there is still no improvement, it may be better for the child to coordinate with them the change and time of change to another Childcare.`,
    },
    page18: {
      parr1: `<strong>Toilet Training</strong>\n\nIt is necessary to work in coordination with the parents to implement the same form of toilet training for your child in daycare as at home, so that the child does not get confused and it is as natural as possible and your child does not feel that he is a drama going to the bathroom because you will be alone in the bathroom such as getting dirty because he or she doesn't know it yet, he or she will not be punished in any way. For toilet training we will need to bring an extra change of clothes appropriate to the weather season and pull-ups or special diapers every day.`,
      parr2: `\n<strong>Diaper Change</strong>\n\nThe diaper changing procedure according to DHHS regulations is:\n\n- Diapers are checked frequently and regularly. If they are wet or dirty, they are changed immediately using disposable wipes.\n\n- Wet and soiled diapers are stored and discarded.\n\n- Diapers changing surfaces are cleaned and disinfected after each diaper change.\n\n- Appropriate hand washing is carried out for the child and the caregiver after each diaper changes and the child is helped to go to the bathroom.`,
      parr3: `\n<strong>Handwash</strong>\n\nDiseases and infections are usually transmitted through the hands. That is why it is essential to wash their hands with soap constantly, especially before eating any food and after going to the bathroom. That's why we ask parents or guardians to follow the same daycare handwashing procedure at home so that your child gets used to doing it themselves and we can keep them healthy.`,
      parr4: `\n<strong>Holidays</strong>\n\nEducando Childcare will have the following national holidays: New Year's Day, July 4th, Memorial Day, Labor Day, Thanksgiving Day, Christmas. On December 24th and December 31st, it will be attended until midday (12 am). To find out whether we will open the day before or after the holiday, Parents will be asked to see if enough children will attend.`,
      parr5: `\n<strong>Inclement Weather</strong>\n\nFor the safety of your children and our staff, in the event of severe weather we will monitor local news to notify Parents via Procare if we will not open or close early or perhaps open late.`,
    },
    page19: {
      parr1: `<strong>Disaster Preparedness Plan</strong>\n\nIn the event of a disaster: Fire, tornado and flood or other natural or man-made disaster, we will evacuate the daycare and move to a safe location with all children for reunification with their Parents. That location will be <strong>"Our Family Supermarket", located on the corner of 36th Street and Q Street, Omaha, NE 68107.</strong>\n\nWe will ensure that no children are left inside the daycare and children with special needs will be always held by hand during the evacuation time.\n\nOnce at the evacuation site, we will contact the Parents to coordinate reunification with their children. And if the Parents are not found, the people authorized by them will be contacted. And if it is not possible to find them or the cell phones do not work, we will contact the police.`,
      parr2: `\n\n<strong>Arrival and Pick-Up of Children</strong>\n\nFor safety reasons, upon arriving at Educando childcare, we recommend that Parents take their children out, turn off the engine of their vehicles, secure valuable items and lock their doors.\n\nPlease register your child's entry on the digital screens in the entrance hall before handing your child over to his or her classroom teacher.\n\nAt the end of the day, don't forget to coordinate with the teacher in charge if your child needs anything in daycare or to find out how their day went.\n\nDon't forget to clock your child out on the digital screen and remember not to leave them unattended at any time. All children must be accompanied by their parents or an adult authorized by them.\n\nNo child will be handed over to anyone other than the Parents, unless they are authorized by the parents in writing and if applicable, they must present a photo ID when picking up the child.`,
      parr3: `\n\n<strong>Custody</strong>\n\nOur duty is to deliver the children to their biological parents and to the people authorized by them. <strong>Only if there is a document with a judge's order will we stop delivering the children to one or both biological parents.</strong> If that is the case, please let us know what the situation is and leave us a copy of the document.`,
    },
  };

  const contract =
    language === Language.English ? contractEnglish : contractSpanish;

  return contract;
};
// Removed unused interface _ChildIterationMarkers
