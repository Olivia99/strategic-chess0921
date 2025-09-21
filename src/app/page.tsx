export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-amber-800 dark:text-amber-200 mb-6">
            ⚔️ Strategic Chess
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            A strategic chess variant featuring historical commanders with unique abilities, 
            played on a 7×7 intersection-based grid.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-300 mb-3">🎮 Game Features</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2">
              <li>• 7×7 intersection-based board</li>
              <li>• 8 unique piece types</li>
              <li>• 6 historical heroes</li>
              <li>• Piece conversion system</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-300 mb-3">🏆 Victory Conditions</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2">
              <li>• Checkmate opponent&apos;s Commander</li>
              <li>• Collect 21 trophy points</li>
              <li>• Strategic positioning</li>
              <li>• Hero ability combinations</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-300 mb-3">⚡ Game Modes</h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2">
              <li>• Local multiplayer</li>
              <li>• Online real-time battles</li>
              <li>• Room-based matchmaking</li>
              <li>• Cross-platform play</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-200 mb-6">
              Choose Your Historical Commander
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
              <div className="p-4 bg-amber-50 dark:bg-gray-700 rounded">
                <strong>Alexander the Great</strong><br/>
                <small>Cavalry tactics & 3 starting trophies</small>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-gray-700 rounded">
                <strong>Genghis Khan</strong><br/>
                <small>Enhanced horse mechanics</small>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-gray-700 rounded">
                <strong>Napoleon Bonaparte</strong><br/>
                <small>Respawn system & artillery</small>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-gray-700 rounded">
                <strong>George Washington</strong><br/>
                <small>Commander/President conversion</small>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-gray-700 rounded">
                <strong>Anne Bonny</strong><br/>
                <small>Ship mechanics & piracy</small>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-gray-700 rounded">
                <strong>Che Guevara</strong><br/>
                <small>Revolutionary marks system</small>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            🚧 Game currently in development - Coming soon! 🚧
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Built with Next.js, TypeScript & Tailwind CSS
          </div>
        </div>
      </main>
    </div>
  );
}
