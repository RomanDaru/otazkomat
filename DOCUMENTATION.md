# OtázkoMat - Technická Dokumentácia

## Prehľad Projektu

OtázkoMat je moderná webová aplikácia postavená na princípe AI-asistovaného odpovedania na otázky v slovenskom jazyku. Projekt demonštruje implementáciu pokročilých webových technológií, prácu s AI modelmi a správu používateľských dát.

## Architektúra

### Frontend (Next.js App Router)

Aplikácia využíva najnovší Next.js 14 s App Router architektúrou, ktorá prináša:

- Server Components pre optimálny výkon
- Client Components pre interaktívne prvky
- Streamované renderovanie pre okamžitú odozvu

Kľúčové komponenty:

1. **QuestionForm** - Hlavný komponent pre zadávanie otázok

   - Implementuje real-time validáciu
   - Spracováva stav načítavania
   - Zobrazuje odpovede s plynulou animáciou

2. **TrendingQuestions** - Zobrazuje populárne otázky

   - Implementuje infinite scroll
   - Optimalizované pre rýchle načítanie
   - Inteligentné cachovanie dát

3. **UserHistory** - Správa histórie otázok používateľa
   - Implementuje lokálne vyhľadávanie
   - Optimistické UI aktualizácie
   - Efektívna pagination

### Backend (Next.js API Routes)

Aplikácia využíva API Routes pre:

1. **Spracovanie Otázok** (`/api/ask`)

   - Rate limiting pre neregistrovaných používateľov
   - Inteligentné cachovanie odpovedí
   - Optimalizácia promptov pre GPT-3.5

2. **Správa Trendov** (`/api/trending`)

   - Sofistikovaný algoritmus pre výpočet trendov
   - Efektívne databázové queries
   - Automatická aktualizácia štatistík

3. **Systém Hlasovania** (`/api/vote`)
   - Implementácia optimistic updates
   - Ochrana proti duplicitným hlasom
   - Real-time aktualizácie skóre

### Databázová Vrstva

Využívame Prisma ORM s PostgreSQL, ktorá zabezpečuje:

- Typovú bezpečnosť
- Automatické migrácie
- Efektívne relačné vzťahy

Kľúčové modely:

```prisma
Question {
  id        String
  content   String
  answer    String
  askCount  Int
  votes     Vote[]
  userId    String?
}

Vote {
  id         String
  questionId String
  userId     String
  isPositive Boolean
}

User {
  id        String
  questions Question[]
  votes     Vote[]
}
```

### Autentifikácia

Implementovaná pomocou NextAuth.js:

- OAuth integrácia s Google
- Bezpečné session management
- Middleware pre ochranu routes

## Zaujímavé Technické Riešenia

1. **Inteligentné Cachovanie**

   - Implementácia hybridného cachingu
   - Automatická invalidácia cache pri hlasovaní
   - Optimalizácia pre často kladené otázky

2. **Optimalizácia AI Odpovedí**

   - Vlastný prompt engineering pre slovenčinu
   - Kontextové vylepšovanie odpovedí
   - Automatická detekcia kvality odpovede

3. **Real-time Aktualizácie**

   - Optimistic updates pre okamžitú odozvu
   - Graceful fallback pri zlyhaní
   - Efektívna správa stavov

4. **Výkonnostné Optimalizácie**
   - Implementácia lazy loading
   - Optimalizácia bundle size
   - Efektívne code splitting

## Škálovateľnosť a Údržba

Projekt je navrhnutý s ohľadom na:

1. **Horizontálne Škálovanie**

   - Stateless architektúra
   - Efektívne databázové indexy
   - Distribuované caching

2. **Monitoring a Logging**

   - Implementácia error boundary
   - Detailné logovanie chýb
   - Performance monitoring

3. **Continuous Integration**
   - Automatizované testy
   - Linting a type checking
   - Deployment pipelines

## Bezpečnosť

Implementované bezpečnostné prvky:

1. **Rate Limiting**

   - Ochrana proti spam
   - IP-based limitovanie
   - User-based kvóty

2. **Validácia Vstupov**

   - Sanitizácia používateľských vstupov
   - XSS ochrana
   - CSRF tokeny

3. **Dátová Bezpečnosť**
   - Šifrované user sessions
   - Bezpečné ukladanie credentials
   - Regular security audits

## Budúce Vylepšenia

Plánované vylepšenia zahŕňajú:

1. Implementáciu pokročilého vyhľadávania
2. Integráciu ďalších AI modelov
3. Rozšírenie analytických funkcií
4. Implementáciu PWA
5. Lokalizáciu do ďalších jazykov

## Technické Výzvy a Riešenia

1. **Optimalizácia Odozvy AI**

   - Implementácia streaming responses
   - Paralelné spracovanie požiadaviek
   - Inteligentné queue management

2. **Škálovanie Databázy**

   - Implementácia connection pooling
   - Optimalizácia queries
   - Efektívne indexovanie

3. **Frontend Performance**
   - Implementácia virtualizácie
   - Optimalizácia render cyklov
   - Efektívny state management

## Záver

OtázkoMat demonštruje implementáciu moderných webových technológií s dôrazom na:

- Používateľskú skúsenosť
- Výkon a škálovateľnosť
- Bezpečnosť a spoľahlivosť
- Udržateľnosť kódu

Projekt slúži ako výborný príklad full-stack vývoja s využitím najnovších technológií a best practices.
