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

  if (!isOpen || !piece) {
    return null;
  }

  const availableTargets = PieceConversion.getConversionTargets(piece.type);

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
    availableTargets, 
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

          {/* Available Conversions */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Available Conversions:
            </h4>
            <div className="space-y-3">
              {availableTargets.map((targetType) => {
                const conversionKey = `${piece.type}->${targetType}`;
                const rule = CONVERSION_RULES[conversionKey];

                return (
                  <div 
                    key={targetType}
                    style={{
                      padding: '12px',
                      border: selectedTarget === targetType ? '2px solid #3b82f6' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: selectedTarget === targetType ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 1000
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('=== CONVERSION OPTION CLICKED ===');
                      console.log('Target clicked:', targetType);
                      console.log('Event:', e);
                      setSelectedTarget(targetType);
                      console.log('Selected target updated to:', targetType);
                    }}
                    onMouseDown={(e) => {
                      console.log('MouseDown on conversion option:', targetType);
                    }}
                    onMouseUp={(e) => {
                      console.log('MouseUp on conversion option:', targetType);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{getPieceIcon(targetType)}</span>
                        <div>
                          <h5 style={{ margin: 0, fontWeight: 'bold', color: '#111827' }}>
                            {getPieceName(targetType)}
                          </h5>
                          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                            {rule?.description}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>
                          FREE
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Ends turn
                        </div>
                      </div>
                    </div>
                    
                    {/* Emergency backup button */}
                    <div style={{ marginTop: '8px' }}>
                      <button
                        onClick={(e) => {
                          console.log('EMERGENCY BUTTON CLICKED for:', targetType);
                          setSelectedTarget(targetType);
                        }}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      >
                        Emergency: Select {targetType}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Conversion Info */}
          <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-sm text-green-800 dark:text-green-200">
              <strong>Conversion Cost:</strong> FREE! Conversion will end your turn.
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Debug: Selected = {selectedTarget || 'none'} | Available = {availableTargets.length} | Button disabled = {!selectedTarget ? 'true' : 'false'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                console.log('Convert Piece button clicked!');
                console.log('selectedTarget:', selectedTarget);
                console.log('Button disabled:', !selectedTarget);
                if (selectedTarget) {
                  handleConvert();
                } else {
                  console.log('No target selected - button should not work');
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: selectedTarget ? '#2563eb' : '#d1d5db',
                color: selectedTarget ? 'white' : '#6b7280',
                cursor: 'pointer'
              }}
            >
              Convert Piece (Selected: {selectedTarget || 'none'})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieceConversionDialog;