

document.body.style.backgroundColor = '#222'

// a_a: Elemento do canvas e sua var de contexto
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// a_b: Dimensões do canvas
canvas.width = 1200
canvas.height = 600

// e_b: Sendo dois cenários, eles são inseridos num array
let landscapes = [] 

// f_h: Array que guardará os inimigos
let enemies = []

// h_c: Onde os pisos são armazenados
let scenarioTerrain = new Image()
scenarioTerrain.src = '../assets//surfaces/mario_world_surface.png'
let floors = []

// i_c: Onde o objeto "colinas" são armazenados
let hill = new Image()
hill.src = '../assets/obstacles/hill_small_tr.png'
let hills = []

// j_a: Onde as plataformas são armazenadas
let platforms = []

// k_a: Onde os canos são armazenados
let purplePipe = new Image()
purplePipe.src = '../assets/obstacles/purple_pipe_tr.png'
let pipes = []

// l_a: Onde os tijolos são armazenados
let brick = new Image()
brick.src = '../assets/platforms/happy_brick_tr.gif'
let bricks = []

// Utilidade: Tornar posições dos conteúdos do canvas de forma aleatória
function integersBetween(min, max, float = false) {
    if (float) {
      return Math.random() * (max - min + 1) + min
    }
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// q_a: Os conteúdos que são array (+ de 1 item) são esvaziados, pois essa função reseta o cenário caso o jogador caia
function dataWipe() {
  landscapes = [] 
  enemies = []
  floors = []
  hills = []
  platforms = []
  pipes = []
  bricks = []
}

function playerSetup() {
  // q_b: Antes o jogador era criado no escopo global, mas para resetar o jogo, ele precisa ser recriado
  // q_b: Então para evitar erros, ele é criado no escopo desta função
  player = new Player()
}

// e_c: Os cenários são configurados nesta função, passado ao array criado no item anterior
function landscapeSetup({contentBox}) {
  let background = new Image()
  background.src = '../assets/landscapes/background.png'

  let backgroundHills = new Image()
  backgroundHills.src = '../assets/landscapes/hills.png'
  
  let mainBackground = new Landscape(
    {
      image: background,
      x: 0,
      y: 0,
      width: background.width,
      height: background.height
    })
  contentBox.push(mainBackground)
  
  let hillsBackground = new Landscape(
    {
      image: backgroundHills,
      x: 0,
      y: 0,
      width: backgroundHills.width,
      height: backgroundHills.height
    })
  contentBox.push(hillsBackground)
}

// f_i
function enemySetup({contentBox, amount}) {
  // O primeiro inimigo nasce numa posição específica (first é true)
  contentBox.push(new Foe({first: true}))

  // Do inimigo 2 adiante, estes pegam a posição do inimigo 1 e aumentam p/ algo entre 20 a 700 p/ ->
  for (let i = 1; i < amount; i++) {
    contentBox.push(new Foe({first: false, x: contentBox[i - 1].x + integersBetween(20, 700)}))
  }
}

// h_d
function surfaceSetup({contentBox, objectImage, amount}) {
  // O primeiro piso possui uma posição fixa X e Y (first: true)
  let canvasBottom = 540
  let firstFloor = new Thing(
    {image: objectImage, x: 0, y: canvasBottom, width: objectImage.width, height: objectImage.height}
  )
  contentBox.push(firstFloor)
  
  // A primeira imagem têm X=499, e as seguintes pegam esse valor, somados com uma "lacuna" entre 80 a 140
  // Isso significa que cada X do piso anterior é usado como referência pelo posterior + essa "lacuna"
  for (let i = 1; i <= amount; i++) {
    let gapWidthMin = 80
    let gapWidthMax = 140
    let newFloor = new Thing(
      {
        image: objectImage, 
        x: contentBox[i - 1].x + integersBetween(objectImage.width + gapWidthMin, objectImage.width + gapWidthMax, true),
        y: canvasBottom, width: objectImage.width, height: objectImage.height
      }
    )
    contentBox.push(newFloor)
  }
}

// i_d & k_b & l_b
function objectSetup({contentBox, objectType, objectImage, amount}) {
  
  // i_d
  if (objectType === 'hill') {
    // A posição da primeira colina serve de referência p/ as seguintes
    let firstHill = new Thing(
      { image: objectImage,
        x: integersBetween(500, 700, true),
        y: integersBetween(445, 470, true),
        width: objectImage.width * integersBetween(2, 4, true), 
        height: objectImage.height * integersBetween(2.7, 3.3, true)
      }
    )
    contentBox.push(firstHill)
  
  // As colinas seguintes
  for (let i = 1; i <= amount; i++) {
    let newHill = new Thing(
      { 
        image: objectImage, 
        x: contentBox[i - 1].x + integersBetween(700, 1400, true),
        y: integersBetween(445, 470, true), 
        width: objectImage.width * integersBetween(2, 4, true),
        height: objectImage.height * integersBetween(2.7, 4, true)
      }
    )
    contentBox.push(newHill)
  }}
  
  // k_b
  else if (objectType === 'purple_pipe') {

    let scaleForWidth = integersBetween(1.5, 2.5, false)
    let scaleForHeight = integersBetween(1.7, 2.7, false)
    
    // Desenhar o objeto no canvas: canos
    let firstPipe = new Thing(
      {
        image: objectImage,
        x: integersBetween(700, 1000, true),
        y: integersBetween(480, 500, true),
        width: objectImage.width,
        height: objectImage.height
      })
    contentBox.push(firstPipe)
  
    for (let i = 1; i <= amount; i++) {
      let newPipe = new Thing(
        {
          image: objectImage,
          x: contentBox[i - 1].x + integersBetween(700, 1000, true),
          y: integersBetween(480, 500, true),
          width: objectImage.width,
          height: objectImage.height
        })
      contentBox.push(newPipe)
    }
  }
  
  // l_b
  else if (objectType === 'brick') {
    let scaleForWidth = integersBetween(1.7, 2.2, true)
    let scaleForHeight = integersBetween(2, 2.5, true)

    // Desenhar o objeto no canvas: tijolo
    let firstBrick = new Thing(
      {
        image: objectImage,
        x: integersBetween(100, 1100),
        y: integersBetween(200, 300),
        width: objectImage.width * scaleForWidth,
        height: objectImage.height * scaleForHeight
      })
    contentBox.push(firstBrick)

    for (let i = 1; i <= amount; i++) {
      let newBrick = new Thing(
        {
          image: objectImage,
          x: contentBox[i - 1].x + integersBetween(500, 1000),
          y: integersBetween(200, 300),
          width: objectImage.width * scaleForWidth,
          height: objectImage.height * scaleForHeight
        })
      contentBox.push(newBrick)
    }
  }
}

// j_b
function platformSetup({contentBox, amount}) {

  // Desenhar o objeto no canvas: plataforma
  let stonePlatform10 = new Image()
  let stonePlatform9 = new Image()
  let stonePlatform8 = new Image()
  let stonePlatform7 = new Image()
  let stonePlatform6 = new Image()
  let stonePlatform5 = new Image()
  let stonePlatform4 = new Image()
  stonePlatform10.src = '../assets/platforms/stone_platform10_tr.gif'
  stonePlatform9.src = '../assets/platforms/stone_platform9_tr.gif'
  stonePlatform8.src = '../assets/platforms/stone_platform8_tr.gif'
  stonePlatform7.src = '../assets/platforms/stone_platform7_tr.gif'
  stonePlatform6.src = '../assets/platforms/stone_platform6_tr.gif'
  stonePlatform5.src = '../assets/platforms/stone_platform5_tr.gif'
  stonePlatform4.src = '../assets/platforms/stone_platform4_tr.gif'
  
  let platformTypes = [
    stonePlatform10, stonePlatform9, stonePlatform8, stonePlatform7, stonePlatform6, stonePlatform5, stonePlatform4
  ]
  
  // Editar dimensão original da imagem
  let scale = 1.5
  
  // A plataforma é posta no canvas de forma aleatória
  let chosenPlatform = platformTypes[integersBetween(0, platformTypes.length - 1)]

  let firstPlatform = new Thing(
    { 
      image: chosenPlatform, 
      x: integersBetween(700, 1100, true),
      y: integersBetween(250, 350, true),
      width: chosenPlatform.width * scale, 
      height: chosenPlatform.height * scale
    }
  )
  contentBox.push(firstPlatform)

  for (let i = 1; i <= amount; i++) {
    let chosenPlatform = platformTypes[integersBetween(0, platformTypes.length - 1)]
    let newPlatform = new Thing(
      { 
        image: chosenPlatform, 
        x: contentBox[i - 1].x + integersBetween(700, 1200),
        y: integersBetween(250, 350, true),
        width: chosenPlatform.width,
        height: chosenPlatform.height
      }
    )
    contentBox.push(newPlatform)
  }
}

function canvasInsert({content, contentBox}) {
  // e_e: Função usada em "animate" p/ desenhar os cenários constantemente no canvas
  if(content === 'landscape') {
    contentBox.forEach(landscape => {
      landscape.draw()
    })
  }
  
  // f_j: Função usada em "animate" p/ desenhar os inimigos constantemente no canvas
  if (content === 'enemy') {
    contentBox.forEach(enemy => {
      // f_f
      enemy.draw()
      // f_g
      enemy.frameAdmin()
      // g_b
      enemy.horizontalOffset()
      // g_c
      enemy.verticalOffset()
      // g_f
      if(enemyClock.counter % enemyClock.modular === 0) {
        // g_d
        enemy.move()
        // g_e
        enemy.keepOnScreen()
        // g_f
        enemyClock.counter = 0
      }
    })
  }

  // h_e: Função usada em "animate" p/ desenhar os pisos constantemente no canvas
  if (content === 'floor') {
    contentBox.forEach(floor => {
      // h_b
      floor.draw()
    })
  }

  // i_e: Função usada em "animate" p/ desenhar as colinas constantemente no canvas
  if (content === 'object_hill') {
    contentBox.forEach(hill => {
      // i_b
      hill.draw()
    })
  }

  // j_c: Função usada em "animate" p/ desenhar as plataformas constantemente no canvas
  if (content === 'object_platform') {
    contentBox.forEach(platform => {
      platform.draw()
    })
  }

  // k_c: Função usada em "animate" p/ desenhar os canos constantemente no canvas
  if (content === 'object_purple_pipe') {
    contentBox.forEach(purplePipe => {
      purplePipe.draw()
    })
  }

  // l_c: Função usada em "animate" p/ desenhar os tijologs constantemente no canvas
  if (content === 'object_brick') {
    contentBox.forEach(brick => {
      brick.draw()
    })
  }
}

function interaction({reference, against}) {
  // m_a: collisionBottom
  // n_a: collisionHorizontal
  // o_b: landscapeMotion
  if (against === 'landscape') {
    reference.landscapeMotion({obstacle: landscapes, byValue: 2})
  } else if (against === 'platform') {
    reference.landscapeMotion({obstacle: platforms, byValue: 5}) // o_b
    reference.collisionBottom({obstacle: platforms}) // m_a
    reference.collisionHorizontal({obstacle: platforms, reboundBy: 5}) // n_a
  } else if (against === 'hill') {
    reference.landscapeMotion({obstacle: hills, byValue: 5}) // o_b
    reference.collisionBottom({obstacle: hills}) // m_a
    reference.collisionHorizontal({obstacle: hills, reboundBy: 5}) // n_a
  } else if (against === 'purple_pipe') {
    reference.landscapeMotion({obstacle: pipes, byValue: 5}) // o_b
    reference.collisionBottom({obstacle: pipes}) // m_a
    reference.collisionHorizontal({obstacle: pipes, reboundBy: 5}) // n_a
  } else if (against === 'terrain') {
    reference.landscapeMotion({obstacle: floors, byValue: 5}) // o_b
    reference.collisionBottom({obstacle: floors}) // m_a
  } else if (against === 'bricks') {
    reference.landscapeMotion({obstacle: bricks, byValue: 5}) // o_b
    reference.collisionBottom({obstacle: bricks}) // m_a
    reference.collisionHorizontal({obstacle: bricks, reboundBy: 5}) // n_a
  } else if (against === 'enemy') {
    reference.landscapeMotion({obstacle: enemies, byValue: 5}) // o_b
    reference.collisionBottom({obstacle: enemies}) // m_a
    reference.collisionHorizontal({obstacle: enemies, reboundBy: 5}) // n_a
  }
  
  // p_c: Condição que congela o jogador ao alcançar certa posição "X". Todos os conteúdos devem ser verificados
  else if (against === 'scenario_outset') {
    reference.landscapeMotion({obstacle: landscapes, byValue: -2})
    reference.landscapeMotion({obstacle: platforms, byValue: -5})
    reference.landscapeMotion({obstacle: hills, byValue: -5})
    reference.landscapeMotion({obstacle: pipes, byValue: -5})
    reference.landscapeMotion({obstacle: floors, byValue: -5})
    reference.landscapeMotion({obstacle: bricks, byValue: -5})
    reference.landscapeMotion({obstacle: enemies, byValue: -5})
  }
}

function init() {
  // q_a: Quando o jogador cai no fosso, os conteúdos são limpados e recriados na ordem dentro desta função 
  dataWipe()
  // q_b: Criação do jogador
  playerSetup()
  // e_d: Os cenários criados são chamados nesta função, p/ uso único (não deve ser usado na função "animate")
  landscapeSetup({contentBox: landscapes})
  // f_i: Os inimigos criados são chamados nesta função, p/ uso único (não deve ser usado na função "animate")
  enemySetup({contentBox: enemies, amount: 50})
  // h_d: Os pisos criados são chamados nesta função, p/ uso único (não deve ser usado na função "animate")
  surfaceSetup({contentBox: floors, objectImage: scenarioTerrain, amount: 50})
  // i_d: As colinas criadas são chamadas nesta função, p/ uso único (não deve ser usado na função "animate")
  objectSetup({contentBox: hills, objectType: 'hill', objectImage: hill, amount: 50})
  // j_b: As plataformas criadas são chamadas nesta função, p/ uso único (não deve ser usado na função "animate")
  platformSetup({contentBox: platforms, amount: 50})
  // k_b: Os canos criados são chamados nesta função, p/ uso único (não deve ser usado na função "animate")
  objectSetup({contentBox: pipes, objectType: 'purple_pipe', objectImage: purplePipe, amount: 50})
  // l_b: Os tijolos criados são chamados nesta função, p/ uso único (não deve ser usado na função "animate")
  objectSetup({contentBox: bricks, objectType: 'brick', objectImage: brick, amount: 50})
}

function animate() {
  
  // a_c: Configuração inicial (descartável) p/ preencher o canvas (substituída por imagens de fundo)
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, innerWidth, innerHeight)
  
  // g_f
  enemyClock.counter++

  let hint = `A ordem dos conteúdos importa (ex: "enemy" passa por detrás de todos os conteúdos, por vir antes)`

  // e_e: Os cenários são desenhados constatemente no canvas
  canvasInsert({content: 'landscape', contentBox: landscapes})

  // f_j: Os inimigos são desenhados constatemente no canvas
  canvasInsert({content: 'enemy', contentBox: enemies})

  // i_e: As colinas são desenhadas constatemente no canvas
  canvasInsert({content: 'object_hill', contentBox: hills})
  
  // h_e: Os pisos são desenhados constatemente no canvas
  canvasInsert({content: 'floor', contentBox: floors})

  // l_c: Os tijologs são desenhadas constatemente no canvas
  canvasInsert({content: 'object_brick', contentBox: bricks})

  // k_c: Os canos são desenhados constatemente no canvas (depois de 'enemy' = inimigo passa atrás)
  canvasInsert({content: 'object_purple_pipe', contentBox: pipes})
  
  // j_c: As plataformas são desenhadas constatemente no canvas (depois de 'enemy' = inimigo passa atrás)
  canvasInsert({content: 'object_platform', contentBox: platforms})
  
  // b_d & b_e: Jogador desenhado no canvas + controle de sprites
  player.draw()
  player.frameAdmin()

  let test = `
    c_h: Teste p/ descobrir (tentativa e erro) o ajuste certo de cada imagem em seus sprites
    let testSprite = new Image()
    testSprite.src = '../assets/players/teste.png'
    let width = [0, 172, 367, 572]
    let widthDistance = [171, 193, 204, 207]
    ctx.drawImage(testSprite, width[3], 0, widthDistance[3], 175, 400, 100, 300, 300)
    `

  // c_c & c_d & c_e: [movimento horizontal++, movimento vertical++, whereX=]
  player.horizontalOffset()
  player.verticalOffset()
  player.pressedRightOrLeft(5)

  // d_a: Quanto maior o valor, mais rápido o jogador cai após o salto (pula menos)
  player.fallDown({byValue: 1})
  
  // m_a n_a o_b: Essa função é uma síntese das três funções numeradas aqui
  interaction({reference: player, against: 'landscape'})
  interaction({reference: player, against: 'platform'})
  interaction({reference: player, against: 'hill'})
  interaction({reference: player, against: 'purple_pipe'})
  interaction({reference: player, against: 'terrain'})
  interaction({reference: player, against: 'bricks'})
  interaction({reference: player, against: 'enemy'})

  // o_b: Cada objeto move seus atributos "X" pelo "par2"
  let o_b = `
    player.landscapeMotion({obstacle: landscapes, byValue: 2})
    player.landscapeMotion({obstacle: hills, byValue: 5})
    player.landscapeMotion({obstacle: bricks, byValue: 5})
    player.landscapeMotion({obstacle: platforms, byValue: 5})
    player.landscapeMotion({obstacle: pipes, byValue: 5})
    player.landscapeMotion({obstacle: enemies, byValue: 5})
    player.landscapeMotion({obstacle: floors, byValue: 5})
  `
  
  // m_a: A colisão é verificada constantemente com todos os objetos, exceto o chão, pois este não se mexe com o jogador 
  let m_a = `
    player.collisionBottom({obstacle: hills})
    player.collisionBottom({obstacle: bricks})
    player.collisionBottom({obstacle: platforms})
    player.collisionBottom({obstacle: pipes})
    player.collisionBottom({obstacle: enemies})
  `
  
  // n_a: A colisão precisa ser verificada constantemente com todos os objetos
  // n_a: O chão não está incluso, pois este está abaixo do jogador (apenas objetos no mesmo nível)
  let n_a = `
    player.collisionHorizontal({obstacle: hills, reboundBy: 5})
    player.collisionHorizontal({obstacle: bricks, reboundBy: 5})
    player.collisionHorizontal({obstacle: platforms, reboundBy: 5})
    player.collisionHorizontal({obstacle: pipes, reboundBy: 5})
    player.collisionHorizontal({obstacle: enemies, reboundBy: 5})
  `   
  
  // p_b: Criação da verificação, onde uma das imagens de fundo é a referência
  let screenLeftEdge = player.findEdgeLeft({reference: landscapes[0], positionX: 0})
  if (screenLeftEdge) {
    // p_d
    interaction({reference: player, against: 'scenario_outset'})
  }
  
  // q_c: Verificação contínua se o "Y" do jogador é maior que o "Y" do piso
  player.scenarioPit()

  // r_b
  player.lifeWatcher()
  
  // s_c
  player.healthWatcher()
  
  requestAnimationFrame(animate)
}

