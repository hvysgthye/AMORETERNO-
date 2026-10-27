// Original art direction for every gift. No imagery or code from reference sites.
// id, material, accent, luminous ink, background, editorial line, illustration.
const editions = [
  ['candado', 'jewel', '#e7bd78', '#fff0cc', '#24181d', 'La llave siempre fuiste tú.', 'lock'],
  ['puertas-del-corazon', 'architecture', '#d5ac91', '#ffe8dd', '#241523', 'Al otro lado, nuestra historia.', 'doors'],
  ['carta', 'stationery', '#e6b5a0', '#fff0dc', '#321c26', 'Lo que siento, de mi puño y alma.', 'envelope'],
  ['propose', 'jewel', '#d4c6f2', '#f5efff', '#231a32', 'De todos mis sí, tú.', 'ring'],
  ['libro-amor', 'stationery', '#d4ae74', '#fff0d0', '#302014', 'Todavía nos quedan tantas páginas.', 'book'],
  ['chocolate', 'jewel', '#e4a889', '#ffe8d0', '#32191e', 'La parte más dulce de mis días.', 'chocolate'],
  ['galaxy', 'cosmos', '#d5b7f2', '#f2e7ff', '#18132d', 'Un universo, un encuentro: tú.', 'planet'],
  ['galaxia-infinita', 'cosmos', '#c1b7f5', '#ebe8ff', '#14172f', 'Nos encontramos entre infinitos.', 'planet'],
  ['universe', 'cosmos', '#99d5e0', '#e4faff', '#10232e', 'Nuestro lugar entre las estrellas.', 'constellation'],
  ['galaxy-gallery', 'cosmos', '#ecb5d2', '#fff0f8', '#28192f', 'Cada recuerdo, una estrella más.', 'photos'],
  ['galaxy-gallery-flores-amarillas', 'cosmos', '#ebd386', '#fff6cd', '#252139', 'Hasta el universo florece por ti.', 'flower'],
  ['flores-moradas', 'botanical', '#c8b0e7', '#f2eaff', '#211d31', 'Lo nuestro tiene su propia primavera.', 'bouquet'],
  ['flor-amarilla', 'botanical', '#edd181', '#fff7d4', '#283024', 'Un poquito de sol para tu vida.', 'flower'],
  ['flor-amarilla-dia', 'botanical', '#d9d59a', '#fffae1', '#24372c', 'Tú haces que todo vuelva a florecer.', 'flower'],
  ['flor-galaxy', 'botanical', '#bcb9f4', '#f0edff', '#211a37', 'Una flor nacida de las estrellas.', 'flower'],
  ['arbol', 'botanical', '#a4c9a4', '#e9f7d9', '#1b2d27', 'Raíces en el alma. Ramas al futuro.', 'tree'],
  ['lector-huellas', 'light', '#8edbd0', '#ddfff7', '#102b2b', 'No hay nadie como tú.', 'fingerprint'],
  ['latidos-de-luz', 'light', '#f0adbb', '#ffedf1', '#2c1725', 'Mi manera favorita de estar vivo.', 'pulse'],
  ['spotify-amor', 'retro', '#a8d6be', '#e4fff0', '#192b26', 'Esta canción siempre va a ser tuya.', 'vinyl'],
  ['net', 'light', '#a6cce8', '#e7f6ff', '#162638', 'Hay conexiones que no se explican.', 'constellation'],
  ['memorama', 'play', '#d1b8ed', '#f4ebff', '#2a203a', 'Volvería a encontrarte, una y otra vez.', 'cards'],
  ['memori-corazon', 'play', '#e9b4cc', '#fff0f6', '#321d30', 'Estamos hechos de pequeños recuerdos.', 'photos'],
  ['laberinto', 'play', '#b9ceb0', '#f2ffe9', '#202e28', 'Todos mis caminos llegan a ti.', 'maze'],
  ['carrera-de-corazones', 'play', '#efb8a2', '#fff0e0', '#322220', 'La mejor parte del viaje es contigo.', 'road'],
  ['heart-shooter', 'play', '#ddb0c7', '#ffedf7', '#321c32', 'Acertaste justo en mi corazón.', 'arrow'],
  ['corazon-revienta', 'play', '#f2b5ba', '#fff0f0', '#361c29', 'Hay cosas que ya no caben en el pecho.', 'balloon'],
  ['bubbles', 'light', '#9ed8e5', '#e5fbff', '#142c39', 'La felicidad se parece a esto.', 'bubbles'],
  ['hotwheels', 'retro', '#e8b78a', '#fff0d7', '#30231e', 'Tú y yo, sin poner el freno.', 'car'],
  ['regalos-cumple', 'jewel', '#e5b9ce', '#fff0fa', '#2f1c33', 'Hoy celebramos que existes.', 'gift'],
  ['el-camino-juntos', 'stationery', '#c6b68c', '#fff4d5', '#29271f', 'Lo bonito es seguir caminando.', 'road'],
  ['tres-corazones', 'jewel', '#ebc6a5', '#fff2df', '#33251e', 'Pedí tres deseos. En los tres estabas.', 'hearts'],
  ['heart', 'light', '#edaccb', '#ffeaf5', '#2f162e', 'Esta luz lleva tu nombre.', 'heart'],
  ['dedicate', 'stationery', '#d9c7a0', '#fff7e4', '#29251f', 'Sin adornos. Con todo el corazón.', 'monogram'],
  ['little-girl', 'jewel', '#e1bcdc', '#fff0ff', '#302239', 'Tu magia hace más bonito el mundo.', 'crown'],
  ['halloween', 'architecture', '#e6b58a', '#ffedce', '#292035', 'Hasta mis fantasmas te quieren.', 'moon'],
  ['cassette-retro', 'retro', '#ddb29d', '#ffeddd', '#302725', 'Lado A: tú. Lado B: también tú.', 'cassette'],
  ['star-map', 'cosmos', '#bacde4', '#edf6ff', '#192738', 'El cielo guardó aquel instante.', 'constellation'],
  ['polaroid-album', 'stationery', '#d7bf9c', '#fff4e4', '#302b26', 'Instantes pequeños. Nuestro mundo entero.', 'photos'],
  ['mensaje-botella', 'ocean', '#a0d5d1', '#e8fffa', '#163438', 'Aunque cambie la marea, siempre tú.', 'bottle'],
  ['girasoles-sunset', 'botanical', '#e8be7c', '#fff1c9', '#393027', 'Siempre voy a buscar tu luz.', 'flower'],
  ['boarding-pass', 'stationery', '#aac8dc', '#e9f7ff', '#24303a', 'Destino: todos nuestros sueños.', 'ticket'],
  ['scratch-card', 'jewel', '#d7c18f', '#fff4d5', '#312b23', 'La suerte más bonita fue conocerte.', 'ticket'],
  ['gameboy-8bit', 'retro', '#bbcfab', '#eeffe1', '#28312b', 'Dos jugadores. Una misma aventura.', 'gameboy'],
  ['origami-grulla', 'stationery', '#e0b9b2', '#fff0e9', '#36272c', 'Un deseo que aprendió a volar.', 'crane'],
  ['reloj-arena', 'jewel', '#d8c0a1', '#fff0df', '#29262e', 'Que el tiempo nos encuentre juntos.', 'hourglass'],
];

export const KEEPSAKE_DESIGNS = Object.fromEntries(editions.map(([id, family, accent, ink, background, quote, motif], index) => [id, {
  id, family, accent, ink, background, quote, motif, edition: String(index + 1).padStart(2, '0'),
  rotation: (index % 5 - 2) * 5,
}]));

export function getKeepsakeDesign(id) {
  return KEEPSAKE_DESIGNS[id] || KEEPSAKE_DESIGNS.candado;
}
