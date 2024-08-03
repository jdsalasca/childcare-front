import { defaultContractInfo, fontStyles, formatDateToYYYYMMDD } from "../utilsAndConsts"

export const contractInfo = (contractData = defaultContractInfo) => {
    console.log('====================================');
    console.log("contractData", contractData);
    console.log('====================================');
    const todayDate = formatDateToYYYYMMDD(contractData.todayDate);
    const startDate = formatDateToYYYYMMDD(contractData.startDate);
    const endDate = formatDateToYYYYMMDD(contractData.endDate);

    const guardians = contractData.guardians.map(g => g.name).join(', ');
    const children = contractData.children.map(child => `- Nombre del niño: ${child.name}, fecha de nacimiento: ${formatDateToYYYYMMDD(child.bornDate)}`).join(`\n`);
    
   
    return {
        page1: {
            parr1: `Educando Childcare dedicará el tiempo necesario para la Registración de su(s) niño(s), alimentando nuestro Programa especializado con toda su información y la de su(s) niño(s), brindándole así las facilidades tecnológicas para el registro diario de ingreso y salida de su(s) niño(s), nuestra comunicación e información diaria sobre su niño y la agilidad en sus pagos. /n `,
            parr2: `El presente Contrato de servicio de guardería, entre los Padres/Apoderado de los niños y Educando Childcare, se realizará bajo los siguientes términos y condiciones:`,
            parr3: `\nEl servicio comenzará en la fecha: ${startDate} y terminará 5 días después del día de aviso por cualquiera de las dos partes de no continuación del servicio.`,
            parr4: `\nLos Padres/Apoderado que vienen en persona a contratar el servicio de guardería para su(s) niño(s) es/son: ${guardians}`,
            parr5: `\nY el nombre de los niños a quienes Educando Childcare brindará el servicio de cuidado infantil son:\n\n`,
            parr6: `${children}`,
            parr7: `\nEl Pago por el servicio de cuidado infantil de su niño será de forma:`,
            parr8: `\n /n - Cash - Programa de Subsidio y Co-pay Mensual de: $${contractData.totalAmount}`,
            parr9: `\nEducando Childcare provee un servicio de cuidado infantil y enseñanza de calidad ayudando en el desarrollo de los primeros años del niño, bajo los estándares del Departamento de Educación de Nebraska.`,
            parr10: `\nAdemás, provee alimentos saludables preparados diariamente bajo regulaciones del Programa de Comidas del Departamento de Salud y Servicios Humanos del Estado de Nebraska. La alimentación dependerá del horario acordado en este Contrato y la aprobación del Subsidy program, si fuera el caso (Por favor llenar y firmar la forma de comidas).`
        },
        page2: {
            parr1: `Para Educando Childcare son muy importantes los niños y sus familias, pero también su personal calificado, el cual tiene familia que los espera en casa. Por eso el servicio de cuidado infantil de cada niño NO será más de 8 horas al día; de lo contrario, Educando Childcare cargará el costo de ese tiempo adicional a los Padres. Esto incluye a los servicios pagados a través de Subsidy Program o Título XX, ya que ellos NO autorizan pagos pasadas las 6 horas diarias.`,
            parr2: `\nAdemás, el Programa de Subsidio podría notar la irregularidad en sus horas de recogida de su niño y podría retirarle ese beneficio a su niño.`,
            parr3: `\nPasada la hora acordada de recogida de su niño es tardanza; sin embargo, tendremos una tolerancia de 15 minutos. Pasado este tiempo, el pago en ese momento por tardanza es:\n\n - Pasados los primeros 15 minutos: $15\n - Pasados 30 minutos: $30`,
            parr4: `\nSi los Padres/Guardian deben pagar al daycare el Co-pay del Subsidy Program o Título XX, este deberá ser realizado durante <strong> los primeros 3 días de cada mes </strong>. Pasado ese tiempo, se cobrará un cargo adicional de $10 por cada día pasado.`,
            parr5: `\nEducando Childcare lleva a cabo un Calendario de actividades y festividades con sus niños dentro y fuera de sus instalaciones, lo que tendrá un costo simbólico de: $20 anuales por niño. No incluye a Bebés hasta 18 meses.`,
            parr6: `\nEl Pago por el servicio de cuidado infantil de su niño será de forma:\n\n- Cash - Programa de Subsidio - Co-pay Mensual: $${contractData.totalAmount}`,
            parr7: `\nEntonces, el pago por el servicio de cuidado infantil de su(s) niño(s) incluirá:`,
            // parr8: `\n-Pago anual por actividades de $20 por familia (${contractData.children.length} niños): Total $${contractData.children.length * 20}`,
            parr8: `\n-Pago anual por actividades de $20 por familia (${contractData.children.length} niños): Total $${20}`,
            parr9: `\n-Infant (bebés de 6 semanas a 18 meses): por (${contractData.children.filter(child => child.program === 'Infant').length} niños): Total $ \n -Toddler (18 meses a 3 años): por (${contractData.children.filter(child => child.program === 'Toddler').length} niños): Total $ \n -Pre-school (3 a 5 años): por (${contractData.children.filter(child => child.program === 'Pre-school').length} niños): Total $ \n -School age (5 a 12 años): por (${contractData.children.filter(child => child.program === 'School age').length} niños): Total $`,
            parr10: `\n\nFirma y Nombre de Padres: _____________________________  Fecha: ${todayDate}`,
            parr11: `\nFirma de Educando Childcare Center: _____________________________  Fecha: ${todayDate}`
        },
        page3: {
            title: {text: `<i>Manual de Padres de Educando Childcare Center</i>`, fontStyle: fontStyles.ITALIC},
            separator: true,
            subtitle: {text:  `Nuestro Programa`, fontStyle: fontStyles.BOLD},
            parr1: `\nCreemos que los niños aprenden jugando y explorando, por eso creamos un ambiente de aprendizaje divertido donde los niños son motivados a participar en actividades de aprendizaje que ayuden en su desarrollo. Sabemos que es importante trabajar con los Padres, siendo fundamental nuestra mutua comunicación para criar a sus hijos sanos y felices.`,
            parr2: `\nNuestro Programa promueve el Desarrollo emocional, Cognitivo y de Aprendizaje, Social y Físico. Esto lo realizamos mediante diversas actividades de aprendizaje divertidas, siempre buscando involucrar al niño en el descubrimiento y la exploración como herramientas importantes para el aprendizaje.`,
            parr3: `\n<strong>En el Desarrollo Emocional</strong>, estimulamos a los niños a que realicen cosas por sí mismos y promovemos la autoestima a través de actividades de aprendizaje en grupo. Ayudarlos a lidiar con sus emociones intensas es la clave para regularse a sí mismos. Un desarrollo emocional saludable les permite sentirse seguros y ser parte de un grupo, aprendiendo a trabajar con él, facilitando así su integración al mundo real que comienza en la escuela.`,
            parr4: `\n<strong>En el Desarrollo Cognitivo y de Aprendizaje</strong>, las diversas actividades de exploración y creatividad pondrán en marcha experiencias que serán la base del conocimiento que los niños pondrán en práctica al enfrentar futuros retos.`,
            parr5: `\n<strong>Desarrollo Social</strong>, la interacción de actividades con otros niños les ayudará a desarrollar empatía y amistades, compartir, dar y recibir. Todo esto es necesario para el sano desarrollo del niño. Como guía de la interacción entre niños, será práctica de actitudes positivas, respeto, amor y buenos modales.`,
            parr6: `\n<strong>Desarrollo Físico</strong>: sabemos que el desarrollo físico saludable de los niños que tienen oportunidades de actividades de movimiento y juego está preparado para desarrollar su motricidad fina, tan necesaria para la escuela. Así aprenderán a seguir instrucciones, prestar atención, sostener el lápiz, etc.`,
            parr7: `\nLas actividades de los niños, como saltar, correr, columpiarse y deslizarse, no solo ayudan a estirar y fortalecer sus músculos para un crecimiento saludable, sino también a desarrollar habilidades de coordinación, fuerza y destreza. Además, el movimiento gradual, velocidad o lentitud les ayudará a manejar sus emociones.`,
            parr8: `\nEl baile y la música les ayudarán a desarrollar coordinación, pero también en el aprendizaje del lenguaje, escritura y el comportamiento positivo.`
        },
        page4: {
            title: {text:`Educando Childcare Center`, fontStyle: fontStyles.ITALIC},
            separator: true,
            parr1: `\n<em>#Misión##</em>\n\nEstamos comprometidos en brindar el más alto nivel de educación y crianza infantil, asegurando así el éxito escolar y un buen desarrollo académico, y un futuro prometedor. Todo dentro de un ambiente seguro, cómodo y rodeado de amor, mientras velamos por la salud física y emocional de nuestros niños.`,
            parr2: `\n<em>#Visión##</em>\n\nNos aseguramos de fomentar el aprendizaje temprano a través de actividades educativas divertidas que ayudarán en las diversas etapas del desarrollo infantil. La práctica de valores y buenas costumbres, llevadas siempre con amor, son parte de nuestro servicio.`,
            parr3: `\n<em>#Objetivos#"</em>\n\nNuestro objetivo es elevar el nivel de crianza y educación temprana en nuestra comunidad, brindando el servicio que los niños merecen en un ambiente seguro y confortable, asegurando su buen desarrollo escolar.`
        },
        page5: {
            title: {text:`Fotos y Permisos`, fontStyle: fontStyles.ITALIC},
            separator: true,
            parr1: `\nPara mantener a los padres informados sobre el progreso y las actividades de sus hijos, y para compartir los logros y momentos especiales con la comunidad, solicitamos su permiso para tomar y utilizar fotos de su hijo(a).`,
            parr2: `\n<strong>Permisos:</strong>`,
            parr3: `\n- Se permite tomar fotos de mi hijo(a) y compartirlas dentro de Educando Childcare Center.`,
            parr4: `\n- Se permite tomar fotos de mi hijo(a) y compartirlas en medios de comunicación externos (por ejemplo, sitio web, redes sociales)`,
            parr5: `\n- Se permite el uso de fotos externas con fines especiales (por ejemplo, publicidad, eventos)`,
            parr6: `\nFirma del Padre/Guardián: _____________________________  Fecha: ${formatDateToYYYYMMDD(contractData.todayDate)}`
        },
page6: {

    parr1: `<strong>Simulacros de Incendio y Tornado</strong>\nComo siempre debemos estar listos en caso de incendio o tornado, realizamos simulacros de incendio cada mes y de tornado cuatro veces al año y sin previo aviso. De esta manera, tanto los niños como el personal sabrán a dónde dirigirse en cada caso si fuese real.`,
    parr2: `\n<strong>Pertenencias</strong>\nPedimos a los padres o tutores que marquen con nombre las pertenencias de su niño. Educando Childcare no se responsabiliza por pérdidas. Por todo esto, no está permitido traer a la guardería objetos de casa, aparatos electrónicos, celulares, tablets, videojuegos, dinero o juguetes. Si se diera el caso, estos serán guardados en la oficina para ser entregados antes de que el niño se vaya a casa.`,
    parr3: `\n<strong>Cambios de Ropa</strong>\nSolicitamos a los padres o apoderados que traigan al menos una muda de ropa diariamente para su niño, por si tiene la necesidad de cambiarse en caso de ensuciarse realizando actividades diarias en la guardería o de que tuviera algún incidente en el baño. Si el niño no tiene una muda en el momento en que la necesite, se proporcionará lo que tengamos disponible en la guardería, lo cual quizás no sea de la talla de su niño, y se le cargará el cobro en su pago semanal. En el caso de los bebés, los padres son responsables de traer los necesarios pañales, toallitas húmedas, crema de escaldaduras, biberones y leche.`,
    parr4: `\n<strong>Alimentación</strong>\n\nLos niños reciben alimentos nutritivos y saludables, preparados diariamente bajo regulaciones del Programa de Comidas del Departamento de Agricultura de los Estados Unidos y el Departamento de Salud y Servicios Humanos del Estado de Nebraska para Guarderías y Centros de Cuidado de Ancianos.\nLos padres o tutores deberán firmar una solicitud para que sus niños participen sin pago extra.\n\nLos niños recibirán comidas balanceadas, incluyendo las que son sus favoritas, solo que preparadas de forma saludable. Por eso pedimos a los padres o tutores que mantengan los horarios de sus contratos para que sus niños tomen las comidas que les corresponden en casa antes de venir a la guardería, de forma que no traigan la comida de casa, para evitar el riesgo de que otros niños se interesen en ella o que pueda haber alergias a ese alimento.\n\nSi su niño es alérgico a algún alimento, medicamento o algo, por favor llene la forma de alergias.\n\nA todos los niños se les servirá la comida y se les animará a comer, porque sabemos que la alimentación adecuada y a sus horas es muy necesaria para su salud y crecimiento. Los padres serán notificados en caso de que su niño no comiera bien cada día.`
},
page7: {

    parr1: `\n<strong>Disciplina Positiva</strong>\n\nCreemos en los elogios que alientan al niño a comportarse positivamente y desarrollarse mejor. Parte de nuestro objetivo es ayudar al niño en el autocontrol y el respeto a sí mismos y a los demás niños.\n\nNuestros empleados usarán solo técnicas positivas para disciplinar. Esto incluye redirección, anticipación, consecuencias naturales y enseñar a los niños a resolver conflictos de manera adecuada.\n\nDespués de algunas de esas medidas disciplinarias, lo abrazamos y sonreímos al niño para demostrarle que sigue siendo un niño querido y siempre alabamos su buen comportamiento.\n\nPara disciplinar necesitamos estar en comunicación con los padres o tutores para asegurarnos de utilizar las mismas técnicas para evitar la confusión en su niño. Y si el comportamiento de su niño no mejora será necesario tener conferencias para ver de qué forma podemos ayudar a su niño. Y si no hubiese una mejora, quizás sea mejor para el niño coordinar con ellos el cambio y tiempo de cambio hacia otro Childcare.`,
    parr2: `\n<strong>Entrenamiento para el Baño</strong>\n\nEs necesario trabajar en coordinación con los padres para poner en práctica la misma forma de entrenamiento al baño de su niño en el daycare que en casa, para que el niño no se confunda y sea de forma más natural posible. Si su niño tiene algún accidente en el baño, como ensuciarse por no saber aún hacerlo solo, no será castigado de ninguna forma. Para el entrenamiento del baño necesitaremos que traiga a diario una muda extra de ropa adecuada a la temporada de clima y pull-ups o pañales especiales.`,
    parr3: `\n<strong>Lavarse las Manos</strong>\n\nLas enfermedades e infecciones suelen transmitirse a través de las manos. Por eso es indispensable lavarse las manos con jabón constantemente, sobre todo antes de comer cualquier alimento y después de ir al baño. Pedimos a los padres o tutores que sigan el mismo procedimiento de lavado de manos de la guardería en casa, para que su niño se acostumbre a hacerlo por sí mismo y podamos mantenerlo saludable.`,
    parr4: `\n<strong>Cambio de Pañal</strong>\n\nEl procedimiento de cambio de pañal según regulaciones del DHHS es: \n\n- Los pañales mojados y sucios se cambian inmediatamente. /n- Los pañales se revisan con frecuencia y regularidad. /n- Se utilizan toallitas desechables. /n- Los pañales mojados y sucios se almacenan y desechan.`
},
page8: {

    parr1: `\n\n-Las superficies para cambiar pañal se limpian y desinfectan después de cada cambio de pañal.\n\n-Se realiza el lavado de manos adecuado al niño y al proveedor de cuidado cada vez que se cambia el pañal y se ayuda a un niño a ir al baño.`,
    parr2: `\n\n<strong>Plan de Preparación para Desastres</strong>\n\nEn caso de desastre (incendio, tornado, inundación u otro desastre natural o provocado por el hombre), evacuaremos la guardería y nos trasladaremos a un lugar seguro con todos los niños para la reunificación con sus padres. Ese lugar será <strong>“Supermercado Nuestra Familia”, ubicado en la esquina de la calle 36 y la Q, Omaha, NE 68107.</strong>\n\nPreviamente nos aseguraremos de que no quede ningún niño dentro de la guardería y los niños con necesidades especiales serán llevados de la mano en todo momento durante el tiempo de evacuación.\n\nEstando ya en el lugar de evacuación, contactaremos a los padres para coordinar la reunificación con sus niños. Y si no se encontrara a los padres, se contactarán a las personas autorizadas por ellos. Y si es imposible encontrarlos o los teléfonos celulares no funcionen, contactaremos a la policía.`,
    parr3: `\n\n<strong>Días Feriados</strong>\n\nEducando Childcare tendrá los siguientes días feriados nacionales: Año Nuevo, 4 de Julio, Memorial Day, Día del Trabajo, Día de Acción de Gracias, Navidad. El día 24 de diciembre se atenderá hasta las 12 del día.`,
    parr4: `\n<strong>Llegada y Recogida de Niños</strong>\n\nPor motivos de seguridad, al llegar a Educando Childcare, recomendamos a los padres sacar a sus niños, apagar el motor de sus vehículos, asegurar los artículos de valor y asegurar sus puertas.\n\nPor favor, registre el ingreso de su niño en las pantallas digitales que se encuentran en el hall de ingreso antes de entregar a su niño a su maestra encargada de su salón.\n\nAl final del día, no olvide coordinar con la maestra encargada si su niño necesita algo en el daycare o para saber cómo le fue en el día. No olvide registrar la salida de su niño en la pantalla digital y recuerde no dejarlos desatendidos en ningún momento. Todos los niños deberán salir acompañados de sus padres o una persona adulta autorizada por ellos.\n\nNingún niño será entregado a otra persona que no sean los padres, a no ser que sean los autorizados por los padres por escrito y, si fuera el caso, deberán presentar un ID con foto al momento de recoger al niño.`
},

page9: {
    title:  {text:`Procedimientos`, fontStyle: fontStyles.ITALIC},
    separator: true,
    // subtitle: `Exclusión de los Niños que Estén Enfermos`,
    parr1: `<strong>Exclusión de los Niños que Estén Enfermos</strong>\n\nLos padres con un niño enfermo deberán mantenerlo en casa si no se siente bien o puede contagiar a los otros niños.\n\nEducando Childcare se reserva el derecho de no proveer servicio a un niño si se piensa que el niño está enfermo o puede contagiar a otros niños.\n\nSi el niño comienza a enfermarse durante su día en la guardería, los padres serán notificados para recoger a su niño lo más pronto posible.\n\nSi el niño se enfermó, golpeó o accidentó y a pesar de que se trató de contactar a los padres no fue posible encontrarlos, el doctor de emergencia será contactado.\n\nLos padres podrían firmar una forma de consentimiento al médico de su niño en caso sea necesario ser atendido con algún procedimiento de emergencia.\n`,
    parr2: `<strong>Síntomas de Enfermedad por los Cuales los Padres Serán Contactados para Recoger Inmediatamente a su Niño:</strong>\n`,
    parr3: `\n- Temperatura alta de 100 grados. Según sea el caso del niño, se le comunicará a los padres desde que el niño tenga 99 grados de temperatura para evitar que el niño colapse y quede inconsciente si la temperatura sube muy rápido.`,
    parr4: `\n- Si es la segunda vez en el mismo día que el niño presenta vómitos o diarrea.`,
    parr5: `\n- Si el niño presenta infecciones como: paperas, varicela, sarampión, infección en los ojos y piojos.`,
    parr6: `\nEn todos estos casos, una nota del médico diciendo que el niño es lo suficientemente saludable para regresar al daycare será requerida.`,
...firmSection(contractData)
}
,
page10: {
    // title: `<em>Terminación del Servicio de Educando</em>`,
    parr0: `<strong>Terminación del Servicio de Educando</strong>\n`,
    parr1: `El servicio en Educando podrá ser terminado por ambas partes, por los padres, apoderado o por Educando Childcare, con un previo aviso de 10 días. El pago de esos 10 días será realizado inmediatamente después de haber dado la noticia.`,
    parr2: `\nEducando Childcare podría terminar sus servicios por las siguientes razones:`,
    parr3: `\n- Si el niño no se acostumbra, sigue molesto o llora continuamente, después de haber tratado con los padres o apoderado que el niño asista diariamente y horas consideradas día completo para que el niño se acostumbre.`,
    parr4: `\n- Si el niño está constantemente pegándose a sí mismo o a otros niños en Educando Childcare o a sus empleados.`,
    parr5: `\n- Si el niño tiene mal comportamiento continuo, a pesar de haber tratado de ayudarlo a cambiar.`,
    parr6: `\n- Si los padres no respetan las horas y horarios acordados en el contrato.`,
    parr7: `\n- Si los padres o apoderados no están al día o no son puntuales con los pagos a Educando por el servicio a su niño, incluyendo el co-pago del Programa de Subsidio o Título 20 si fuera el caso.`,
    parr8: `\n- Si los padres o apoderados de niño(s) muestran mal comportamiento, gritos, insultos, malos tratos o ataques hacia los empleados o directora de Educando o hacia otros padres o niños en servicio de Educando.`,
    parr9: `\n- Si los padres o apoderados no trabajan junto a Educando Childcare para proporcionar al niño consistente disciplina, no realizan la misma práctica del entrenamiento al baño en casa, no proveen cambios de ropa, pañales, leche para su bebé y todo lo necesario para la buena salud de su niño o no atienden a reuniones o conferencias con la directora o maestra encargada de su niño para trabajar juntos por el bienestar de su niño.`,
    parr10: `\n- Si los padres no obedecen las pólizas y procedimientos establecidos por Educando Childcare y el Departamento de Servicios Humanos de Nebraska, inclusive las establecidas por el programa de Subsidio antes llamado Título 20 y Programa de Comidas.`,
    parr11: `\n\nAl momento de la noticia de terminación del servicio de Educando Childcare al niño, ambas partes acordarán cuál será el último día de servicio y el pago final correspondiente al daycare.`,
    ...firmSection(contractData)    
}
,
    page11: {
        parr0: `<strong>Autorización de Uso de Fotografía y Media</strong>\n\n`,
        parr1: `Yo, ${contractData?.guardians[0]?.name}, Madre/Padre o Apoderado de mi niño(s) llamado(s) ${contractData?.children?.map(child => child.name).join(", ") ?? "No hay niños asignados"}, estoy de acuerdo que Educando Childcare: (Por favor marque lo que desee)`,
        parr2: `\n${contractData.photosAllowed ? '☑' : '☐'} Comparta fotos, videos, media con mi niño(s) allí con otras familias de niños registrados en el daycare para propósito solo familiar y personal (via email, libro del año o de su aula o impresión de fotos).`,
        parr3: `\n${contractData.externalPhotosAllowed ? '☑' :'☐' } Permiso a otros Padres de los niños registrados en Educando Childcare para tomar fotografías, videos y media con mis niños allí, si están de acuerdo otros Padres para uso solamente personal y familiar como Celebraciones de cumpleaños, festividades celebradas en el daycare.`,
        parr4: `\n${contractData.specialExternalUsage ? '☑' : '☐'} Uso de fotografías de mi niño para trabajos de artes manuales y actividades para familias de niños registrados en el daycare.`,
        parr5: `\n${contractData.externalUsageAllowed ? '☑' : '☐'} Uso de fotografías, video, media con mi niño allí para promover Educando Childcare Center.`,
        parr6: `\n\nYo doy mi consentimiento firmando abajo:`,
        ...firmSection(contractData)
    },
page12: {
    parr0: `<strong>Autorización para salir a caminar</strong>\n\n`,
    parr1: `Como parte del programa de Educando Childcare, incluye algunos paseos fuera de nuestras instalaciones como parte de la estimulación en contacto con la naturaleza, la Comunidad y el sano desarrollo físico. Los lugares típicos para caminar podrían incluir, pero no limitarse a:`,
    parr2: `\n${contractData.walkAroundNeighborhood ? '☑' : '☐'} Caminar alrededor del vecindario de Educando Childcare.`,
    parr3: `\n${contractData.walkToThePark ? '☑' : '☐'} Caminar hacia parque del vecindario o tal vez ir en el transporte de la guardería.`,
    parr4: `\n${contractData.walkAroundSchool ? '☑' : '☐'} Caminar en la escuela del vecindario.`,
    parr5: `\n\nYo, ${contractData?.guardian?.name}, autorizo a Educando Childcare llevar a mi(s) niño(s) a los paseos mencionados y que yo aprobé más arriba.\n\nComprendo que para otros paseos se me dará un calendario de días y horas y lugares a visitar fuera del daycare como parte del programa de enriquecimiento educativo de mi(s) niño(s).`,
    ...firmSection(contractData)
}
,
page13: {
    subtitle: {text:`RECIBO DEL MANUAL DE PADRES DE EDUCANDO CHILDCARE\n`, fontStyle: fontStyles.BOLD},
    parr1: `Confirmo que he recibido una copia del Manual para Padres/Apoderados de Educando Childcare Center, de acuerdo con las normas del Departamento de Salud y Servicios Humanos del Estado de Nebraska, los procedimientos y las expectativas de la guardería que leeré, conoceré y cumpliré en beneficio de mi(s) hijo(s).`,
    parr2: `\n\nEntiendo que estas Políticas y reglamentos están sujetos a cambios, de los cuales recibiré y los pondré en práctica.`,
    ...firmSection(contractData)
}
}
}

const firmSection =(contractData = defaultContractInfo)=> {
    return{
        signSectionFirms: `\n\n                       ${contractData.guardians[0].name}                    ___________________________                     ${formatDateToYYYYMMDD(contractData.todayDate)}`,
    signSection: ` Nombre de Padre o Madre/Apoderado                     Firma                                                  Fecha`
}}