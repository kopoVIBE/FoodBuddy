export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-200"></div>
        </div>
        <p className="text-sm text-gray-600">통계를 불러오는 중...</p>
      </div>
    </div>
  );
}
