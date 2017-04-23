var DOon = false;
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchend", touchEnded);
document.addEventListener("touchmove", touchStop);
var playerX = window.innerWidth/2;

var song = new Audio("backSong.mp3");
song.volume = 0.9;
song.load();

song.play();

function touchHandler(e) {
  if(e.touches) {
      var originX = e.touches[0].pageX;
      var originY = e.touches[0].pageY;
  }
}
function touchStop(e) {
  e.preventDefault();
  if(e.touches) {
      playerX = e.touches[0].pageX;
      playerY = e.touches[0].pageY;
  }
}
function touchEnded() {
  playerX = window.innerWidth/2;
}

 window.addEventListener("keydown", function(e) {
  // space and arrow keys
   if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
     e.preventDefault();
   }
 }, false);

  var device = "PC";
  var absolute = 0;
  var alpha = 0;
  var beta = 0;
  var gamma = 0;
  var timer = 0;

  window.addEventListener("deviceorientation", handleOrientation, true);
  function handleOrientation(e) {
    absolute = e.absolute;
    alpha = e.alpha;
    beta = e.beta;
    gamma = e.gamma;
  }
  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  function dist(x0,y0,z0,x1,y1,z1){
    deltaX = x1 - x0;
    deltaY = y1 - y0;
    deltaZ = z1 - z0;
    distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    return distance;
  }

  document.addEventListener( "mousemove", onMouseMove, false );

  var mouse = {
    x: 0,
    y: 0
  };
  document.getElementById("easyhighscore").innerHTML = "Easy Mode High Score: " + localStorage.getItem( "easyhighscore" );
  document.getElementById("hardhighscore").innerHTML = "Hard Mode High Score: " + localStorage.getItem( "hardhighscore" );
  document.getElementById("normalhighscore").innerHTML = "Normal Mode High Score: " + localStorage.getItem( "normalhighscore" );
  var select = 0;
  var diff = 0;
  var pause = false;
  var lives = 0;
  var lvlSpeed = 0.0;
  var playerVel = 0;
  var jumpVel = 0;
  var score = 0;
  var keyboard = new THREE.KeyboardState();
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( "rgb(155,155,255)", 0.03 );
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 100 );
  camera.position.set( 3, -4, -2 );
  camera.rotation.set( 1.58, 0.17, -1.6 );
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( scene.fog.color );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  //controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.enableZoom = true;
  //controls.enablePan = true;
  var crystgeo = new THREE.SphereBufferGeometry( 0.5, 4, 2 );
  var crystmat = new THREE.MeshLambertMaterial( { color: "rgb(15,15,15)", reflectivity: 0.1 } );
  var cryst = new THREE.Mesh( crystgeo, crystmat );
  cryst.position.y = 150;
  cryst.position.x = ( Math.random() - 0.5 ) * 100;
  cryst.position.z = 0.25;
  scene.add( cryst );

  var size;
  var geom;
  var mate = new THREE.MeshLambertMaterial( {color: "rgb(25,25,255)" } );
  var blocks = [];
  for ( var i = 0; i < 100; i++ ) {
    size = Math.floor( Math.random( 2, 4 ) );
    geom = new THREE.SphereBufferGeometry( 2, size, size-1 );
    var mesh = new THREE.Mesh( geom, mate );
    mesh.position.x = ( Math.random() - 0.5 ) * 50;
    mesh.position.z = ( Math.random() - 0.5 ) * 50;
    mesh.position.y = ( Math.random() - 0.5 ) * 100 + 150;
    //mesh.position.z = ( Math.random() - 0.5 ) * 100;
    //mesh.updateMatrix();
    //mesh.matrixAutoUpdate = true;
    scene.add( mesh );
    blocks.push( mesh );
  }

  var bordergeo = new THREE.BoxBufferGeometry( 1, 125, 1 );
  var bordermat = new THREE.MeshLambertMaterial( { color: "rgb(0,0,55)" } );
  var border1 = new THREE.Mesh( bordergeo, bordermat );
  border1.position.x = 50;
  scene.add( border1 );
  var border2 = new THREE.Mesh( bordergeo, bordermat );
  border2.position.x = -50;
  scene.add( border2 );

  var planegeo = new THREE.PlaneBufferGeometry( 750, 750 );
  var planemat = new THREE.MeshLambertMaterial( { color: "rgb(255,255,255)", side: THREE.DoubleSide } );
  var plane1 = new THREE.Mesh( planegeo, planemat );
  plane1.position.set( 0, 0, -25 );
  scene.add( plane1 );
  var plane2 = new THREE.Mesh( planegeo, planemat );
  plane2.position.set( 0, 0, 25 );
  scene.add( plane2 );
  var plane3 = new THREE.Mesh( planegeo, planemat );
  plane3.position.set( 25, 0, 0 );
  plane3.rotation.y = Math.radians(90);
  scene.add( plane3 );
  var plane4 = new THREE.Mesh( planegeo, planemat );
  plane4.position.set( -25, 0, 0 );
  plane4.rotation.y = Math.radians(90);
  scene.add( plane4 );

  var amblight = new THREE.AmbientLight( "rgb(10,10,10)", 3 );
  scene.add( amblight );

  var light = new THREE.PointLight( "rgb(255,255,255)", 10, 1000, 2 );
  light.position.y = 1;
  scene.add( light );

  var lpoint = new THREE.Mesh( new THREE.SphereBufferGeometry( 0.25, 10, 10 ), new THREE.MeshLambertMaterial( { color: "rgb(255,255,255)"} ));
  scene.add( lpoint );

  var thrustlight = new THREE.PointLight( "rgb(55,55,55)", 3, 10, 2 );
  thrustlight.position.y = light.position.y - 2;
  scene.add( thrustlight );

  var wingsgeo = new THREE.RingBufferGeometry( 0.001, 0.75, 1, 1, Math.radians(90), 6.3 );
  var wingsmat = new THREE.MeshLambertMaterial( { color: "rgb(255,255,255)" } );
  var wings = new THREE.Mesh( wingsgeo, wingsmat );
  wings.position.set( lpoint.position.x, lpoint.position.y, lpoint.position.z );
  scene.add( wings );

  var sheildgeo = new THREE.SphereBufferGeometry( 0.5, 36, 36 );
  var sheildmat = new THREE.MeshBasicMaterial ( { color: "rgb(55,55,255)", transparent: true,opacity: 0 } );
  var sheild = new THREE.Mesh( sheildgeo, sheildmat );
  scene.add( sheild );

  var thrustgeom = new THREE.SphereBufferGeometry( 0.3, 3, 3 );
  var thrustmate = new THREE.MeshBasicMaterial( { color: "rgb(55,255,55)", transparent: true, opacity: 0.5 } );
  var thrust = [];
  for ( var i = 0; i < 250; i++ ) {
    var particle = new THREE.Mesh( thrustgeom, thrustmate );
    particle.position.x = light.position.x + ( Math.random() - 0.5 ) * 0.1;
    particle.position.y = light.position.y - ( Math.random() - 0.5 ) * 5;
    particle.position.z = light.position.z;
    particle.rotation.set( ( Math.random() - 0.5 ) * 6, ( Math.random() - 0.5 ) * 6, ( Math.random() - 0.5 ) * 6 );
    scene.add( particle );
    thrust.push ( particle );
  }

  var starsgeo = new THREE.PlaneBufferGeometry( 0.1, 0.1, 0.1 );
  var starsmat = new THREE.MeshBasicMaterial( { color: "rgb(255,255,255)" } );
  var stars = [];
  for ( var i = 0; i < 200; i++ ) {
    var star = new THREE.Mesh( starsgeo, starsmat );
    star.position.x = (Math.random() - 0.5 )  * 100;
    star.position.y = (Math.random() - 0.5 )  * 100;
    star.position.z = (Math.random() )  * 10;
    star.rotation.set( ( Math.random() - 0.5 ) * 6, ( Math.random() - 0.5 ) * 6, ( Math.random() - 0.5 ) * 6 );
    scene.add( star );
    stars.push( star );
  }

  scene.rotation.y = Math.radians(90);

  var render = function () {
      requestAnimationFrame( render );

      if ( song.ended == true ) {
        song.play();
      }

    if ( pause == false && lives > 0 ) {
        timer++;
        for (var i = 0; i < blocks.length; i++ ) {
          blocks[i].position.y -= lvlSpeed;
          blocks[i].rotation.x = timer/100+i;
          blocks[i].rotation.z = timer/100+i;
          if (blocks[i].position.y<-15) {
            blocks[i].position.y = 75;
            blocks[i].position.x = ( Math.random() - 0.5) * 50;
          }
          if ( dist(light.position.x, light.position.y, light.position.z, blocks[i].position.x, blocks[i].position.y, blocks[i].position.z) < blocks[i].geometry.parameters.radius && lvlSpeed > 0) {
            lvlSpeed += -1.4-score*0.00015*diff*0.5;
            lives -= 10;
            sheild.material.opacity = lives/100;
          }
        }
        for (var i = 0; i < stars.length; i++) {
          stars[i].position.y -= lvlSpeed*2;
          stars[i].lookAt( camera.position );
          if (stars[i].position.y < -50) {
            stars[i].position.y = 50;
            stars[i].position.x = ( Math.random() - 0.5) * 100;
          }
        }
        for ( var i = 0; i < thrust.length; i++ ) {
          thrust[i].position.y -= 0.1;
          //thrust[i].position.z = lpoint.position.z;
          thrust[i].material.opacity = thrustlight.intensity/100;
          if ( thrust[i].position.y < -5 ) {
            thrust[i].position.y = lpoint.position.y - 0.0;
            thrust[i].position.x = lpoint.position.x + ( Math.random() - 0.5 ) * 0.25;
            thrust[i].position.z = lpoint.position.z-0.1;
          }
        }
        cryst.position.y -= lvlSpeed;
        cryst.rotation.z += Math.radians(3);
        if ( cryst.position.y < -25 ) {
          cryst.position.y = 75;
          cryst.position.x = ( Math.random() - 0.5 ) * 25;
        }
        if ( dist( cryst.position.x, cryst.position.y, cryst.position.z, light.position.x, light.position.y, light.position.z ) < 1.75) {
          cryst.position.y = 50;
          cryst.position.x = ( Math.random() - 0.5 ) * 25;
          lvlSpeed += 0.4;
          if ( lives < 100 ) {
            lives += 5;
            sheild.material.opacity = 1.0;
          }
        }
        if ( lvlSpeed > 0.6 + score*0.00015*diff + diff/5 ) {
          lvlSpeed -= 0.005;
        }
        if ( lvlSpeed < 0.6 + score*0.00015*diff + diff/5 ) {
          lvlSpeed += 0.01;
        }
        if ( keyboard.pressed("right") || keyboard.pressed("D") ) {
          playerVel += 0.06;
        }
        if ( keyboard.pressed("left")  || keyboard.pressed("A") ) {
          playerVel -= 0.06;
        }
        if ( keyboard.pressed("up")  || keyboard.pressed("W") ) {
          jumpVel += 0.06;
        }
        if ( keyboard.pressed("down")  || keyboard.pressed("S") ) {
          jumpVel -= 0.06;
        }
        if ( keyboard.pressed("right") == false && keyboard.pressed("left") == false ) {
          playerVel *= 0.9;
        }
        if ( keyboard.pressed("up") == false && keyboard.pressed("down") == false ) {
          jumpVel *= 0.9;
        }
        if ( device == "Mobile" ) {
          playerVel = ((playerX-window.innerWidth)/(window.innerWidth/20))*0.06;
        }
        if ( device == "Mobile" ) {
          jumpVel = -((playerY-window.innerHeight)/(window.innerHeight/20))*0.06;
        }
        if ( DOon == true ) {
          if ( alpha > 180 ) {
            alpha -= 360;
          }
          playerVel = -alpha/90*0.58;
        }
        if ( playerVel > 0.59 ) {
          playerVel = 0.59;
        }
        if ( playerVel < -0.59 ) {
          playerVel = -0.59;
        }
        if ( jumpVel > 0.59 ) {
          jumpVel = 0.59;
        }
        if ( jumpVel < -0.59 ) {
          jumpVel = -0.59;
        }
        if ( light.position.x > 24 ) {
          light.position.x = 24;
        }
        if ( light.position.x < -24 ) {
          light.position.x = -24;
        }
        if ( light.position.z > 24 ) {
          light.position.z = 24;
        }
        if ( light.position.z < -24 ) {
          light.position.z = -24;
        }
        if ( sheild.material.opacity > 0 ) {
          sheild.material.opacity *= 0.9;
        }
        if ( lives <= 40 ) {
          sheild.material.color.set("rgb(255,0,0)");
        }
        else {
          sheild.material.color.set("rgb(55,55,255)");
        }
        lpoint.position.set(light.position.x,light.position.y-1,light.position.z-0.1);
        light.position.x += playerVel;
        light.position.z += jumpVel;
        wings.position.set( lpoint.position.x, lpoint.position.y, lpoint.position.z );
        wings.rotation.y = playerVel;
        wings.rotation.z = -playerVel/10;
        wings.rotation.x = jumpVel*0.75;
        thrustlight.position.x = lpoint.position.x;
        thrustlight.position.y = lpoint.position.y - 2 - lvlSpeed;
        thrustlight.position.z = lpoint.position.z;
        thrustlight.intensity = lvlSpeed * 5;
        camera.position.z = -lpoint.position.x;
        camera.position.x = lpoint.position.z+2;
        if ( camera.position.x > 23 ) {
          camera.position.x = 23;
        }
        //camera.rotation.y = -jumpVel;
        //camera.position.y = (lpoint.position.z+2);
        sheild.position.x = lpoint.position.x;
        sheild.position.y = lpoint.position.y;
        sheild.position.z = lpoint.position.z;
        score += lvlSpeed;
        document.getElementById("score").innerHTML = Math.floor(score) + " meters";
        document.getElementById("lives").innerHTML = lives + "% shield";
        renderer.render(scene, camera);
        if ( Math.floor(score) % 1000 == 0 ) {
          document.getElementById("ScoreBlast").innerHTML = Math.floor(score);
          document.getElementById("ScoreBlast").style.opacity = 1.0;
        }
        if (  Math.floor(score) % 1000 > lvlSpeed*10 ) {
          document.getElementById("ScoreBlast").style.opacity = 0.0;
        }
        if ( lvlSpeed < 0.8 ) {
          lvlSpeed += 0.005;
        }
        if ( lives < 1 && pause == false) {
          document.getElementById("deathmenu").style.height = "90%";
          document.getElementById("deathtitle").style.opacity = 0.8;
          document.getElementById("playagain").style.opacity = 0.8;
          document.getElementById("playagain").style.bottom = "15%";
          document.getElementById("DOsettingafter").style.opacity = 1.0;
          if ( diff == 0.1 ) {
            if ( score > localStorage.getItem( "easyhighscore" ) ) {
              localStorage.setItem( "easyhighscore", Math.floor(score) );
            }
          }
          if ( diff == 0.2 ) {
            if ( score > localStorage.getItem( "normalhighscore" ) ) {
              localStorage.setItem( "normalhighscore", Math.floor(score) );
            }
          }
          else {
            if ( score > localStorage.getItem( "hardhighscore" ) ) {
              localStorage.setItem( "hardhighscore", Math.floor(score) );
            }
          }
          document.getElementById("hardhighscoreafter").innerHTML = "Hard Mode High Score: " + localStorage.getItem( "hardhighscore" );
          document.getElementById("easyhighscoreafter").innerHTML = "Easy Mode High Score: " + localStorage.getItem( "easyhighscore" );
          document.getElementById("normalhighscoreafter").innerHTML = "Normal Mode High Score: " + localStorage.getItem( "normalhighscore" );
          document.getElementById("normalhighscoreafter").style.opacity = 1;
          document.getElementById("easyhighscoreafter").style.opacity = 1;
          document.getElementById("hardhighscoreafter").style.opacity = 1;
        }
      }
  };

  render();

  function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
 };

 function startagain() {
   select = 0;
   lives = 100;
   lvlSpeed = -2;
   score = 133.5;
   document.getElementById("DOsettingafter").style.opacity = 0.0;
   document.getElementById("deathmenu").style.height = "0%";
   document.getElementById("deathtitle").style.opacity = 0;
   document.getElementById("easyoptionafter").style.opacity = 0;
   document.getElementById("hardoptionafter").style.opacity = 0;
   document.getElementById("normaloptionafter").style.opacity = 0;
   document.getElementById("normaloptionafter").style.bottom = "-100%";
   document.getElementById("easyhighscoreafter").style.opacity = 0;
   document.getElementById("hardhighscoreafter").style.opacity = 0;
   document.getElementById("normalhighscoreafter").style.opacity = 0;
 }

 function startgame() {
   select = 0;
   lives = 100;
   score = 100;
   document.getElementById("DOsetting").style.opacity = 0.0;
   document.getElementById("startmenu").style.height = "0%";
   document.getElementById("gametitle").style.opacity = 0;
   document.getElementById("gameinfo1").style.opacity = 0;
   document.getElementById("gameinfo2").style.opacity = 0;
   document.getElementById("gameinfo3").style.opacity = 0;
   document.getElementById("easyoption").style.opacity = 0;
   document.getElementById("hardoption").style.opacity = 0;
   document.getElementById("normaloption").style.opacity = 0;
   document.getElementById("normaloption").style.bottom = "-100%";
   document.getElementById("easyhighscore").style.opacity = 0;
   document.getElementById("hardhighscore").style.opacity = 0;
   document.getElementById("normalhighscore").style.opacity = 0;
 }
 function showoptions() {
   select = 1;
   if ( score ==  0 ) {
     document.getElementById("easyoption").style.opacity = 1;
     document.getElementById("hardoption").style.opacity = 1;
     document.getElementById("normaloption").style.opacity = 1;
     document.getElementById("normaloption").style.bottom = "15%";
     document.getElementById("gamestart").style.opacity = 0;
     document.getElementById("gamestart").style.bottom = "-100%";
   }
   else {
     document.getElementById("easyoptionafter").style.opacity = 1;
     document.getElementById("hardoptionafter").style.opacity = 1;
     document.getElementById("normaloptionafter").style.opacity = 1;
     document.getElementById("normaloptionafter").style.bottom = "15%";
     document.getElementById("playagain").style.opacity = 0;
     document.getElementById("gamestart").style.bottom = "-100%";
   }
 }

 function hardmode() {
   diff = 1;
   scene.fog.color.set( "rgb(155,46,0)" );
   renderer.setClearColor( scene.fog.color );
   for ( var i = 0; i < blocks.length; i++ ) {
     blocks[i].material.color.set( "rgb(255,15,15)" );
   }
   for ( var i = 0; i < thrust.length; i++ ) {
     thrust[i].material.color.set( "rgb(255,255,100)" );
   }
   thrustlight.color.set( "rgb(255,255,100)" );
   border1.material.color.set( "rgb(55,0,0)" );
   border2.material.color.set( "rgb(55,0,0)" );
   cryst.material.color.set( "rgb(155,155,255)" );
 }

