import * as THREE from 'three';

// export default ({sourcePosition, targetPosition}) => {
//   var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
//   var geometry = new THREE.Geometry();
//   geometry.vertices.push(sourcePosition);
//   geometry.vertices.push(targetPosition);
//   return new THREE.Line(geometry, material);
// }

const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
// const geometry = new THREE.Geometry();

export default class GraphLink {
  constructor({source, target}) {
    this.source = source;
    this.target = target;
    const geometry = new THREE.Geometry();
    // this.geometry = new THREE.Geometry();
    // this.geometry.vertices = [sourcePosition, targetPosition];
    this.lineObject = new THREE.Line(geometry, material);
    // this.lineObject.geometry.vertices = [sourcePosition, targetPosition];
  }

  updateVertices = (sourcePosition, targetPosition) => {
    this.lineObject.geometry.vertices = [sourcePosition, targetPosition];
    this.lineObject.geometry.verticesNeedUpdate = true;
  }
}