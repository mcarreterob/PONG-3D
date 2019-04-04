/*

  Práctica Final GyV3D - PONG X Mario Carretero Berrocal

  Se ha implementado la funcionalidad básica y extras:
    - Se han añadido más objetos a la escena:
        4 cilindros, 4 esferas y 1 plano
    - Se han añadido sombras producidas por una SpotLight
    - Se han añadido texturas a todos los objetos excepto a las palas
    - La cámara sigue el movimiento de la pala del jugador
    - Se han añadido sonidos al contacto de la pelota con las palas
    - Se han añadido sonidos al marcarse tantos en ambos lados del juego
    - Se ha añadido sonido al terminar la partida, previo activación del volumen
      en los controles que aparecen.
*/
// GLOBAL VARIABLES
// Set the scene size
const WIDTH = 640;
const HEIGHT = 360;

var container;

// Plano del area de juego
const FIELD_WIDTH = 400,
      FIELD_HEIGHT = 200;

const PLANE_WIDTH = FIELD_WIDTH,
      PLANE_HEIGHT = FIELD_HEIGHT,
      PLANE_QUALITY = 10;

// Paddles
const PADDLE_WIDTH = 10,
      PADDLE_HEIGTH = 30,
      PADDLE_DEPTH = 10,
      PADDLE_QUALITY = 1;

var playerPaddleDirY = 1,
    cpuPaddleDirY = 1,
    paddleSpeed = 4;

var playerPaddle,
    cpuPaddle;

// Set some camera attributes
const VIEW_ANGLE = 50;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

// Scene object variables
var renderer, scene, camera, pointLight;

// Set up the sphere vars
const RADIUS = 5;
const SEGMENTS = 6;
const RINGS = 6;

var sphere, sphere_column21;
var plane, outer_plane;

var ballDirX = 3,
    ballDirY = 1,
    ballSpeed = 3,
    maxBallSpeed = ballSpeed*2;

var score1 = 0,
    score2 = 0,
    maxScore = 5;

var cylinder_11, cylinder_12, cylinder_21, cylinder_22;

// set opponent reaction rate (0-easiest, 1-hardest)
var difficulty = 0.25;

// GAME FUNCTIONS

function setup()
{
    createScene();
    addMesh();
    addLight();
    requestAnimationFrame(draw);
}

