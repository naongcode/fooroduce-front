import {
  BarChart,Bar,XAxis,YAxis,Tooltip,CartesianGrid,ResponsiveContainer,LabelList
} from "recharts";

// 투표 결과 차트 컴포넌트
const VoteResultChart = ({ data, userVotedName }) => {
  if (!data || data.length === 0) {
    return <p>아직 투표 결과가 없습니다.</p>;
  }
  // 투표 수 기준으로 우승자 찾기
  // console.log('data',data)
  const maxVotes = Math.max(...data.map(d => d.voteCount));
  console.log('maxVotes',maxVotes)
  const winner = data.find(d => d.voteCount === maxVotes)?.truckName;

  // 커스텀 Tooltip 컴포넌트 정의
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{
          backgroundColor: "#fff",
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}>
          <strong>{d.truckName}</strong><br />
          투표 수: {d.voteCount}표<br />
          {/* 우승자일 경우 강조 */}
          {d.truckName === winner && <div>🥇 우승!</div>}
          {/* 내가 투표한 후보일 경우 표시 */}
          {d.truckName === userVotedName && <div>✅ 내가 투표함</div>}
        </div>
      );
    }
    return null;
  };

  return (
    // 카드 스타일로 차트 감싸기
    <div className="shadow-xl rounded-2xl p-6 bg-white max-w-3xl mx-auto mt-6">
      {/* 차트 제목 */}
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        
      </h2>

      {/* 반응형 컨테이너로 감싸기 (크기 자동 조절) */}
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        > 
          {/* 배경 격자 */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* X축: 후보 이름 */}
          <XAxis
            dataKey="truckName"
            height={150}
            tick={({ x, y, payload, index }) => {
              const truck = data[index];

              // 이미지 크기 조정
              const imageSize = 90;

              return (
                <g transform={`translate(${x},${y + 10})`}>
                  <image
                    xlinkHref={truck.menuImage}
                    x={-imageSize / 2}
                    y={0}
                    width={imageSize}
                    height={imageSize}
                    preserveAspectRatio="xMidYMid slice"
                  />
                  <text
                    x={0}
                    y={imageSize + 15}
                    textAnchor="middle"
                    fontSize="22"
                    fill="#333"
                  >
                    {truck.truckName}
                  </text>
                </g>
              );
            }}
          />
          {/* Y축: 투표 수 */}
          <YAxis allowDecimals={false} />
          {/* 마우스 오버시 툴팁 */}
          <Tooltip content={<CustomTooltip />} />

          {/* 실제 막대 그리기 */}
          <Bar
            dataKey="voteCount"
            isAnimationActive={true} // 부드러운 애니메이션
            fill="#8884d8" // 기본 막대 색상
            animationDuration={5000}  // ← 이 부분 추가 (밀리초 단위)
          >
            {/* 막대 위에 투표 수 숫자 라벨 표시 */}
            <LabelList
              dataKey="voteCount"
              position="top"

              fill="#000"
              content={({ x, y, width, height, value, index }) => {
                const truck = data[index]; // index로 원본 데이터 접근
                const label =
                  truck.truckName === winner ? `${value} 👑` : `${value}`;
                return (
                  <text
                    x={x + width / 2}
                    y={y - 5}
                    fill="#000"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="24"
                  >
                    {label}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VoteResultChart;
