const HEX_WIDTH = 64;
const HALF_HEX_WIDTH = HEX_WIDTH / 2;
const HEX_HEIGHT = HEX_WIDTH / Math.sqrt(3);
const HALF_HEX_HEIGHT = HEX_HEIGHT / 2;

function Hex(color) {
   this.color = color;
   this.lineColor = '#000';
   
}

Hex.prototype.render = function(context, x, y) {
   context.lineWidth = 1;
   context.strokeStyle = this.lineColor;
   context.fillStyle = this.color;
   
   var px = x * HEX_WIDTH;
   if (y % 2 == 1) {
      px += HALF_HEX_WIDTH;
   }
   var py = y * 3 * HALF_HEX_HEIGHT;
   
   context.beginPath();
   context.moveTo(px + HALF_HEX_WIDTH, py);
   context.lineTo(px +      HEX_WIDTH, py +     HALF_HEX_HEIGHT);
   context.lineTo(px +      HEX_WIDTH, py + 3 * HALF_HEX_HEIGHT);
   context.lineTo(px + HALF_HEX_WIDTH, py + 2 *      HEX_HEIGHT);
   context.lineTo(px                 , py + 3 * HALF_HEX_HEIGHT);
   context.lineTo(px                 , py +     HALF_HEX_HEIGHT);
   context.closePath();
   context.fill();
   context.stroke();
   
   context.fillStyle = '#000';
   context.textAlign = "center";
   context.fillText(x + ", " + y, px + HALF_HEX_WIDTH, py + 8 * HEX_HEIGHT / 5);
}

function pixelToHex(x, y, tileSize) {
	var xHex = Math.floor(x / (tileSize[0] / 2));
	var yHex = Math.floor(y / (tileSize[1] / 4));

	var column = [Math.floor(xHex / 2), Math.floor((xHex - 1) / 2)];
	var row;
	if (yHex % 3 !== 0) {
		row = Math.floor(yHex / 3);
		column = column[row % 2];
		if (column < 0) {
			return undefined;
		}
		return [column, row];
	} else {
		row = [Math.floor(yHex / 3), Math.ceil(yHex / 3)];
	}

	var determinant;
	var line;
	var coords;
	if (yHex % 3 === 0) {
		if (yHex % 2 === 0) {
			if (xHex % 2 === 0) {
				// Top left
				line = [
					[xHex, (yHex + 1)],
					[(xHex + 1), yHex]
				];
				coords = [
					[Math.floor(xHex / 2), Math.floor(yHex / 3)],
					[Math.floor(xHex / 2) - 1, Math.floor(yHex / 3) - 1]
				];
			} else {
				// Top right
				line = [
					[xHex, yHex],
					[(xHex + 1), (yHex + 1)]
				];
				coords = [
					[Math.floor(xHex / 2), Math.floor(yHex / 3)],
					[Math.floor(xHex / 2), Math.floor(yHex / 3) - 1]
				];
			}
		} else {
			if (xHex % 2 === 0) {
				// Bottom left
				line = [
					[xHex, yHex],
					[(xHex + 1), (yHex + 1)]
				];
				coords = [
					[Math.floor(xHex / 2) - 1, Math.floor(yHex / 3)],
					[Math.floor(xHex / 2), Math.floor(yHex / 3) - 1]
				];
			} else {
				// Bottom right
				line = [
					[xHex, (yHex + 1)],
					[(xHex + 1), yHex]
				];
				coords = [
					[Math.floor(xHex / 2), Math.floor(yHex / 3)],
					[Math.floor(xHex / 2), Math.floor(yHex / 3) - 1]
				];
			}
		}

		line[0][0] *= (tileSize[0] / 2);
		line[0][1] *= (tileSize[1] / 4);
		line[1][0] *= (tileSize[0] / 2);
		line[1][1] *= (tileSize[1] / 4);

		determinant = ((line[1][0] - line[0][0]) * (y - line[0][1]));
		determinant -= ((x - line[0][0]) * (line[1][1] - line[0][1]));

		if (determinant > 0) {
			coords = coords[0];
		} else if (determinant < 0) {
			coords = coords[1];
		}

		if (coords[0] < 0 || coords[1] < 0) {
			return undefined;
		}
		return coords;
	}
	return undefined;
}

