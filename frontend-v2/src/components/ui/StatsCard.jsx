/**
 * StatsCard - Reusable statistics display card
 * Used in Profile page for recipes, favorites, notes, comments count
 */
function StatsCard({ value, label, color = "orange" }) {
  const colorClasses = {
    orange: "text-orange-500",
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    gray: "text-gray-500"
  }

  const textColor = colorClasses[color] || colorClasses.orange

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className={`text-3xl font-bold ${textColor} mb-2`}>
        {value !== undefined && value !== null ? value : '—'}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}

export default StatsCard

