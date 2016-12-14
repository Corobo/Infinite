var quieto = "quieto";
var correr = "correr";
var saltar = "saltar";
var disparando = "disparando";

var JugadorPlataformas = cc.Class.extend({
    contadorVelYCero: 0,
    estado: quieto,
    tiempoDisparando: 0,
    animacionDisparar:null,
    animacionQuieto:null,
    animacionCorrer:null,
    animacionSaltar:null,
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,

ctor:function (space, posicion, layer) {
    this.space = space;
    this.layer = layer;

    // animaciones - correr
    var framesAnimacion = [];
    for (var i = 1; i <= 8; i++) {
        var str = "playerrunright_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionCorrer = new cc.RepeatForever(new cc.Animate(animacion));
    //this.animacionCorrer.retain();

    // animaciones - saltar
    var framesAnimacion = [];
    for (var i = 1; i <= 3; i++) {
        var str = "playerjumpright_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionSaltar = new cc.RepeatForever(new cc.Animate(animacion));


    // animaciones - quieto
    var framesAnimacion = [];
    for (var i = 1; i <= 5; i++) {
        var str = "playeridleright_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionQuieto = new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 5; i++) {
        var str = "playeridleright_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));


    // Crear animación - disparar
    var framesAnimacion = [];
    for (var i = 1; i <= 3; i++) {
        var str = "playershootright_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionDisparar =
        new cc.Repeat(new cc.Animate(animacion),1);


    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#playeridleright_01.png");
    // Cuerpo dinamico, SI le afectan las fuerzas


    this.body = new cp.Body(1, Infinity);
    this.body.setPos(posicion);
    //body.w_limit = 0.02;
    this.body.setAngle(0);
    this.sprite.setBody(this.body);

    // Se añade el cuerpo al espacio
    this.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height);
    this.shape.setFriction(0);
    this.shape.setCollisionType(tipoJugadorPlataformas);
    //this.shape.setElasticity(0);
    // forma dinamica
    this.space.addShape(this.shape);
    // añadir sprite a la capa

    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);
    layer.addChild(this.sprite,10);


    }, moverIzquierda: function(){
        if ( this.estado != correr && this.tiempoDisparando <= 0 ) {
            this.estado = correr;
            this.sprite.stopAllActions();
            this.sprite.runAction(this.animacionCorrer);
        }
        this.sprite.scaleX = -1;

        this.body.applyImpulse(cp.v(-100, 0), cp.v(0, 0));

    }, moverDerecha: function(){
        if ( this.estado != correr && this.tiempoDisparando <= 0) {
            this.estado = correr;
            this.sprite.stopAllActions();
            this.sprite.runAction(this.animacionCorrer);
        }
        this.sprite.scaleX = 1;

        this.body.applyImpulse(cp.v(100, 0), cp.v(0, 0));

    }, moverArriba: function(){

       if ( this.body.vy < 3 && this.body.vy > - 3   ){
           this.contadorVelYCero  = this.contadorVelYCero +1 ;
       }

       console.log("vel Y:"+this.body.vy );

       if ( this.contadorVelYCero  > 1 ){
          if ( this.estado != saltar && this.tiempoDisparando <= 0) {
               this.estado = saltar;
               this.sprite.stopAllActions();
               this.sprite.runAction(this.animacionSaltar);
           }

           this.body.applyImpulse(cp.v(0, 300), cp.v(0, 0));
           this.contadorVelYCero = 0;
       }

    }, actualizarAnimacion: function(){
        if ( this.tiempoDisparando  > 0 ){
            this.tiempoDisparando  = this.tiempoDisparando  - 1;
        }
        if ( this.body.vy <= 10 && this.body.vy >= -10
           && this.body.vx <= 0.1 && this.body.vx >= -0.1 ){
              if( this.estado != quieto && this.tiempoDisparando <= 0){
                  this.estado = quieto;
                  this.sprite.stopAllActions();
                  this.sprite.runAction(this.animacionQuieto);
              }
        }

        if ( this.body.vy >= 10 || this.body.vy <= -10 ){
              if( this.estado != saltar && this.tiempoDisparando <= 0){
                  this.estado = saltar;
                  this.sprite.stopAllActions();
                  this.sprite.runAction(this.animacionSaltar);
              }
        }
    }, disparar: function(){
         this.sprite.stopAllActions();
         this.sprite.runAction(this.animacionDisparar);
         this.tiempoDisparando = 40;
         this.estado = disparando;
     }
});
