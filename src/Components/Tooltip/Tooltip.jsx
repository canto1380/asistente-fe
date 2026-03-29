import React from 'react';
import { HelpCircle } from 'lucide-react';

const Tooltip = ({ text, children, position = 'top', width = 'w-64' }) => {
    const positionClasses = {
        top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
        bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
        left: 'right-full mr-2 top-1/2 -translate-y-1/2',
        right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-x-transparent border-b-transparent border-4',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-x-transparent border-t-transparent border-4',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-y-transparent border-r-transparent border-4',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-y-transparent border-l-transparent border-4',
    };

    return (
        <div className="relative inline-flex items-center group z-10">
            {children ? (
                children
            ) : (
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-primary-600 cursor-help transition-colors" />
            )}
            
            <div className={`whitespace-pre-line absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 ${width} p-2 text-xs text-white bg-gray-800 rounded shadow-lg pointer-events-none text-center leading-relaxed ${positionClasses[position]}`}>
                {text}
                <div className={`absolute ${arrowClasses[position]}`}></div>
            </div>
        </div>
    );
};

export default Tooltip;
