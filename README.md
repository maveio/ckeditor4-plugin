# ckeditor4-plugin

## 1. Install plugin
Copy the contents from [`plugins/mave`](https://github.com/maveio/ckeditor4-plugin/tree/main/js/plugins/mave) to your project plugins folder.

## 2. Configure mave within your project:

```html
<script type="module">
  import { Player, Upload } from "https://cdn.mave.io/npm/@maveio/components/+esm";

  window.MAVE_CONFIG = {
    token: '{{your token here}}', // token (JWT): should include `sub` (space), `collection` and `exp`,
    color: 'red',
    font: 'Verdana, system-ui, sans-serif',
    radius: '20px',
    locale: 'nl', // default: 'en', can be: 'nl', 'de', 'fr']
    previewInlineTag: 'img' // optional, defaults to iframe
  }
</script>
```

## 3. Add token to config
Replace the `YOUR_TOKEN_HERE` from the above code snippet by generating your own token. Go to https://jwt.io and fill in the appropiate info like shown below:
![jwt.io](https://user-images.githubusercontent.com/238946/231775312-c5ac6cc4-f176-418e-be81-0ba4f0a49b94.png)


## 4. Server configuration (optional when using previewInlineTag 'img')
When you are using an image placeholder (see `MAVE_CONFIG.previewInlineTag`), you will need to transform the image tag to an `<mave-player>` element when rendering on page. You can find the elements as `img[data-type="mave_preview"]`. Within each `img` tag you will find `img[data-type="embed"]`, which is the value use to render the player as `<mave-player embed="{embed}"></mave-player>`.
