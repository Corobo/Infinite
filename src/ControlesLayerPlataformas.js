
var ControlesLayerPlataformas = cc.Layer.extend({
    etiquetaMonedas:null,
    monedas:0,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Contador Monedas
        this.etiquetaMonedas = new cc.LabelTTF("Monedas: 0", "Helvetica", 20);
        this.etiquetaMonedas.setPosition(cc.p(size.width - 90, size.height - 20));
        this.etiquetaMonedas.fillStyle = new cc.Color(0, 0, 0, 0);
        this.addChild(this.etiquetaMonedas);


        this.scheduleUpdate();
        return true;
    },agregarMoneda:function(){
          this.monedas++;
          this.etiquetaMonedas.setString("Monedas: " + this.monedas);
    }

});

