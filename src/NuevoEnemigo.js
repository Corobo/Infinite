var NuevoEnemigo = cc.Class.extend({
    direccion: "derecha",
    space:null,
    sprite:null,
    shape:null,
    layer:null,
    tiempoDisparo:0,
ctor:function (space, posicion, layer,tipo) {
    this.space = space;
    this.layer = layer;

    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 8; i++) {
        var str = "cuervo" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#cuervo1.png");
    // Cuerpo estática , no le afectan las fuerzas
    // Cuerpo dinámico, SI le afectan las fuerzas
    this.body = new cp.Body(5, Infinity);

    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);
    // Se añade el cuerpo al espacio
    this.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height);
    // agregar forma dinamica
    this.space.addShape(this.shape);
    if(tipo=="Infinite")
        this.shape.setCollisionType(tipoEnemigo);
    else
        this.shape.setCollisionType(tipoEnemigoPlataformas)
    // añadir sprite a la capa

    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);

    layer.addChild(this.sprite,10);

   }, moverAutomaticamente: function(){
        // invertir direccion

        // Velocidad baja ha colisionado con algo,
        if ( this.body.vx < 3 &&  this.body.vx > -3 ) {
           if (this.direccion == "derecha"){
               this.direccion = "izquierda";
               this.body.p.x = this.body.p.x -10; // Para que salga de la colisión
               this.sprite.scaleX = 1;
           } else {
               this.direccion = "derecha";
                this.body.p.x = this.body.p.x + 10; // Para que salga de la zona de colisión
               this.sprite.scaleX = -1;
           }
        }

        // Dar impulsos para mantener la velocidad
        if (this.direccion == "izquierda" && this.body.vx > -100){
            this.body.applyImpulse(cp.v(-100, 250), cp.v(0, 0));
        }
        if (this.direccion == "derecha" && this.body.vx < 100){
            this.body.applyImpulse(cp.v(100, 250), cp.v(0, 0));
        }



   } , eliminar: function (){
        // quita la forma
        this.space.removeShape(this.shape);

        // quita el cuerpo
        this.space.removeBody(this.shape.getBody());

        // quita el sprite
        this.layer.removeChild(this.sprite);
    }, disparar: function(){
        if(new Date().getTime() - this.tiempoDisparo > 1000 ){
            this.tiempoDisparo = new Date().getTime();
            var disparo = new Disparo(this.space,
              cc.p(this.body.p.x, this.body.p.y),
              this.layer,true);
              if(this.direccion=="derecha")
                disparo.body.vx = 350;
              else
                disparo.body.vx = -350;
            this.layer.disparos.push(disparo);
        }
    }
});
