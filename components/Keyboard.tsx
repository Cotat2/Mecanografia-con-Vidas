import React from 'react';

const KEY_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  [' '], // Spacebar
];

interface KeyboardProps {
  userInput: string;
}

const Keyboard: React.FC<KeyboardProps> = ({ userInput }) => {
  const lastChar = userInput.slice(-1).toUpperCase();

  return (
    <div className="keyboard-container">
      <div className="keyboard flex flex-col items-center gap-2">
        {KEY_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 md:gap-2">
            {row.map((key) => {
              const isPressed = lastChar === key;
              const isSpacebar = key === ' ';

              const baseClasses = 'key rounded-md font-sans font-bold flex items-center justify-center select-none';
              const sizeClasses = isSpacebar 
                ? 'w-64 md:w-96 h-10' 
                : 'w-10 h-10 md:w-12 md:h-12';
              const pressedClass = isPressed ? 'pressed' : '';

              const keyClasses = `${baseClasses} ${sizeClasses} ${pressedClass}`;

              return (
                <div key={key} className={keyClasses}>
                  {isSpacebar ? '' : key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;