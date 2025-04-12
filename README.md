# OtázkoMat

OtázkoMat je inteligentný asistent pre otázky a odpovede, postavený na Next.js a OpenAI GPT-3.5. Poskytuje okamžité odpovede na otázky používateľov v slovenskom jazyku, s funkciami pre sledovanie trendujúcich otázok a osobnej histórie otázok.

## Funkcie

### 🤖 Inteligentné Odpovede

- Poháňané modelom OpenAI GPT-3.5
- Odpovede poskytované v slovenskom jazyku
- Jasné a stručné odpovede na každodenné otázky

### 📈 Trendujúce Otázky

- Sledujte, čo sa pýtajú ostatní
- Zobrazte najčastejšie kladené otázky dňa
- Zapojte sa do komunity cez systém hlasovania

### 👤 Používateľské Funkcie

- Prihlásenie cez Google
- História osobných otázok
- Hlasovanie o kvalite odpovedí
- Sledovanie vašich najčastejších otázok

### 🎨 Moderné UI/UX

- Responzívny dizajn
- Tmavý režim rozhrania
- Plynulé prechody a animácie
- Interaktívne karty otázok

## Technológie

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Databáza**: PostgreSQL s Prisma ORM
- **Autentifikácia**: NextAuth.js s Google poskytovateľom
- **AI**: OpenAI GPT-3.5 API
- **Štýlovanie**: TailwindCSS s vlastnými gradientmi

## Začíname

### Požiadavky

- Node.js 18+ nainštalovaný
- PostgreSQL databáza
- OpenAI API kľúč
- Google OAuth credentials

### Nastavenie Prostredia

Vytvorte `.env` súbor v koreňovom adresári s nasledujúcimi premennými:

```env
# Databáza
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Autentifikácia
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### Inštalácia

1. Naklonujte repozitár:

```bash
git clone https://github.com/yourusername/otazkomat.git
cd otazkomat
```

2. Nainštalujte závislosti:

```bash
npm install
```

3. Nastavte databázu:

```bash
npx prisma migrate dev
```

4. Spustite vývojový server:

```bash
npm run dev
```

5. Otvorte [http://localhost:3000](http://localhost:3000) vo vašom prehliadači.

## Použitie

### Pre Používateľov

1. Navštívte webstránku
2. Položte otázku v slovenskom jazyku
3. Získajte okamžitú AI-generovanú odpoveď
4. (Voliteľné) Prihláste sa cez Google pre:
   - Sledovanie histórie vašich otázok
   - Hlasovanie o kvalite odpovedí
   - Prístup k neobmedzeným otázkam

### Pre Vývojárov

- Kódová základňa sleduje modulárnu štruktúru
- Komponenty sú v adresári `components/`
- API cesty sú v adresári `app/api/`
- Schéma databázy je v `prisma/schema.prisma`

## Prispievanie

Príspevky sú vítané! Neváhajte poslať Pull Request.

## Licencia

Tento projekt je licencovaný pod MIT Licenciou - pozrite súbor [LICENSE](LICENSE) pre detaily.

## Poďakovanie

- OpenAI za ich GPT-3.5 API
- Vercel za Next.js a hosting
- Next.js tímu za úžasný framework
- TailwindCSS tímu za framework štýlovania
