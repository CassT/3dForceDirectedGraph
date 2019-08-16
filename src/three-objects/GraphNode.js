import * as THREE from 'three';

const equilibriumLinkLength = 30;
const springConstant = 10;

const geometry = (size) => new THREE.SphereGeometry(size, 32, 32);
const material = new THREE.MeshPhongMaterial({
  color: 0x156289,
  emissive: 0x072534,
  side: THREE.DoubleSide,
  flatShading: true,
});

export default class GraphNode {
  constructor({ref, label, size}) {
    this.ref = ref;
    this.label = label;
    this.size = size;
    this.mesh = new THREE.Mesh(geometry(size), material);
    this.velocity = {x: 0, y: 0, z: 0};
  }

  calculateForce = (nodes, links) => {
    const currentPosition = this.mesh.position;
    const otherNodes = nodes.filter(node => node.ref !== this.ref);
    const ownSize = this.size;
    const ownRef = this.ref;
    let force = {x: 0, y: 0, z: 0};
    otherNodes.forEach(node => {
      // repulsive force
      const r = {
        x: currentPosition.x - node.mesh.position.x,
        y: currentPosition.y - node.mesh.position.y,
        z: currentPosition.z - node.mesh.position.z,
      };
      const repulsiveMultiplier = ownSize * node.size / (r.x^2 + r.y^2 + r.z^2)^(3/2);
      force.x += + r.x * repulsiveMultiplier;
      force.y += + r.y * repulsiveMultiplier;
      force.z += + r.z * repulsiveMultiplier;

      // spring force from links
      const areConnected = links.find(link => 
        link.source === ownRef && link.target === node.ref || 
        link.target === ownRef && link.source === node.ref
      );
      if (areConnected) {
        force.x += -r.x * springConstant;
        force.y += -r.y * springConstant;
        force.z += -r.z * springConstant;
      }
    });

    return force;
  }

  nextVelocity = (nodes, links) => {
    const force = this.calculateForce(nodes, links);
    this.velocity = {
      x: this.velocity.x + force.x / (this.size * 100),
      y: this.velocity.y + force.y / (this.size * 100),
      z: this.velocity.z + force.z / (this.size * 100),
    };
    return this.velocity;
  }
}

