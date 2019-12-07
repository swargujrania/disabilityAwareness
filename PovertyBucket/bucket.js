class Bucket {
  constructor(x, label, w) {
    this.label = label;
    this.x = x;
    this.y = 600;
    this.w = w;

    this.x1 = this.x - this.w / 2
    this.x2 = this.x + this.w / 2;
  }

  showBucket(svg) {
    svg.append('line')
      .attr('x1', this.x1)
      .attr('y1', this.y)
      .attr('x2', this.x2)
      .attr('y2', this.y)
      .style('stroke', 'black')
      .style('stroke-width', 2);
  }

  showLabel(svg) {
    svg.append('text')
      .text(this.label)
      .attr('x', this.x)
      .attr('y', this.y + 30)
      .style('text-anchor', 'middle');
  }
}