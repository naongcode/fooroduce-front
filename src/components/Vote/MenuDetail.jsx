import { useRef } from 'react'
import useOnClickOutside from '../../hooks/useOnClickOutside'

const MenuDetail = ({
  selectedTruck,
  setSelectTruck,
  votedTruckIds,
  handleVote,
}) => {
  const ref = useRef()
  useOnClickOutside(ref, () => {
    setSelectTruck(null)
  })
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        ref={ref}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-indigo-800">
              {selectedTruck.truckName}
            </h3>
            <button
              onClick={() => setSelectTruck(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl 
                  cursor-pointer"
            >
              <i className="fas fa-times">X</i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={selectedTruck.menus[0].menuImage}
                alt={selectedTruck.name}
                className="w-full h-64 object-cover object-top rounded-xl"
              />
              <div className="mt-4">
                <p className="text-gray-600 mb-4">
                  {selectedTruck.description}
                </p>
                <div className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedTruck.category ?? '한식'}
                  </span>
                  <span className="ml-4 text-indigo-600 font-medium">
                    <i className="fas fa-thumbs-up mr-1"></i>{' '}
                    {selectedTruck.voteCount} 투표
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-utensils text-indigo-600 mr-2"></i>
                대표 메뉴
              </h4>
              <div className="space-y-6">
                {selectedTruck.menus.map((menu, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-xl shadow-md border border-indigo-100"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 mb-4 md:mb-0">
                        <img
                          src={menu.menuImage}
                          alt={'이미지'}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3 md:pl-6">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-xl font-bold text-gray-800">
                            {menu.menuName}
                          </h5>
                          <span className="text-indigo-700 font-bold">
                            {menu.menuPrice}원
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{menu.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-fire text-red-500 mr-1"></i>
                          <span>인기 메뉴</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setSelectTruck(null)
                    if (!votedTruckIds.includes(selectedTruck.truckId)) {
                      handleVote(selectedTruck.truckId)
                    }
                  }}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium whitespace-nowrap !rounded-button cursor-pointer ${
                    votedTruckIds.includes(selectedTruck.truckId)
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                  }`}
                  disabled={votedTruckIds.includes(selectedTruck.truckId)}
                >
                  {votedTruckIds.includes(selectedTruck.truckId) ? (
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
        </div>
      </div>
    </div>
  )
}

export default MenuDetail
