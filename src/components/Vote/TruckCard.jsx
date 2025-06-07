import { useState } from 'react'

const TruckCard = ({ truck, handleVote, isVoted }) => {
  const [expandedMenus, setExpandedMenus] = useState([])
  const toggleMenu = (truckId) => {
    if (expandedMenus.includes(truckId)) {
      setExpandedMenus(expandedMenus.filter((id) => id !== truckId))
    } else {
      setExpandedMenus([...expandedMenus, truckId])
    }
  }
  return (
    <div
      key={truck.truckId}
      className="bg-white rounded-2xl overflow-hidden 
    shadow-lg hover:shadow-xl transition-all duration-300 
    transform hover:-translate-y-2 border border-indigo-50 flex flex-col"
    >
      <div className="h-56 overflow-hidden relative group">
        <img
          src={truck?.menus[1]?.menuImage}
          alt={truck?.truckName + ' 이미지'}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 text-white">
            <p className="font-medium">{truck?.description}</p>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-indigo-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {truck.category ?? '카테고리'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {truck.truckName}
        </h3>

        <div className="mb-6">
          <button
            onClick={() => toggleMenu(truck.truckId)}
            className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 px-4 py-3 rounded-xl text-left transition-all duration-300 flex justify-between items-center"
          >
            <span className="font-semibold text-gray-700 flex items-center">
              <i className="fas fa-utensils text-indigo-500 mr-2"></i>
              메뉴 보기
            </span>
            <i
              className={`fas fa-chevron-down text-indigo-500 transition-transform duration-300 ${
                expandedMenus.includes(truck.truckId) ? 'rotate-180' : ''
              }`}
            ></i>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              expandedMenus.includes(truck.truckId)
                ? 'max-h-[500px] mt-4'
                : 'max-h-0'
            }`}
          >
            <div className="grid grid-cols-1 gap-4">
              {truck.menus?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg shadow-sm border border-indigo-50 
                hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-lg overflow-hidden mr-4">
                      <img
                        src={item.menuImage}
                        alt={'메뉴 이미지'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">
                        {item.menuName}
                      </h4>
                      <p className="text-indigo-600 font-medium">
                        {item.menuPrice}
                      </p>
                      <p className="text-gray-500 text-sm line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full">
            <span className="font-bold text-lg">{truck.voteCount}</span>
            <span className="text-sm ml-1">투표</span>
          </div>
          <button
            onClick={() => handleVote(truck.truckId)}
            className={`px-5 py-2.5 rounded-lg transition-all duration-300 font-medium whitespace-nowrap cursor-pointer ${
              isVoted
                ? 'bg-gray-200 text-gray-600'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
            }`}
            disabled={isVoted}
          >
            {isVoted ? (
              <>
                <i className="fas fa-check-circle mr-2"></i>투표 완료
              </>
            ) : (
              <>
                <i className="fas fa-vote-yea mr-2"></i>투표하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TruckCard
