class Circle {
  constructor(x, y, ctx, ref, color) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.color = color;

    this.ref = ref;

    this.updateInFB();
  }

  dibujar() {
    ctx.beginPath();
    ctx.arc(this.getX(), this.getY(), 15, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.stroke();
    ctx.fill();
  }

  updateInFB() {
    this.ref.update({
      'y': this.y,
      'x': this.x
    });
  }

  getRef() {
    return this.ref;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  left() {
    this.x -= 10;
    this.updateInFB();
  }

  right() {
    this.x += 10;
    this.updateInFB();
  }

  up() {
    this.y -= 10;
    this.updateInFB();
  }

  down() {
    this.y += 10;
    this.updateInFB();
  }

}

