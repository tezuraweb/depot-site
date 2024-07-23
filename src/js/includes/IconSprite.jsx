import React from 'react';

const IconSprite = ({selector='', width = 12, height = 12, fill = 'none', classNames='', ...props}) => {
    return (
        <svg className={`icon icon-${selector} ${classNames}`} fill={fill} width={width} height={height} {...props}>
            <use xlinkHref={`#${selector}`} />
        </svg>
    );
};

export default IconSprite;
