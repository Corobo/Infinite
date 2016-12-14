
var GameModeSelect = cc.LayerColor.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super(cc.color(0, 0, 0, 180));

        var winSize = cc.director.getWinSize();

        var boton1 = new cc.MenuItemSprite(
            new cc.Sprite(res.boton_plataformas_png),
            new cc.Sprite(res.boton_plataformas_png),
            this.pulsarBoton1, this);

        var menu = new cc.Menu(boton1);
        menu.setPosition(winSize.width / 2, winSize.height / 2);

        this.addChild(menu);

        var boton2 = new cc.MenuItemSprite(
            new cc.Sprite(res.boton_infinite_png),
            new cc.Sprite(res.boton_infinite_png),
            this.pulsarBoton2, this);

        var menu = new cc.Menu(boton2);
        menu.setPosition(winSize.width / 2, winSize.height / 2.5);

        this.addChild(menu);
    },
    pulsarBoton1:function (sender) {
        // Volver a ejecutar la escena Prinicpal
        cc.director.runScene(new GameLevelLayer("Plataformas"));
    },pulsarBoton2:function (sender) {
            // Volver a ejecutar la escena Prinicpal
            cc.director.runScene(new GameLevelLayer("Infinite"));
    }
});
