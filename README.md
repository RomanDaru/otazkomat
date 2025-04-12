# Smart QA Assistant

Smart QA Assistant is an intelligent question-answering platform built with Next.js and OpenAI's GPT-3.5. It provides instant answers to user questions in Slovak language, with features for tracking trending questions and personal question history.

## Features

### 🤖 Intelligent Answers

- Powered by OpenAI's GPT-3.5 model
- Answers provided in Slovak language
- Clear and concise responses to everyday questions

### 📈 Trending Questions

- See what others are asking
- View most frequently asked questions of the day
- Engage with community through voting system

### 👤 User Features

- Google authentication
- Personal question history
- Vote on answer quality
- Track your most frequent questions

### 🎨 Modern UI/UX

- Responsive design
- Dark mode interface
- Smooth transitions and animations
- Interactive question cards

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google provider
- **AI**: OpenAI GPT-3.5 API
- **Styling**: TailwindCSS with custom gradients

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- OpenAI API key
- Google OAuth credentials

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/smart-qa-assistant.git
cd smart-qa-assistant
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma migrate dev
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users

1. Visit the website
2. Ask a question in Slovak language
3. Get an instant AI-generated answer
4. (Optional) Log in with Google to:
   - Track your question history
   - Vote on answer quality
   - Access unlimited questions

### For Developers

- The codebase follows a modular structure
- Components are in `components/` directory
- API routes are in `app/api/` directory
- Database schema is in `prisma/schema.prisma`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for their GPT-3.5 API
- Vercel for Next.js and hosting
- The Next.js team for the amazing framework
- TailwindCSS team for the styling framework