// Detectar teclas pressionadas p/ definir o grupo de sprites a ser carregado
addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'w':
      player.keys.w.pressed = true
      // c_g
      player.loadSprite({action: 'jump'}) 

      // c_f: O salto se torna mais realista se colocado aqui, ao invés de estar na função "animate"
      player.pressedUpOrDown(20)
      break

    case 'a':
      player.keys.a.pressed = true
      // c_g
      player.loadSprite({action: 'walk_left'})
      break

    case 'd':
      player.keys.d.pressed = true
      // c_g
      player.loadSprite({action: 'walk_right'})
      break
  }
})

// Detectar teclas soltas p/ definir o grupo de sprites a ser carregado
addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'w':
      player.keys.w.pressed = false
      break

    case 'a':
      player.keys.a.pressed = false
      // c_g
      player.loadSprite({action: 'idle_left'})
      break

    case 'd':
      player.keys.d.pressed = false
      // c_g
      player.loadSprite({action: 'idle_right'})
      break
  }
})

class Player {
  constructor() {
    
    // c_g: Configuração de cada grupo de sprite do jogador
    this.wolfSetup = {
      
      idleRight: {
        widthList: [0, 184, 365, 542, 715, 892, 1074],
        widthList2: [183, 183, 177, 171, 174, 180, 185],
        srcHeight: 175,
        frameAmount: 6
      },

      idleLeft: {
        widthList: [0, 185, 367, 544, 717, 894, 1074],
        widthList2: [187, 183, 177, 173, 177, 181, 185],
        srcHeight: 175,
        frameAmount: 6
      },

      walkRight: {
        widthList: [0, 172, 350, 510, 685, 860, 1033, 1205.7, 1380],
        widthList2: [171, 169, 160, 175, 175, 175, 175, 175, 175],
        srcHeight: 161,
        frameAmount: 8
      },

      // INVERTER O SPRITE DA DIREITA NO PAINT + INVERTER A ORDEM DOS FRAMES (CORRIGIR MOVIMENTO INVERSO)
      walkLeft: {
        // widthList: [0, 172, 344, 515, 690, 865, 1037, 1208, 1380],
        widthList: [1380, 1208, 1037, 865, 690, 515, 344, 172, 0],
        // widthList2: [171, 169, 174, 175, 175, 175, 172, 172, 172],
        widthList2: [172, 172, 172, 175, 175, 175, 174, 169, 171],
        srcHeight: 161,
        frameAmount: 8
      },

      jumpRight: {
        widthList: [0, 189, 378, 567, 755, 945, 1135],
        widthList2: [189, 189, 189, 189, 189, 189, 189],
        srcHeight: 188,
        frameAmount: 6
      },

      jumpRightEdited: {
        widthList: [0, 178, 355, 531, 709, 886, 1064, 1242],
        widthList2: [178, 178, 178, 178, 178, 178, 178, 178],
        srcHeight: 176,
        frameAmount: 7
      },

      spin: {
        widthList: [0, 191, 375, 563, 754, 940, 1126],
        widthList2: [191, 186, 186, 186, 186, 186, 193],
        srcHeight: 189,
        frameAmount: 6
      }
    }
    
    // Sprite inicial
    let wolf = new Image()
    wolf.src = '../assets/players/wolf_idle_right_tr.png'
    
    let wolfJumpRightEdited = new Image()
    wolfJumpRightEdited.src = '../assets/players/wolf_jump_right_edited_tr.png'
    
    // Utilidades
    this.surfaceHeight = 61
    this.playerHeight = 60
    
    // b_a: Explicação de como o método "draw" funciona com todos seus parâmetros
    this.tutorial = {
      'par_1': 'Imagem atual do jogador carregada no canvas',
      'par_2': `
        FONTE: C:\Users\lucasf\Downloads\projetos\IMPORTANTE_SOBRE_JOGOS
        Captura da posição x de cada imagem do sprite
        Pela lógica, a captura dessas posições começa na parte <- da primeira imagem até a <- da última imagem
        A quantidade de índices equivale a quantidade de imagens
        EX: [0, 184, 365, 542, 715, 892, 1074] significa que esse sprite têm 7 imagens
      `,
      'par_2[i]': 'Índice que representa a imagem atual do sprite do jogador (muda em "frameAdmin")',
      'par_3': 'Posição Y onde acontece o recorte no sprite de imagens (pelo bom senso, tende a ser sempre zero)',
      'par_4': `
        FONTE: C:\Users\lucasf\Downloads\projetos\IMPORTANTE_SOBRE_JOGOS
        Cálculo da distância da posição x (subtração) de cada imagem do sprite (i2 - i1, i3 - i2, i4 - i3...etc)
        Uma forma de explicar isso é usando o valor de exemplo citado acima: [0, 184, 365, 542, 715, 892, 1074]
        Os índices deste array são a subtração do índice posterior pelo anterior no exemplo, mas não é 100% preciso
      `,
      'par_5': 'Altura original da imagem',
      'par_6': 'Inserção do jogador no X do canvas',
      'par_7': 'Inserção do jogador no Y do canvas',
      'par_8': 'Largura opcional p/ o jogador no canvas',
      'par_9': 'Altura opcional p/ o jogador no canvas',
    }
    
    // b_b: Criação dos atributos p/ poder desenhar o jogador em "draw" (parâmetros em ordem exata do método)
    // O sprite inicial é o jogador p/ -> (idleRight)
    this.image = wolf                                                      // par_1
    this.widthList = this.wolfSetup.idleRight.widthList                    // par_2  
    this.frameCounter = 0                                                  // par_2[i] & par4[i]
    this.fixedHeight = 0                                                   // par_3
    this.widthList2 = this.wolfSetup.idleRight.widthList2                  // par_4
    this.srcHeight = this.wolfSetup.idleRight.srcHeight                    // par_5
    this.whereX = 100                                                      // par_6
    this.whereY = canvas.height - (this.playerHeight + this.surfaceHeight) // par_7
    this.canvasWidth = 60                                                  // par_8
    this.canvasHeight = 60                                                 // par_9
    
    // b_c: Atributos usados no função "frameAdmin", que auxilia na transição de sprites. São eles:
    // [Contador que ++ constantemente, Gatilho p/ transição da 1 imagem p/ outra, Qtd. de imagens no sprite]
    // Quanto maior o valor de "this.modular": + lenta a transição de sprites
    // O último atributo muda conforme a tecla de movimento que é pressionada (muda grupo de sprites)
    this.modularCounter = 0                                                
    this.modular = 5                                                        
    this.frameAmount = this.wolfSetup.idleRight.frameAmount                 
    
    // c_a: Controlador do x e y do jogador
    this.speed = {x: 0, y: 0}
    
    // c_b: Controlador de teclas e de qual grupo de sprite é carregado (mudado nos EventListeners)
    this.keys = {
      a: { pressed: false },
      d: { pressed: false },
      space: { pressed: false },
      w: { pressed: false },
      s: { pressed: false },
      // t_b: Chave que controla o bolão de mensagem de colisão do jogador
      ouch: {value: true}
    }

    // o_a: Var que controla a movimentação do cenário no Canvas
    this.motionTrigger = false
  } 
  
