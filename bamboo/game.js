var Game = function (pConfig) {
    'use strict';
    var self = this;
    self.states = [];
    self.currentState = null;

    // -------------------------------------------------------------------- init

    self.loop = new Bamboo.loop(pConfig.FPS);
    self.assets = new Bamboo.assets();
    self.inputs = new Bamboo.inputs(pConfig.canvas);
    self.screen = new Bamboo.screen(pConfig.width, pConfig.height);
    self.renderer = new Bamboo.renderer(pConfig.canvas);

    self.start = function () {

        // ---------------------------------------------------------- add states

        pConfig.states.forEach(function (state) {
            self.addState(state);
        });

        // -------------------------------------------------- load initial state

        self.switchState(pConfig.initialState);
        
        self.loop.start(function () {

            if (self.currentState) {

                // -------------------------------------------------- initialize

                if (!self.currentState.initialized) {
                    self.currentState.init();
                }
                
                // ----------------------------------------------------- preload

                if (!self.currentState.preloaded) {

                    //  before preload
                    self.currentState.beforePreload();

                    self.currentState.preloaded = true;
                    self.currentState.preload();
                    self.assets.loadAll();
                }

                // ----------------------------------------------- after preload

                self.currentState.loading();

                // ------------------------------------------------------ create

                if (!self.currentState.created &&
                    self.currentState.preloaded &&
                    !self.assets.loading) {

                    // before create
                    self.currentState.beforeCreate();

                    self.currentState.created = true;
                    self.currentState.create();

                    // after create
                    self.currentState.afterCreate();
                }

                // ------------------------------------------------------ update

                if (self.currentState.created) {
                    self.currentState.events.update();
                    if (self.currentState.physics.initialized) {
                        self.currentState.physics.update();
                    }
                    self.currentState.update();
                    self.currentState.time.update(self.loop.delta);
                
                    // -------------------------------------------------- render

                    if (self.currentState.physics.initialized) {
                        self.currentState.physics.debugDraw();
                    }
                    
                    self.renderer.draw(
                        self.currentState.entities.pool,
                        self.currentState.cameras.current,
                        self.screen
                    );

                    // --------------------------------------------- post render
                    
                    self.currentState.postRender();
                    
                }
            }
        });
    };

    // ------------------------------------------------------------ core methods

    self.addState = function(pState) {
        pState.game = self;
        pState.loop = self.loop;
        pState.assets = self.assets;
        pState.inputs = self.inputs;
        pState.screen = self.screen;
        pState.renderer = self.renderer;
        self.states.push(pState);
    };

    self.switchState = function(pStateName) {
        self.states.forEach(function (state) {
            if (state.name === pStateName) {
                self.currentState = state;
            }
        });
    };

    self.nextState = function() {
        var currentIndex = self.states.indexOf(self.currentState);
        var nextIndex = (currentIndex + 1) % self.states.length;
        self.currentState = self.states[nextIndex];
    };

    self.previousState = function() {
        var currentIndex = self.states.indexOf(self.currentState);
        var previousIndex = currentIndex - 1;
        if (previousIndex < 0) {
            previousIndex = self.states.length - 1;
        }
        self.currentState = self.states[previousIndex];
    };

};