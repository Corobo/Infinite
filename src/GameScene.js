var tipoSuelo = 1;
var tipoJugador = 2;
var tipoMoneda = 3;
var tipoMuro = 4;
var tipoEnemigo = 5;
var tipoMeta = 6;
var tipoDisparo = 7;
var nivelActual = 1;

var GameLayer = cc.Layer.extend({
    _emitter: null,
    tiempoEfecto:0,
    monedas:[],
    space:null,
    mapa: null,
    mapaAncho: null,
    jugador: null,
    formasEliminar:[],
    disparos:[],
    enemigos:[],
    ctor:function () {
        this._super();
        var size = cc.winSize;

        cc.spriteFrameCache.addSpriteFrames(res.moneda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_subiendo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_avanzando_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.disparo_plist);

        // Inicializar Space
         this.space = new cp.Space();
         this.space.gravity = cp.v(0, -350);
         // Depuración
         this.depuracion = new cc.PhysicsDebugNode(this.space);
         this.addChild(this.depuracion, 10);

         this.jugador = new Jugador(this, cc.p(50,150));
         this.cargarMapa();
         this.scheduleUpdate();

          // suelo y jugador
          this.space.addCollisionHandler(tipoSuelo, tipoJugador,
                null, null, this.collisionSueloConJugador.bind(this), null);
          // jugador y moneda
          // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión por la propiedad SENSOR de la Moneda).
          this.space.addCollisionHandler(tipoJugador, tipoMoneda,
                null, this.collisionJugadorConMoneda.bind(this), null, null);
          this.space.addCollisionHandler(tipoJugador, tipoEnemigo,
               null, this.collisionJugadorConEnemigo.bind(this), null, null);
          this.space.addCollisionHandler(tipoJugador, tipoMeta,
                         null, this.collisionJugadorConMeta.bind(this), null, null);
          this.space.addCollisionHandler(tipoEnemigo, tipoMuro,
                                   null, this.collisionEnemigoConMuro.bind(this), null, null);
          this.space.addCollisionHandler(tipoDisparo, tipoEnemigo,
                      null, this.colisionDisparoConEnemigo.bind(this), null, null);
          this.space.addCollisionHandler(tipoDisparo, tipoSuelo,
                     null, this.colisionDisparoConSuelo.bind(this), null, null);
        // Declarar emisor de particulas (parado)
          this._emitter =  new cc.ParticleGalaxy.create();
          this._emitter.setEmissionRate(0);
        //this._emitter.texture = cc.textureCache.addImage(res.fire_png);
          this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
          this.addChild(this._emitter,10);


         return true;
    },update:function (dt) {
          this.jugador.estado = estadoSaltando;
          this.space.step(dt);

          for (var i = 0; i < this.enemigos.length; i++) {
                   this.enemigos[i].update(dt, this.jugador.body.p.x);
          }

          // Control de emisor de partículas
          if (this.tiempoEfecto > 0){
               this.tiempoEfecto = this.tiempoEfecto - dt;
               this._emitter.x =  this.jugador.body.p.x;
               this._emitter.y =  this.jugador.body.p.y;

          }
          if (this.tiempoEfecto < 0) {
               this._emitter.setEmissionRate(0);
               this.tiempoEfecto = 0;
          }


          // Controlar el angulo (son radianes) max y min.
           if ( this.jugador.body.a > 0.44 ){
               this.jugador.body.a = 0.44;
           }
           if ( this.jugador.body.a < -0.44){
               this.jugador.body.a = -0.44;
           }
           // controlar la velocidad X , max y min
           if (this.jugador.body.vx < 250){
               this.jugador.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));
           }
           if (this.jugador.body.vx > 400){
               this.jugador.body.vx = 400;
           }
           // controlar la velocidad Y , max
           if (this.jugador.body.vy > 450){
               this.jugador.body.vy = 450;
           }

           // Ampliacion Scroll eje Y
           var posicionXCamara = this.jugador.body.p.x - this.getContentSize().width/2;
           var posicionYCamara = this.jugador.body.p.y - this.getContentSize().height/2;

           if ( posicionXCamara < 0 ){
              posicionXCamara = 0;
           }
           if ( posicionXCamara > this.mapaAncho - this.getContentSize().width ){
              posicionXCamara = this.mapaAncho - this.getContentSize().width;
           }

           if ( posicionYCamara < 0 ){
               posicionYCamara = 0;
           }
           if ( posicionYCamara > this.mapaAlto - this.getContentSize().height ){
               posicionYCamara = this.mapaAlto - this.getContentSize().height ;
           }

           this.setPosition(cc.p( - posicionXCamara , - posicionYCamara));



           // Caída, sí cae vuelve a la posición inicial
            if( this.jugador.body.p.y < -100){
               cc.director.pause();
               cc.director.runScene(new GameOverLayer());
            }
            // Eliminar formas:
            for(var i = 0; i < this.formasEliminar.length; i++) {
               var shape = this.formasEliminar[i];

               for (var j = 0; j < this.monedas.length; j++) {
                 if (this.monedas[j].shape == shape) {
                       this.monedas[j].eliminar();
                       this.monedas.splice(j, 1);
                 }
               }
               for (var j = 0; j < this.enemigos.length; j++){
                if(this.enemigos[j].shape == shape){
                    this.enemigos[j].eliminar();
                    this.enemigos.splice(j,1);
                }
               }
               for (var j = 0; j < this.disparos.length; j++) {
                   if (this.disparos[j].shape == shape) {
                       this.disparos[j].eliminar();
                       this.disparos.splice(j, 1);
                   }
               }
            }
            this.formasEliminar = [];

    }, cargarMapa:function () {
         enemigos = [];
         monedas = [];
         this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
         // Añadirlo a la Layer
         this.addChild(this.mapa);
         // Ancho del mapa
         this.mapaAncho = this.mapa.getContentSize().width;

         // Solicitar los objeto dentro de la capa Suelos
         var grupoSuelos = this.mapa.getObjectGroup("Suelos");
         var suelosArray = grupoSuelos.getObjects();

         // Los objetos de la capa suelos se transforman a
         // formas estáticas de Chipmunk ( SegmentShape ).
         for (var i = 0; i < suelosArray.length; i++) {
             var suelo = suelosArray[i];
             var puntos = suelo.polylinePoints;
             for(var j = 0; j < puntos.length - 1; j++){
                 var bodySuelo = new cp.StaticBody();

                 var shapeSuelo = new cp.SegmentShape(bodySuelo,
                     cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                         parseInt(suelo.y) - parseInt(puntos[j].y)),
                     cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                         parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                     10);

                shapeSuelo.setCollisionType(tipoSuelo);
                this.space.addStaticShape(shapeSuelo);
             }
         }

         var grupoMuros = this.mapa.getObjectGroup("Muros");
         var murosArray = grupoMuros.getObjects();

          // Los objetos de la capa muros se transforman a
          // formas estáticas de Chipmunk ( SegmentShape ).
          for (var i = 0; i < murosArray.length; i++) {
              var muro = murosArray[i];
              var puntos = muro.polylinePoints;
              for(var j = 0; j < puntos.length - 1; j++){
                  var bodyMuro = new cp.StaticBody();

                  var shapeMuro = new cp.SegmentShape(bodyMuro,
                      cp.v(parseInt(muro.x) + parseInt(puntos[j].x),
                          parseInt(muro.y) - parseInt(puntos[j].y)),
                      cp.v(parseInt(muro.x) + parseInt(puntos[j + 1].x),
                          parseInt(muro.y) - parseInt(puntos[j + 1].y)),
                      10);

                 shapeMuro.setCollisionType(tipoMuro);
                 shapeMuro.setSensor(true);
                 this.space.addStaticShape(shapeMuro);
              }
          }

          var grupoMeta = this.mapa.getObjectGroup("Meta");
           var metaArray = grupoMeta.getObjects();

            // Los objetos de la capa muros se transforman a
            // formas estáticas de Chipmunk ( SegmentShape ).
            for (var i = 0; i < metaArray.length; i++) {
                var meta = metaArray[i];
                var puntos = meta.polylinePoints;
                for(var j = 0; j < puntos.length - 1; j++){
                    var bodyMeta = new cp.StaticBody();

                    var shapeMeta = new cp.SegmentShape(bodyMeta,
                        cp.v(parseInt(meta.x) + parseInt(puntos[j].x),
                            parseInt(meta.y) - parseInt(puntos[j].y)),
                        cp.v(parseInt(meta.x) + parseInt(puntos[j + 1].x),
                            parseInt(meta.y) - parseInt(puntos[j + 1].y)),
                        10);

                   shapeMeta.setCollisionType(tipoMeta);
                   shapeMeta.setSensor(true);
                   this.space.addStaticShape(shapeMeta);
                }
            }

         var grupoMonedas = this.mapa.getObjectGroup("Monedas");
         var monedasArray = grupoMonedas.getObjects();
         for (var i = 0; i < monedasArray.length; i++) {
           var moneda = new Moneda(this,
               cc.p(monedasArray[i]["x"],monedasArray[i]["y"]));
           this.monedas.push(moneda);
         }
         var grupoEnemigos = this.mapa.getObjectGroup("Enemigos");
         var enemigosArray = grupoEnemigos.getObjects();
         for (var i = 0; i < enemigosArray.length; i++) {
             var enemigo = new Enemigo(this,
                 cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]));

             this.enemigos.push(enemigo);
         }

      },collisionSueloConJugador:function (arbiter, space) {
             this.jugador.tocaSuelo();
      },collisionJugadorConMoneda:function (arbiter, space) {
                 // Emisión de partículas
                  this._emitter.setEmissionRate(5);
                  this.tiempoEfecto = 3;

                  // Impulso extra
                  this.jugador.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));

                  // Marcar la moneda para eliminarla
                  var shapes = arbiter.getShapes();
                  // shapes[0] es el jugador
                  this.formasEliminar.push(shapes[1]);

                  var capaControles =
                     this.getParent().getChildByTag(idCapaControles);
                  capaControles.agregarMoneda();

      },collisionJugadorConEnemigo:function (arbiter, space) {
            var capaControles = this.getParent().getChildByTag(idCapaControles);
            this.jugador.restaVida();
            var shapes = arbiter.getShapes();
            this.formasEliminar.push(shapes[1]);
            if(this.jugador.vidas<=0){
                cc.director.pause();
                cc.director.runScene(new GameOverLayer());
            }
            capaControles.actualizarVidas(this.jugador.vidas);
      },collisionJugadorConMeta:function (arbiter, space){
            nivelActual++;
            cc.director.pause();
            cc.director.runScene(new GameWinLayer());
      },collisionEnemigoConMuro:function (arbiter, space){

      },colisionDisparoConEnemigo:function (arbiter, space) {
             var shapes = arbiter.getShapes();

             this.formasEliminar.push(shapes[1]);
             this.formasEliminar.push(shapes[0]);
      },colisionDisparoConSuelo:function (arbiter, space) {
             var shapes = arbiter.getShapes();

             this.formasEliminar.push(shapes[0]);
      }

});

var idCapaJuego = 1;
var idCapaControles = 2;

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.director.resume();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer();
        this.addChild(controlesLayer, 0, idCapaControles);

    }
});