  // b_d: Desenho da imagem do jogador no canvas
  draw() {
    ctx.drawImage(
      this.image,
      this.widthList[this.frameCounter],
      this.fixedHeight,
      this.widthList2[this.frameCounter],
      this.srcHeight,
      this.whereX,
      this.whereY,
      this.canvasWidth,
      this.canvasHeight
    )
  }
  
  // b_e: Controle de velocidade da transição de sprites do jogador
  frameAdmin() {
    this.modularCounter++

    if (this.modularCounter % this.modular === 0) {
      if (this.frameCounter < this.frameAmount) {
        this.frameCounter++
      } else {
        this.frameCounter = 0
      }
    }
  }

  // c_c: Alteração de x do jogador
  horizontalOffset() {
    this.whereX += this.speed.x
  }

  // c_d: Alteração de y do jogador
  verticalOffset() {
    this.whereY += this.speed.y
  }

  // c_e: Movimento horizontal do jogador
  pressedRightOrLeft(offsetHorizontal) {
    // Construção dos elementos que movem o cenário com o jogador até ele alcançar certa posição em "X"
    let rightBoundary = canvas.width / 1.7
    let leftBoundary = canvas.width / 4
    let playerAtBoundaryRight = this.whereX < rightBoundary
    let playerAtBoundaryLeft = this.whereX > leftBoundary
    
    // o_a: A var de controle é modificada aqui. Basicamente, os objetos movem em "else" e param em "if & else if"
    if (this.keys.a.pressed && playerAtBoundaryLeft) {
      this.motionTrigger = false
      this.speed.x = -offsetHorizontal // ir <-
    } else if (this.keys.d.pressed && playerAtBoundaryRight) {
      this.motionTrigger = false
      this.speed.x = offsetHorizontal  // ir ->
    } else {
      this.motionTrigger = true
      this.speed.x = 0
    }
  }

