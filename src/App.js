import React, { useState } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import './App.css';
import sampleData from './sampleData';
import GraphNode from './three-objects/GraphNode';
import GraphLink from './three-objects/GraphLink';
import ForceDirectedGraph from './components/ForceDirectedGraph';

const App = () => {
  const [data, setData] = useState(sampleData);
  return <ForceDirectedGraph data={data} />
}

export default App;
