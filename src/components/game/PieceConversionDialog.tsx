'use client';

import React, { useState } from 'react';
import { Piece, PieceType } from '@/lib/types/game';
import { CONVERSION_RULES, PieceConversion } from '@/lib/game/conversion';

interface PieceConversionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  piece: Piece | null;
  onConvert: (piece: Piece, targetType: PieceType) => void;
}

const PieceConversionDialog: React.FC<PieceConversionDialogProps> = ({
  isOpen,
  onClose,
  piece,
  onConvert
}) => {
  const [selectedTarget, setSelectedTarget] = useState<PieceType | null>(null);

  const targetType = piece ? PieceConversion.getDirectConversionTarget(piece.type) : null;
  
  // Auto-select the target since there's only one option
  React.useEffect(() => {
    if (targetType) {
      setSelectedTarget(targetType);
    }
  }, [targetType]);

  if (!isOpen || !piece) {
    return null;
  }

  const getPieceIcon = (pieceType: PieceType): string => {
    const icons = {
      commander: '👑',
      soldier: '⚔️',
      guard: '🛡️',
      raider: '🗡️',
      horse: '🐎',
      elephant: '🐘',
      tower: '🏰',
      artillery: '💥'
    };
    return icons[pieceType] || '❓';
  };

  const getPieceName = (pieceType: PieceType): string => {
    const names = {
      commander: 'Commander',
      soldier: 'Soldier',
      guard: 'Guard',
      raider: 'Raider',
      horse: 'Horse',
      elephant: 'Elephant',
      tower: 'Tower',
      artillery: 'Artillery'
    };
    return names[pieceType] || 'Unknown';
  };

  const handleConvert = () => {
    console.log('Convert button clicked', { selectedTarget, piece });
    if (selectedTarget && piece) {
      onConvert(piece, selectedTarget);
      setSelectedTarget(null);
      onClose();
    }
  };

  console.log('Dialog state:', { 
    selectedTarget, 
    targetType, 
    piece: piece?.type,
    isButtonDisabled: !selectedTarget 
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Convert Piece
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Current Piece */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-2xl">{getPieceIcon(piece.type)}</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {getPieceName(piece.type)}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Position: ({piece.position.x}, {piece.position.y})
                </p>
              </div>
            </div>
          </div>

          {/* Conversion Preview */}
          {targetType && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Conversion Preview:
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-4">
                  {/* Current Piece */}
                  <div className="text-center">
                    <div className="text-2xl mb-2">{getPieceIcon(piece.type)}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {getPieceName(piece.type)}
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-3xl text-blue-600 dark:text-blue-400">→</div>
                  
                  {/* Target Piece */}
                  <div className="text-center">
                    <div className="text-2xl mb-2">{getPieceIcon(targetType)}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {getPieceName(targetType)}
                    </div>
                  </div>
                </div>
                
                {/* Conversion Description */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {CONVERSION_RULES[`${piece.type}->${targetType}`]?.description}
                  </p>
                  <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ FREE conversion • Ends your turn
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log('Convert button clicked!');
                if (selectedTarget) {
                  handleConvert();
                }
              }}
              disabled={!selectedTarget}
              className={`
                flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                ${selectedTarget
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {targetType ? `Convert to ${getPieceName(targetType)}` : 'Convert Piece'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieceConversionDialog;