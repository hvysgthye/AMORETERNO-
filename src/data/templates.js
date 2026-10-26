// Catálogo Oficial Completo de 35 Plantillas de Dedicapag
// Rediseñadas con estilo ultra-elegante, animaciones fluidas y soporte de música personalizada.

export const CATEGORIES = [
  'Todos',
  'Románticas & Mecánicas',
  'Cósmicas & Mágicas',
  'Flores & Naturaleza',
  'Biometría & Luces',
  'Juegos & Dinámicas',
  'Especiales & Regalos'
];

export const TEMPLATES = [
  // --- 1. Románticas & Mecánicas ---
  {
    id: 'candado',
    name: 'Candado del Amor 3D',
    category: 'Románticas & Mecánicas',
    badge: 'Más Popular',
    rating: '5.0 (5.4k)',
    description: 'Candado mecánico interactivo con combinación secreta de 3 números. Al desbloquearse, el arco metálico salta con sonido físico y despliega tu carta con foto y música.',
    previewGradient: 'from-rose-600 via-pink-600 to-amber-500',
    accentColor: '#f43f5e',
    features: ['Diales 3D interactivos', 'Físicas de resorte metálico', 'Efectos sonoros WebAudio', 'Lluvia de corazones'],
    defaults: {
      title: 'Nuestro Secreto Eterno',
      lockTitle: 'Gira los números para abrir mi corazón',
      combo: [14, 2, 24],
      unlockMsg: '¡Desbloqueaste mi amor!',
      letterTitle: 'Para la persona más especial de mi vida',
      letterBody: 'Desde el primer momento en que te vi, supe que mi vida cambiaría para siempre. Gracias por cada sonrisa y cada abrazo que hemos compartido.',
      photo: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Melodía Celestial (Music Box)'
    }
  },
  {
    id: 'puertas-del-corazon',
    name: 'Puertas del Corazón 3D',
    category: 'Románticas & Mecánicas',
    badge: '3D Inmersivo',
    rating: '4.9 (3.1k)',
    description: 'Portón señorial en doble hoja con sombras y perspectiva tridimensional. Al tocarlo se abren de par en par con un haz de luz celestial revelando tu regalo.',
    previewGradient: 'from-amber-600 via-rose-600 to-purple-700',
    accentColor: '#f59e0b',
    features: ['Perspectiva 3D con doble batiente', 'Iluminación volumétrica', 'Sonido de goznes', 'Transición cinemática'],
    defaults: {
      title: 'Abre la Puerta a Nuestro Amor',
      lockTitle: 'Toca las puertas para entrar a mi corazón',
      unlockMsg: 'Bienvenida/o al rincón más cálido de mi alma.',
      letterTitle: 'Mi Puerta Siempre Está Abierta Para Ti',
      letterBody: 'Dicen que el hogar no es un lugar, sino una persona. Desde que estás conmigo sé exactamente dónde quiero estar siempre.',
      photo: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Gateway to Romance'
    }
  },
  {
    id: 'carta',
    name: 'Carta con Lacre de Cera',
    category: 'Románticas & Mecánicas',
    badge: 'Elegancia Vintage',
    rating: '4.9 (2.9k)',
    description: 'Sobre vintage con sello de lacre rojo grabado. Al hacer clic se rompe el sello con sonido crujiente, se despliega la carta en papel pergamino y suena tu música.',
    previewGradient: 'from-red-800 via-rose-700 to-amber-600',
    accentColor: '#be123c',
    features: ['Lacre de cera interactivo', 'Despliegue de papel pergamino', 'Tipografía caligráfica', 'Efecto de tinta que se escribe'],
    defaults: {
      title: 'Una Carta Sellada Con Mi Alma',
      lockTitle: 'Toca el sello de lacre para romperlo y leer',
      unlockMsg: 'El sello se ha roto para ti.',
      letterTitle: 'Mi más sincera confesión de amor',
      letterBody: 'Hay sentimientos tan profundos que solo una carta escrita desde el corazón puede intentar expresar. Eres mi presente y mi futuro.',
      photo: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Vintage Romance'
    }
  },
  {
    id: 'propose',
    name: 'Pedida de Mano (Caja de Anillo)',
    category: 'Románticas & Mecánicas',
    badge: 'Momento Inolvidable',
    rating: '5.0 (4.2k)',
    description: 'Caja de terciopelo azul noche o burdeos que se abre con bisagra 3D, revelando un anillo de compromiso centelleante con fuegos artificiales dorados.',
    previewGradient: 'from-blue-900 via-indigo-700 to-amber-400',
    accentColor: '#fbbf24',
    features: ['Caja de terciopelo 3D', 'Anillo de diamante con destello', 'Pregunta interactiva ¿Quieres casarte conmigo?', 'Fuegos artificiales dorados'],
    defaults: {
      title: 'Una Pregunta Para Toda la Vida',
      lockTitle: 'Abre la cajita de terciopelo...',
      unlockMsg: '¿Aceptas ser mi compañera/o de vida para siempre?',
      letterTitle: 'El día en que comenzó nuestra eternidad',
      letterBody: 'No imagino el resto de mis días sin tu risa y tu compañía. Quiero que cada amanecer sea a tu lado. ¿Aceptas dar este paso conmigo?',
      photo: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Wedding Bells Symphony'
    }
  },
  {
    id: 'libro-amor',
    name: 'Libro de Nuestra Historia',
    category: 'Románticas & Mecánicas',
    badge: 'Cuento de Hadas',
    rating: '4.8 (2.3k)',
    description: 'Un elegante libro ilustrado encuadernado en cuero. Pasa las páginas con sonido de papel hojear, descubriendo fotos, fechas memorables y dedicatorias.',
    previewGradient: 'from-amber-800 via-yellow-700 to-rose-900',
    accentColor: '#d97706',
    features: ['Efecto de pasar páginas en 3D', 'Capítulos interactivos de la relación', 'Textura de papel vintage', 'Sonido de hojas de libro'],
    defaults: {
      title: 'El Libro de Nuestro Amor',
      lockTitle: 'Abre la portada para hojear nuestro cuento',
      unlockMsg: 'Capítulo 1: Cuando el destino nos unió.',
      letterTitle: 'La historia más hermosa jamás escrita',
      letterBody: 'Cada día contigo es una página inolvidable de aventuras, risas cómplices y cariño sincero. Gracias por ser el mejor capítulo de mi vida.',
      photo: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Storybook Fairytale'
    }
  },
  {
    id: 'chocolate',
    name: 'Caja de Bombones & Chocolates',
    category: 'Románticas & Mecánicas',
    badge: 'Dulce Sorpresa',
    rating: '4.7 (1.8k)',
    description: 'Caja dorada con lazo rojo que al abrirse muestra bombones en forma de corazón. Cada bombón contiene un motivo por el cual te amo.',
    previewGradient: 'from-amber-900 via-rose-900 to-yellow-600',
    accentColor: '#92400e',
    features: ['Caja de chocolates desarmable', 'Bombones interactivos con mensajes', 'Partículas de polvo de oro', 'Efecto dulce y goloso'],
    defaults: {
      title: 'Tú Eres Mi Dulzura Favorita',
      lockTitle: 'Desata el lazo de la caja de bombones',
      unlockMsg: '¡Cada bombón es un motivo de por qué te amo!',
      letterTitle: 'Más dulce que cualquier chocolate',
      letterBody: 'Endulzas mis días grises, iluminas mis mañanas y haces que todo sea más bonito. Te amo con cada pedacito de mi corazón.',
      photo: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Sweet Sugar Melody'
    }
  },

  // --- 2. Cósmicas & Mágicas ---
  {
    id: 'galaxy',
    name: 'Galaxia del Amor',
    category: 'Cósmicas & Mágicas',
    badge: 'Canvas 60fps',
    rating: '4.9 (4.8k)',
    description: 'Un viaje cinematográfico por el cosmos. Cientos de estrellas interactivas orbitando tu constelación personalizada con fecha de aniversario y mensajes flotantes.',
    previewGradient: 'from-indigo-600 via-purple-600 to-pink-500',
    accentColor: '#a855f7',
    features: ['Partículas estelares Canvas a 60fps', 'Constelación en doble corazón', 'Interacción gravitacional', 'Audio espacial'],
    defaults: {
      title: 'Nuestro Universo Juntos',
      lockTitle: 'Explorando el cosmos de nuestro amor',
      starName: 'Constelación Mateo & Sofia',
      anniversaryDate: '24 de Noviembre, 2023',
      unlockMsg: 'Eres mi estrella favorita en todo el universo.',
      letterTitle: 'Más allá de las estrellas',
      letterBody: 'Ni todo el brillo de las galaxias se compara con la luz que trajiste a mi mundo. Te amo hasta el infinito y más allá.',
      photo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Cosmic Dreams'
    }
  },
  {
    id: 'galaxia-infinita',
    name: 'Galaxia Infinita 3D',
    category: 'Cósmicas & Mágicas',
    badge: 'Profundidad Cósmica',
    rating: '5.0 (3.6k)',
    description: 'Efecto de vuelo hiperespacial a través de una nebulosa de estrellas en espiral con polvo cósmico brillante que rodea su foto.',
    previewGradient: 'from-purple-900 via-violet-700 to-pink-600',
    accentColor: '#8b5cf6',
    features: ['Efecto túnel hiperespacial', 'Nebulosa de colores reactiva', 'Estrellas fugaces al hacer clic', 'Música ambient espacial'],
    defaults: {
      title: 'Un Viaje Infinito a Tu Lado',
      lockTitle: 'Presiona para acelerar hacia nuestra galaxia',
      unlockMsg: '¡Llegamos al centro de nuestro universo!',
      letterTitle: 'Amor en Todas las Dimensiones',
      letterBody: 'Si en un universo paralelo tuviera que volver a elegir, te buscaría en cada galaxia hasta encontrarte una y mil veces más.',
      photo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Interstellar Romance'
    }
  },
  {
    id: 'universe',
    name: 'Universo & Constelaciones',
    category: 'Cósmicas & Mágicas',
    badge: 'Mapa Estelar Real',
    rating: '4.8 (2.4k)',
    description: 'Mapa estelar de la noche en que se conocieron o iniciaron su noviazgo, con líneas doradas uniendo sus estrellas y dedicatoria astronómica.',
    previewGradient: 'from-slate-900 via-indigo-950 to-blue-900',
    accentColor: '#38bdf8',
    features: ['Simulación de bóveda celeste', 'Nombres grabados en las estrellas', 'Cálculo poético de constelaciones', 'Destellos estelares'],
    defaults: {
      title: 'El Cielo de la Noche en que Te Conocí',
      lockTitle: 'Observa la alineación de nuestras estrellas',
      unlockMsg: 'Las estrellas conspiraron para unirnos.',
      letterTitle: 'Escrito en el Firmamento',
      letterBody: 'Dicen que nada ocurre por casualidad. La noche en que cruzamos miradas, el universo entero encajó a la perfección.',
      photo: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Starlight Nocturne'
    }
  },
  {
    id: 'galaxy-gallery',
    name: 'Galería Cósmica de Fotos',
    category: 'Cósmicas & Mágicas',
    badge: 'Álbum Flotante',
    rating: '4.9 (2.7k)',
    description: 'Múltiples recuerdos fotográficos orbitando como planetas alrededor de un sol en forma de corazón que pulsa al ritmo de la música.',
    previewGradient: 'from-pink-900 via-purple-900 to-indigo-900',
    accentColor: '#ec4899',
    features: ['Planetas fotográficos en órbita', 'Zoom interactivo a cada foto', 'Partículas de polvo cósmico', 'Efecto gravitacional'],
    defaults: {
      title: 'Nuestros Mejores Momentos en Órbita',
      lockTitle: 'Gira la órbita para ver nuestras memorias',
      unlockMsg: '¡Nuestros recuerdos brillan más que mil soles!',
      letterTitle: 'Un álbum estelar de nuestro amor',
      letterBody: 'Cada fotografía es un tesoro que guardo con devoción en el cofre de mi alma. Gracias por tantos instantes mágicos.',
      photo: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Cosmic Gallery Chords'
    }
  },
  {
    id: 'galaxy-gallery-flores-amarillas',
    name: 'Galaxia con Flores Amarillas',
    category: 'Cósmicas & Mágicas',
    badge: 'Fusión Viral',
    rating: '5.0 (3.9k)',
    description: 'La combinación perfecta: la inmensidad del cosmos con un ramo de flores amarillas brillantes que brotan de una nebulosa dorada.',
    previewGradient: 'from-amber-600 via-purple-800 to-slate-900',
    accentColor: '#facc15',
    features: ['Flores amarillas cósmicas', 'Nebulosa dorada brillante', 'Efecto 21 de septiembre', 'Polen estelar flotante'],
    defaults: {
      title: 'Flores Amarillas en el Infinito',
      lockTitle: 'Toca la flor cósmica para iluminar el universo',
      unlockMsg: '¡Tus flores amarillas nunca se marchitarán!',
      letterTitle: 'Un ramo de luz para toda la eternidad',
      letterBody: 'Prometí darte flores amarillas, pero quise que fueran tan infinitas como mi amor. Aquí están, brillando para siempre en el cosmos.',
      photo: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Yellow Galaxy Waltz'
    }
  },

  // --- 3. Flores & Naturaleza ---
  {
    id: 'flores-moradas',
    name: 'Ramo de Flores Moradas',
    category: 'Flores & Naturaleza',
    badge: 'Delicadeza y Calma',
    rating: '4.9 (3.8k)',
    description: 'Brote botánico SVG que germina ante tus ojos: los tallos crecen y los pétalos morados y lilas florecen dejando caer partículas luminosas.',
    previewGradient: 'from-purple-800 via-fuchsia-700 to-indigo-900',
    accentColor: '#c084fc',
    features: ['Animación vectorial de brote', 'Pétalos lilas y violetas flotantes', 'Efecto de rocío matutino', 'Música suave de relajación'],
    defaults: {
      title: 'Flores Moradas Para Mi Amor',
      lockTitle: 'Toca el botón para hacer florecer el ramo',
      unlockMsg: 'Floreces cada rincón de mi vida con ternura.',
      letterTitle: 'Un ramo violeta que nunca se apaga',
      letterBody: 'El morado es el color de la magia, la paz y la devoción. Este ramo virtual simboliza lo especial y único que es nuestro cariño.',
      photo: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Purple Petals Melody'
    }
  },
  {
    id: 'flor-amarilla',
    name: 'Flores Amarillas Eternas',
    category: 'Flores & Naturaleza',
    badge: 'Tendencia Favorita',
    rating: '5.0 (6.1k)',
    description: 'Inspirada en la emblemática tradición de regalar flores amarillas. Girasoles y flores doradas que se abren con luz solar y música alegre.',
    previewGradient: 'from-amber-500 via-yellow-500 to-orange-500',
    accentColor: '#eab308',
    features: ['Girasoles animados al sol', 'Rayos de luz solar interactivos', 'Caída de pétalos dorados', 'Música romántica optimista'],
    defaults: {
      title: 'Tus Flores Amarillas Soñadas',
      lockTitle: 'Haz clic para regar tu flor amarilla',
      unlockMsg: '¡Aquí están tus flores amarillas para siempre!',
      letterTitle: 'Porque te mereces todas las flores del mundo',
      letterBody: 'Sé cuánto soñabas con tus flores amarillas. Hoy quiero recordarte que iluminas mis días como el sol más radiante de primavera.',
      photo: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Spring Sunlight'
    }
  },
  {
    id: 'flor-amarilla-dia',
    name: 'Flor Amarilla de Primavera',
    category: 'Flores & Naturaleza',
    badge: '21 de Septiembre',
    rating: '4.8 (2.5k)',
    description: 'Edición de día con cielo azul celeste, nubes suaves y un campo de flores amarillas que bailan al compás del viento cuando mueves el mouse.',
    previewGradient: 'from-sky-500 via-amber-400 to-yellow-300',
    accentColor: '#f59e0b',
    features: ['Cielo primaveral animado', 'Viento interactivo con el cursor', 'Doble ramo floral', 'Día radiante'],
    defaults: {
      title: 'El Día de las Flores Amarillas',
      lockTitle: 'Siente la brisa primaveral de nuestro amor',
      unlockMsg: '¡Feliz día de las flores amarillas, mi vida!',
      letterTitle: 'Una promesa cumplida con amor',
      letterBody: 'No podía dejar pasar este día sin entregarte las flores más brillantes. Gracias por llenar mi vida de primaveras eternas.',
      photo: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Spring Breeze'
    }
  },
  {
    id: 'flor-galaxy',
    name: 'Flor Galaxy Holográfica',
    category: 'Flores & Naturaleza',
    badge: 'Holograma 3D',
    rating: '4.9 (3.3k)',
    description: 'Flor cósmica iridiscente que cambia de tonalidad (magenta, cian, dorado) con reflejos holográficos futuristas y música chillout.',
    previewGradient: 'from-fuchsia-600 via-cyan-500 to-violet-700',
    accentColor: '#d946ef',
    features: ['Efecto holograma iridiscente', 'Cambio dinámico de espectro cromático', 'Polvo estelar bioluminiscente', 'Reflejos de prisma'],
    defaults: {
      title: 'Flor Holográfica Galáctica',
      lockTitle: 'Gira el holograma para encender la flor',
      unlockMsg: '¡Sintonizada en la frecuencia de nuestro amor!',
      letterTitle: 'Un amor fuera de esta galaxia',
      letterBody: 'Tu cariño es tan deslumbrante como una flor nacida de las nebulosas más lejanas. Te amo con cada partícula de mi ser.',
      photo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Holographic Bloom'
    }
  },
  {
    id: 'arbol',
    name: 'Árbol del Amor & Corazones',
    category: 'Flores & Naturaleza',
    badge: 'Raíces Fuertes',
    rating: '4.9 (2.8k)',
    description: 'Un majestuoso árbol cuyas hojas son pequeños corazones palpitantes. Conforme pasa el tiempo, el árbol crece y sus ramas se llenan de recuerdos.',
    previewGradient: 'from-rose-800 via-amber-800 to-emerald-900',
    accentColor: '#fb7185',
    features: ['Árbol con follaje de corazones', 'Hojas cayendo suavemente', 'Ramas con hitos de aniversario', 'Crecimiento animado'],
    defaults: {
      title: 'El Árbol que Crece Con Nuestro Amor',
      lockTitle: 'Toca el tronco para hacer florecer los corazones',
      unlockMsg: 'Nuestras raíces son firmes y nuestro amor infinito.',
      letterTitle: 'Raíces profundas, amor eterno',
      letterBody: 'Como un árbol que resiste las tormentas y florece en primavera, nuestro amor se hace más fuerte y hermoso con cada día que pasa.',
      photo: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Tree of Life Melody'
    }
  },

  // --- 4. Biometría & Luces ---
  {
    id: 'lector-huellas',
    name: 'Lector de Huellas Biométrico',
    category: 'Biometría & Luces',
    badge: 'Sensación Táctil',
    rating: '4.9 (4.3k)',
    description: 'Simulador biométrico futurista. Mantén presionado el escáner con el dedo o mouse; un rayo láser escanea tu huella y libera el regalo.',
    previewGradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    accentColor: '#06b6d4',
    features: ['Sensor con pulso y halo neón', 'Efecto láser vertical en tiempo real', 'Contador de progreso 0-100%', 'Respuesta de sonido y háptica'],
    defaults: {
      title: 'Acceso Biométrico al Corazón',
      lockTitle: 'Mantén presionado el sensor con tu dedo para escanear',
      unlockMsg: '¡Identidad verificada: Dueña/o de mi corazón!',
      letterTitle: 'Acceso Concedido: Te Amo',
      letterBody: 'Solo tú tienes la huella digital que encaja exactamente en los latidos de mi corazón. Nadie más en el mundo tiene tu lugar.',
      photo: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Cybernetic Love'
    }
  },
  {
    id: 'latidos-de-luz',
    name: 'Monitor de Latidos de Corazón (ECG)',
    category: 'Biometría & Luces',
    badge: 'Electrocardiograma Neón',
    rating: '4.9 (3.2k)',
    description: 'Línea de pulso cardíaco en pantalla médica de neón que late suavemente y se acelera intensamente cuando tocas la pantalla.',
    previewGradient: 'from-rose-950 via-red-900 to-black',
    accentColor: '#f43f5e',
    features: ['Ondas ECG reactivas', 'Sonido realista de latidos (beep-beep)', 'Corazón que palpita con ritmo cardiaco', 'Aceleración al tocar'],
    defaults: {
      title: 'El Ritmo de Mi Corazón Cuando Te Veo',
      lockTitle: 'Pon tu mano en la pantalla para sincronizar nuestros latidos',
      unlockMsg: '¡Taquicardia de amor detectada!',
      letterTitle: 'Mi corazón late a tu compás',
      letterBody: 'Cada segundo, cada suspiro y cada latido lleva grabado tu nombre. Eres el motivo por el cual mi pulso se acelera de felicidad.',
      photo: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Heartbeat Rhythm'
    }
  },
  {
    id: 'spotify-amor',
    name: 'Reproductor Spotify / Vinilo Romance',
    category: 'Biometría & Luces',
    badge: 'Música & Disco',
    rating: '5.0 (6.7k)',
    description: 'Interfaz idéntica a un reproductor de música con disco de vinilo giratorio, carátula con su foto, barra de progreso y letra romántica sincronizada.',
    previewGradient: 'from-emerald-700 via-green-800 to-slate-900',
    accentColor: '#10b981',
    features: ['Disco de vinilo giratorio realista', 'Controles de Play/Pausa interactivos', 'Barra de tiempo de canción', 'Letra de canción deslizante'],
    defaults: {
      title: 'La Canción de Nuestra Historia',
      lockTitle: 'Dale Play para escuchar la melodía que me recuerda a ti',
      unlockMsg: '¡Reproduciendo nuestro tema favorito en bucle!',
      letterTitle: 'Eres mi canción favorita en repeat',
      letterBody: 'Hay canciones que me hacen recordar tu sonrisa, tus ojos y la forma en que iluminas todo. Esta melodía fue hecha para nosotros dos.',
      photo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Our Favorite Song'
    }
  },
  {
    id: 'net',
    name: 'Red de Conexión de Almas',
    category: 'Biometría & Luces',
    badge: 'Constelación Neural',
    rating: '4.7 (1.6k)',
    description: 'Nodos de luz interconectados como una red neuronal que viajan a través de la distancia hasta unir dos corazones en los extremos.',
    previewGradient: 'from-cyan-900 via-blue-950 to-purple-900',
    accentColor: '#38bdf8',
    features: ['Red de filamentos de luz', 'Conexión a larga distancia', 'Pulso sináptico de amor', 'Puntos interactivos'],
    defaults: {
      title: 'Conectados Sin Importar la Distancia',
      lockTitle: 'Toca los puntos para trazar la línea que nos une',
      unlockMsg: '¡Señal de amor al 100%!',
      letterTitle: 'Cero kilómetros en el corazón',
      letterBody: 'No importa la distancia física, el tiempo ni las pantallas. Nuestras almas están enlazadas por un hilo invisible e inquebrantable.',
      photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Synapse Connection'
    }
  },

  // --- 5. Juegos & Dinámicas ---
  {
    id: 'memorama',
    name: 'Memorama de Nuestros Recuerdos',
    category: 'Juegos & Dinámicas',
    badge: 'Juego Interactivo',
    rating: '4.9 (3.4k)',
    description: 'Mini-juego de buscar parejas de cartas con sus fotos y momentos felices. Al completar el tablero, se desbloquea la carta y la música.',
    previewGradient: 'from-violet-600 via-rose-500 to-amber-500',
    accentColor: '#8b5cf6',
    features: ['Cartas volteables en 3D', 'Contador de intentos y aciertos', 'Confeti de victoria al ganar', 'Totalmente personalizable con fotos'],
    defaults: {
      title: 'Encuentra las Parejas de Nuestro Amor',
      lockTitle: 'Voltea las cartas para encontrar cada recuerdo',
      unlockMsg: '¡Hiciste match con mi corazón!',
      letterTitle: 'Ganaste el juego y mi corazón entero',
      letterBody: 'Jugamos, reímos y superamos cada reto juntos. Eres mi mejor compañero/a de aventuras y mi mayor premio en esta vida.',
      photo: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Playful Love Waltz'
    }
  },
  {
    id: 'memori-corazon',
    name: 'Memorias en Corazón',
    category: 'Juegos & Dinámicas',
    badge: 'Mosaico de Amor',
    rating: '4.8 (2.1k)',
    description: 'Un rompecabezas en forma de corazón. Arrastra las piezas o tócalas para ensamblar la foto juntos y revelar el mensaje secreto.',
    previewGradient: 'from-rose-600 via-pink-700 to-red-800',
    accentColor: '#e11d48',
    features: ['Rompecabezas en silueta de corazón', 'Piezas magnéticas animadas', 'Revelación de foto final', 'Animación de unión perfecta'],
    defaults: {
      title: 'Las Piezas que Completan Mi Vida',
      lockTitle: 'Une las piezas para completar el corazón',
      unlockMsg: '¡Encajamos a la perfección!',
      letterTitle: 'Mi pieza que faltaba',
      letterBody: 'Antes de conocerte, sentía que faltaba algo en mi mundo. Llegaste tú y todo cobró sentido y armonía. Te amo profundamente.',
      photo: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Puzzle of Love'
    }
  },
  {
    id: 'laberinto',
    name: 'Laberinto hasta Tu Corazón',
    category: 'Juegos & Dinámicas',
    badge: 'Aventura de Amor',
    rating: '4.7 (1.9k)',
    description: 'Guía el pequeño corazón a través de los caminos del laberinto hasta llegar a la meta donde espera tu carta y regalo sorpresa.',
    previewGradient: 'from-teal-600 via-emerald-700 to-blue-800',
    accentColor: '#14b8a6',
    features: ['Laberinto dinámico navegable', 'Controles táctiles y de teclado', 'Rastro de corazones en el camino', 'Efecto de meta cumplida'],
    defaults: {
      title: 'Todos los Caminos Me Llevan a Ti',
      lockTitle: 'Encuentra el camino hacia mi corazón',
      unlockMsg: '¡Llegaste a tu verdadero hogar!',
      letterTitle: 'Siempre elegiré encontrarte',
      letterBody: 'Aunque la vida tenga mil caminos y curvas complejas, mi brújula siempre apuntará directamente hacia tu felicidad.',
      photo: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Journey of Two'
    }
  },
  {
    id: 'carrera-de-corazones',
    name: 'Carrera de Amor',
    category: 'Juegos & Dinámicas',
    badge: 'Divertido y Dinámico',
    rating: '4.8 (2.0k)',
    description: 'Pulsa rápidamente la pantalla para hacer que dos corazones corran por la pista de atletismo hasta cruzar la meta juntos de la mano.',
    previewGradient: 'from-pink-600 via-rose-500 to-orange-500',
    accentColor: '#f43f5e',
    features: ['Toque rápido para acelerar', 'Pista con meta romántica', 'Medalla de amor virtual', 'Efecto de victoria conjunta'],
    defaults: {
      title: 'Corriendo Juntos Hacia el Futuro',
      lockTitle: 'Presiona rápido para cruzar la meta juntos',
      unlockMsg: '¡Ganamos el primer lugar en amor!',
      letterTitle: 'Nuestro mejor récord es amarnos',
      letterBody: 'Correr a tu lado hace que el camino sea ligero, alegre y emocionante. No hay meta que no podamos alcanzar juntos.',
      photo: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Victory of Love'
    }
  },
  {
    id: 'heart-shooter',
    name: 'Flechazo de Cupido',
    category: 'Juegos & Dinámicas',
    badge: 'Tiro al Blanco',
    rating: '4.8 (2.2k)',
    description: 'Apunta el arco de Cupido y dispara la flecha al centro de la diana en forma de corazón para liberar la lluvia de amor y la dedicatoria.',
    previewGradient: 'from-rose-500 via-red-600 to-amber-500',
    accentColor: '#e11d48',
    features: ['Flecha de Cupido animada', 'Diana de corazón con puntaje', 'Efecto sonoro de diana acertada', 'Explosión de chispas'],
    defaults: {
      title: 'El Flechazo Más Certero',
      lockTitle: 'Apunta y dispara la flecha al corazón',
      unlockMsg: '¡Directo al centro de mi alma!',
      letterTitle: 'Flechado/a para toda la vida',
      letterBody: 'Desde el primer instante acertaste en el centro de mi corazón con tu bondad, tu ternura y esa luz única que tienes.',
      photo: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Cupids Arrow Chime'
    }
  },
  {
    id: 'corazon-revienta',
    name: 'Corazón Sorpresa Explosivo',
    category: 'Juegos & Dinámicas',
    badge: 'Piñata Sorpresa',
    rating: '4.9 (3.7k)',
    description: 'Un corazón gigante que se infla y palpita con cada toque hasta estallar en una espectacular fiesta de confeti, fotos y cartas.',
    previewGradient: 'from-pink-500 via-red-500 to-yellow-400',
    accentColor: '#ec4899',
    features: ['Corazón elástico que crece al tocar', 'Efecto piñata explosiva', 'Lluvia de mensajes de amor', 'Sonido de ¡Pop! festivo'],
    defaults: {
      title: 'Un Amor que No Cabe en el Pecho',
      lockTitle: 'Toca el corazón varias veces para que estalle de alegría',
      unlockMsg: '¡Mi amor por ti explotó de felicidad!',
      letterTitle: 'Un estallido de emociones puras',
      letterBody: 'Mi amor por ti es tan inmenso que simplemente no puede contenerse. Gracias por hacerme inmensamente feliz.',
      photo: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Heartburst Celebration'
    }
  },
  {
    id: 'bubbles',
    name: 'Burbujas Flotantes de Amor',
    category: 'Juegos & Dinámicas',
    badge: 'Relajante & Mágico',
    rating: '4.7 (1.9k)',
    description: 'Burbujas de jabón iridiscentes flotando por la pantalla. Explótalas una a una para revelar fotos ocultas y palabras de ternura.',
    previewGradient: 'from-cyan-500 via-sky-600 to-pink-500',
    accentColor: '#06b6d4',
    features: ['Físicas de burbujas flotantes', 'Efecto de estallido con sonido pop', 'Mensajes y fotos en el interior', 'Fondo relajante'],
    defaults: {
      title: 'Burbujas de Amor Inolvidables',
      lockTitle: 'Revienta las burbujas para descubrir los secretos',
      unlockMsg: '¡Todas las burbujas liberaron sus recuerdos!',
      letterTitle: 'Momentos tan ligeros y mágicos',
      letterBody: 'A tu lado, el tiempo flota sin peso alguno. Cada instante es suave, brillante y lleno de paz.',
      photo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Bubble Chimes'
    }
  },

  // --- 6. Especiales & Regalos ---
  {
    id: 'hotwheels',
    name: 'Ramo de Hot Wheels',
    category: 'Especiales & Regalos',
    badge: 'Tendencia Viral',
    rating: '5.0 (7.8k)',
    description: 'La famosa tendencia viral: pista de carreras con coches de colección que corren por un circuito hasta formar un ramo de autos con regalos.',
    previewGradient: 'from-red-600 via-orange-600 to-yellow-500',
    accentColor: '#ef4444',
    features: ['Pista de carreras interactiva', 'Autos de colección animados', 'Botón de turbo nitro', 'Ramo de autitos con flores'],
    defaults: {
      title: 'Acelerando Mi Corazón a 1000 km/h',
      lockTitle: 'Presiona el botón de encendido para arrancar',
      unlockMsg: '¡Vuelta rápida completada: Mi mayor premio eres tú!',
      letterTitle: 'Para Mi Copiloto Favorito/a',
      letterBody: 'La vida es como una pista llena de curvas y emociones, y no existe nadie en el mundo con quien prefiera viajar en este camino que contigo.',
      photo: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Nitro Heartbeats'
    }
  },
  {
    id: 'regalos-cumple',
    name: 'Caja de Regalo con Moño',
    category: 'Especiales & Regalos',
    badge: 'Cumpleaños & Aniversario',
    rating: '4.9 (4.1k)',
    description: 'Caja de regalo envuelta con papel brillante y moño de seda. Tira de la cinta para abrir la tapa, saltar serpentinas y ver tu sorpresa.',
    previewGradient: 'from-pink-600 via-purple-600 to-amber-500',
    accentColor: '#ec4899',
    features: ['Cinta y moño desatables en 3D', 'Tapa de caja que salta con confeti', 'Sonido festivo de sorpresa', 'Tarjeta de regalo desplegable'],
    defaults: {
      title: '¡Feliz Día, Amor de Mi Vida!',
      lockTitle: 'Tira del lazo dorado para abrir tu regalo',
      unlockMsg: '¡Sorpresa preparada con todo mi cariño!',
      letterTitle: 'El mejor regalo de mi vida eres tú',
      letterBody: 'Hoy celebramos tu existencia, tu alegría y cada instante compartido. Deseo que todos tus anhelos se cumplan y poder acompañarte siempre.',
      photo: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Birthday Celebration Waltz'
    }
  },
  {
    id: 'el-camino-juntos',
    name: 'Nuestra Línea de Tiempo (El Camino)',
    category: 'Especiales & Regalos',
    badge: 'Historia de Amor',
    rating: '4.9 (3.3k)',
    description: 'Un sendero interactivo que recorre sus momentos cumbre: el día en que se conocieron, el primer beso, viajes inolvidables y promesas de futuro.',
    previewGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    accentColor: '#059669',
    features: ['Línea de tiempo cronológica', 'Hitos con fotos y fechas', 'Efecto de pasos en el sendero', 'Destino final con carta'],
    defaults: {
      title: 'El Maravilloso Camino Que Hemos Construido',
      lockTitle: 'Avanza por el sendero de nuestra historia',
      unlockMsg: '¡Y lo mejor de nuestra historia aún está por escribirse!',
      letterTitle: 'Paso a paso, siempre a tu lado',
      letterBody: 'Mirar hacia atrás y ver todo lo que hemos superado y disfrutado juntos me llena de orgullo y gratitud. Vamos por mil aventuras más.',
      photo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Timeline Journey'
    }
  },
  {
    id: 'tres-corazones',
    name: 'Tres Deseos de Amor',
    category: 'Especiales & Regalos',
    badge: 'Tres Promesas',
    rating: '4.8 (2.1k)',
    description: 'Tres corazones de cristal flotantes. Al tocar cada uno se ilumina con una promesa sagrada de amor hasta revelar la carta final.',
    previewGradient: 'from-rose-500 via-pink-600 to-indigo-700',
    accentColor: '#f43f5e',
    features: ['3 corazones de cristal', 'Promesas interactivas iluminadas', 'Halo de luz ascendente', 'Armonía de tres notas'],
    defaults: {
      title: 'Tres Promesas Que Te Hago Hoy',
      lockTitle: 'Enciende los tres corazones de cristal',
      unlockMsg: '1. Cuidarte • 2. Escucharte • 3. Amarte siempre',
      letterTitle: 'Mis tres votos hacia ti',
      letterBody: 'Prometo estar en tus días difíciles, celebrar tus mayores victorias y recordarte cada día lo valiosa y amada que eres.',
      photo: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Three Crystal Hearts'
    }
  },
  {
    id: 'heart',
    name: 'Latido del Corazón Neón',
    category: 'Especiales & Regalos',
    badge: 'Estilo Neón Cyber',
    rating: '4.7 (1.8k)',
    description: 'Silueta de corazón en tubos de neón rosa y azul que se enciende con un chasquido eléctrico iluminando la noche oscura con tu foto.',
    previewGradient: 'from-pink-600 via-purple-700 to-black',
    accentColor: '#ec4899',
    features: ['Luz de neón con parpadeo realista', 'Sonido de interruptor eléctrico', 'Glow nocturno envolvente', 'Foto estilo polaroid neón'],
    defaults: {
      title: 'Brillando en la Oscuridad Por Ti',
      lockTitle: 'Enciende el letrero de neón de nuestro amor',
      unlockMsg: '¡Luz encendida al 100%!',
      letterTitle: 'Nuestra luz nunca se apaga',
      letterBody: 'Incluso en la noche más oscura, el recuerdo de tu mirada ilumina mi camino y disipa cualquier miedo.',
      photo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Neon Romance Glow'
    }
  },
  {
    id: 'dedicate',
    name: 'Dedicatoria Minimalista Elegante',
    category: 'Especiales & Regalos',
    badge: 'Limpio y Puro',
    rating: '4.8 (2.6k)',
    description: 'Diseño minimalista con tipografía de alta costura, animaciones suaves y una presentación sobria y madura para parejas sofisticadas.',
    previewGradient: 'from-slate-800 via-zinc-900 to-stone-900',
    accentColor: '#e2e8f0',
    features: ['Tipografía editorial de lujo', 'Fondo limpio y espaciado áureo', 'Animación de fundido suave', 'Elegancia absoluta'],
    defaults: {
      title: 'Elegancia, Silencio y Amor Puro',
      lockTitle: 'Desliza suavemente hacia arriba para descubrir',
      unlockMsg: 'La sencillez de amarte cada día.',
      letterTitle: 'Lo esencial es invisible a los ojos',
      letterBody: 'Sin artificios, sin adornos excesivos. Solo nosotros dos, nuestras miradas cómplices y la certeza de haber encontrado mi lugar en el mundo.',
      photo: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Minimal Acoustic Piano'
    }
  },
  {
    id: 'little-girl',
    name: 'Especial Princesa & Dulzura',
    category: 'Especiales & Regalos',
    badge: 'Tierno & Adorable',
    rating: '4.9 (2.9k)',
    description: 'Estilo tierno de cuento infantil con mariposas pastel, estrellitas brillantes y un ambiente acogedor para sorprender a tu persona favorita.',
    previewGradient: 'from-pink-400 via-rose-300 to-amber-200',
    accentColor: '#f472b6',
    features: ['Mariposas flotantes en tonos pastel', 'Estrellitas chispeantes', 'Nubes de algodón de azúcar', 'Ternura infinita'],
    defaults: {
      title: 'Para la Niña de Mis Ojos',
      lockTitle: 'Toca las mariposas para que dancen a tu alrededor',
      unlockMsg: '¡Eres la princesa de mi cuento de hadas!',
      letterTitle: 'Mi persona favorita en el universo',
      letterBody: 'Tu inocencia, tu dulzura y tu corazón noble hacen que el mundo sea un lugar mil veces más hermoso. Siempre cuidaré de ti.',
      photo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Lullaby of Tender Hearts'
    }
  },
  {
    id: 'halloween',
    name: 'Noche Encantada Romántica',
    category: 'Especiales & Regalos',
    badge: 'Amor de Ultratumba',
    rating: '4.8 (2.7k)',
    description: 'Para parejas góticas y amantes del misterio: calabazas iluminadas, murciélagos amigables y una promesa de amarse hasta después de la muerte.',
    previewGradient: 'from-orange-700 via-purple-950 to-black',
    accentColor: '#f97316',
    features: ['Velas parpadeantes misteriosas', 'Luna llena con murciélagos de corazones', 'Poción de amor mágica', 'Promesa hasta el más allá'],
    defaults: {
      title: 'Hasta Que la Eternidad Nos Una',
      lockTitle: 'Enciende la vela encantada de nuestro hechizo',
      unlockMsg: '¡Hechizados para siempre!',
      letterTitle: 'Un amor que desafía la eternidad',
      letterBody: 'Ni los fantasmas, ni la noche oscura, ni el fin de los tiempos podrán separar lo que nuestras almas unieron con tanta magia.',
      photo: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      customAudio: null,
      musicTitle: 'Enchanted Spooky Waltz'
    }
  }
];