  // c_f: Salto do jogador
  pressedUpOrDown(offsetVertical) {
    if (this.keys.w.pressed) {
      this.speed.y = -offsetVertical // p/ cima
    } else {
      this.speed.y = 0
    }
  }
  
  // d_a: Queda do jogador (aplicação da gravidade após o salto)
  fallDown({byValue}) {
    // A soma de todos estes atributos em "if" é igual ao tamanho do canvas (600 = 600)
    // Quando o jogador salta, a função "pressedUpOrDown" reduz "600 - offsetVertical"  e entra na condição "if"
    // A queda do jogador na condição é para quando ele salta
    // Quando o jogador em "Y" supera "600", ele entra em "else" e o jogador cai com base no valor definido p/ "Y"
    if (this.whereY + this.playerHeight + this.surfaceHeight + this.speed.y <= canvas.height) {
      this.speed.y += byValue
    } else {
      this.speed.y = 10
    }
  }

  // c_g: Trocar o grupo de sprites
  loadSprite({action}) {
    if (action === 'jump') {
      let wolfJump = new Image()
      wolfJump.src = '../assets/players/spin_rainbow_tr.png'
      this.image = wolfJump
      this.widthList = this.wolfSetup.spin.widthList
      this.widthList2 = this.wolfSetup.spin.widthList2
      this.srcHeight = this.wolfSetup.spin.srcHeight
      this.frameAmount = this.wolfSetup.spin.frameAmount
    } 
    
    else if (action === 'walk_right') {
      let wolfWalkRight = new Image()
      wolfWalkRight.src = '../assets/players/wolf_walk_right_tr.png'
      this.image = wolfWalkRight
      this.widthList = this.wolfSetup.walkRight.widthList
      this.widthList2 = this.wolfSetup.walkRight.widthList2
      this.srcHeight = this.wolfSetup.walkRight.srcHeight
      this.frameAmount = this.wolfSetup.walkRight.frameAmount
    } 
    
    else if (action === 'walk_left') {
      let wolfWalkLeft = new Image()
      wolfWalkLeft.src = '../assets/players/wolf_walk_left_tr.png'
      this.image = wolfWalkLeft
      this.widthList = this.wolfSetup.walkLeft.widthList
      this.widthList2 = this.wolfSetup.walkLeft.widthList2
      this.srcHeight = this.wolfSetup.walkLeft.srcHeight
      this.frameAmount = this.wolfSetup.walkLeft.frameAmount
    } 
    
    else if (action === 'idle_right') {
      let wolf = new Image()
      wolf.src = '../assets/players/wolf_idle_right_tr.png'
      this.image = wolf
      this.widthList = this.wolfSetup.idleRight.widthList
      this.widthList2 = this.wolfSetup.idleRight.widthList2
      this.srcHeight = this.wolfSetup.idleRight.srcHeight
      this.frameAmount = this.wolfSetup.idleRight.frameAmount
    } 
    
    else if (action === 'idle_left') {
      let wolfIdleLeft = new Image()
      wolfIdleLeft.src = '../assets/players/wolf_idle_left_tr.png'
      this.image = wolfIdleLeft
      this.widthList = this.wolfSetup.idleLeft.widthList
      this.widthList2 = this.wolfSetup.idleLeft.widthList2
      this.srcHeight = this.wolfSetup.idleLeft.srcHeight
      this.frameAmount = this.wolfSetup.idleLeft.frameAmount
    } 
  }
  
