---
title: 6. Translating in JavaScript
description: Learn how to use Simple Translator in every possible use-case.
slug: /tutorial/06/
---

In this final section, we will have a look at how to translate content programmatically in JavaScript, without involving any HTML at all.

Why is this even necessary? Not all your page content might be inside an HTML page. Think about UX flows like confirmation modals, popup notifications, or content that has been added dynamically via JavaScript. These things are usually controlled by a script and have their own text content, which is as important to translate as the rest of the page.

Another example might be Node.js: _Simple Translator_ can also work with JavaScript that is not executed in the browser, but on the server-side. Say you are building a REST API or a CLI that supports translation - there's no such thing as adding `data` attributes to mark content as translateble.

## Using translateForKey()

That's why _Simple Translator_ offers a method called `.translateForKey`, which allows you to translate a single key from your translations into a specific language:

```js
translator.add('en', {
  meta: {
    description: 'Find the best recipes from all around the world.',
  },
  title: 'Recipes of the Day',
});

translator.translateForKey('meta.description', 'en');
// -> "Find the best recipes from all around the world."

translator.translateForKey('title', 'en');
// -> "Recipes of the Day"
```

You can only translate one single key at a time, but this method can be used to translate all content that you have in JavaScript. Let's look at an example on how this could be useful:

```js
import Translator from '@andreasremdt/simple-translator';

var translator = new Translator();

translator.add('en', {
  confirmation: {
    leavePage: 'Are you sure that you want to leave this page?',
  },
});

if (
  window.confirm(translator.translateForKey('confirmation.leavePage', 'en'))
) {
  window.open('/logout');
}
```

## Using the Global Helper

Using a lengthy method name `.translateForKey` can be cumbersome in larger applications, that's why _Simple Translator_ offers a global shortcut. By default, you can use the global function `.__` to achieve the same result as above:

```js
__('confirmation.leavePage', 'en');

// or, using the default language:
__('confirmation.leavePage');
```

Using two underscores is a common pattern for translations, but if you'd prefer something different, you can customize the helper's name or disable it entirely:

```js
import Translator from '@andreasremdt/simple-translator';

var translator = new Translator({
  registerGlobally: 't',
});

t('confirmation.leavePage');

// or pass `false` to disable the helper:
var translator = new Translator({
  registerGlobally: false,
});
```

The global helper will work in both Node.js and browser environments. Especially when using frameworks like React.js, this might be useful, because you don't want to clutter your JSX markup with those `data-i18n` attributes nor have the translator interfere with React rendering.

```jsx
function ConfirmDialog() {
  return (
    <div>
      <p>{__('confirmation.leavePage', 'en')}
      <button>{__('confirmation.no', 'en')}</button>
      <button>{__('confirmation.yes', 'en')}</button>
    </div>
  );
}
```

## Conclusion

Using programmatic translation might be a very useful feature for you, depending on the kind of app you are working on. In SPAs or apps built with frameworks like React.js, Vue.js, or Angular, you might want to make use of it more than `.translatePageTo`, which manipulates DOM nodes and might interfere with how these frameworks render their data.

If you have a simple, server-side rendered website in plain HTML, using _Simple Translator_ to translate your entire HTML might be the better approach, though.

And that's it. You made it through this tutorial and learned how to use _Simple Translator_ on your website. Go ahead and build something awesome with it, or have a look at the [examples](/examples/) for different frameworks. If you have any quesitons or issues, feel free to head over to [GitHub](https://github.com/andreasremdt/simple-translator/issues) and open a new issue.
