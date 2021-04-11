---
title: 1. Introduction
description: Learn how to use Simple Translator in every possible use-case.
slug: /tutorial/01/
next_link: /tutorial/02/
---

This tutorial guides you through building a simple website, translated by _Simple Translator_. We'll take a look at all of the use-cases _Simple Translator_ can handle and explain how to use the API, along with some best-practices.

Ready? Let's dive in!

## Prerequisites

This tutorial assumes that you're already familiar with JavaScript and HTML, ideally also with Node.js.

## System requirements

- [Node.js](https://nodejs.org/en/) v8.x or later
- npm v6.x or later
- A text editor of your choice, like [VS Code](https://code.visualstudio.com/) or [Sublime Text](https://www.sublimetext.com/)

## Setup

Before we can get started, we need to create a new project and install _Simple Translator_. Create a folder and `cd` into it:

```bash
mkdir translator-tutorial
cd translator-tutorial/
```

Initialize the emtpy folder as a new npm project:

```bash
npm init -y
```

> `-y` just means that all defaults are taken and you don't have to type in anything.

Next, let's install _Simple Translator_:

```bash
npm i @andreasremdt/simple-translator
```

You should see a new folder `node_modules`, containing the _Simple Translator_ library. Create an empty `index.html` and `main.js` next:

```bash
touch index.html
touch main.js
```

**Hint:** you don't have to install the library via npm. Instead, you can copy the [unpkg link](https://unpkg.com/@andreasremdt/simple-translator@latest/dist/umd/translator.min.js) and place it into a `script` tag in `index.html`.

## Conclusion

With the basic setup out of the way, we are ready to dive into the tutorial. Head on to the next page to learn more about adding HTML attributes to mark content as translatable.