  // m_a: Pouso do jogador sob os objetos (cada índice de um array) passados em "obstacle" (array) 
  collisionBottom({obstacle}) {
    obstacle.forEach(index => {
      if (
        this.whereY + this.canvasHeight <= index.y &&
        this.whereY + this.canvasHeight + this.speed.y >= index.y &&
        this.whereX + this.canvasWidth >= index.x &&
        this.whereX <= index.x + index.width
      ) {
          this.speed.y = 0
        }
      })
  }

  // n_a: Colisão frontal na <- / -> do jogador com os objetos passados em "obstacle" (array)
  collisionHorizontal({obstacle, reboundBy}) {
    obstacle.forEach(index => {
      if (
        this.whereX + this.canvasWidth >= index.x &&
        this.whereX <= index.x + index.width &&
        this.whereY + this.canvasHeight >= index.y &&
        this.whereY <= index.y + index.height
      ) {
        // t_b: Momento da colisão onde o personagem solta a mensagem 
        this.keys.ouch.value = true

        // t_d: Uso da função
        this.hit({objectImage: ouch})

        // s_b: Em caso de colisão horizontal, o jogador leva dano (chegando em 15, perde 1% de sua saúde)
        playerStats.damage += 1

        if (this.keys.d.pressed) {
          this.speed.x = -reboundBy
        } else if (this.keys.a.pressed) {
          this.speed.x = reboundBy
        }
      }
    }
    )
  }
  
