import React from 'react';
import Export from './artifacts/react/renovation/viz/export';

function App() {
    return (
        <svg width="500" height="600">
            <Export x={0.5} y={0.5} color='#e6e6e6' strokeColor='#9d9d9d'/>
        </svg>
    );
}

export default App;
