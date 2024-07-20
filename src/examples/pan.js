var Example = Example || {};

Example.pan = function () {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Vector = Matter.Vector;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
            showAngleIndicator: false,
            showCollisions: false,
            showVelocity: false
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var group = Body.nextGroup(true);

    var stack_l = Composites.stack(250, 255, 1, 3, 0, 0, function (x, y) {
        return Bodies.rectangle(x, y, 30, 30, { friction: 0.95, frictionStatic: 10.0 });
    });
    var stack_r = Composites.stack(520, 255, 1, 3, 0, 0, function (x, y) {
        return Bodies.rectangle(x, y, 30, 30, { friction: 0.95, frictionStatic: 10.0 });
    });

    var catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });

    Composite.add(world, [
        stack_l,
        stack_r,
        catapult,
        Bodies.rectangle(250, 555 + 5, 20, 50, { isStatic: true, render: { fillStyle: '#060a19' } }),   // 顶梁柱y=555
        Bodies.rectangle(550, 555 + 5, 20, 50, { isStatic: true, render: { fillStyle: '#060a19' } }),
        Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group }, render: { fillStyle: '#060a19' } }),    // 天平

        // walls
        Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
        Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
        Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
        Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
        // |⬛| |⬜|
        Bodies.rectangle(250 - 10, 450, 10, 100, { isStatic: true, fraction: 0, fractionStatic: 0 }),
        Bodies.rectangle(250 + 10 + 30, 450, 10, 100, { isStatic: true, fraction: 0, fractionStatic: 0 }),
        Bodies.rectangle(520 - 10, 450, 10, 100, { isStatic: true, fraction: 0, fractionStatic: 0 }),
        Bodies.rectangle(520 + 10 + 30, 450, 10, 100, { isStatic: true, fraction: 0, fractionStatic: 0 }),

        Constraint.create({
            bodyA: catapult,
            pointB: Vector.clone(catapult.position),
            stiffness: 1.0,
            damping: 0,
            length: 0
        })
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

Example.pan.title = 'Balance pan';
Example.pan.for = '>=0.14.2';

if (typeof module !== 'undefined') {
    module.exports = Example.pan;
}

// 添加一个checkBox，样式悬浮
function add_checkBox() {
    var elem = document.createElement('input');
    elem.type = 'checkbox';
    elem.checked = true;

    elem.id = 'pan_on';
    elem.innerHTML = `<label for="${elem.id}">测试</label>`;

    elem.style.cssText = 'position:absolute;top:10%;left:50%;z-index:999;';
    elem.onchange = function () {
        var render = Example.pan().render;
        render.options.showCollisions = elem.checked;
        render.options.showVelocity = elem.checked;
        render.options.showAngleIndicator = elem.checked;
    }
    document.body.appendChild(elem);
}
add_checkBox();