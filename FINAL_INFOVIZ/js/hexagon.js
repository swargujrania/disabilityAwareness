class Unit {
  constructor(unit, x, y) {
    this.status = unit.status;
    this.bracket = unit.bracket;
    this.x = x;
    this.y = y;

    this.points_init = `${x-4},${y-1000} ${x-2},${y-3.5-1000} ${x+2},${y-3.5-1000} ${x+4},${y-1000} ${x+2},${y+3.5-1000} ${x-2},${y+3.5-1000} ${x-4},${y-1000}`;
    this.points_final = `${x-4},${y} ${x-2},${y-3.5} ${x+2},${y-3.5} ${x+4},${y} ${x+2},${y+3.5} ${x-2},${y+3.5} ${x-4},${y}`;
  }
}