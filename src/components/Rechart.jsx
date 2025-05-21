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
  // console.log('maxVotes',maxVotes)
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
          layout="vertical"
          margin={{ top: 20, right: 60, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          {/* Y축: 후보 이름 (세로에 표시) */}
          <YAxis
            type="category"
            dataKey="truckName"
            width={150}
            tick={({ x, y, payload, index }) => {
              const truck = data[index];
              const imageSize = 70;

              return (
                <g transform={`translate(${x-70},${y - imageSize / 2})`}>
                  <image
                    xlinkHref={truck.menuImage}
                    x={0}
                    y={0}
                    width={imageSize}
                    height={imageSize}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
              );
            }}
          />

          {/* X축: 투표 수 (가로 수치 축) */}
          <XAxis type="number" allowDecimals={false} />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="voteCount"
            isAnimationActive={true}
            fill="#8884d8"
            animationDuration={2500}
          >
            <LabelList
              dataKey="truckName"
              position="right"
              fill="#000"
              content={({ x, y, width, height, value, index }) => {
                const truck = data[index];
                const label =
                  truck.truckName === winner ? `${value} 👑` : `${value}`;
                return (
                  <text
                    x={x + width +3 }
                    y={y + height / 2}
                    fill="#000"
                    textAnchor="start"
                    dominantBaseline="middle"
                    fontSize="20"
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