  // o_b: Mover os elementos do canvas (cenários + objetos) em seus atributos "x" na direção oposta a do jogador
  landscapeMotion({obstacle, byValue}) {
    // o_a
    if (this.motionTrigger && this.keys.d.pressed) {
      obstacle.forEach(index => {
        index.x -= byValue
      })
    } 
    // o_a
    else if (this.motionTrigger && this.keys.a.pressed) {
      obstacle.forEach(index => {
        index.x += byValue
      })
    }}

  // p_a: Analisar o atrib. "X" do jogador, impedir que conteúdos do canvas se movam a <- quando alcançar certo valor
  findEdgeLeft({reference, positionX}) {
    
    let screenEdgeLeft = reference.x
    
    if (screenEdgeLeft > positionX) {
      return true
    } else {
      return false
    }
  } 
  
  // q_c: Função que cria a queda (ler os comentários aqui)
  scenarioPit() {
    // ANTES: this.whereY + this.playerHeight + this.surfaceHeight + this.speed.y > canvas.height
    // Foi modificado pois o conteúdo do jogo é reiniciado de forma imediata, não vendo o jogador caindo e sumindo
    // setTimeout não funcionou como esperado aqui, então via "subtração" se cria um tempo de atraso
    // Quanto maior "playerY", maior o valor do atributo "Y" do jogador é, que significa: mais longe da tela ele está
    // Fazendo isso, há um intervalo moderado da queda do jogador p/ o reset dos conteúdos no canvas
    let playerY = 300
    if ((this.whereY + this.playerHeight + this.surfaceHeight + this.speed.y) - canvas.height > playerY) {
      // r_a: Foi tentado via parâmetro, mas os stats só mudam de fato, quando se chama a "var global" dentro da classe
      playerStats.lives -= 1
      // s_a: Ao iniciar o cenário após queda, o HP do jogador volta ao valor inicial
      playerStats.hp = 100
      init()
    }
  }

