# Universo Queima-Queima

Projeto independente que reúne quatro jogos gratuitos em uma única PWA responsiva para computador e celular.

## Jogos

- **Queima-Queima e Ganhe:** precisão, controle de força, pisos, circuito, duelos, ranking e desafios N-back.
- **Quebra-Quebra: Fogo Cruzado:** ação com minicanhão, modos livre e por tempo, campanha de 100 fases, chefes, bônus e conquistas.
- **JogoBitcoin: Mineração Educativa:** 100 blocos com desafios de criptografia, ferramentas de decodificação, blockchain visual, enciclopédia, tutor, carteira fictícia e conquistas.
- **Rebate!:** tênis de mesa com oito personagens, partidas rápidas ou em sets, Arena, torneio, Copa Mundial, desafios e ranking local.

O JogoBitcoin é uma experiência educativa. Moedas, mineração, carteira, rendimentos e recompensas são fictícios e não representam investimento, mineração real ou promessa de ganho.

## Idiomas

A interface principal, os quatro jogos e o guia editorial estão disponíveis em:

- Português do Brasil
- Inglês
- Espanhol

O Rebate! respeita o idioma escolhido na central e também oferece um seletor próprio dentro do jogo. O guia editorial possui páginas estáticas próprias nos três idiomas, com URLs canônicas e marcações `hreflang`.

## Conteúdo e navegação

- `index.html`: central dos quatro jogos.
- `QQeGanhe!.html`: Queima-Queima e Ganhe.
- `quebra-quebra/`: Quebra-Quebra: Fogo Cruzado.
- `jogobitcoin/`: JogoBitcoin.
- `rebate/`: Rebate!.
- `guia.html`, `guide.html` e `guia-es.html`: guia original dos jogos e do aprendizado.
- `sobre.html`, `privacidade.html`, `termos.html` e `contato.html`: páginas institucionais.
- `manifest.webmanifest`, `pwa.js` e `sw.js`: instalação e funcionamento como PWA.
- `robots.txt` e `sitemap.xml`: descoberta e indexação do conteúdo público.

## Execução local

Sirva a raiz do projeto por HTTP. No VS Code, é possível usar o Live Server e abrir `index.html`. Alguns recursos de PWA, armazenamento, rede e instalação não funcionam corretamente quando os arquivos são abertos diretamente por `file://`.

## Publicação

O endereço público utilizado pela PWA/TWA é:

`https://universo-queima-queima.netlify.app/`

O aplicativo Android usa o pacote `com.lxnautico.universoqueimaqueima`. O conteúdo dos jogos é carregado do endereço público; mudanças exclusivamente web não exigem um novo Android App Bundle. Alterações nativas exigem novo `versionCode` e assinatura com a chave original.

## Privacidade e serviços externos

O projeto pode usar armazenamento local, Supabase, Netlify, Google, CoinGecko e redes de distribuição de conteúdo. Consulte a Política de Privacidade publicada para saber quais dados e recursos se aplicam a cada experiência.

## Autoria

Criado e desenvolvido por Alex Alexandre Guedes Ramos, usuário [LxNautico](https://github.com/LxNautico) no GitHub.

Consulte também `AUTHORS.md` e `LICENSE.md`.
