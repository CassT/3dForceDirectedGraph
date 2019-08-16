import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import GraphNode from '../three-objects/GraphNode';
import GraphLink from '../three-objects/GraphLink';

export default class ForceDirectedGraph extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.addSceneObjects();
    this.startAnimationLoop();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  render() {
    const style={width: '900px', height: '900px'};
    return <div ref={ref => (this.el = ref)} style={style} />;
  }

  sceneSetup = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    this.controls = new OrbitControls(this.camera, this.el);

    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.el.appendChild(this.renderer.domElement);
  }

  addSceneObjects = () => {
    const { data } = this.props;

    // initialize nodes
    this.nodes = data.nodes.map(nodeData => {
      return new GraphNode(nodeData);
    });
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].mesh.position.set(i*10 - 20, 20*Math.random() - 10, 20*Math.random());
    }
    this.nodes.forEach(node => this.scene.add(node.mesh));

    // initialize links
    this.links = [];
    data.links.forEach(link => {
      const graphLink = new GraphLink({
        source: link.source, 
        target: link.target, 
      });
      const sourcePosition = this.nodes.find(node => node.ref === link.source).mesh.position;
      const targetPosition = this.nodes.find(node => node.ref === link.target).mesh.position;
      graphLink.updateVertices(sourcePosition, targetPosition);
      this.links.push(graphLink);
      this.scene.add(graphLink.lineObject);
    });

    // add lighting
    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    lights.forEach(light => this.scene.add(light));
  }

  startAnimationLoop = () => {
    this.renderer.render(this.scene, this.camera);
    // this.nodes.forEach(node => node.mesh.translateX(2));
    this.nodes.forEach(node => {
      const nodeVelocity = node.nextVelocity(this.nodes, this.links);
      node.mesh.translateX(nodeVelocity.x);
      node.mesh.translateY(nodeVelocity.y);
      node.mesh.translateZ(nodeVelocity.z)
    });
    this.updateLinks();
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  updateLinks = () => {
    const nodes = this.nodes;
    this.links.forEach(link => {
      const sourcePosition = nodes.find(node => node.ref === link.source).mesh.position;
      const targetPosition = nodes.find(node => node.ref === link.target).mesh.position;
      link.updateVertices(sourcePosition, targetPosition);
    });
  }

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}