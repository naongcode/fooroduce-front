import PyramidBox from './VotePyramidBox';
import AnimatedImage from './VoteAnimation';

export default function VotePyramidVote({ rankedTrucks }) {
  const filled = [...rankedTrucks];
  // 자리 비우기
  while (filled.length < 6) filled.push(null);

  return (
    <div className="space-y-8">

      {/* 1위 (애니메이션 적용)*/}
      <div className="flex justify-center">
        <PyramidBox truck={filled[0]}>
          {/* {console.log('filled[0]',filled[0])} */}
          {/* <AnimatedImage src={filled[0]?.menu_image} /> */}
        </PyramidBox>
      </div>

      {/* 2~3위 */}
      <div className="flex justify-center space-x-12">
        {filled.slice(1, 3).map((truck, idx) => (
          <PyramidBox truck={truck} key={`rank-${idx + 2}`} />
        ))}
      </div>

      {/* 4~6위 */}
      <div className="flex justify-center space-x-8">
        {filled.slice(3).map((truck, idx) => (
          <PyramidBox truck={truck} key={`rank-${idx + 4}`} />
        ))}
      </div>

    </div>
  );
}
