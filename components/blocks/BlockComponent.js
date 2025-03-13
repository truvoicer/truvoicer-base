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

    function getBlockProps() {
        let blockProps = {
            ref: blockRef,
        };
        if (typeof styles === 'object') {
            blockProps.style = styles;
        }
        if (typeof classes === 'string') {
            blockProps.className = classes;
        }
        return blockProps;
    }

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
            <div {...getBlockProps()}>
                {children}
            </div>
        </BlockContext.Provider>
    );
};

export default BlockComponent;