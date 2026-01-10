import CanvasEditor from "@/components/CanvasEditor";

export default function EditorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">
        Customize Your Gift
      </h1>

      <CanvasEditor />
    </main>
  );
}
