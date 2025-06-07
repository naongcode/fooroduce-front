import truckImg from '../../data/icon/truck.png'

const TruckNotFound = () => {
  return (
    <div className="h-[500px] flex justify-center items-center">
      <div className="relative w-[300px] h-24 flex flex-col gap-3">
        <img
          src={truckImg}
          className="animate-[truckMove_2s_linear_forwards] w-[100px]"
        />
        <h2 className="text-2xl">트럭을 찾을 수 없습니다</h2>
      </div>
    </div>
  )
}

export default TruckNotFound
