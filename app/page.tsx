import QuestionForm from "@/components/QuestionForm";
import TrendingQuestions from "@/components/TrendingQuestions";
import UserHistory from "@/components/UserHistory";
import LoginButton from "@/components/LoginButton";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className='min-h-screen bg-gray-900 text-white'>
      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className='flex justify-end mb-8'>
          <LoginButton />
        </div>

        <header className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'>
            OtázkoMat
          </h1>
          <p className='text-gray-300 text-lg mb-6'>
            Opýtaj sa čokoľvek a získaj inteligentnú odpoveď na každodennú
            otázku
          </p>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            <div className='bg-gray-800 p-4 rounded-xl'>
              <h3 className='font-semibold text-blue-400 mb-2'>Denné trendy</h3>
              <p className='text-gray-400 text-sm'>
                Pozrite si najčastejšie otázky dňa
              </p>
            </div>
            <div className='bg-gray-800 p-4 rounded-xl'>
              <h3 className='font-semibold text-purple-400 mb-2'>
                Osobné otázky
              </h3>
              <p className='text-gray-400 text-sm'>
                Vaše najčastejšie kladené otázky
              </p>
            </div>
            <div className='bg-gray-800 p-4 rounded-xl'>
              <h3 className='font-semibold text-green-400 mb-2'>
                Rýchle odpovede
              </h3>
              <p className='text-gray-400 text-sm'>
                Okamžité odpovede na vaše otázky
              </p>
            </div>
          </div>
        </header>

        <QuestionForm />

        <div className='mt-12'>
          {session ? <UserHistory /> : <TrendingQuestions />}
        </div>
      </div>
    </main>
  );
}
