import React from 'react';

export default props => {
    return (
        <div>
            <h1>Im header</h1>
            {props.children}
            <h1>Im footer</h1>
        </div>
    );
}