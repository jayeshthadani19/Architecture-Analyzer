# Stack & Pattern Detection Reference

Use this reference during **Step 2 – Classify Streams** to identify technologies and architectural patterns from file names, folder structures, and dependency manifests.

---

## Frontend Detection

### Framework Signals

| Framework | Key Dep / File | Entry Point |
|---|---|---|
| React (CRA/Vite) | `react`, `react-dom` in `package.json` | `src/index.tsx`, `src/main.tsx` |
| Next.js | `next` dep, `next.config.*` | `app/` or `pages/` |
| Vue 3 | `vue`, `@vitejs/plugin-vue` | `src/main.ts` |
| Nuxt 3 | `nuxt` dep, `nuxt.config.*` | `pages/`, `app.vue` |
| Angular | `@angular/core` | `src/app/app.module.ts` or `app.config.ts` |
| Svelte / SvelteKit | `svelte`, `@sveltejs/kit` | `src/routes/`, `src/app.html` |
| Remix | `@remix-run/react` | `app/routes/` |
| Astro | `astro` dep, `astro.config.*` | `src/pages/` |

### State Management Signals

| Library | Detection |
|---|---|
| Redux Toolkit | `@reduxjs/toolkit`, `store/`, `slices/` |
| Zustand | `zustand`, store files named `*.store.ts` |
| Pinia | `pinia`, `stores/` dir in Vue project |
| Jotai / Recoil | `jotai` / `recoil` dep |
| React Query / TanStack Query | `@tanstack/react-query`, `useQuery`, `useMutation` |
| Context API | `createContext`, `useContext` in component files |
| XState | `xstate`, `machines/` dir |

### Routing Signals

| Library | Detection |
|---|---|
| React Router | `react-router-dom`, `<Routes>`, `createBrowserRouter` |
| Next.js App Router | `app/` dir with `page.tsx` files |
| Next.js Pages Router | `pages/` dir with `_app.tsx` |
| Vue Router | `vue-router`, `src/router/index.ts` |
| Angular Router | `RouterModule`, `app-routing.module.ts` |

---

## Backend Detection

### Framework Signals

| Framework | Language | Key File / Dep |
|---|---|---|
| Express.js | Node.js | `express` dep, `app.js` / `server.js` |
| NestJS | Node.js | `@nestjs/core`, `src/main.ts`, `*.module.ts` |
| Fastify | Node.js | `fastify` dep |
| Hono | Node.js / Edge | `hono` dep |
| FastAPI | Python | `fastapi` dep, `main.py` with `@app` decorators |
| Django | Python | `django`, `manage.py`, `settings.py` |
| Flask | Python | `flask` dep, `app = Flask(__name__)` |
| Spring Boot | Java | `spring-boot-starter`, `@SpringBootApplication` |
| Gin | Go | `github.com/gin-gonic/gin` in `go.mod` |
| Echo | Go | `github.com/labstack/echo` |
| ASP.NET Core | C# | `.csproj` with `Microsoft.AspNetCore` |
| Ruby on Rails | Ruby | `Gemfile` with `rails` gem, `config/routes.rb` |

### Auth Pattern Signals

| Pattern | Detection |
|---|---|
| JWT | `jsonwebtoken`, `python-jose`, `jwtDecode`, bearer token middleware |
| Session | `express-session`, `connect-pg-simple`, `SESSION_SECRET` env |
| OAuth2 / OIDC | `passport`, `authlib`, `@auth0/`, `next-auth`, `keycloak` |
| API Key | Middleware checking `x-api-key` or `Authorization: ApiKey` headers |
| mTLS | Client cert validation in gateway/proxy config |

### API Style Signals

| Style | Detection |
|---|---|
| REST | Route files with `GET`/`POST`/`PUT`/`DELETE` handlers |
| GraphQL | `graphql`, `@nestjs/graphql`, `strawberry`, `*.graphql` / `*.gql` files |
| tRPC | `@trpc/server`, `router/`, `procedure` |
| gRPC | `*.proto` files, `grpc` dep |
| WebSocket | `ws`, `socket.io`, `@nestjs/websockets` |

---

## Data Layer Detection

### Database Signals

| Technology | Detection |
|---|---|
| PostgreSQL | `pg`, `psycopg2`, `postgresql://` in env, `pgvector` |
| MySQL / MariaDB | `mysql2`, `mysqlclient`, `mysql://` in env |
| SQLite | `better-sqlite3`, `sqlite3`, `.db` files in repo |
| MongoDB | `mongoose`, `pymongo`, `mongodb://` in env |
| Redis | `ioredis`, `redis-py`, `REDIS_URL` in env |
| Elasticsearch | `@elastic/elasticsearch`, `elasticsearch-py` |
| DynamoDB | `@aws-sdk/client-dynamodb`, `boto3` DynamoDB resource |
| Cassandra | `cassandra-driver` |

### ORM / Query Builder Signals

| Library | Detection |
|---|---|
| Prisma | `prisma` dep, `schema.prisma`, `prisma/migrations/` |
| TypeORM | `typeorm` dep, `@Entity()` decorator, `ormconfig.*` |
| Drizzle | `drizzle-orm`, `drizzle.config.*`, `schema.ts` |
| SQLAlchemy | `sqlalchemy`, `Base = declarative_base()`, `alembic/` |
| Django ORM | `models.py` files with `models.Model` |
| Hibernate / JPA | `@Entity`, `@Repository`, `persistence.xml` |
| GORM | `gorm.io/gorm` in `go.mod`, `AutoMigrate` calls |
| ActiveRecord | `app/models/*.rb`, `db/migrate/` |

### Pipeline / ETL Signals

| Tool | Detection |
|---|---|
| Airflow | `dags/`, `from airflow import DAG` |
| dbt | `dbt_project.yml`, `models/`, `schema.yml` |
| Spark | `pyspark`, `SparkSession`, `*.scala` in `spark/` |
| Dagster | `dagster` dep, `@asset`, `@job` decorators |
| Prefect | `prefect` dep, `@flow`, `@task` decorators |
| Kafka Streams | `kafka-streams`, `KafkaStreams` class |
| Flink | `apache-flink`, `StreamExecutionEnvironment` |

---

## Architectural Pattern Recognition

| Pattern | Key Signals |
|---|---|
| **MVC** | `controllers/`, `views/`, `models/` trinity |
| **Layered / N-tier** | `presentation/`, `application/`, `domain/`, `infrastructure/` |
| **Clean / Hexagonal** | `core/`, `ports/`, `adapters/`, `use-cases/` |
| **CQRS** | `commands/`, `queries/`, `handlers/`, separate read/write models |
| **Event-driven** | `events/`, `subscribers/`, `producers/`, `consumers/`, message broker deps |
| **Microservices** | Multiple `services/` dirs or packages each with own entry point + Dockerfile |
| **Monolith (modular)** | Single deployable, but clearly separated `modules/` with internal APIs |
| **Serverless** | `functions/`, `handlers/`, `serverless.yml`, AWS Lambda / Azure Functions / GCP Cloud Functions |
| **BFF** | A backend package scoped to serving a specific frontend |
