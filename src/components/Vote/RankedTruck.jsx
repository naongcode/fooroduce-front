const RankedTruck = ({ showMenuDetail, sorted, selectedTruck }) => {
  return (
    <div>
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold mb-4 text-indigo-800 tracking-tight inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          인기
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sorted.slice(0, 3).map((truck, index) => (
          <RankedTruckCard
            truck={truck}
            index={index}
            key={index}
            selectedTruck={selectedTruck}
            showMenuDetail={showMenuDetail}
          />
        ))}
      </div>
    </div>
  )
}

const RankedTruckCard = ({ truck, index, selectedTruck, showMenuDetail }) => {
  console.log('card', truck)
  return (
    <div
      key={truck?.truckId}
      className={`bg-white rounded-2xl overflow-hidden shadow-xl border-2 ${
        index === 0
          ? 'border-yellow-400  z-10'
          : index === 1
            ? 'border-gray-300'
            : index === 2
              ? 'border-amber-600'
              : 'border-blue-700'
      }`}
    >
      <div className="relative">
        <img
          src={truck?.menuImage ?? truck?.menus[1]?.menuImage}
          alt={'트럭 이미지'}
          className="w-full h-56 object-cover object-top"
        />
        <div
          className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
            index === 0
              ? 'bg-yellow-500'
              : index === 1
                ? 'bg-gray-400'
                : index === 2
                  ? 'bg-amber-700'
                  : 'bg-blue-700'
          }`}
        >
          {index + 1}
        </div>

        {index <= 2 && (
          <div>
            <div
              className={`absolute top-0 right-0 w-0 h-0 border-t-[80px] ${
                index === 0
                  ? 'border-t-yellow-500'
                  : index === 1
                    ? 'border-t-gray-400'
                    : 'border-t-amber-700'
              } border-l-[80px] border-l-transparent`}
            ></div>
            <div className="absolute top-3 right-3 text-white font-bold transform rotate-45">
              TOP
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-3">
          {truck?.truckName}
        </h4>
        <div className="flex justify-between items-center">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
            {truck?.category ?? '한식'}
          </span>
          <span
            className={`font-bold text-lg ${
              index === 0
                ? 'text-yellow-500'
                : index === 1
                  ? 'text-gray-400'
                  : index === 2
                    ? 'text-amber-700'
                    : 'text-blue-700'
            }`}
          >
            {truck?.voteCount} 투표
          </span>
        </div>

        {/* 메뉴 미리보기 추가 */}
        <div className="mt-4 pt-4 border-t border-indigo-50">
          <div className="flex overflow-x-auto pb-2 space-x-3">
            {selectedTruck?.menus?.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-20">
                <div className="w-20 h-20 rounded-lg overflow-hidden mb-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-center font-medium text-gray-700 truncate">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            showMenuDetail(truck)
          }}
          className="w-full mt-4 py-2 bg-gradient-to-r from-indigo-50
         to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg text-indigo-700 font-medium flex items-center justify-center cursor-pointer"
        >
          <i className="fas fa-utensils mr-2"></i>
          메뉴 자세히 보기
        </button>
      </div>
    </div>
  )
}

export default RankedTruck
