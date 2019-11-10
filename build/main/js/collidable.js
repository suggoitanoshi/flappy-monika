class Collidable {
    checkCollision(other) {
        if ((this.mask & other.mask) != 0) {
            if ((this.position[0] <= other.position[0] + other.size[0] && this.position[0] + this.size[0] >= other.position[0])) {
                if ((this.position[1] <= other.position[1] + other.size[1] && this.position[1] + this.size[1] >= other.position[1])) {
                    other.onCollide(this);
                    this.onCollide(other);
                    return true;
                }
            }
        }
        return false;
    }
    onCollide(other) { }
}
