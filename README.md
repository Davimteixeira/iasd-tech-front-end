# 🍽️ Angular Iasd Tech - Frontend

Este é o frontend de um sistema de gerenciamento de produtos e categorias, desenvolvido com **Angular** e **Angular Material**, utilizando **autenticação JWT** para controle de acesso.

## 📌 **Índice**

- [📦 Tecnologias utilizadas](#-tecnologias-utilizadas)
- [🛠️ Como instalar e rodar localmente](#-como-instalar-e-rodar-localmente)
- [📂 Estrutura do projeto](#-estrutura-do-projeto)
- [🔗 Rotas do frontend](#-rotas-do-frontend)
- [🖥️ API do backend](#-api-do-backend)
- [💡 Modelos e interfaces](#-modelos-e-interfaces)
- [🛡️ Autenticação e segurança](#-autenticação-e-segurança)

---

## 📦 **Tecnologias utilizadas**

Este projeto foi desenvolvido com as seguintes tecnologias:

- **Angular** (@angular/core) - v17.1.0
- **Angular Material** (@angular/material) - v17.1.0
- **RxJS** (rxjs) - v7.8.0
- **Angular Router** (@angular/router) - v17.1.0
- **JWT Authentication** (AuthService + HttpInterceptor)
- **Testes Unitários** (Jasmine e Karma)
- **HTTP Client** (@angular/common/http)

---

## 🛠️ **Como instalar e rodar localmente**

### ✅ **1. Clone o repositório**

```sh
git clone https://github.com/seu-usuario/angular-ecommerce.git
cd angular-ecommerce
```

### ✅ **2. Instale as dependências**

```sh
npm install
```

### ✅ **3. Instale o Angular CLI**

Caso ainda não tenha o Angular CLI instalado:

```sh
npm install -g @angular/cli@17.1.0
```

### ✅ **4. Configure a API backend**

O frontend se comunica com um backend **Django REST Framework** que roda na porta **8000**.  
Certifique-se de que a API está rodando antes de iniciar o frontend.

### ✅ **5. Inicie o servidor Angular**

```sh
ng serve
```

A aplicação estará disponível em:  
👉 **http://localhost:4200/**

---

## 📂 **Estrutura do projeto**

```
src/
│-- app/
│   ├-- components/
│   │   ├-- login/               → Tela de login
│   │   ├-- register/            → Tela de cadastro
│   │   ├-- products/            → Listagem e criação de produtos
│   │   ├-- category/            → Listagem e criação de categorias
│   ├-- guards/
│   │   ├-- auth.guard.ts        → Proteção de rotas
│   ├-- interceptors/
│   │   ├-- auth.interceptor.ts  → Intercepta requisições para adicionar o token JWT
│   ├-- models/
│   │   ├-- product.model.ts     → Interfaces para produtos e categorias
│   │   ├-- user.model.ts        → Interfaces para autenticação e usuários
│   ├-- services/
│   │   ├-- auth.service.ts      → Serviço de autenticação JWT
│   │   ├-- product.service.ts   → Serviço para produtos e categorias
│   ├-- app.module.ts            → Configuração principal do Angular
│   ├-- app.routes.ts            → Definição das rotas do frontend
│   ├-- app.component.ts         → Componente raiz
```

---

## 🔗 **Rotas do frontend**

| Rota            | Descrição                   | Protegida? |
| --------------- | --------------------------- | ---------- |
| `/login`        | Página de login             | ❌ Não     |
| `/register`     | Página de cadastro          | ❌ Não     |
| `/products`     | Listagem de produtos        | ✅ Sim     |
| `/products/new` | Cadastro de produtos        | ✅ Sim     |
| `/categories`   | Gerenciamento de categorias | ✅ Sim     |

---

## 🛡️ **Autenticação e segurança**

A aplicação utiliza **JSON Web Tokens (JWT)** para autenticação, garantindo segurança e controle de acesso.

### 🔑 **Fluxo de autenticação JWT:**

1. O usuário faz **login** na aplicação.
2. A API retorna um **token de acesso** e um **token de refresh**.
3. O **token de acesso** é armazenado no `localStorage` e anexado às requisições autenticadas.
4. Quando o token expira, o **token de refresh** é usado para obter um novo token sem precisar de um novo login.

### 🔒 **Proteção de Rotas**

As rotas protegidas são verificadas pelo `auth.guard.ts`, que impede o acesso de usuários não autenticados.

```typescript
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
```

Isso garante que apenas usuários logados possam acessar **produtos** e **categorias**.

```

```