  // r_b: Monitar os pontos de vida p/ saber se deve ser lançado "GAME OVER" via var global
  lifeWatcher() {
    
    // r_a: Var global
    if (playerStats.lives === 0) {
      
      // Ao perder todas as vidas, o canvas é preenchido por um plano de fundo branco
      ctx.fillStyle = 'rgba(255,255,255)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // No plano de fundo, temos uma mensagem [ fillText(string, x, y) ]
      ctx.fillStyle = 'blue'
      ctx.font = '100px georgia'
      ctx.fillText('GAME OVER', canvas.width / 4, canvas.height / 2)
      ctx.fill()
    } else {
      // Enquanto o jogador tiver vidas, exibí-las no canvas [ fillText(string, x, y) ] 
      ctx.fillStyle = 'cyan'
      ctx.font = '25px georgia'
      // r_a: Var global
      ctx.fillText('Vidas: ' + playerStats.lives, 50, 50)
    }
  }
  
  // s_c: Função que controla a perda de HP do personagem (usa somente vars globais)
  healthWatcher() {
    if (playerStats.damage >= 15) {
      playerStats.hp -= 1
      // Ao perder 1% da saúde, a contagem de dano é reiniciada
      playerStats.damage = 0
    }
    
    // Derrota do jogador (Saúde chega a 0%), -1 p/ vida, saúde regenerada, conteúdo no canvas recriado
    if (playerStats.hp === 0) {
      
      playerStats.lives -= 1
      playerStats.hp = 100
      init()

    } else {
      // HP no canvas
      ctx.fillStyle = 'cyan'
      ctx.font = '25px georgia'
      ctx.fillText('Saúde: ' + playerStats.hp + '%', 50, 100)
    }
  }
  
  // t_c
  playerShoutsOuch({objectImage}) {
    // O posição "Y" do balão de dano do jogador, fica acima dele via "integersBetween"
    ctx.drawImage(
      objectImage, this.whereX, this.whereY - integersBetween(40, 60), objectImage.width, objectImage.height
    )
  }
  
  // t_c
  ouchDialogueDuration({duration}) {
    // A duração do bolão é configurada neste "setTimeout", após isso, ele some até a próxima colisão
    setTimeout(() => {
      this.keys.ouch.value = false
    }, duration)
  }
  
  // t_c 
  dialogueHidesItself({objectImage, whereX, whereY}) {
    // Não havendo colisão, o balão é desenhado num local invisível do canvas
    ctx.drawImage(objectImage, whereX, whereY, objectImage.width, objectImage.height)
  }

  // t_d: Configuração do balão
  hit({objectImage}) {
    if (this.keys.ouch.value) {
      this.playerShoutsOuch({objectImage: ouch})
      this.ouchDialogueDuration({duration: 800})
    } else {
      this.dialogueHidesItself({objectImage: ouch, whereX: -10000, whereY: -10000})
    }
  }

}

// e_a: Classe para carregar os recursos de imagem intangíveis do canvas (cenários de fundo)
class Landscape {
  constructor({image, x, y, width, height}) {
    this.image = image
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)  
  }
} 

