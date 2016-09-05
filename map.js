function Map(width, height) {
   this.width = width;
   this.height = height;
   this.pixelWidth = width * HEX_WIDTH + HALF_HEX_WIDTH;
   this.pixelHeight = HEX_HEIGHT * 2 + ((height - 1) * (HEX_HEIGHT * 3 / 2));
   this.hexes = new Array(width);
   var x, y;
   for (x = 0; x < width; x++) {
      this.hexes[x] = new Array(height);
      for (y = 0; y < height; y++) {
         this.hexes[x][y] = new Hex('#6C6');
      }
   }
   this.regions = [];
}

Map.prototype.render = function(context) {
   var x, y;
   for (x = 0; x < this.width; x++) {
      for (y = 0; y < this.height; y++) {
         this.hexes[x][y].render(context, x, y);
      }
   }
}