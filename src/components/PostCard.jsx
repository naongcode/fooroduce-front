import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
  return (
    <Link
      to={`/event/${post.eventId}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {post.eventImage && (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <img
            src={post.eventImage}
            alt={'이미지'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
          {post.title}
        </h3>
        <div className="flex flex-col items-start text-base text-gray-600 mb-4">
          <span className="mr-4 font-semibold text-xl">{post.eventName}</span>
          <span className="mr-4">{post.description}</span>
        </div>
      </div>
    </Link>
  )
}

const RecommendationList = ({ posts }) => {
  console.log('posts', posts)
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">주변 추천 행사</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

export default RecommendationList
