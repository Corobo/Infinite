
var ControlesLayer = cc.Layer.extend({
    spriteBotonSaltar:null,
    spriteBotonTurbo:null,
    etiquetaMonedas:null,
    etiquetaVidas:null,
    monedas:0,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Contador Monedas
        this.etiquetaMonedas = new cc.LabelTTF("Monedas: 0", "Helvetica", 20);
        this.etiquetaMonedas.setPosition(cc.p(size.width - 90, size.height - 20));
        this.etiquetaMonedas.fillStyle = new cc.Color(0, 0, 0, 0);
        this.addChild(this.etiquetaMonedas);

        // Contador Vidas
        this.etiquetaVidas = new cc.LabelTTF("Vidas: 3", "Helvetica", 20);
        this.etiquetaVidas.setPosition(cc.p(size.width - size.width+90, size.height - 20));
        this.etiquetaVidas.fillStyle = new cc.Color(0, 0, 0, 0);
        this.addChild(this.etiquetaVidas);

        // BotonSaltar
        this.spriteBotonSaltar = cc.Sprite.create(res.boton_saltar_png);
        this.spriteBotonSaltar.setPosition(
            cc.p(size.width*0.8, size.height*0.5));

        this.addChild(this.spriteBotonSaltar);

         // BotonTurbo
         this.spriteBotonTurbo = cc.Sprite.create(res.boton_turbo_png);
         this.spriteBotonTurbo.setPosition(
                cc.p(size.width*0.8, size.height*0.8));

         this.addChild(this.spriteBotonTurbo);

        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this)

        this.scheduleUpdate();
        return true;
    },update:function (dt) {

    },procesarMouseDown:function(event) {
        var instancia = event.getCurrentTarget();
        var areaBoton = instancia.spriteBotonSaltar.getBoundingBox();
        var areaTurbo = instancia.spriteBotonTurbo.getBoundingBox();

        // La pulsación cae dentro del botón
        if (cc.rectContainsPoint(areaBoton,
            cc.p(event.getLocationX(), event.getLocationY()) )){

            // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
            var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
            // tenemos el objeto GameLayer
            gameLayer.jugador.saltar();
        }
        if (cc.rectContainsPoint(areaTurbo,
            cc.p(event.getLocationX(), event.getLocationY()) )){
            var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
            gameLayer.jugador.turbo();
        }
    },agregarMoneda:function(){
          this.monedas++;
          this.etiquetaMonedas.setString("Monedas: " + this.monedas);

    },actualizarVidas:function(vidas){
        this.etiquetaVidas.setString("Vidas: " + vidas);
    }
});

