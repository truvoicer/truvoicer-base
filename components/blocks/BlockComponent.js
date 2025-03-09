import React, { useEffect, useRef, useState } from 'react';
import { BlockContext, blockContextData } from './contexts/BlockContext';

function BlockComponent({
    styles,
    classes,
    data = {},
    children
}) {
    const [blockConTextState, setBlockContextState] = useState({
        ...blockContextData
    });
    const blockRef = useRef(null);

    useEffect(() => {
        setBlockContextState(prevState => {
            let cloneState = { ...prevState };
            cloneState.ref = blockRef;
            return cloneState;
        });
    }, [blockRef]);
    
    return (
        <BlockContext.Provider value={blockConTextState}>
            {data?.title &&
                <h3 className="block-title">
                    <span>{data.title}</span>
                </h3>
            }
            <div ref={blockRef} className={`${classes}`} style={styles}>
                {children}
            </div>
        </BlockContext.Provider>
    );
};

export default BlockComponent;