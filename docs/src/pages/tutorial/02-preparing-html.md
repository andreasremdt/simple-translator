---
title: 2. Preparing the HTML
description: Learn how to prepare your HTML elements for translation by adding just two attributes.
slug: /tutorial/02/
prev_link: /tutorial/01/
next_link: /tutorial/03/
---

Before you dive into translating your website, you should look at your content and be clear about what you want to translate and what not. Not all elements might need a translation; others might need translated attributes (e.g., `title`, `placeholder`), and so on.

## Determining the Elements

Let's have a look at the below HTML structure, a recipe app, as an example:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="author" content="John Doe" />
    <meta
      name="description"
      content="Find the best recipes from all around the world."
    />
    <title>Delicious Recipes</title>
  </head>
  <body>
    <h1>Recipes of the Day</h1>
    <p>
      This curated list contains some fresh recipe recommendations from our
      chefs, ready for your kitchen.
    </p>

    <article>
      <h2>Rasperry Milkshake with Ginger</h2>
      <img
        src="/images/rasperry-milkshare-ginger.webp"
        alt="Rasperry Milkshake with Ginger"
      />
      <p>5 min - Easy - Shakes</p>
      <button aria-label="Read more">&raquo;</button>
    </article>
    <article>
      <h2>Fluffy Banana Pancakes</h2>
      <img
        src="/images/fluffy-banana-pancakes.webp"
        alt="Fluffy Banana Pancakes"
      />
      <p>15 min - Easy - Breakfast</p>
      <button aria-label="Read more">&raquo;</button>
    </article>
  </body>
</html>
```

We need to mark the content that needs translation. It doesn't matter if your app is built with a UI framework like React or handcrafted HTML. In the end, it's the HTML elements with text content that we will hook into.

Looking at the code, we can see all candidates for translation:

- The `title` and `description` in the HTML's head.
- The `h1` and `p`, since they put out what this page is about.
- Each recipe, which is wrapped by an `article` element. A recipe has a title, some meta-information like the duration and difficulty, an image, and a button to open it.

Note that there are things like the page's `author`, which we don't need nor want to translate.

Coming back to the recipe (`article`) itself, you might notice that not everything that we need to translate is text content:

```html
<img src="/images/fluffy-banana-pancakes.webp" alt="Fluffy Banana Pancakes" />
```

```html
<button aria-label="Read more">&raquo;</button>
```

Especially when considering accessibility, we also want to include attributes like `alt` or `aria-label`, because screen reader users might suffer from the lack of language consistency.

## Adding Attributes

Now that we have an overview of all elements that need touching, we can go ahead and add the attributes that _Simple Translator_ will use to apply translations.

For that, we have two different attributes available:

- `data-i18n`: Specifies the key which is used to find a translation.
- `data-i18n-attr`: Specifies which attributes should be translated instead of the text content.

### `data-i18n`

Apply this attribute to all HTML elements that you want to translate, no matter if it's text content or an attribute's value:

```html
<h1 data-i18n="title">Recipes of the Day</h1>
<p data-i18n="subtitle">
  This curated list contains some fresh recipe recommendations from our chefs,
  ready for your kitchen.
</p>
```

You can pass in any string as the value, it will be used to match the proper translation, so be mindful about it. Translations are either JSON or JavaScript objects, so they can be nested many levels deep. This means that the following syntax is also okay:

```html
<h1 data-i18n="header.title">Recipes of the Day</h1>
```

Keep the original text hardcoded inside the HTML elements since it will be used as a fallback. Leaving it out would result in a flash of missing content when the page loads, which is considered bad practice.

### `data-i18n-attr`

The above attribute is fine for translating text content, but what if we want to change the image's `alt` attribute? That's what `data-i18n-attr` is used for:

```html
<img
  src="/images/fluffy-banana-pancakes.webp"
  alt="Fluffy Banana Pancakes"
  data-i18n="recipe.image.alt"
  data-i18n-attr="alt"
/>
```

You just need to define the attribute that you want to translate. In this example, it's the image's `alt` attribute, hence we put it as the value of `data-i18n-attr`. In theory, you can provide any HTML attribute as a value, although not all of them might make sense, like `src`.

The same applies for the button:

```html
<button
  aria-label="Read more"
  data-i18n="recipe.button"
  data-i18n-attr="aria-label"
>
  &raquo;
</button>
```

### Translating Multiple Attributes

Sometimes, you might find yourself in a situation where you need to translate more than one attribute, say for an input element:

```html
<input type="text" title="Your name" placeholder="Please enter a name" />
```

Luckily, you can translate as many attributes as you want with `data-i18n-attr`. Just separate them with whitespaces:

```html
<input
  type="text"
  title="Your name"
  placeholder="Please enter a name"
  data-i18n="input.title input.placeholder"
  data-i18n="title placeholder"
/>
```

Be careful to have the same amount of keys for `data-i18n` and `data-i18n-attr`. The order matters as well; make sure that you pass them in the same order as you want to translate them. Passing just one key to `data-i18n` but two attributes to `data-i18n-attr` will most likely result in unexpected behavior.

## Conclusion

Let's have a look at our markup after applying the new attributes:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="author" content="John Doe" />
    <meta
      name="description"
      content="Find the best recipes from all around the world."
      data-i18n="meta.description"
      data-i18n-attr="content"
    />
    <title data-i18n="meta.title">Delicious Recipes</title>
  </head>
  <body>
    <h1 data-i18n="title">Recipes of the Day</h1>
    <p data-i18n="subtitle">
      This curated list contains some fresh recipe recommendations from our
      chefs, ready for your kitchen.
    </p>

    <article>
      <h2 data-i18n="recipes.1.title">Rasperry Milkshake with Ginger</h2>
      <img
        src="/images/rasperry-milkshare-ginger.webp"
        alt="Rasperry Milkshake with Ginger"
        data-i18n="recipes.1.image"
        data-i18n-attr="alt"
      />
      <p data-i18n="recipes.1.meta">5 min - Easy - Shakes</p>
      <button aria-label="Read more" data-i18n="button" data-i18n="aria-label">
        &raquo;
      </button>
    </article>
    <article>
      <h2 data-i18n="recipes.2.title">Fluffy Banana Pancakes</h2>
      <img
        src="/images/fluffy-banana-pancakes.webp"
        alt="Fluffy Banana Pancakes"
        data-i18n="recipes.2.image"
        data-i18n-attr="alt"
      />
      <p data-i18n="recipes.2.meta">15 min - Easy - Breakfast</p>
      <button aria-label="Read more" data-i18n="button" data-i18n="aria-label">
        &raquo;
      </button>
    </article>
  </body>
</html>
```

Copy this HTML into the `index.html` that you created on the previous page. We will translate it at the end of the tutorial.

With that out of the way, you can head over to the next section, which will guide you through the creation of translation files in JSON.
