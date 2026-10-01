---
title: Volver a Teselia
date: 2026-09-26
tags: [tools, projects]
# `override:` evita que 11ty fusione estas capas con las globales de _data/backdrop.js: las reemplaza.
override:backdrop:
  - { src: "/assets/img/posts/unova/sky.svg", depth: 6, fit: cover, fade: true, bleed: 40 }
  - { src: "/assets/img/posts/unova/pokeball-dots.svg", depth: 16, fit: none, position: "0 0" }
  - { src: "/assets/img/posts/unova/reshiram.gif", depth: 12, class: "unova-sprite unova-reshiram" }
  - { src: "/assets/img/posts/unova/zekrom.gif", depth: 22, class: "unova-sprite unova-zekrom" }
  - { src: "/assets/img/posts/unova/grass.svg", depth: 34, fit: cover, class: "unova-grass" }
---
{% css %}{% include "posts/volver-a-teselia/style.css" %}{% endcss %}
{% js %}{% include "posts/volver-a-teselia/script.js" %}{% endjs %}

Encontré mi DS Lite en un cajón, todavía con la *Edición Negra* puesta. La batería aguantó lo justo para mostrarme una partida guardada de 2011: un Samurott a nivel 54 y ni un recuerdo de cómo había llegado hasta ahí.

Teselia siempre fue mi región favorita y nunca supe bien por qué. Creo que es porque fue la única vez que Game Freak se animó a empezar de cero: ni un solo Pokémon conocido hasta terminar la historia. Todo volvía a ser raro, como en 1998.

Esta vez la estoy jugando como Nuzlocke, con tres reglas:

- Sólo atrapo al primer Pokémon de cada ruta.
- Si se debilita, se va al PC para siempre.
- Todos llevan mote. Mi Tepig se llama *Chorizo*.

Para no hacerme trampa armé un rastreador chiquito en una tarde: un JSON por ruta y un script que me avisa si ya usé el encuentro. Nada del otro mundo, pero me hizo pensar en la cantidad de herramientas que escribo sólo para jugar mejor a cosas que no lo necesitan.

Lo que más me sorprendió al volver fue la música de Ciudad Porcelana. Sigue siendo lo mejor de toda la saga, y ahora la escucho mientras programo.

Ah, y si mirás a la izquierda: algo se mueve en la hierba alta.
