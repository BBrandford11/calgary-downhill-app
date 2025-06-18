interface RoundNavigationProps {
  currentRound: number;
  totalRounds: number;
  onRoundChange: (round: number) => void;
  canStartNextRound: boolean;
  onStartNextRound: () => void;
}

export default function RoundNavigation({
  currentRound,
  totalRounds,
  onRoundChange,
  canStartNextRound,
  onStartNextRound,
}: RoundNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-zinc-800 rounded-lg shadow p-4">
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
          <button
            key={round}
            onClick={() => onRoundChange(round)}
            className={`px-4 py-2 rounded-md ${
              currentRound === round
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Round {round}
          </button>
        ))}
      </div>

      {canStartNextRound && (
        <button
          onClick={onStartNextRound}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Start Round {totalRounds + 1}
        </button>
      )}
    </div>
  );
} 