class Foe {
  constructor({first, x}) {
    // f_a: Atrib. criado p/ que o inimigo 1 tenha posição fixa, e os próximos usem ele como referência (se "true")
    this.first = first
    
    // f_b: Todos os inimigos que estarão no canvas
    let koopaBlue = new Image()
    let koopaColorful = new Image()
    let koopaCyan = new Image()
    let koopaGolden = new Image()
    let koopaOrange = new Image()
    let koopaRed = new Image()
    let koopaViolet = new Image()
    let koopaWhiteYellow = new Image()
    
    // f_c: Todos os arquivos de imagem dos inimigos
    koopaBlue.src = '../assets/shells/shell_blue_tr.gif'
    koopaColorful.src = '../assets/shells/shell_colorful_tr.gif'
    koopaCyan.src = '../assets/shells/shell_cyan_tr.gif'
    koopaGolden.src = '../assets/shells/shell_golden_tr.gif'
    koopaOrange.src = '../assets/shells/shell_orange_tr.gif'
    koopaRed.src = '../assets/shells/shell_red_tr.gif'
    koopaViolet.src = '../assets/shells/shell_violet_tr.gif'
    koopaWhiteYellow.src = '../assets/shells/shell_white_yellow_tr.gif'
    
    // f_d: Os inimigos são colocados num array, p/ serem criados aleatoriamente em "enemySetup"
    this.enemies = [
      koopaBlue, koopaColorful, koopaCyan, koopaGolden, koopaOrange, koopaRed, koopaViolet, koopaWhiteYellow
    ]
    
    // f_e: Todos os atributos na ordem exata para criar um inimigo em "draw" (todos têm "w" e "h" iguais)
    this.image = this.enemies[integersBetween(0, this.enemies.length - 1)]
    this.widthList = [0, 17.5, 34.5, 51.5]
    this.frameCounter = 0
    this.fixedHeight = 0
    this.widthList2 = [16, 17.5, 17, 17]
    this.srcHeight = 16
    // f_a: O primeiro inimigo têm uma posição fixa. Os outros pegam a posição da 1 como referência em "enemySetup"
    if(this.first) {
      this.x = integersBetween(700, 1000)
    } else {
      this.x = x
    }
    this.y = 535
    this.width = 32
    this.height = 32
    this.modularCounter = 0
    this.modular = 10
    this.frameAmount = 3
    
    // g_a: Controlador do x e y do inimigo
    this.speed = {x: 0, y: 0}
  }
  
  // f_f: Desenho do inimigo no canvas
  draw() {
    ctx.drawImage(
      this.image,
      this.widthList[this.frameCounter],
      this.fixedHeight,
      this.widthList2[this.frameCounter],
      this.srcHeight,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
  
  // f_g: Transição de sprites de cada inimigo
  frameAdmin() {
    this.modularCounter++

    if (this.modularCounter % this.modular === 0) {
      if (this.frameCounter < this.frameAmount) {
        this.frameCounter++
      } else {
        this.frameCounter = 0
      }
    }
  }

  // g_b: Alteração de x do inimigo
  horizontalOffset() {
    this.x += this.speed.x
  }

  // g_c: Alteração de y do inimigo
  verticalOffset() {
    this.y += this.speed.y
  }

  // g_d: Movimentar o inimigo pelo canvas (horizontal & vertical)
  move() {
    let directions = ['v', 'h']
    let chosenDirection = directions[integersBetween(0, directions.length - 1)]

    if(chosenDirection === 'h') {
      this.speed.x = integersBetween(-2, 2, true)
    }

    if(chosenDirection === 'v') {
      this.speed.y = integersBetween(-2, 2, true)
    }
  }
  
  // g_e: Manter o inimigo em dimensões controladas do canvas
  keepOnScreen() {
    let playerStartPosition = 470
    let roof = 300
    let whereToGo = Math.random() - 0.5

    // Impedir sumir do canvas p/ baixo jogando pra cima (valor pequeno torna movimento + natural)
    if (this.y >= playerStartPosition) {
      this.speed.y = -1
    }
    // Impedir sumir do canvas p/ cima jogando pra baixo (valor pequeno torna movimento + natural)
    else if (this.y <= roof) {
      this.speed.y = 1
    } 
    // Se chegar na posição x do jogador, mover p/ <- ou ->
    else if (this.x > 100) {
      if (whereToGo > 0) {
        this.speed.x = -1
      } else if (whereToGo < 0) {
        this.speed.x = 1
      }
    }
  }
}

class Platform {
  // h_a: Atributos comuns a uma plataforma
  constructor({ first, image, x, y, width, height }) {
    this.first = first
    this.image = image
    if (this.first) {
      let canvasBottom = 540
      this.x = 0
      this.y = canvasBottom
    } else {
      this.x = x
      this.y = y
    }
    this.width = width
    this.height = height
  }
  
  // h_b: Desenho da plataforma no canvas
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

class Thing {
  // i_a: Atributos comuns a um objeto 
  constructor({ image, x, y, width, height }) {
    this.image = image
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  
  // i_b: Desenhar o objeto no canvas: colina
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

class Clock {
  constructor({counter, modular}) {
    this.counter = counter
    this.modular = modular
  }
}

// b_f: ANTES: [let new Player()] Criação do objeto do jogador / q_a: Após criar o fosso de queda, o valor muda 
let player = undefined

// g_f: Para impedir que o inimigo se mexa muito rápido, define-se um atraso entre cada alteração
let enemyClock = new Clock({counter: 0, modular: 70})

// r_a: Cria-se um objeto global (foi testado outros métodos, mas apenas uma var global parece funcionar)
let playerStats = {
  lives: 3,
  // s_a: As duas chaves abaixo são usadas dentro da classe "Player", onde "damage" afeta "hp" diretamente
  hp: 100,
  // s_b
  damage: 0
}

// t_a: Agora temos uma interação do jogador com o sistema de colisão (imagem de aviso da colisão)
let ouch = new Image()
ouch.src = '../assets/dialogue/ouch.gif'

init()
animate()
