//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
        width: 800,
        height: 600,
        antialiasing: true,
        transparent: false,
        resolution: 1
    }
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById('jeu').appendChild(app.view);

loader
    .add("medias/hero.png")
    .add("medias/bg-jeu.jpg")
    .add("medias/muchante.png")
    .load(setup);

//Define any variables that are used in more than one function
var hero, muchant, state, background;

function setup() {

    //Background
    background = new Sprite(resources["medias/bg-jeu.jpg"].texture);
    background.width = 800;
    background.height = 600;
    app.stage.addChild(background);

    //Create the `hero` sprite
    hero = new Sprite(resources["medias/hero.png"].texture);
    hero.vx = 0;
    hero.vy = 0;
    hero.height = 95;
    hero.width = 75;
    app.stage.addChild(hero);

    //Create the `muchant` sprite
    muchant = new Sprite(resources["medias/muchante.png"].texture);
    muchant.x = 725;
    muchant.y = Math.floor(Math.random() * 505);
    muchant.vx = 0;
    muchant.vy = 0;
    muchant.height = 95;
    muchant.width = 75;
    app.stage.addChild(muchant);

    //Set muchant's movements properties
    let speed = 5,
        direction = 1;
    muchant.vy = speed * direction;
    muchant.vx = speed * direction;

    //Capture the keyboard arrow keys
    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = () => {
        //Change the hero's velocity when the key is pressed
        hero.vx = -5;
        hero.vy = 0;
    }

    //Left arrow key `release` method
    left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the hero isn't moving vertically:
        //Stop the hero
        if (!right.isDown && hero.vy === 0) {
            hero.vx = 0;
        }
    }

    //Up
    up.press = () => {
        hero.vy = -5;
        hero.vx = 0;
    }
    up.release = () => {
        if (!down.isDown && hero.vx === 0) {
            hero.vy = 0;
        }
    }

    //Right
    right.press = () => {
        hero.vx = 5;
        hero.vy = 0;
    }
    right.release = () => {
        if (!left.isDown && hero.vy === 0) {
            hero.vx = 0;
        }
    }

    //Down
    down.press = () => {
        hero.vy = 5;
        hero.vx = 0;
    }
    down.release = () => {
        if (!up.isDown && hero.vx === 0) {
            hero.vy = 0;
        }
    }

    //Set the game state
    state = play;

    //Start the game loop
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){

    //Update the current game state:
    state(delta);
}

function play(delta) {

    //Use the hero's velocity to make it move
    hero.x += hero.vx;
    hero.y += hero.vy;

    //enemy movements
    muchant.x += muchant.vx;
    muchant.y += muchant.vy;
    let muchantHitsWall = contain(muchant, background);
    if (muchantHitsWall === "top" || muchantHitsWall === "bottom") {
        muchant.vy *= -1;
    }
    if (muchantHitsWall === "left" || muchantHitsWall === "right") {
        muchant.vx *= -1;
    }

    //Game area limit
    contain(hero, background);
    contain(muchant, background);

    //If there's a collision between hero and muchant
    //stop the hero's movements, popup, remove
    //the hero and refresh the page.
    if (hitTestRectangle(hero, muchant)) {
        hero.x = 0;
        hero.y = 0;
        muchant.x = 800;
        muchant.y = 600;
        alert("Vous avez perdu!");
        app.stage.removeChild(hero);
        app.stage.removeChild(muchant);
        window.location.reload();
    }
}

//The `keyboard` helper function
function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    }

    //The `upHandler`
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    }

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}
function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
}


//The `keyboard` helper function
function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

function contain(sprite, container) {

    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    //Return the `collision` value
    return collision;
}