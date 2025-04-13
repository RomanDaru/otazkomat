import UserHistory from "@/components/UserHistory";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Questions - OtazkoMat",
  description: "View your question history",
};

export default async function MyQuestionsPage() {
  const session = await getServerSession(authOptions);

  // Redirect to the home page if not authenticated
  if (!session) {
    redirect("/");
  }

  return (
    <main className='min-h-screen bg-gray-900 text-white'>
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <h1 className='text-3xl font-bold mb-6 text-purple-400'>Moje otázky</h1>
        <p className='text-gray-300 mb-8'>
          Prehľad všetkých vašich otázok a odpovedí
        </p>

        <UserHistory showMyQuestionsOnly={true} />
      </div>
    </main>
  );
}
