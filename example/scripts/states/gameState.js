var gameState = new Bamboo.state('gameState');

gameState.create = function () {
    this.myCamera = this.cameras.current;
    this.myRefferenceEntity = this.entities.add(0, 0, 25, 25);
    //this.myEntity = this.entities.add(50, 50, 50, 50);
    //this.myEntity.texture = this.loader.getAsset('stone');
    this.myEntity = this.entities.addImage('stone', 50, 50, 50, 50);
    //console.log(this.myEntity);
    
    this.cameras.current.lerp = 5;
};

gameState.update = function () {

    if (this.inputs.keyboard.arrowUp) {
        this.myEntity.y -= this.time.toPPS(180);
    }
    if (this.inputs.keyboard.arrowRight) {
        this.myEntity.x += this.time.toPPS(180);
    }
    if (this.inputs.keyboard.arrowDown) {
        this.myEntity.y += this.time.toPPS(180);
    }
    if (this.inputs.keyboard.arrowLeft) {
        this.myEntity.x -= this.time.toPPS(180);
    }
    if (this.inputs.keyboard.w) {
        this.myCamera.zoom += this.time.toPPS(1);
    }
    if (this.inputs.keyboard.d) {
        this.myCamera.angle += this.time.toPPS(100);
    }
    if (this.inputs.keyboard.s) {
        this.myCamera.zoom -= this.time.toPPS(1);
    }
    if (this.inputs.keyboard.a) {
        this.myCamera.angle -= this.time.toPPS(100);
    }

    this.myCamera.follow(this.myEntity);
};

gameState.postRender = function () {
    this.renderer.context.fillText('currentState:    ' + this.name, 200, 15);
    this.renderer.context.fillText('state time:      ' +  Math.floor(this.time.current / 1000), 200, 30);
};