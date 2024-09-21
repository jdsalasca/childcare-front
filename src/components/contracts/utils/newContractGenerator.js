/* eslint-disable no-unused-vars */
import { Functions } from '../../../utils/functions'
import { defaultContractInfoFinished, fontStyles } from '../utilsAndConstants'
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

  const guardians = contractData.guardians.map(g => g.name).join(', ')
  const children = contractData.children
    .map(
      child =>
        `- Nombre del niño: ${
          child.first_name + ' ' + child.last_name
        }, fecha de nacimiento: ${Functions.formatDateToMMDDYY(
          child.born_date
        )}`
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
      const programPrice = programPrices[program] || 0 // Ensure programPrices[program] is not undefined
      const programCount = programCounts[program] || 0 // Ensure programCounts[program] is not undefined
      return sum + programPrice * programCount
    }, 0)

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
      parr8: `\nInfant (bebe 6 semanas a 18 meses)  ……………………………………………… $275.00  Total: ${
        programCounts['Infant'] || 0
      }`,
      parr9: `\nToddler (18 meses a 3 años) ………………………………………………………… $250.00  Total: ${
        programCounts['Toddler'] || 0
      }`,
      parr10: `\nPreschool (3 a 5 años) ………………………………………………………………… $225.00  Total: ${
        programCounts['Preschool'] || 0
      }`,
      parr11: `\nSchool (5 a 12 años) …………………………………………………………………… $200.00 Total: ${
        programCounts['School age'] || 0
      }`,
      parr12: `\nTransporte a la escuela (ida y Vuelta por semana) ………………………………….$50.00`,
      parr13: `\nMarque arriba lo que corresponda para su servicio y a la edad de su(s) niño(s). Su pago será de:`,
      parr14: `\nPago al momento de la registración: $${totalCost}`,
      parr15: `\n\n<strong> Pago seminal: …………………………………………………………………… </strong>`,
      signSection: true
    },
    page4: {
      parr0: `\n<strong> Información Médica de su niño </strong>`,
      separator: true,
      parr1:
        '\n<strong>Nombre del niño ____________________________  </strong> . Estado actual de salud de su niño o  algo que debamos saber al respecto: _________________________________________________',
      'parr2.1':
        '\n¿Está teniendo algún tratamiento? ¿Cual?: ____________________________________________',
      parr3:
        '\nTiene alguna alergia y/o intolerancia a alguna comida, picadura de insectos, crema de rozaduras, repelente de insectos, bloqueador solar o cualquier otra cosa que desencadene una reacción alérgica? _________________________________________________',
      parr4:
        '\nFavor de darnos instrucciones claras de cómo ayudar a su niño si se diera el caso: ________________________________________________________________________________________________________________________________________________________________',
      parr6:
        '\nYo certifico que la información proporcionada es correcta y basada en mi conocimiento.',
      signSection: true,
      yPlus: 14,
      separator2: true,
      parr8:
        '\nNombre del niño: _______________________________. Estado actual de salud de su niño o algo que debamos saber al respecto: _________________________________________________',
      parr9:
        '\n¿Está teniendo algún tratamiento? ¿Cual?: ____________________________________________',
      parr10:
        '\nTiene alguna alergia y/o intolerancia a alguna comida, picadura de insectos, crema de rozaduras, repelente de insectos, bloqueador solar o cualquier otra cosa que desencadene una reacción alérgica?',
      parr11:
        '\nFavor de darnos instrucciones claras de cómo ayudar a su niño si se diera el caso: ________________________________________________________________________________________________________________________________________________________________',
      parr13:
        '\nYo certifico que la información proporcionada es correcta y basada en mi conocimiento.',
      signSection2: true
    },
    page5: {
      parr0: `\n<strong> Fórmula de bebé y horarios de comidas </strong>`,
      separator: true,
      parr1:
        '\nNombre del niño: ______________________________________ Fecha de Nacimiento: ________',
      parr2:
        '\n<strong>                                                              Instrucciones  </strong>',
      parr3:
        '\no Leche maternal o formula: _____________________________________________________',
      parr4:
        '\no Aproximada horas de comer: ____________   ____________    ____________    __________',
      parr5:
        '\no Máximo tiempo entre botellas: _______________Mínimo (si se diera el caso): ________',
      parr6: '\no Cantidad aproximada (onzas): _______________',
      parr7:
        '\no Instrucciones para dar de comer: ____________________________________________________________________________________________________________________________________',
      parr8:
        '\no Otra información de comida (cereal, comida de bebe, comida preparade, jugos, etc.) \n__________________________________________________________________________________________________________________________________________________________',
      parr9:
        '\no Alergias a alguna comida o alguna comida que no debe comer: ___________________\n______________________________________________________________________________',
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
        '\nNombre del niño: ___________________________ a la Escuela _____________________',
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
      parr2: `\n<strong>Cambio de Pañal</strong>\n\nEl procedimiento de cambio de panal según regulaciones del DHHS es:\n\n         -   Los pañales se revisan con frecuencia y regularidad. Si están mojados o sucios se cambian                 inmediatamente utilizando toallitas desechables.\n         -   Los pañales mojados y sucios se almacenan y desechan.\n         -   Las superficies para cambiar pañal se limpian y desinfectan después de cada cambio.\n         -   Se realiza el lavado de manos adecuado al niño y el cuidador después de cada cambio de                  pañal y se ayuda a un niño a ir al baño.`,
      parr3: `\n<strong>Lavarse las manos</strong>\n\nLas enfermedades e infecciones suelen transmitirse a través de las manos. Por eso es indispensable el lavarse las manos con jabón constantemente, sobre todo antes de comer cualquier alimento y después de ir al baño. Por eso pedimos a los Padres o tutores sigan el mismo procedimiento de lavado de manos de la guardería en casa para que su niño se acostumbre a hacerlo por sí mismo y podamos mantenerlo saludable.`,
      parr4: `\n<strong>Días Feriados</strong>\n\nEducando Childcare tendrá los siguientes días Feriados nacionales: Año Nuevo, 4 de Julio, Memorial Day, Dia del Trabajo, Dia de Acción de Gracias, Navidad. El día 24 de diciembre se atenderá hasta el 12 del día. Para saber si abriremos o no el día anterior o después del día festivo, se preguntará a los Padres para saber si asistirán la cantidad suficiente de niños.`,
      parr5: `\n<strong>Inclemencia del Clima</strong>\n\nPor seguridad de sus niños y nuestro personal, en caso de clima severo estaremos al tanto de las noticias locales para notificar a los Padres via Procare de si no abriremos o cerraremos temprano o tal vez abramos tarde.`
     },
    page18: {
      parr1: `<strong>Plan de Preparación para Desastres</strong>\n\nEn caso de desastre: Incendio, tornado e inundación u otro desastre natural o provocado por el hombre, evacuaremos la guardería y nos trasladaremos a un lugar seguro con todos los niños para la reunificación con sus Padres. Ese lugar será <strong>“Supermercado Nuestra Familia”, Ubicado en la esquina de la calle 36 y la Q, Omaha, NE 68107.</strong>\n\nPreviamente nos aseguraremos de que no quede ningún niño dentro de la guardería y los niños con necesidades especiales serán llevados de la mano en todo momento durante el tiempo de evacuación.\n\nEstando ya en el lugar de evacuación, contactaremos a los Padres para coordinar la reunificación con sus niños. Y si no se encontrara a los Padres se contactarán a las personas autorizadas por ellos. Y de no ser posible encontrarlos o los teléfonos celulares no funcionen contactaremos a la policía.`,
      parr2: `\n\n<strong>Llegada y Recogida de niños</strong>\n\nPor motivos de seguridad, al llegar a Educando Childcare, recomendamos a los Padres sacar a sus niños, apagar el motor de sus vehículos, asegurar los artículos de valor y asegurar sus puertas.\n\nPor favor registre el ingreso de su niño en las pantallas digitales que se encuentran en el hall de ingreso antes de entregar a su niño a su maestra encargada de su salón.\n\nAl final del día, no olvide coordinar con la maestra encargada si su niño necesita algo en el daycare o para saber cómo le fue en el día. No olvide registrar la salida de su niño en la pantalla digital y recuerde no dejarlos desatendidos en ningún momento. Todos los niños deberán salir acompañados de sus Padres <strong> o una persona adulta autorizada por ellos.</strong>\n\nNingún niño será entregado a otra persona que no sean los Padres, a no ser que sean los autorizados por los Padres por escrito y si fuera el caso deberán presentar un ID con foto al momento de recoger al niño.`,
      parr3: `\n\n<strong>Custodia</strong>\n\nNuestro deber es entregar a los niños a sus Padres biológicos y a las personas autorizadas por ellos.<strong> Solo si hay un documento con orden del juez</strong> dejaremos de entregar a los niños a alguno o ambos Padres biológicos. Si ese fuera el caso por favor déjenos saber cuál es el caso y entregarnos una copia del documento.`
     }

    // #region add medical information
  }
}
