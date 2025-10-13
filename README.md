# 🌸 Diário de Saúde Mental e Gratidão

Um aplicativo web completo para bem-estar mental, gratidão e autocuidado diário.

![Status](https://img.shields.io/badge/status-production%20ready-success)
![Build](https://img.shields.io/badge/build-passing-success)

## ✨ Recursos Principais

- 📝 Diário de gratidão com 3 itens diários
- 😊 Rastreamento de humor (escala 1-5)
- 💧 Contador de hidratação
- 📊 Gráficos de progresso e estatísticas
- 🎯 Desafios de bem-estar (21, 7 e 30 dias)
- 💌 Cartas para o futuro
- 💜 Botão SOS com respiração guiada
- 🔐 Autenticação segura com Supabase
- 📱 Design responsivo e PWA-ready

## 🚀 Deploy Rápido na Netlify

### Opção 1: Deploy Manual (mais rápido)

1. **Faça o build** (já foi feito automaticamente):
   ```bash
   npm run build
   ```

2. **Arraste a pasta `dist`** para a Netlify:
   - Acesse [netlify.com/drop](https://app.netlify.com/drop)
   - Arraste a pasta `dist`

3. **Configure as variáveis de ambiente** na Netlify:
   - Vá em **Site settings → Environment variables**
   - Adicione:
     ```
     VITE_SUPABASE_URL=https://qryegotberilhwxkugyg.supabase.co
     VITE_SUPABASE_ANON_KEY=[sua-chave-anon]
     ```

4. **Faça um redeploy**:
   - Vá em **Deploys → Trigger deploy → Clear cache and deploy site**

### Opção 2: Deploy Automático via Git

```bash
# 1. Inicializar Git
git init
git add .
git commit -m "Initial commit"

# 2. Enviar para GitHub
git branch -M main
git remote add origin [seu-repositorio]
git push -u origin main

# 3. Conectar na Netlify
# - Vá em app.netlify.com
# - "Add new site" → "Import an existing project"
# - Conecte o repositório
# - Configure as variáveis de ambiente
```

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Verificar tipos
npm run typecheck
```

## 📦 Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Ícones:** Lucide React
- **Deploy:** Netlify

## 🗄️ Estrutura do Banco de Dados

O projeto usa 4 tabelas no Supabase:

- **profiles** - Perfis de usuário
- **daily_entries** - Entradas diárias do diário
- **challenges** - Desafios de bem-estar
- **future_letters** - Cartas para o futuro

Todas as tabelas possuem **Row Level Security (RLS)** habilitado para máxima segurança.

## 🎨 Design

- **Cores:** Lavanda (#B49EDC), Verde-água (#BCEAD5), Azul-claro (#A8E0FF)
- **Fonte:** Quicksand (Google Fonts)
- **Estilo:** Minimalista, com gradientes suaves e animações delicadas

## 📝 Recursos Detalhados

### 365 Mensagens Motivacionais
Cada dia do ano tem uma mensagem única de motivação e bem-estar.

### Desafios de Bem-Estar
- **21 Dias de Gratidão** - Cultive a gratidão diariamente
- **7 Dias para Mente Leve** - Foco em leveza mental
- **30 Dias de Autocuidado** - Um mês dedicado a você

### Análise de Progresso
- Gráfico de humor semanal
- Contador de dias consecutivos (streak)
- Nuvem de palavras das reflexões
- Insights personalizados

## 🐛 Solução de Problemas

### Tela em Branco na Netlify?

**Causa:** Variáveis de ambiente não configuradas.

**Solução:** Veja o arquivo [SOLUCAO-TELA-BRANCA.md](./SOLUCAO-TELA-BRANCA.md)

### Erros de Build?

```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Documentação Adicional

- [FEATURES.md](./FEATURES.md) - Lista completa de recursos
- [DEPLOY-NETLIFY.md](./DEPLOY-NETLIFY.md) - Guia detalhado de deploy
- [SOLUCAO-TELA-BRANCA.md](./SOLUCAO-TELA-BRANCA.md) - Troubleshooting

## 🤝 Contribuindo

Este é um projeto completo e pronto para produção. Sugestões de melhorias:

- [ ] Notificações push PWA
- [ ] Modo escuro automático às 20h
- [ ] Reflexões guiadas com áudio
- [ ] Export de dados (PDF/JSON)
- [ ] Integração com calendário

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de bem-estar.

## 💼 Créditos

**Desenvolvido por:** My GlobyX
**Missão:** Inspirando Transformações Reais

---

## 🎯 Início Rápido

1. Clone o projeto
2. Execute `npm install`
3. Configure o `.env` com suas credenciais Supabase
4. Execute `npm run dev`
5. Acesse `http://localhost:5173`

## 🌟 Status do Projeto

✅ Build passing
✅ TypeScript sem erros
✅ Banco de dados configurado
✅ RLS habilitado
✅ PWA ready
✅ Netlify ready
✅ Produção ready

**O app está 100% funcional e pronto para uso!**
