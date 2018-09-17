class Circle {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
  }

  dibujar () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "#ff0000";
    ctx.fill();
  }

  moreX() {
    this.x += 10;
  }

  lessX() {
    this.x -= 10;
  }

  moreY() {
    this.y += 10;
  }

  lessY() {
    this.y -= 10;
  }
}

