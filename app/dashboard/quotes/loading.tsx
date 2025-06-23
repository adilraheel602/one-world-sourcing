export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      <div className="text-center mt-4 text-sm text-gray-600">Loading</div>
    </div>
  );
}

