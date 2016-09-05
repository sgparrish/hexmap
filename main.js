function main() {
   var map = new Map(35, 25);

   setupSlider();
   setupCanvasControl(map);
}

function setupSlider() {
   var dragging = false;
   var mapPane = document.getElementById("mapPane");
   var textPane = document.getElementById("textPane");
   var slider = document.getElementById("slider");

   slider.addEventListener('mousedown', function(e) {
      e.preventDefault();

      dragging = true;
      document.onmousemove = function(e) {
         if (dragging) {
            mapPane.style.width = e.pageX + "px";
            textPane.style.left = e.pageX + "px";

         }
      };
   });

   document.addEventListener('mouseup', function(e) {
      if (dragging) {
         dragging = false;
      }
   });
}

function setupCanvasControl(map) {
   var canvas = document.getElementById("mainCanvas");
   var isDown = false;
   var transform = new Transform();
   var prevPoint = [];

   setInterval(function() {
      render(canvas, transform, map);
   }, 500);

   canvas.addEventListener('mousedown', function(e) {
      isDown = true;

      var x = e.pageX - canvas.offsetLeft;
      var y = e.pageY - canvas.offsetTop;

      prevPoint = [x, y];
   });

   document.addEventListener('mouseup', function(e) {
      isDown = false;
   });

   document.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      var x = e.pageX - canvas.offsetLeft;
      var y = e.pageY - canvas.offsetTop;

      var mousePoint = transform.transformPointInverse(x, y);
      var lastPoint = transform.transformPointInverse(prevPoint[0], prevPoint[1]);

      var translateX = mousePoint[0] - lastPoint[0];
      var translateY = mousePoint[1] - lastPoint[1];

      transform.translate(translateX, translateY);

      transform.clamp(map.pixelWidth, map.pixelHeight, canvas);

      prevPoint = [x, y];

      render(canvas, transform, map);
   });

   canvas.addEventListener('wheel', function(e) {
      var x = e.pageX - canvas.offsetLeft;
      var y = e.pageY - canvas.offsetTop;

      var mousePoint = transform.transformPointInverse(x, y);

      var factor = Math.pow(1.1, (e.deltaY / -40.0));

      transform.translate(mousePoint[0], mousePoint[1]);
      transform.scale(factor, factor);
      transform.translate(-mousePoint[0], -mousePoint[1]);

      transform.clamp(map.pixelWidth, map.pixelHeight, canvas);

      canvas.parentElement.style.transform("scale(" + transform.m[0] + ")");

      render(canvas, transform, map);
   });
}

function render(canvas, transform, map) {
   canvas.width = canvas.parentElement.clientWidth;
   canvas.height = canvas.parentElement.clientHeight;
   var context = canvas.getContext("2d");
   context.setTransform(
      transform.m[0],
      transform.m[1],
      transform.m[2],
      transform.m[3],
      transform.m[4],
      transform.m[5]
   );
   context.save();
   context.setTransform(1, 0, 0, 1, 0, 0);
   context.clearRect(0, 0, canvas.width, canvas.height);
   context.restore();
   map.render(context);
}