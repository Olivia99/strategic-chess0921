'use client';

import React from 'react';
import { Player, Position } from '@/lib/types/game';

interface GuardInvincibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  guardPosition: Position;
  guardPlayer: Player;
}

const GuardInvincibilityModal: React.FC<GuardInvincibilityModalProps> = ({
  isOpen,
  onClose,
  guardPosition,
  guardPlayer
}) => {
  if (!isOpen) return null;

  const getPositionName = (x: number, y: number) => {
    const column = String.fromCharCode(65 + x); // A-G
    const row = 7 - y; // 1-7
    return `${column}${row}`;
  };

  const renderMiniBoard = () => {
    const isInHomeRows = (y: number, player: Player) => {
      if (player === 'white') {
        return y >= 4; // Rows 5, 6, 7 (0-indexed: 4, 5, 6)
      } else {
        return y <= 2; // Rows 1, 2, 3 (0-indexed: 0, 1, 2)
      }
    };

    const cells = [];
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isGuardPosition = x === guardPosition.x && y === guardPosition.y;
        const isWhiteHome = isInHomeRows(y, 'white');
        const isBlackHome = isInHomeRows(y, 'black');
        
        let cellClass = "w-6 h-6 border border-gray-300 flex items-center justify-center text-xs font-bold";
        
        if (isGuardPosition) {
          cellClass += guardPlayer === 'white' 
            ? " bg-blue-500 text-white" 
            : " bg-gray-800 text-white";
        } else if (isWhiteHome && guardPlayer === 'white') {
          cellClass += " bg-blue-100";
        } else if (isBlackHome && guardPlayer === 'black') {
          cellClass += " bg-gray-200";
        } else {
          cellClass += " bg-gray-50";
        }

        cells.push(
          <div key={`${x}-${y}`} className={cellClass}>
            {isGuardPosition ? '🛡️' : ''}
          </div>
        );
      }
    }

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-400 p-2 rounded">
        {cells}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              🛡️ Guard Invincibility
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="mb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 font-medium">
                Cannot attack this Guard!
              </p>
              <p className="text-red-700 text-sm mt-1">
                The {guardPlayer} Guard at {getPositionName(guardPosition.x, guardPosition.y)} is in its invincible zone.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">🛡️ Guard Invincibility Rules</h3>
            <p className="text-gray-700 text-sm mb-3">
              Guards cannot be captured when they are in their home rows (their own territory).
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <h4 className="font-medium text-gray-800 mb-2">Invincible Zones:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <span className="font-medium">White Guards:</span> Rows 5, 6, 7 (bottom 3 rows)</li>
                <li>• <span className="font-medium">Black Guards:</span> Rows 1, 2, 3 (top 3 rows)</li>
                <li>• <span className="font-medium">Neutral Zone:</span> Row 4 (middle row) - Guards can be captured here</li>
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Current Board Situation:</h4>
            <div className="flex items-center gap-4">
              <div>
                {renderMiniBoard()}
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>White Guard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 rounded"></div>
                  <span>Black Guard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>White Home</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
                  <span>Black Home</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">💡 Strategic Tips:</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Wait for the Guard to leave its home rows</li>
                <li>• Use other pieces to control the middle row (Row 4)</li>
                <li>• Focus on capturing other pieces for Trophy points</li>
                <li>• Target the enemy Commander for instant victory</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-3 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuardInvincibilityModal;