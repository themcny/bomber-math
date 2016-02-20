

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Problem() {
  this.number1 = getRandomInt(1, 12);
  this.number2 = getRandomInt(1, 12);
  this.question = this.number1 + " * " + this.number2 + " = ?";
  this.answer = this.number1 * this.number2;

}