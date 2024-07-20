var Example = Example || {};

Example.pan = function () {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    World = Matter.World,
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
  // 创建天平的两端
  var leftSide = Bodies.rectangle(100, 200, 50, 10, { angle: -0.1 });
  var rightSide = Bodies.rectangle(200, 200, 50, 10, { angle: 0.1 });

  // 创建支点约束
  var pivot = Constraint.create({
    pointA: { x: 150, y: 200 },
    bodyB: leftSide,
    pointB: { x: 50, y: 0 },
    stiffness: 0.1,
    length: 50
  });
  Constraint.create({
    pointA: { x: 150, y: 200 },
    bodyB: rightSide,
    pointB: { x: -50, y: 0 },
    stiffness: 0.1,
    length: 50
  });

  // 添加物体到世界
  World.add(world, [
    leftSide, rightSide, pivot,
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
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