function createScene()
{
    // Set up all the 3D objects in the scene

	  // Get the DOM element to attach to
    container = document.getElementById('gameCanvas');

    // Create a WebGL renderer, camera and a scene
    renderer = new THREE.WebGLRenderer();
    camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );

    scene = new THREE.Scene();

    // Add the camera to the scene
    scene.add(camera);
    // Start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    // Attach the renderer-supplied DOM element.
    gameCanvas.appendChild(renderer.domElement);
}
function addMesh()
{
    //ESFERA
    var geometry = new THREE.SphereGeometry(
      RADIUS,
      SEGMENTS,
      RINGS);
  /*
    POSSIBLE SPHERE TEXTURES TO CHOOSE:
      - tango.jpg;
      - jabulani.jpg;
      - europass.jpg;
      - roteiro.jpg;
  */
    var sphere_texture = new THREE.TextureLoader().load('./js/textures/tango.jpg');
    var material = new THREE.MeshLambertMaterial(
      {
        map: sphere_texture
      });

    //PLANOS
    var plane_geometry = new THREE.PlaneGeometry(
      PLANE_WIDTH,
      PLANE_HEIGHT,
      PLANE_QUALITY);
    var outer_plane_geometry = new THREE.PlaneGeometry(
      440,
      235,
      PLANE_QUALITY);
    var plane_texture = new THREE.TextureLoader().load('./js/textures/pitch.jpg');
    var plane_material = new THREE.MeshLambertMaterial(
      {
        map: plane_texture
      });
    var outer_plane_texture = new THREE.TextureLoader().load('./js/textures/grey-marble.jpg');
    var outer_plane_material = new THREE.MeshLambertMaterial(
      {
        map: outer_plane_texture
      });

    //PALAS
    var playerPaddle_geometry = new THREE.CubeGeometry(
      PADDLE_WIDTH,
      PADDLE_HEIGTH,
      PADDLE_DEPTH,
      PADDLE_QUALITY);
    var playerPaddle_material = new THREE.MeshLambertMaterial(
      {
        color: 0xFF0000
      });
    var cpuPaddle_geometry = new THREE.CubeGeometry(
      PADDLE_WIDTH,
      PADDLE_HEIGTH,
      PADDLE_DEPTH,
      PADDLE_QUALITY);
    var cpuPaddle_material = new THREE.MeshBasicMaterial(
      {
        color: 0x0000FF
      });

    //COLUMNAS
    var column_texture = new THREE.TextureLoader().load('./js/textures/column.jpg');
    var cylinder_geometry = new THREE.CylinderGeometry( 8, 8, 40, 32 );
    var cylinder_material = new THREE.MeshLambertMaterial(
      {
        map: column_texture
      });
    var sphere_column_geometry = new THREE.SphereGeometry(
      8,
      32,
      32);
    var sphere_column11_texture = new THREE.TextureLoader().load('./js/textures/roteiro.jpg');
    var sphere_column12_texture = new THREE.TextureLoader().load('./js/textures/europass.jpg');
    var sphere_column21_texture = new THREE.TextureLoader().load('./js/textures/tango.jpg');
    var sphere_column22_texture = new THREE.TextureLoader().load('./js/textures/jabulani.jpg');
    var sphere_column11_material = new THREE.MeshLambertMaterial(
      {
        map: sphere_column11_texture
      });
    var sphere_column12_material = new THREE.MeshLambertMaterial(
      {
        map: sphere_column12_texture
      });
    var sphere_column21_material = new THREE.MeshLambertMaterial(
      {
        map: sphere_column21_texture
      });
    var sphere_column22_material = new THREE.MeshLambertMaterial(
      {
        map: sphere_column22_texture
      });



    // Create a new mesh
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = -95;

    plane = new THREE.Mesh(plane_geometry, plane_material);
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = -100;

    outer_plane = new THREE.Mesh(outer_plane_geometry, outer_plane_material);
    outer_plane.position.x = 10;
    outer_plane.position.y = 0;
    outer_plane.position.z = -101;

    playerPaddle = new THREE.Mesh(playerPaddle_geometry, playerPaddle_material);
    playerPaddle.position.x = -192;
    playerPaddle.position.y = 0;
    playerPaddle.position.z = -95;

    cpuPaddle = new THREE.Mesh(cpuPaddle_geometry, cpuPaddle_material);
    cpuPaddle.position.x = 192;
    cpuPaddle.position.y = 0;
    cpuPaddle.position.z = -95;

    //COLUMNAS
    cylinder_11 = new THREE.Mesh(cylinder_geometry, cylinder_material);
    cylinder_12 = new THREE.Mesh(cylinder_geometry, cylinder_material);
    cylinder_21 = new THREE.Mesh(cylinder_geometry, cylinder_material);
    cylinder_22 = new THREE.Mesh(cylinder_geometry, cylinder_material);

    cylinder_11.position.x = 200;
    cylinder_11.position.y = 108;
    cylinder_11.position.z = -81;
    cylinder_11.rotation.x = Math.PI/2;

    cylinder_12.position.x = 200;
    cylinder_12.position.y = -108;
    cylinder_12.position.z = -81;
    cylinder_12.rotation.x = Math.PI/2;

    cylinder_21.position.x = -200;
    cylinder_21.position.y = 108;
    cylinder_21.position.z = -81;
    cylinder_21.rotation.x = Math.PI/2;

    cylinder_22.position.x = -200;
    cylinder_22.position.y = -108;
    cylinder_22.position.z = -81;
    cylinder_22.rotation.x = Math.PI/2;

    sphere_column11 = new THREE.Mesh(sphere_column_geometry, sphere_column11_material);
    sphere_column11.position.x = 200;
    sphere_column11.position.y = 108;
    sphere_column11.position.z = -53;

    sphere_column12 = new THREE.Mesh(sphere_column_geometry, sphere_column12_material);
    sphere_column12.position.x = 200;
    sphere_column12.position.y = -108;
    sphere_column12.position.z = -53;

    sphere_column21 = new THREE.Mesh(sphere_column_geometry, sphere_column21_material);
    sphere_column21.position.x = -200;
    sphere_column21.position.y = 108;
    sphere_column21.position.z = -53;

    sphere_column22 = new THREE.Mesh(sphere_column_geometry, sphere_column22_material);
    sphere_column22.position.x = -200;
    sphere_column22.position.y = -108;
    sphere_column22.position.z = -53;

    // Finally, add to the scene
    scene.add(sphere);
    scene.add(sphere_column11);
    scene.add(sphere_column12);
    scene.add(sphere_column21);
    scene.add(sphere_column22);
    scene.add(plane);
    scene.add(outer_plane);
    scene.add(playerPaddle);
    scene.add(cpuPaddle);
    scene.add(cylinder_11);
    scene.add(cylinder_12);
    scene.add(cylinder_21);
    scene.add(cylinder_22);
}
function addLight()
{
    // Create a point light
    spotLight =
      new THREE.SpotLight(0xFFFFFF);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    spotLight.castShadow = true;

    sphere.castShadow = true;

    plane.castShadow = true;
    plane.receiveShadow = true;

    playerPaddle.castShadow = true;
    playerPaddle.receiveShadow = true;

    cpuPaddle.castShadow = true;

    sphere_column11.receiveShadow = true;
    sphere_column12.receiveShadow = true;
    sphere_column21.receiveShadow = true;
    sphere_column22.receiveShadow = true;

    cylinder_11.receiveShadow = true;
    cylinder_12.receiveShadow = true;
    cylinder_21.receiveShadow = true;
    cylinder_22.receiveShadow = true;

    cylinder_11.castShadow = true;
    cylinder_12.castShadow = true;
    cylinder_21.castShadow = true;
    cylinder_22.castShadow = true;

    outer_plane.receiveShadow = true;

    sphere_column11.castShadow = true;
    sphere_column12.castShadow = true;
    sphere_column21.castShadow = true;
    sphere_column22.castShadow = true;

    // Set its position
    spotLight.position.x = 0;
    spotLight.position.y = 0;
    spotLight.position.z = 200;

    // Add to the scene
    scene.add(spotLight);
}
function paddleMove(){
  if (Key.isDown(Key.A)){
    // code to move paddle left
    if (playerPaddle.position.y >= (FIELD_HEIGHT/2 - PADDLE_HEIGTH/2)){
      playerPaddle.position.y = playerPaddle.position.y;
    }else{
      playerPaddle.position.y += playerPaddleDirY*paddleSpeed;
    }
  }else  if (Key.isDown(Key.D)){
    // code to move paddle right
    if (playerPaddle.position.y <= (-FIELD_HEIGHT/2 + PADDLE_HEIGTH/2)){
      playerPaddle.position.y = playerPaddle.position.y;
    }else{
      playerPaddle.position.y += -playerPaddleDirY*paddleSpeed;
    }
  }
}
function sphereMove(){
  if (sphere.position.y > FIELD_HEIGHT/2 - RADIUS || sphere.position.y < -FIELD_HEIGHT/2 + RADIUS){
    ballDirY = - ballDirY;
    sphere.position.y += ballDirY;
    sphere.position.x += ballDirX;
    sphere.rotation.x += 0.1;
    sphere.rotation.y += 0.05;
    //Rotate sphere_column's
    sphere_column11.rotation.x += 0.05;
    sphere_column11.rotation.y += 0.05;
    sphere_column12.rotation.x += 0.05;
    sphere_column12.rotation.y += 0.05;
    sphere_column21.rotation.x += 0.05;
    sphere_column21.rotation.y += 0.05;
    sphere_column22.rotation.x += 0.05;
    sphere_column22.rotation.y += 0.05;
  }else{
    sphere.position.y += ballDirY;
    sphere.position.x += ballDirX;
    sphere.rotation.x += 0.1;
    sphere.rotation.y += 0.05;
    //Rotate sphere_column's
    sphere_column11.rotation.x += 0.05;
    sphere_column11.rotation.y += 0.05;
    sphere_column12.rotation.x += 0.05;
    sphere_column12.rotation.y += 0.05;
    sphere_column21.rotation.x += 0.05;
    sphere_column21.rotation.y += 0.05;
    sphere_column22.rotation.x += 0.05;
    sphere_column22.rotation.y += 0.05;
    // cpuPaddle logic
    cpuPaddleDirY = (sphere.position.y - cpuPaddle.position.y) * difficulty;
    cpuPaddle.position.y += cpuPaddleDirY;
    limitBallSpeed()
    score();
  }
}
function limitBallSpeed(){
  if (ballDirY > maxBallSpeed){
    ballDirY = maxBallSpeed;
    //console.log("Limitacion maxima velocidad " + ballDirY);
  }else if (ballDirY < -maxBallSpeed){
    ballDirY = -maxBallSpeed;
    //console.log("Limitacion maxima velocidad " + ballDirY);
  }
}
function paddelsCollisions(){
  if(sphere.position.x > cpuPaddle.position.x - PADDLE_WIDTH/2
    && sphere.position.x < cpuPaddle.position.x){
    if(sphere.position.y <= cpuPaddle.position.y + PADDLE_HEIGTH/2
      && sphere.position.y >= cpuPaddle.position.y - PADDLE_HEIGTH/2){
        ballDirX = - ballDirX;
        /* Dependiendo con que parte de la pala des a la pelota, tomara una
        direccion y velocidad determinada. Cuanto mas cerca de los extremos,
        mas fuerza cogera la pelota*/
        ballDirY = (sphere.position.y - cpuPaddle.position.y)*0.5;
        //console.log("cpuballDirY " + ballDirY);
        //console.log("cpuballDirX " + ballDirX);
        sphere.position.y += ballDirY;
        sphere.position.x += ballDirX;
        sphere.rotation.x += 0.2;
        sphere.rotation.y += 0.05;
        var cpu_sound = new Audio('./js/sounds/cpu.wav');
        cpu_sound.play();
    }
  }else if(sphere.position.x < playerPaddle.position.x + PADDLE_WIDTH/2
    && sphere.position.x > playerPaddle.position.x){
    if(sphere.position.y <= playerPaddle.position.y + PADDLE_HEIGTH/2
      && sphere.position.y >= playerPaddle.position.y - PADDLE_HEIGTH/2){
        ballDirX = - ballDirX;
        /* Dependiendo con que parte de la pala des a la pelota, tomara una
        direccion y velocidad determinada. Cuanto mas cerca de los extremos,
        mas fuerza cogera la pelota*/
        ballDirY = (sphere.position.y - playerPaddle.position.y)*0.5;
        //console.log("playerballDirY " + ballDirY);
        //console.log("playerballDirX " + ballDirX);
        sphere.position.y += ballDirY;
        sphere.position.x += ballDirX;
        sphere.rotation.x += 0.2;
        sphere.rotation.y += 0.05;
        var player_sound = new Audio('./js/sounds/player.wav');
        player_sound.play();
    }
  }
}
function score(){
  document.getElementById('winnerBoard').innerHTML = "First to " + maxScore + " wins!";
  if (sphere.position.x > PLANE_WIDTH/2){
    score1 +=1;
    var score1_sound = new Audio('./js/sounds/Yeah.wav');
    score1_sound.play();
    document.getElementById('scores').innerHTML = score1 + '-' + score2;
    sphere.position.x = 0;
    sphere.position.y = 0;
    ballDirY = 1;
    ballDirX = -ballDirX;
  }
  if (sphere.position.x < -PLANE_WIDTH/2){
    score2 += 1;
    var score2_sound = new Audio('./js/sounds/HOOOO!!!!.wav');
    score2_sound.play();
    document.getElementById('scores').innerHTML = score1 + '-' + score2;
    sphere.position.x = 0;
    sphere.position.y = 0;
    ballDirY = 1;
    ballDirX = -ballDirX;
  }
  if (score2 == maxScore){
    document.getElementById('winnerBoard').innerHTML = 'CPU wins! Refresh to play again';
    var finish_sound = document.getElementById("end");
    finish_sound.play();
    sphere.position.y = 0;
    sphere.position.x = 0;
    sphere.position.z = -95;
    sphere.rotation.x = 0;
    sphere.rotation.y = 0;
  }else if(score1 == maxScore){
    document.getElementById('winnerBoard').innerHTML = 'You win! Refresh to play again';
    var finish_sound = document.getElementById("end");
    finish_sound.play();
    sphere.position.y = 0;
    sphere.position.x = 0;
    sphere.position.z = -95;
    sphere.rotation.x = 0;
    sphere.rotation.y = 0;
  }
}
function draw()
{
  // Draw!
  camera.position.x = playerPaddle.position.x - 110;
  camera.position.z = playerPaddle.position.z + 100;
  camera.position.y = playerPaddle.position.y;
  camera.rotation.y = -60*Math.PI/180;
  camera.rotation.z = -90*Math.PI/180;

  renderer.render(scene, camera);
  paddleMove();
  sphereMove();
  paddelsCollisions();
  //limitBallSpeed();
  requestAnimationFrame(draw);
  }