function normalmode() {
  diff = 0.2;
   scene.fog.color.set( "rgb(155,255,155)" );
   renderer.setClearColor( scene.fog.color );
   for ( var i = 0; i < blocks.length; i++ ) {
     blocks[i].material.color.set( "rgb(55,255,55)" );
   }
   for ( var i = 0; i < thrust.length; i++ ) {
     thrust[i].material.color.set( "rgb(55,55,255)" );
   }
   thrustlight.color.set( "rgb(55,55,255)" );
   border1.material.color.set( "rgb(55,155,55)" );
   border2.material.color.set( "rgb(55,155,55)" );
   cryst.material.color.set( "rgb(155,155,255)" );
}

 function easymode() {
   diff = 0.1;
   scene.fog.color.set( "rgb(155,155,255)" );
   renderer.setClearColor( scene.fog.color );
   for ( var i = 0; i < blocks.length; i++ ) {
     blocks[i].material.color.set( "rgb(15,15,255)" );
   }
   for ( var i = 0; i < thrust.length; i++ ) {
     thrust[i].material.color.set( "rgb(0,255,0)" );
   }
   thrustlight.color.set( "rgb(0,255,0)" );
   border1.material.color.set( "rgb(0,0,55)" );
   border2.material.color.set( "rgb(0,0,55)" );
   cryst.material.color.set( "rgb(55,55,55)" );
 }

 function DOcontrols() {
   if ( DOon == false ) {
     DOon = true;
     document.getElementById("DOsetting").style.backgroundColor = "rgba(0,255,0,0.35)";
     document.getElementById("DOsettingafter").style.backgroundColor = "rgba(0,255,0,0.35)";
   }
  else {
     DOon = false;
     document.getElementById("DOsetting").style.backgroundColor = "rgba(255,0,0,0.35)";
     document.getElementById("DOsettingafter").style.backgroundColor = "rgba(255,0,0,0.35)";
   }
 }
