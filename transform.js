function Transform() {
   this.reset();
}

Transform.prototype.copy = function() {
   var other = new Transform();
   other.m[0] = this.m[0];
   other.m[1] = this.m[1];
   other.m[2] = this.m[2];
   other.m[3] = this.m[3];
   other.m[4] = this.m[4];
   other.m[5] = this.m[5];
   return other;
}

Transform.prototype.reset = function() {
   this.m = [1, 0, 0, 1, 0, 0];
};

Transform.prototype.multiply = function(matrix) {
   var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
   var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

   var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
   var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

   var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
   var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

   this.m[0] = m11;
   this.m[1] = m12;
   this.m[2] = m21;
   this.m[3] = m22;
   this.m[4] = dx;
   this.m[5] = dy;
};

Transform.prototype.invert = function() {
   var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
   var m0 = this.m[3] * d;
   var m1 = -this.m[1] * d;
   var m2 = -this.m[2] * d;
   var m3 = this.m[0] * d;
   var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
   var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
   this.m[0] = m0;
   this.m[1] = m1;
   this.m[2] = m2;
   this.m[3] = m3;
   this.m[4] = m4;
   this.m[5] = m5;
};

Transform.prototype.rotate = function(rad) {
   var c = Math.cos(rad);
   var s = Math.sin(rad);
   var m11 = this.m[0] * c + this.m[2] * s;
   var m12 = this.m[1] * c + this.m[3] * s;
   var m21 = this.m[0] * -s + this.m[2] * c;
   var m22 = this.m[1] * -s + this.m[3] * c;
   this.m[0] = m11;
   this.m[1] = m12;
   this.m[2] = m21;
   this.m[3] = m22;
};

Transform.prototype.translate = function(x, y) {
   this.m[4] += this.m[0] * x + this.m[2] * y;
   this.m[5] += this.m[1] * x + this.m[3] * y;
};

Transform.prototype.scale = function(sx, sy) {
   this.m[0] *= sx;
   this.m[1] *= sx;
   this.m[2] *= sy;
   this.m[3] *= sy;
};

Transform.prototype.transformPoint = function(px, py) {
   var x = px;
   var y = py;
   px = x * this.m[0] + y * this.m[2] + this.m[4];
   py = x * this.m[1] + y * this.m[3] + this.m[5];
   return [px, py];
};

Transform.prototype.transformPointInverse = function(px, py) {
   other = this.copy();
   other.invert();
   return other.transformPoint(px, py);
};

Transform.prototype.clamp = function(width, height, canvas) {

   width *= this.m[0];
   height *= this.m[3];
   width = (canvas.width - width);
   height = (canvas.height - height);

   if (width >= 0) {
      if (this.m[4] < 0) {
         this.m[4] = 0;
      } else if (this.m[4] > width) {
         this.m[4] = width;
      }
   }
   if (width < 0) {
      if (this.m[4] > 0) {
         this.m[4] = 0;
      } else if (this.m[4] < width) {
         this.m[4] = width;
      }
   }
   if (height >= 0) {
      if (this.m[5] < 0) {
         this.m[5] = 0;
      } else if (this.m[5] > height) {
         this.m[5] = height;
      }
   } else {
      if (this.m[5] > 0) {
         this.m[5] = 0;
      } else if (this.m[5] < height) {
         this.m[5] = height;
      }
   }


};